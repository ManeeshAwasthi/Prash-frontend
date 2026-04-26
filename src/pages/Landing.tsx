import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, GitBranch, Search, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const STEPS = [
  {
    Icon: GitBranch,
    title: 'Connect your repo',
    desc: 'OAuth once — Prash installs a webhook on your GitHub repo automatically.',
  },
  {
    Icon: Search,
    title: 'Detect & diagnose',
    desc: 'When a workflow fails, Prash fetches the logs and runs AI diagnosis in seconds.',
  },
  {
    Icon: CheckCircle,
    title: 'Fix & verify',
    desc: 'Prash creates a fix PR and waits for all CI workflows to pass before marking it verified.',
  },
]

export default function Landing() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true })
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-violet-400" />
          <span className="font-semibold text-zinc-100">Prash by Drufiy</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          onClick={() => navigate('/login')}
        >
          Sign in
        </Button>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs mb-8 tracking-wide">
          <Zap className="h-3 w-3 text-violet-400" />
          Autonomous CI/CD troubleshooter
        </div>
        <h1 className="text-6xl font-bold tracking-tight text-zinc-50 max-w-3xl leading-[1.1] mb-6">
          Your CI never <br />
          breaks twice.
        </h1>
        <p className="text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed">
          Prash watches your GitHub Actions, diagnoses failures with AI, and
          creates the fix PR — automatically. Then verifies it works.
        </p>
        <Button
          size="lg"
          className="bg-violet-600 hover:bg-violet-500 text-white px-8"
          onClick={() => navigate('/login')}
        >
          Connect with GitHub
        </Button>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800 px-8 py-20">
        <p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-12">
          How it works
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {STEPS.map(({ Icon, title, desc }, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Icon className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-zinc-200 mb-1">{title}</p>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-8 py-6 text-center text-zinc-600 text-sm">
        © 2026 Drufiy · Built at NSRCEL, IIM Bangalore
      </footer>
    </div>
  )
}
