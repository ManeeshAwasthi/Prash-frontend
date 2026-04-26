import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { statusBadge } from '@/lib/statusBadge'

interface HistoryRun {
  id: string
  repo_id: string
  branch: string
  commit_sha: string
  commit_message: string
  status: string
  fix_branch_name: string | null
  created_at: string
  updated_at: string
  diagnosis: {
    problem_summary: string
    fix_type: string
    confidence: number
    github_pr_url: string | null
    github_pr_number: number | null
    verification_status: string | null
  } | null
}

export default function History() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery<HistoryRun[]>({
    queryKey: ['history'],
    queryFn: () => api('/runs/history?limit=50&offset=0'),
  })

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-zinc-100 mb-6">History</h1>

      {isError && (
        <Alert className="mb-4 border-red-900 bg-red-950/20">
          <AlertDescription className="text-red-400">Failed to load history.</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !data?.length ? (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-lg mb-1">No runs yet.</p>
          <p className="text-sm">Connect a repo and push some code to get started.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left px-4 py-3 text-zinc-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium">Problem</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium hidden md:table-cell">Branch</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium hidden lg:table-cell">Fix Type</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium hidden lg:table-cell">PR</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {data.map((run) => {
                const { label, className } = statusBadge(run.status)
                return (
                  <tr
                    key={run.id}
                    onClick={() => navigate(`/runs/${run.id}`)}
                    className="border-b border-zinc-800/50 last:border-0 cursor-pointer hover:bg-zinc-900/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={className}>{label}</Badge>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-zinc-200 truncate">
                        {run.diagnosis?.problem_summary ?? run.commit_message ?? '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <code className="text-zinc-400 text-xs">{run.branch}</code>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-zinc-400">
                      {run.diagnosis?.fix_type ?? '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {run.diagnosis?.github_pr_number ? (
                        <a
                          href={run.diagnosis.github_pr_url ?? '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-violet-400 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          #{run.diagnosis.github_pr_number}
                        </a>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(run.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
