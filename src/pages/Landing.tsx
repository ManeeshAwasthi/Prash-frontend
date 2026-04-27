import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap, GitBranch, Search, GitPullRequest, CheckCircle2,
  ArrowRight, Shield, Brain, Code2, Cpu, ChevronRight,
  TrendingUp, Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Landing() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true })
  }, [user, loading, navigate])

  const agents = [
    {
      icon: Search,
      title: 'Failure Diagnosis',
      description: 'Analyzes CI logs and pinpoints root causes automatically within seconds of a failure.',
      badge: 'On CI failure',
      color: 'from-violet-500/20 to-transparent',
      borderHover: 'hover:border-violet-500/50',
    },
    {
      icon: GitPullRequest,
      title: 'Automated Fixes',
      description: 'Generates validated fixes and opens a ready-to-merge pull request automatically.',
      badge: 'Automatic',
      color: 'from-blue-500/20 to-transparent',
      borderHover: 'hover:border-blue-500/50',
    },
    {
      icon: Brain,
      title: 'Pattern Learning',
      description: 'Learns from every run across your codebase to continuously improve diagnosis.',
      badge: 'Continuous',
      color: 'from-indigo-500/20 to-transparent',
      borderHover: 'hover:border-indigo-500/50',
    },
    {
      icon: CheckCircle2,
      title: 'PR Verification',
      description: 'Runs the full CI pipeline on every fix before marking it verified and complete.',
      badge: 'On every run',
      color: 'from-purple-500/20 to-transparent',
      borderHover: 'hover:border-purple-500/50',
    },
    {
      icon: Shield,
      title: 'Security Scanning',
      description: 'Detects vulnerabilities introduced during CI and flags them before they ship.',
      badge: 'Proactive',
      color: 'from-rose-500/20 to-transparent',
      borderHover: 'hover:border-rose-500/50',
    },
  ]

  const steps = [
    { icon: GitBranch, label: 'Install GitHub App', sub: '30 seconds' },
    { icon: Search, label: 'Failure detected', sub: 'Real-time' },
    { icon: Brain, label: 'Root cause found', sub: 'Seconds' },
    { icon: GitPullRequest, label: 'PR auto-created', sub: 'Automatic' },
    { icon: CheckCircle2, label: 'CI verified', sub: 'All tests pass' },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">

      {/* Background grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      {/* Hero glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-base tracking-tight">Prash</span>
            <span className="text-xs text-zinc-500 font-normal ml-1">by Drufiy</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <button
              onClick={() => navigate('/how-it-works')}
              className="hover:text-zinc-100 transition-colors"
            >
              How it works
            </button>
            <a href="#agents" className="hover:text-zinc-100 transition-colors">Agents</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Sign in
            </button>
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-lg px-4 h-8 text-sm font-medium"
              onClick={() => navigate('/login')}
            >
              Get started
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-28 pb-24 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-xs mb-8 font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Autonomous CI/CD Troubleshooter
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Your AI DevOps
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Team Never Sleeps.
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Prash automatically detects CI failures, diagnoses root causes, creates fixes, and verifies they work—all without human intervention.
          </p>

          <p className="text-sm text-zinc-500 mb-8">Currently in early access — onboarding design partners.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-500 text-white px-8 h-12 text-base rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-violet-500/30 transition-all"
              onClick={() => navigate('/login')}
            >
              Get early access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-zinc-300 hover:text-zinc-100 hover:bg-white/5 px-8 h-12 text-base rounded-xl border border-white/10"
              onClick={() => navigate('/how-it-works')}
            >
              See how it works
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-violet-400" />
              GitHub App install in 30s
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-violet-400" />
              Works with any GitHub Actions
            </span>
          </div>
        </div>

        {/* Hero visual — pipeline flow */}
        <div className="mt-20 max-w-4xl mx-auto relative z-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-1">
            <div className="rounded-xl bg-zinc-900/80 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon
                  return (
                    <div key={idx} className="flex md:flex-col items-center gap-3 flex-1">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                          idx === 0 ? 'border-violet-500/50 bg-violet-500/10' :
                          idx === steps.length - 1 ? 'border-emerald-500/50 bg-emerald-500/10' :
                          'border-white/10 bg-white/5'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            idx === 0 ? 'text-violet-400' :
                            idx === steps.length - 1 ? 'text-emerald-400' :
                            'text-zinc-400'
                          }`} />
                        </div>
                        {idx < steps.length - 1 && (
                          <div className="hidden md:block absolute top-1/2 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent -translate-y-1/2 ml-2" />
                        )}
                      </div>
                      <div className="text-center md:block">
                        <div className="text-xs font-medium text-zinc-300">{step.label}</div>
                        <div className="text-xs text-zinc-600 mt-0.5">{step.sub}</div>
                      </div>
                      {idx < steps.length - 1 && (
                        <ArrowRight className="md:hidden h-4 w-4 text-zinc-600 shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="px-6 py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">Specialized agents</p>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">A team built for reliability</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Five specialized agents working in concert to keep your CI reliable, fast, and secure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {agents.map((agent, idx) => {
              const Icon = agent.icon
              return (
                <div
                  key={idx}
                  className={`group relative p-5 rounded-2xl border border-white/8 bg-white/[0.03] ${agent.borderHover} transition-all duration-300 hover:bg-white/[0.06] cursor-default`}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${agent.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-white/20 transition-colors">
                      <Icon className="w-5 h-5 text-zinc-300" />
                    </div>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-500 border border-white/8 mb-3 font-medium">
                      {agent.badge}
                    </span>
                    <h3 className="font-semibold text-sm mb-2 text-zinc-100">{agent.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{agent.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works — quick preview */}
      <section className="px-6 py-24 border-b border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">How it works</p>
              <h2 className="text-4xl font-bold mb-6 tracking-tight leading-tight">
                From failure to fix
                <br />
                in four steps.
              </h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Install once. Prash monitors your CI 24/7, automatically diagnoses failures, creates pull requests with fixes, and verifies they pass before you even open your laptop.
              </p>
              <Button
                variant="outline"
                className="border-white/10 text-zinc-300 hover:bg-white/5 hover:text-zinc-100 rounded-xl"
                onClick={() => navigate('/how-it-works')}
              >
                View full guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { n: '01', title: 'Connect your repo', desc: 'Install via GitHub App — takes 30 seconds and works with any existing workflow.', icon: GitBranch },
                { n: '02', title: 'Detect & diagnose', desc: 'Prash watches your GitHub Actions and analyzes failures instantly as they happen.', icon: Search },
                { n: '03', title: 'Fix & create PR', desc: 'Automatic fixes are generated, tested, and a PR is opened and ready for review.', icon: GitPullRequest },
                { n: '04', title: 'Verify & ship', desc: 'All CI tests pass before Prash marks the fix verified. No false positives.', icon: CheckCircle2 },
              ].map(({ n, title, desc, icon: Icon }, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:border-white/10 transition-colors group">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mt-0.5">
                    <Icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-violet-400/60 font-mono">{n}</span>
                      <span className="text-sm font-semibold text-zinc-100">{title}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Prash */}
      <section className="px-6 py-24 border-b border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">Why Prash</p>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Built for developers by developers</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Created by engineers who've spent years scaling CI/CD at high-growth companies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: 'Instant diagnosis',
                desc: 'Get root cause analysis in seconds instead of hours of manual log trawling and debugging.',
              },
              {
                icon: Code2,
                title: 'Automated fixes',
                desc: 'Fixes are generated and validated through your full CI pipeline — no rubber stamp reviews.',
              },
              {
                icon: TrendingUp,
                title: 'Learns & improves',
                desc: 'Prash learns from every run across your org to get smarter and more accurate over time.',
              },
              {
                icon: Shield,
                title: 'Enterprise security',
                desc: 'Minimal GitHub App permissions. Your code stays in your environment. We only read CI logs and workflow definitions.',
              },
              {
                icon: Cpu,
                title: 'No config needed',
                desc: 'Zero configuration. Install the GitHub App and Prash figures everything else out automatically.',
              },
              {
                icon: GitBranch,
                title: 'Any workflow',
                desc: 'Works with any GitHub Actions workflow — monorepos, matrix builds, custom runners.',
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1.5 text-zinc-100">{title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-violet-600/5 blur-3xl rounded-full pointer-events-none" />
          <div className="relative">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-4">Get started today</p>
            <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
              Ready to fix CI failures
              <br />automatically?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              Get started in 5 minutes. First fix within hours. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-500 text-white px-10 h-13 text-base rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-violet-500/30 transition-all"
                onClick={() => navigate('/login')}
              >
                Get early access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-zinc-400 hover:text-zinc-100 hover:bg-white/5 px-8 h-12 rounded-xl border border-white/8"
                onClick={() => navigate('/how-it-works')}
              >
                Learn how it works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-5 gap-10 mb-12 pb-12 border-b border-white/5">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Prash by Drufiy</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                Autonomous CI/CD troubleshooting. Detect failures, diagnose root causes, and fix automatically.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-zinc-300">Product</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><button onClick={() => navigate('/how-it-works')} className="hover:text-zinc-200 transition-colors">How it works</button></li>
                <li><a href="#agents" className="hover:text-zinc-200 transition-colors">Agents</a></li>
                <li><a href="#" className="hover:text-zinc-200 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-zinc-200 transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-zinc-300">Company</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-200 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-zinc-200 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-zinc-200 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-zinc-300">Legal</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-200 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-zinc-200 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-zinc-200 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-zinc-200 transition-colors">Twitter / X</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
            <p>© 2026 Drufiy, Inc. All rights reserved.</p>
            <p>Built at NSRCEL, IIM Bangalore</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
