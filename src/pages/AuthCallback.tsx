import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

interface CallbackResponse {
  token: string
  user: { id: string; github_username: string; email: string | null }
}

export default function AuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      navigate('/login?error=no_code', { replace: true })
      return
    }

    api<CallbackResponse>('/auth/github/callback', {
      method: 'POST',
      body: JSON.stringify({
        code,
        redirect_uri: `${window.location.origin}/auth/callback`,
      }),
    })
      .then(({ token, user }) => {
        login(token, user)
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        toast.error('GitHub sign-in failed. Please try again.')
        navigate('/login?error=auth_failed', { replace: true })
      })
  }, [login, navigate])

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950">
      <div className="space-y-3 w-64 text-center">
        <p className="text-zinc-400 text-sm">Signing in with GitHub…</p>
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  )
}
