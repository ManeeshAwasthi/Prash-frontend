import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  GitBranch,
  XCircle,
  History,
  Zap,
  LogOut,
} from 'lucide-react'
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
        {/* Wordmark */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-zinc-800">
          <Zap className="h-5 w-5 text-violet-400" />
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
