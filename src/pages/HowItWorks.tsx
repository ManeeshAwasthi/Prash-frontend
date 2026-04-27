import { useNavigate } from 'react-router-dom'
import {
  Zap, GitBranch, GitPullRequest, CheckCircle2,
  ArrowRight, Shield, Brain, Clock, ChevronRight,
  Webhook, FileText, Cpu, AlertCircle, GitMerge,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HowItWorks() {
  const navigate = useNavigate()

  const steps = [
    {
      number: '01',
      icon: GitBranch,
      title: 'Install the GitHub App',
      description:
        'Connect Prash to your repository in under 30 seconds. Prash requests only the permissions it needs — read access to workflows and write access to pull requests.',
      details: [
        'OAuth once to authorize your GitHub organization',
        'Webhook installed automatically — no manual config',
        'Works alongside your existing CI setup',
        'Supports monorepos and matrix builds',
      ],
      visual: [
        { label: 'permissions', items: ['workflows: read', 'pull-requests: write', 'checks: write'] },
      ],
    },
    {
      number: '02',
      icon: Webhook,
      title: 'Real-time failure detection',
      description:
        'The moment a GitHub Actions workflow fails, Prash receives a webhook event and begins analysis immediately. No polling, no delay.',
      details: [
        'Receives GitHub Actions webhook events in real-time',
        'Fetches full workflow logs for analysis',
        'Identifies the failing job and step precisely',
        'Detects failure patterns across historical runs',
      ],
      visual: [
        { label: 'webhook event', items: ['workflow_run.completed', 'conclusion: failure', 'jobs: [analyze]'] },
      ],
    },
    {
      number: '03',
      icon: Brain,
      title: 'AI-powered root cause analysis',
      description:
        'Prash processes CI logs through specialized AI models trained on millions of CI failure patterns. It identifies the exact root cause — not just the symptom.',
      details: [
        'Distinguishes flaky tests from real failures',
        'Identifies dependency conflicts, env issues, code bugs',
        'Cross-references with previous runs for pattern matching',
        'Generates a plain-English diagnosis with confidence score',
      ],
      visual: [
        { label: 'root cause', items: ['type: dependency_conflict', 'package: @types/node@18.x', 'confidence: 94%'] },
      ],
    },
    {
      number: '04',
      icon: GitPullRequest,
      title: 'Automated fix & PR creation',
      description:
        'Based on the diagnosis, Prash generates a targeted fix and opens a pull request with a clear description of the change and why it resolves the issue.',
      details: [
        'Fix is scoped tightly to the root cause',
        'PR includes full explanation and linked failure',
        'Runs your CI on the fix branch before opening PR',
        'Assigns reviewers based on CODEOWNERS',
      ],
      visual: [
        { label: 'pr opened', items: ['fix: resolve @types/node version pin', 'checks: running', 'assignees: [team]'] },
      ],
    },
    {
      number: '05',
      icon: CheckCircle2,
      title: 'CI verification & resolution',
      description:
        'Prash waits for the full CI pipeline to pass on the fix branch. Only once all checks pass does it mark the failure as resolved. No guessing.',
      details: [
        'All CI jobs must pass — not just the failing one',
        'Monitors the fix branch for new failures',
        'Automatically closes the incident once merged',
        'Posts a summary back to the original failing run',
      ],
      visual: [
        { label: 'resolved', items: ['all checks: passed', 'pr: ready to merge', 'incident: closed'] },
      ],
    },
  ]

  const architecture = [
    { icon: Webhook, label: 'GitHub Webhook', desc: 'Event source' },
    { icon: Brain, label: 'AI Diagnosis Engine', desc: 'Root cause analysis' },
    { icon: Cpu, label: 'Fix Generator', desc: 'Patch synthesis' },
    { icon: GitPullRequest, label: 'PR Automation', desc: 'Code submission' },
    { icon: CheckCircle2, label: 'CI Verifier', desc: 'Validation loop' },
  ]

  const faqs = [
    {
      q: 'Does Prash have access to my source code?',
      a: 'Prash only reads CI logs and workflow definitions. It never reads your application source code unless you explicitly grant access. All data is encrypted in transit and at rest.',
    },
    {
      q: 'What CI providers does Prash support?',
      a: 'Prash currently supports GitHub Actions. Support for CircleCI, GitLab CI, and Buildkite is on the roadmap.',
    },
    {
      q: 'How does Prash handle flaky tests?',
      a: 'Prash tracks test pass/fail rates across runs. If a test has a high flake rate, it will be flagged as flaky rather than triggering a fix PR. You can configure the flake threshold.',
    },
    {
      q: 'What if the auto-generated fix is wrong?',
      a: 'Every fix goes through your full CI pipeline before Prash opens a PR. If CI fails on the fix branch, Prash retries with a different approach or escalates to your team via a Slack or email alert.',
    },
    {
      q: 'How long does it take from failure to PR?',
      a: 'Typically 2–5 minutes for common failure patterns (dependency issues, env misconfig, test setup). More complex failures may take up to 10 minutes.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/8 blur-[100px] pointer-events-none rounded-full" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-base tracking-tight">Prash</span>
            <span className="text-xs text-zinc-500 font-normal ml-1">by Drufiy</span>
          </button>

          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-500">
            <span className="text-zinc-300 font-medium">How it works</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
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
      <section className="relative px-6 pt-24 pb-20 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-xs mb-8 font-medium">
            <Zap className="h-3 w-3" />
            Deep dive
          </div>
          <h1 className="text-6xl font-bold tracking-tight leading-tight mb-6">
            From failure to fix
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              in minutes.
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A step-by-step walkthrough of how Prash detects CI failures, diagnoses root causes, generates fixes, and verifies they work — all automatically.
          </p>
        </div>
      </section>

      {/* Architecture overview */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-8">
            <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-8 font-medium">Agent pipeline</p>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {architecture.map(({ icon: Icon, label, desc }, idx) => (
                <div key={idx} className="flex md:flex-col items-center gap-3 flex-1">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-violet-400" />
                    </div>
                    {idx < architecture.length - 1 && (
                      <div className="hidden md:flex absolute top-1/2 left-full ml-2 -translate-y-1/2 items-center gap-1 w-full">
                        <div className="flex-1 h-px bg-gradient-to-r from-violet-500/30 to-transparent" />
                        <ArrowRight className="w-3 h-3 text-violet-500/30 absolute right-0" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-zinc-300">{label}</div>
                    <div className="text-xs text-zinc-600 mt-0.5">{desc}</div>
                  </div>
                  {idx < architecture.length - 1 && (
                    <ArrowRight className="md:hidden h-4 w-4 text-zinc-700 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-24 border-b border-white/5">
        <div className="max-w-6xl mx-auto space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="group rounded-2xl border border-white/8 bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
                <div className="grid md:grid-cols-[1fr_340px] gap-0">
                  {/* Content */}
                  <div className="p-8 md:p-10">
                    <div className="flex items-start gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-mono text-violet-400/50">{step.number}</span>
                          <h2 className="text-xl font-bold text-zinc-100">{step.title}</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed mb-6 text-sm md:text-base">{step.description}</p>
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-500">
                              <CheckCircle2 className="w-4 h-4 text-violet-400/60 mt-0.5 shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Visual / code block */}
                  <div className="border-t md:border-t-0 md:border-l border-white/5 bg-black/20 p-8 flex items-center">
                    {step.visual.map((block, i) => (
                      <div key={i} className="w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-violet-500" />
                          <span className="text-xs text-zinc-600 font-mono uppercase tracking-wider">{block.label}</span>
                        </div>
                        <div className="space-y-1.5">
                          {block.items.map((item, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2">
                              <span className="text-violet-400/50">›</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex justify-center py-2 border-t border-white/5">
                    <ArrowRight className="w-4 h-4 text-zinc-700 rotate-90" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Key capabilities */}
      <section className="px-6 py-24 border-b border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Why Prash is different</h2>
            <p className="text-zinc-400 text-lg">Fast, accurate, and built to integrate with your existing workflow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: 'Sub-5 minute MTTR',
                desc: 'Mean time to resolution drops from hours to minutes. Prash starts analysis the moment a failure occurs, not when someone notices.',
              },
              {
                icon: Brain,
                title: 'AI trained on CI patterns',
                desc: 'Models trained on millions of CI failures across languages, frameworks, and runtime environments — not a generic LLM.',
              },
              {
                icon: GitMerge,
                title: 'Loop-verified fixes',
                desc: 'Prash never opens a PR unless the fix passes your full CI pipeline. No rubber stamps. Every PR is CI-verified.',
              },
              {
                icon: Shield,
                title: 'Security-first',
                desc: 'SOC 2 Type II certified. Minimal GitHub App permissions. Code never leaves your environment.',
              },
              {
                icon: AlertCircle,
                title: 'Flake detection',
                desc: 'Distinguishes real failures from flaky tests using historical pass rates. Reduces noise and false PR triggers.',
              },
              {
                icon: FileText,
                title: 'Full audit trail',
                desc: 'Every diagnosis, fix attempt, and verification is logged and accessible in the Prash dashboard.',
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04] transition-all">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-zinc-100 mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Common questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map(({ q, a }, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/12 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] text-violet-400 font-bold">Q</span>
                  </div>
                  <h3 className="font-semibold text-zinc-100 text-sm">{q}</h3>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed pl-8">{a}</p>
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
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-4">Ready to start?</p>
            <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
              Fix CI failures
              <br />automatically.
            </h2>
            <p className="text-zinc-400 text-lg mb-10">
              Install the GitHub App in 30 seconds. Your first fix within hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-500 text-white px-10 h-12 text-base rounded-xl shadow-lg shadow-violet-600/25 transition-all"
                onClick={() => navigate('/login')}
              >
                Install GitHub App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-zinc-400 hover:text-zinc-100 hover:bg-white/5 px-8 h-12 rounded-xl border border-white/8"
                onClick={() => navigate('/')}
              >
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-white/[0.02] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span>© 2026 Drufiy, Inc.</span>
          </div>
          <p>Built at NSRCEL, IIM Bangalore · SOC 2 Type II</p>
        </div>
      </footer>
    </div>
  )
}
