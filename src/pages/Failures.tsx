import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { XCircle, ChevronDown, Zap } from 'lucide-react'
import { api } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { statusBadge, POLLING_STATUSES } from '@/lib/statusBadge'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

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

type FilterOption = 'all' | 'active' | 'verified' | 'failed'

const FILTER_LABELS: Record<FilterOption, string> = {
  all: 'All',
  active: 'Active',
  verified: 'Verified',
  failed: 'Failed',
}

const ACTIVE_STATUSES = new Set(['pending', 'diagnosing', 'applying', 'iteration_2', 'fixed', 'waiting_verification', 'diagnosed'])
const FAILED_STATUSES = new Set(['diagnosis_failed', 'exhausted'])

function matchesFilter(run: CiRun, filter: FilterOption): boolean {
  if (filter === 'all') return true
  if (filter === 'active') return ACTIVE_STATUSES.has(run.status)
  if (filter === 'verified') return run.status === 'verified'
  if (filter === 'failed') return FAILED_STATUSES.has(run.status)
  return true
}

// ── Row component ─────────────────────────────────────────────────────────────

interface RowProps {
  run: CiRun
  isNew: boolean
  isUpdated: boolean
}

function FailureRow({ run, isNew, isUpdated }: RowProps) {
  const navigate = useNavigate()
  const { label, className } = statusBadge(run.status)
  const isPulsing = POLLING_STATUSES.has(run.status)

  return (
    <tr
      onClick={() => navigate(`/runs/${run.id}`)}
      className={cn(
        'border-b border-zinc-800/60 cursor-pointer transition-all duration-300 group',
        isNew && 'animate-in fade-in slide-in-from-top-2 border-l-2 border-l-emerald-500',
        isUpdated && 'bg-violet-950/10',
        !isNew && !isUpdated && 'hover:bg-zinc-800/30',
      )}
    >
      {/* Status */}
      <td className="px-4 py-3 w-36">
        <Badge
          variant="outline"
          className={cn(
            'text-xs w-28 justify-center',
            className,
            isPulsing && 'animate-pulse',
          )}
        >
          {label}
        </Badge>
      </td>

      {/* Repo */}
      <td className="px-4 py-3">
        <span className="text-zinc-300 text-sm font-mono">{run.repo_full_name}</span>
      </td>

      {/* Branch */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-zinc-500 text-xs font-mono truncate max-w-[140px] block">
          {run.branch}
        </span>
      </td>

      {/* Commit */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex flex-col gap-0.5">
          <span className="text-zinc-400 text-xs font-mono">{run.commit_sha.slice(0, 7)}</span>
          {run.commit_message && (
            <span className="text-zinc-600 text-xs truncate max-w-[200px]">
              {run.commit_message.split('\n')[0]}
            </span>
          )}
        </div>
      </td>

      {/* Workflow */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-zinc-600 text-xs">{run.github_workflow_name ?? '—'}</span>
      </td>

      {/* Time */}
      <td className="px-4 py-3 text-right">
        <span className="text-zinc-600 text-xs whitespace-nowrap">
          {formatDistanceToNow(new Date(run.created_at), { addSuffix: true })}
        </span>
      </td>
    </tr>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Failures() {
  const [filter, setFilter] = useState<FilterOption>('all')
  const [runs, setRuns] = useState<CiRun[]>([])
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const [updatedIds, setUpdatedIds] = useState<Set<string>>(new Set())
  const newTimer = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const updatedTimer = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const { isLoading, isError } = useQuery<CiRun[]>({
    queryKey: ['failures-list'],
    queryFn: () => api('/runs/history?limit=100'),
    onSuccess: (data: CiRun[]) => setRuns(data),
  } as Parameters<typeof useQuery<CiRun[]>>[0])

  // ── Realtime ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('failures_ci_runs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ci_runs' },
        (payload) => {
          const newRun = payload.new as CiRun
          setRuns((prev) => [newRun, ...prev])
          // Flash new row green for 1.5s
          setNewIds((prev) => new Set(prev).add(newRun.id))
          const t = setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev)
              next.delete(newRun.id)
              return next
            })
          }, 1500)
          newTimer.current.set(newRun.id, t)
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'ci_runs' },
        (payload) => {
          const updated = payload.new as CiRun
          setRuns((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
          // Flash updated row violet briefly
          setUpdatedIds((prev) => new Set(prev).add(updated.id))
          const t = setTimeout(() => {
            setUpdatedIds((prev) => {
              const next = new Set(prev)
              next.delete(updated.id)
              return next
            })
          }, 800)
          updatedTimer.current.set(updated.id, t)
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          toast.error('Live updates disconnected — refresh to reconnect')
        }
      })

    return () => {
      supabase.removeChannel(channel)
      newTimer.current.forEach(clearTimeout)
      updatedTimer.current.forEach(clearTimeout)
    }
  }, [])

  const filtered = runs.filter((r) => matchesFilter(r, filter))

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Failures</h1>
          <p className="text-zinc-500 text-sm mt-1">Live feed — new rows appear automatically.</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 gap-2 text-sm">
              {FILTER_LABELS[filter]}
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
            {(Object.keys(FILTER_LABELS) as FilterOption[]).map((f) => (
              <DropdownMenuItem
                key={f}
                className={cn(
                  'text-sm cursor-pointer',
                  filter === f ? 'text-zinc-100' : 'text-zinc-400',
                )}
                onClick={() => setFilter(f)}
              >
                {FILTER_LABELS[f]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Error */}
      {isError && (
        <Alert className="mb-6 border-red-900 bg-red-950/20">
          <AlertDescription className="text-red-400">Failed to load failures.</AlertDescription>
        </Alert>
      )}

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-zinc-800">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24 hidden md:block" />
                <div className="ml-auto">
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : !isError && filtered.length === 0 ? (
          <div className="py-20 text-center">
            <XCircle className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
            {runs.length === 0 ? (
              <>
                <p className="text-zinc-500 text-sm">No failures yet.</p>
                <p className="text-zinc-700 text-xs mt-1">
                  Push something broken to a connected repo!
                </p>
              </>
            ) : (
              <>
                <p className="text-zinc-500 text-sm">No runs match this filter.</p>
                <button
                  onClick={() => setFilter('all')}
                  className="text-zinc-600 text-xs mt-1 hover:text-zinc-400 transition-colors"
                >
                  Clear filter
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-36">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Repo
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                    Branch
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">
                    Commit
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">
                    Workflow
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((run) => (
                  <FailureRow
                    key={run.id}
                    run={run}
                    isNew={newIds.has(run.id)}
                    isUpdated={updatedIds.has(run.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Live indicator */}
      {!isLoading && (
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-zinc-600 text-xs">Live</span>
          {filtered.length > 0 && (
            <>
              <span className="text-zinc-700 text-xs">·</span>
              <span className="text-zinc-600 text-xs">
                {filtered.length} {filtered.length === 1 ? 'run' : 'runs'}
                {filter !== 'all' && ` (${FILTER_LABELS[filter].toLowerCase()})`}
              </span>
            </>
          )}
          <Zap className="h-3 w-3 text-zinc-700" />
        </div>
      )}
    </div>
  )
}
