import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GitBranch, Search, GitPullRequest, CheckCircle2,
  ArrowRight, Brain, Code2, Cpu, ChevronRight,
  Clock,
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

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
      color: 'from-yellow-500/20 to-transparent',
      borderHover: 'hover:border-yellow-500/50',
    },
    {
      icon: GitPullRequest,
      title: 'Automated Fixes',
      description: 'Generates validated fixes and opens a ready-to-merge pull request automatically.',
      badge: 'Automatic',
      color: 'from-yellow-400/20 to-transparent',
      borderHover: 'hover:border-yellow-400/50',
    },
    {
      icon: CheckCircle2,
      title: 'PR Verification',
      description: 'Runs the full CI pipeline on every fix before marking it verified and complete.',
      badge: 'On every run',
      color: 'from-yellow-300/20 to-transparent',
      borderHover: 'hover:border-yellow-300/50',
    },
  ]

  const steps = [
    { icon: GitBranch, label: 'Push to main', sub: '00:00' },
    { icon: Search, label: 'CI fails', sub: '00:12' },
    { icon: Brain, label: 'Diagnosed', sub: '00:34' },
    { icon: GitPullRequest, label: 'PR opened', sub: '01:08' },
    { icon: CheckCircle2, label: 'CI green', sub: '02:15' },
  ]

  return (
    <div className="min-h-screen bg-black text-white antialiased">

      {/* Hero glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-400/8 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Prash" className="w-7 h-7 rounded-md object-contain" />
            <span className="font-bold text-base tracking-tight text-white">Prash</span>
            <span className="text-xs text-zinc-500 font-normal ml-0.5">by Drufiy</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <button
              onClick={() => navigate('/how-it-works')}
              className="hover:text-white transition-colors"
            >
              How it works
            </button>
            <a href="#agents" className="hover:text-white transition-colors">Agents</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Sign in
            </button>
            <Button
              size="sm"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg px-4 h-8 text-sm"
              onClick={() => navigate('/login')}
            >
              Get started
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24 text-center overflow-hidden">
        <motion.div
          className="max-w-5xl mx-auto relative z-10"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            Your CI fails.
            <br />
            <span className="text-yellow-400">
              We fix it. You merge.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Prash by Drufiy watches your GitHub Actions. When a build breaks, it diagnoses the root cause, opens a PR with the fix, and verifies CI passes — usually before you've finished your coffee.
          </motion.p>

          <motion.p variants={fadeUp} className="text-sm text-zinc-600 mb-8">Currently in early access — onboarding design partners.</motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-12">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 h-12 text-base rounded-xl shadow-lg shadow-yellow-400/20 transition-all"
              onClick={() => navigate('/login')}
            >
              Get early access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto text-zinc-300 hover:text-white hover:bg-white/5 px-8 h-12 text-base rounded-xl border border-white/10"
              onClick={() => { window.location.href = '/dashboard?demo=true' }}
            >
              View live demo
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-yellow-400" />
              GitHub App install in 30s
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-yellow-400" />
              Works with any GitHub Actions
            </span>
          </motion.div>
        </motion.div>

        {/* Hero visual — pipeline flow */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto relative z-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur p-1">
            <div className="rounded-xl bg-zinc-950 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.12, duration: 0.4, ease: 'easeOut' }}
                      className="flex sm:flex-col items-center gap-3 flex-1 w-full sm:w-auto"
                    >
                      <div className="relative">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border ${
                          idx === 0 ? 'border-yellow-500/50 bg-yellow-500/10' :
                          idx === steps.length - 1 ? 'border-emerald-500/50 bg-emerald-500/10' :
                          'border-white/10 bg-white/5'
                        }`}>
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            idx === 0 ? 'text-yellow-400' :
                            idx === steps.length - 1 ? 'text-emerald-400' :
                            'text-zinc-400'
                          }`} />
                        </div>
                        {idx < steps.length - 1 && (
                          <div className="hidden md:block absolute top-1/2 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent -translate-y-1/2 ml-2" />
                        )}
                      </div>
                      <div className="text-left sm:text-center">
                        <div className="text-xs font-medium text-zinc-300">{step.label}</div>
                        <div className="text-xs text-zinc-600 mt-0.5">{step.sub}</div>
                      </div>
                      {idx < steps.length - 1 && (
                        <ArrowRight className="sm:hidden h-4 w-4 text-zinc-600 shrink-0 ml-auto" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="px-4 sm:px-6 py-16 sm:py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12 sm:mb-16">
            <motion.p variants={fadeUp} className="text-yellow-400 text-sm font-medium uppercase tracking-widest mb-3">Specialized agents</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">A team built for reliability</motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg">
              Three specialized agents working in concert to keep your CI reliable, fast, and secure.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {agents.map((agent, idx) => {
              const Icon = agent.icon
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`group relative p-5 rounded-2xl border border-white/8 bg-white/[0.02] ${agent.borderHover} transition-colors duration-300 hover:bg-white/[0.05] cursor-default`}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${agent.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400/80 border border-yellow-400/20 mb-3 font-medium">
                      {agent.badge}
                    </span>
                    <h3 className="font-semibold text-sm mb-2 text-white">{agent.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{agent.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatedSection>
        </div>
      </section>

      {/* How it works — quick preview */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <p className="text-yellow-400 text-sm font-medium uppercase tracking-widest mb-3">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight leading-tight">
                From failure to fix
                <br />
                in four steps.
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg mb-8 leading-relaxed">
                Install once. Prash monitors your CI 24/7, automatically diagnoses failures, creates pull requests with fixes, and verifies they pass before you even open your laptop.
              </p>
              <Button
                variant="outline"
                className="border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white rounded-xl"
                onClick={() => navigate('/how-it-works')}
              >
                View full guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <AnimatedSection className="space-y-3">
              {[
                { n: '01', title: 'Connect your repo', desc: 'Install via GitHub App — takes 30 seconds and works with any existing workflow.', icon: GitBranch },
                { n: '02', title: 'Detect & diagnose', desc: 'Prash watches your GitHub Actions and analyzes failures instantly as they happen.', icon: Search },
                { n: '03', title: 'Fix & create PR', desc: 'Automatic fixes are generated, tested, and a PR is opened and ready for review.', icon: GitPullRequest },
                { n: '04', title: 'Verify & ship', desc: 'All CI tests pass before Prash marks the fix verified. No false positives.', icon: CheckCircle2 },
              ].map(({ n, title, desc, icon: Icon }, idx) => (
                <motion.div key={idx} variants={fadeUp} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-yellow-400/20 transition-colors group">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mt-0.5">
                    <Icon className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-yellow-400/60 font-mono">{n}</span>
                      <span className="text-sm font-semibold text-white">{title}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Prash */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12 sm:mb-16">
            <motion.p variants={fadeUp} className="text-yellow-400 text-sm font-medium uppercase tracking-widest mb-3">Why Prash</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Built for developers by developers</motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
              Created by engineers who've spent years scaling CI/CD at high-growth companies.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
              <motion.div key={idx} variants={fadeUp} whileHover={{ y: -3, transition: { duration: 0.2 } }} className="flex gap-4 p-5 rounded-2xl border border-white/5 hover:border-yellow-400/20 hover:bg-white/[0.02] transition-colors">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1.5 text-white">{title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatedSection>

        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-yellow-400/5 blur-3xl rounded-full pointer-events-none" />
          <AnimatedSection className="relative">
            <motion.p variants={fadeUp} className="text-yellow-400 text-sm font-medium uppercase tracking-widest mb-4">Get started today</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight leading-tight">
              Stop debugging CI.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 text-base sm:text-lg mb-10 leading-relaxed">
              Install the GitHub App in 30 seconds. We're onboarding design partners now.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-10 h-12 text-base rounded-xl shadow-lg shadow-yellow-400/20 transition-all"
                onClick={() => navigate('/login')}
              >
                Get early access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-zinc-400 hover:text-white hover:bg-white/5 px-8 h-12 rounded-xl border border-white/8"
                onClick={() => navigate('/how-it-works')}
              >
                Learn how it works
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-white/5">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.svg" alt="Prash" className="w-7 h-7 rounded-md object-contain" />
                <span className="font-bold text-white">Prash by Drufiy</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                CI failures diagnosed and fixed automatically. No more debugging build logs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-zinc-300">Product</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">How it works</button></li>
                <li><a href="#agents" className="hover:text-white transition-colors">Agents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-zinc-300">Company</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-zinc-300">Legal</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter / X</a></li>
              </ul>
            </div>
          </div>
          <div className="text-xs text-zinc-600">
            <p>© 2026 Drufiy, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
