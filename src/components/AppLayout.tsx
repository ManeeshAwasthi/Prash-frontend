import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  GitBranch,
  XCircle,
  History,
  Zap,
  LogOut,
  X,
} from 'lucide-react'
import { isDemoMode, exitDemoMode } from '@/lib/demoMode'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/repos', label: 'Repos', Icon: GitBranch },
  { to: '/failures', label: 'Failures', Icon: XCircle },
  { to: '/history', label: 'History', Icon: History },
]

export default function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-950">
        {/* Demo banner */}
        {isDemoMode() && (
          <div className="flex items-center justify-between mx-3 mt-3 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            <span className="text-[10px] text-amber-400 font-medium tracking-wide">DEMO MODE</span>
            <button
              onClick={exitDemoMode}
              className="text-amber-400/70 hover:text-amber-400 transition-colors ml-1"
              aria-label="Exit demo mode"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Wordmark */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-zinc-800">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <span className="font-bold text-amber-400 text-xs">D</span>
          </div>
          <span className="font-semibold tracking-tight text-zinc-100">Prash by Drufiy</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200',
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-zinc-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 transition-colors">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-zinc-700 text-zinc-300 text-xs">
                    {user?.github_username?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate flex-1 text-left">{user?.github_username}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                className="text-red-400 cursor-pointer"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
