import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import {
  GitBranch,
  Zap,
  GitPullRequest,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { api } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { statusBadge } from '@/lib/statusBadge'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Stats {
  repos_connected: number
  failures_diagnosed: number
  prs_created: number
  verified_fixes: number
}

interface CiRun {
  id: string
  status: string
  repo_full_name: string
  branch: string
  commit_sha: string
  commit_message: string | null
  github_workflow_name: string | null
  created_at: string
}

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  flash: boolean
  highlight?: boolean
}

function StatCard({ label, value, icon, flash, highlight }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-zinc-900 border rounded-xl p-5 transition-all duration-300',
        highlight && value > 0
          ? 'border-emerald-800'
          : 'border-zinc-800',
        flash && 'ring-1 ring-emerald-500/60',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{label}</span>
        <span className={cn(
          'p-1.5 rounded-md',
          highlight && value > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-zinc-800 text-zinc-400',
        )}>
          {icon}
        </span>
      </div>
      <div className={cn(
        'text-3xl font-mono font-semibold tracking-tight transition-colors',
        highlight && value > 0 ? 'text-emerald-400' : 'text-zinc-100',
      )}>
        {value.toLocaleString()}
      </div>
      {highlight && value > 0 && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-500 text-xs">fixes confirmed</span>
        </div>
      )}
    </div>
  )
}

// ── Recent activity row ───────────────────────────────────────────────────────

function ActivityRow({ run }: { run: CiRun }) {
  const { label, className } = statusBadge(run.status)
  return (
    <Link
      to={`/runs/${run.id}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/40 rounded-lg transition-colors group"
    >
      <Badge variant="outline" className={cn('text-xs shrink-0 w-28 justify-center', className)}>
        {label}
      </Badge>
      <div className="flex-1 min-w-0">
        <p className="text-zinc-300 text-sm font-mono truncate">{run.repo_full_name}</p>
        <p className="text-zinc-600 text-xs font-mono truncate">
          {run.commit_sha.slice(0, 7)}
          {run.commit_message ? ` · ${run.commit_message.split('\n')[0]}` : ''}
        </p>
      </div>
      <span className="text-zinc-600 text-xs whitespace-nowrap shrink-0">
        {formatDistanceToNow(new Date(run.created_at), { addSuffix: true })}
      </span>
      <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
    </Link>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const qc = useQueryClient()
  const [flashCard, setFlashCard] = useState<keyof Stats | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery<Stats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api('/runs/dashboard/stats'),
    refetchInterval: 60_000,
  })

  const {
    data: recentRuns,
    isLoading: runsLoading,
    isError: runsError,
  } = useQuery<CiRun[]>({
    queryKey: ['recent-runs'],
    queryFn: () => api('/runs/history?limit=5'),
    refetchInterval: 30_000,
  })

  // ── Realtime subscription ──────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('dashboard_ci_runs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ci_runs' },
        () => {
          // New failure detected — bump failures_diagnosed optimistically
          qc.setQueryData<Stats>(['dashboard-stats'], (old) =>
            old ? { ...old, failures_diagnosed: old.failures_diagnosed + 1 } : old,
          )
          qc.invalidateQueries({ queryKey: ['recent-runs'] })
          triggerFlash('failures_diagnosed')
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'ci_runs' },
        (payload) => {
          const updated = payload.new as CiRun & { status: string }
          if (updated.status === 'verified') {
            qc.setQueryData<Stats>(['dashboard-stats'], (old) =>
              old ? { ...old, verified_fixes: old.verified_fixes + 1 } : old,
            )
            triggerFlash('verified_fixes')
          }
          if (updated.status === 'fixed') {
            qc.setQueryData<Stats>(['dashboard-stats'], (old) =>
              old ? { ...old, prs_created: old.prs_created + 1 } : old,
            )
            triggerFlash('prs_created')
          }
          qc.invalidateQueries({ queryKey: ['recent-runs'] })
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          toast.error('Live updates disconnected — refresh to reconnect')
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [qc])

  function triggerFlash(card: keyof Stats) {
    setFlashCard(card)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlashCard(null), 1000)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Your CI, always watched.</p>
      </div>

      {/* Stat cards */}
      {statsError && (
        <Alert className="mb-6 border-red-900 bg-red-950/20">
          <AlertDescription className="text-red-400">Failed to load stats.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))
        ) : stats ? (
          <>
            <StatCard
              label="Repos Connected"
              value={stats.repos_connected}
              icon={<GitBranch className="h-4 w-4" />}
              flash={flashCard === 'repos_connected'}
            />
            <StatCard
              label="Failures Diagnosed"
              value={stats.failures_diagnosed}
              icon={<Zap className="h-4 w-4" />}
              flash={flashCard === 'failures_diagnosed'}
            />
            <StatCard
              label="PRs Created"
              value={stats.prs_created}
              icon={<GitPullRequest className="h-4 w-4" />}
              flash={flashCard === 'prs_created'}
            />
            <StatCard
              label="Verified Fixes"
              value={stats.verified_fixes}
              icon={<CheckCircle2 className="h-4 w-4" />}
              flash={flashCard === 'verified_fixes'}
              highlight
            />
          </>
        ) : null}
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-zinc-300">Recent Activity</h2>
          <Link
            to="/failures"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {runsError && (
            <div className="px-4 py-6">
              <Alert className="border-red-900 bg-red-950/20">
                <AlertDescription className="text-red-400">Failed to load recent runs.</AlertDescription>
              </Alert>
            </div>
          )}

          {runsLoading && (
            <div className="divide-y divide-zinc-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          )}

          {!runsLoading && !runsError && recentRuns && recentRuns.length === 0 && (
            <div className="py-14 text-center">
              <Zap className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No failures yet.</p>
              <p className="text-zinc-700 text-xs mt-1">Push something broken to a connected repo!</p>
            </div>
          )}

          {!runsLoading && recentRuns && recentRuns.length > 0 && (
            <div className="divide-y divide-zinc-800/60 p-1">
              {recentRuns.map((run) => (
                <ActivityRow key={run.id} run={run} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
