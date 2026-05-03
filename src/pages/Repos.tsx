import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { GitBranch, Plus, MoreHorizontal, Unplug, Search, Lock, Puzzle } from 'lucide-react'
import { toast } from 'sonner'
import { posthog } from '@/lib/posthog'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { statusBadge } from '@/lib/statusBadge'

interface ConnectedRepo {
  id: string
  github_repo_id: number
  repo_name: string
  repo_full_name: string
  default_branch: string
  is_active: boolean
  created_at: string
}

interface GithubRepo {
  github_repo_id: number
  name: string
  full_name: string
  default_branch: string
  private: boolean
  updated_at: string
}

interface CiRun {
  id: string
  status: string
  created_at: string
}

function RepoCard({
  repo,
  onDisconnect,
}: {
  repo: ConnectedRepo
  onDisconnect: (id: string) => void
}) {
  const { data: runs } = useQuery<CiRun[]>({
    queryKey: ['repo-runs', repo.id],
    queryFn: () => api(`/repos/${repo.id}/runs?limit=1`),
  })

  const lastRun = runs?.[0]
  const { label, className } = lastRun ? statusBadge(lastRun.status) : { label: 'No runs', className: 'border-zinc-700 text-zinc-600' }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <GitBranch className="h-4 w-4 text-zinc-500 flex-shrink-0" />
          <span className="font-mono text-sm text-zinc-200 truncate">{repo.repo_full_name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300 flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-400 cursor-pointer"
              onClick={() => onDisconnect(repo.id)}
            >
              <Unplug className="h-4 w-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <code className="text-zinc-500">{repo.default_branch}</code>
        <span className="text-zinc-700">·</span>
        <Badge variant="outline" className={`text-xs ${className}`}>{label}</Badge>
        {lastRun && (
          <>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-500">
              {formatDistanceToNow(new Date(lastRun.created_at), { addSuffix: true })}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

function ConnectRepoDialog({
  open,
  onClose,
  onConnected,
}: {
  open: boolean
  onClose: () => void
  onConnected: () => void
}) {
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data: githubRepos, isLoading, isError } = useQuery<GithubRepo[]>({
    queryKey: ['github-repos'],
    queryFn: () => api('/repos/github-list'),
    enabled: open,
  })

  const connectMutation = useMutation({
    mutationFn: (repo: GithubRepo) =>
      api('/repos/connect', {
        method: 'POST',
        body: JSON.stringify({
          repo_full_name: repo.full_name,
          github_repo_id: repo.github_repo_id,
          repo_name: repo.name,
          default_branch: repo.default_branch,
        }),
      }),
    onSuccess: (_data, repo) => {
      toast.success('Repo connected — webhook installed.')
      qc.invalidateQueries({ queryKey: ['connected-repos'] })
      posthog.capture('repo_connected', {
        repo_name: repo.full_name,
        is_private: repo.private,
      })
      onConnected()
      onClose()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const filtered = (githubRepos ?? []).filter((r) =>
    r.full_name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Connect a repo</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search repos…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-950 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
          />
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          {isError && (
            <Alert className="border-red-900 bg-red-950/20">
              <AlertDescription className="text-red-400">Failed to load repos.</AlertDescription>
            </Alert>
          )}
          {filtered.map((repo) => (
            <div
              key={repo.github_repo_id}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {repo.private && <Lock className="h-3 w-3 text-zinc-500 flex-shrink-0" />}
                <span className="text-sm text-zinc-200 truncate font-mono">{repo.full_name}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-3 flex-shrink-0 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs"
                disabled={connectMutation.isPending}
                onClick={() => connectMutation.mutate(repo)}
              >
                Connect
              </Button>
            </div>
          ))}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="text-center text-zinc-500 text-sm py-6">No repos found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InstallAppBanner() {
  const { data: installUrl } = useQuery<{ install_url: string }>({
    queryKey: ['github-app-install-url'],
    queryFn: () => api('/auth/github-app/install-url'),
    staleTime: Infinity,
  })

  const { data: githubRepos } = useQuery<GithubRepo[]>({
    queryKey: ['github-repos'],
    queryFn: () => api('/repos/github-list'),
    staleTime: 60_000,
  })

  // Only show banner if we can fetch repos (app installed) — hide if already installed
  if (githubRepos && githubRepos.length > 0) return null

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-violet-800/50 bg-violet-950/20 px-5 py-4">
      <div className="flex items-center gap-3">
        <Puzzle className="h-5 w-5 text-violet-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-zinc-200">Install the GitHub App to connect repos</p>
          <p className="text-xs text-zinc-500 mt-0.5">Grants access to your personal, org, and collab repos</p>
        </div>
      </div>
      <Button
        size="sm"
        className="bg-violet-600 hover:bg-violet-500 text-white flex-shrink-0"
        onClick={() => {
          if (installUrl?.install_url) window.open(installUrl.install_url, '_blank')
        }}
      >
        Install GitHub App
      </Button>
    </div>
  )
}

export default function Repos() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const qc = useQueryClient()
  const { user } = useAuth()
  void user // used for cache key isolation

  const { data: repos, isLoading, isError } = useQuery<ConnectedRepo[]>({
    queryKey: ['connected-repos'],
    queryFn: () => api('/repos/'),
  })

  const disconnectMutation = useMutation({
    mutationFn: (id: string) => api(`/repos/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Repo disconnected.')
      qc.invalidateQueries({ queryKey: ['connected-repos'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <InstallAppBanner />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Connected Repos</h1>
        <Button
          className="bg-violet-600 hover:bg-violet-500 text-white gap-2"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Connect New Repo
        </Button>
      </div>

      {isError && (
        <Alert className="mb-4 border-red-900 bg-red-950/20">
          <AlertDescription className="text-red-400">Failed to load repos.</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : !repos?.length ? (
        <div className="text-center py-24 space-y-4">
          <GitBranch className="h-10 w-10 text-zinc-700 mx-auto" />
          <div>
            <p className="text-zinc-300 font-medium mb-1">No repos connected</p>
            <p className="text-zinc-500 text-sm">Connect a repo to let Prash watch your CI. We only read workflow logs — never your source.</p>
          </div>
          <Button
            className="bg-violet-600 hover:bg-violet-500 text-white gap-2"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Connect your first repo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              onDisconnect={(id) => disconnectMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      <ConnectRepoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConnected={() => qc.invalidateQueries({ queryKey: ['connected-repos'] })}
      />
    </div>
  )
}
