import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface LogLine {
  id: number
  timestamp: string
  level: 'info' | 'error' | 'warn' | 'success' | 'command'
  message: string
  indent?: boolean
}

const LOG_SEQUENCE: Omit<LogLine, 'id' | 'timestamp'>[] = [
  { level: 'command', message: '$ npm run build' },
  { level: 'info', message: '> drufiy-backend@1.0.0 build' },
  { level: 'info', message: '> tsc && vite build' },
  { level: 'info', message: '' },
  { level: 'info', message: 'vite v5.0.0 building for production...' },
  { level: 'info', message: 'transforming...' },
  { level: 'info', message: '✓ 1284 modules transformed.' },
  { level: 'info', message: '' },
  { level: 'info', message: 'src/types/webhook.ts(15,23): error TS2339:' },
  { level: 'error', message: "Property 'retryCount' does not exist on type 'WebhookEvent'.", indent: true },
  { level: 'info', message: '' },
  { level: 'info', message: 'src/handlers/webhook.ts(42,18): error TS2345:' },
  { level: 'error', message: "Argument of type '{ retryCount: number; }' is not assignable to parameter of type 'WebhookEvent'.", indent: true },
  { level: 'info', message: '' },
  { level: 'error', message: 'error: script "build" exited with code 1' },
  { level: 'info', message: '' },
  { level: 'command', message: '$ npm run test 2>&1 | head -20' },
  { level: 'info', message: 'FAIL src/handlers/webhook.test.ts' },
  { level: 'info', message: '  ● webhook handler › should retry on 500' },
  { level: 'error', message: '    expect(received).toBe(expected)' },
  { level: 'error', message: '    Expected: 3', indent: true },
  { level: 'error', message: '    Received: undefined', indent: true },
  { level: 'info', message: '' },
  { level: 'info', message: 'Test Suites: 1 failed, 42 passed (43 total)' },
  { level: 'info', message: 'Tests:       1 failed, 156 passed (157 total)' },
  { level: 'error', message: 'Snapshots:   0 total' },
  { level: 'info', message: 'Time:        4.2s' },
  { level: 'info', message: '' },
  { level: 'warn', message: '[Prash AI] Analyzing CI failure...' },
  { level: 'warn', message: '[Prash AI] Detected type mismatch in WebhookEvent interface' },
  { level: 'warn', message: '[Prash AI] Checking known good files...' },
  { level: 'success', message: '[Prash AI] Fix identified: Add retryCount field to interface' },
  { level: 'success', message: '[Prash AI] Creating fix PR...' },
  { level: 'success', message: '[Prash AI] PR #142 opened: fix(webhook): add retry tracking fields' },
  { level: 'info', message: '' },
  { level: 'command', message: '$ git log --oneline -3' },
  { level: 'info', message: 'a3f8c2e fix(webhook): add retry tracking fields' },
  { level: 'info', message: 'b91d4f7 feat: implement webhook retry logic' },
  { level: 'info', message: 'c04e2b8 refactor: extract webhook handler' },
]

const levelColors = {
  info: 'text-zinc-400',
  error: 'text-red-400',
  warn: 'text-amber-400',
  success: 'text-emerald-400',
  command: 'text-zinc-300',
}

const levelIcons = {
  info: null,
  error: <XCircle className="h-3 w-3 text-red-500 inline mr-1" />,
  warn: <AlertCircle className="h-3 w-3 text-amber-500 inline mr-1" />,
  success: <CheckCircle2 className="h-3 w-3 text-emerald-500 inline mr-1" />,
  command: <span className="text-yellow-400 mr-1">$</span>,
}

export function CILogSimulation() {
  const [visibleLines, setVisibleLines] = useState<LogLine[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isPaused || isComplete) return

    const interval = setInterval(() => {
      if (currentIndex >= LOG_SEQUENCE.length) {
        setIsComplete(true)
        return
      }

      const log = LOG_SEQUENCE[currentIndex]
      const newLine: LogLine = {
        ...log,
        id: currentIndex,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      }

      setVisibleLines((prev) => [...prev, newLine])
      setCurrentIndex((prev) => prev + 1)
    }, 80 + Math.random() * 40)

    return () => clearInterval(interval)
  }, [currentIndex, isPaused, isComplete])

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleLines])

  // Restart animation after completion
  useEffect(() => {
    if (!isComplete) return

    const timeout = setTimeout(() => {
      setVisibleLines([])
      setCurrentIndex(0)
      setIsComplete(false)
    }, 4000)

    return () => clearTimeout(timeout)
  }, [isComplete])

  return (
    <div className="relative group">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-t-xl">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-xs text-zinc-500 font-mono">prash@ci-runner:~/drufiy-backend</span>
        <div className="w-16" />
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="bg-black border-x border-b border-zinc-800 rounded-b-xl p-4 h-80 overflow-y-auto font-mono text-sm scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {visibleLines.map((line) => (
          <div
            key={line.id}
            className={`animate-in fade-in slide-in-from-left-2 duration-200 ${
              line.indent ? 'pl-4' : ''
            }`}
          >
            <span className="text-zinc-700 text-xs mr-2">{line.timestamp}</span>
            <span className={levelColors[line.level]}>
              {levelIcons[line.level]}
              {line.message}
            </span>
          </div>
        ))}

        {/* Cursor */}
        {!isComplete && (
          <div className="mt-1">
            <span className="text-yellow-400">$</span>
            <span className="inline-block w-2 h-4 bg-yellow-400/80 ml-1 animate-pulse" />
          </div>
        )}

        {/* Complete indicator */}
        {isComplete && (
          <div className="mt-4 flex items-center gap-2 animate-in fade-in duration-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Fix verified — CI passing</span>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-zinc-500">
            {isComplete ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Fixed</span>
              </>
            ) : (
              <>
                <Loader2 className="h-3 w-3 text-amber-400 animate-spin" />
                <span className="text-amber-400">Diagnosing...</span>
              </>
            )}
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-500">prash/drufiy-backend</span>
        </div>
        <span className="text-zinc-600">main · a3f8c2e</span>
      </div>

      {/* Hover hint */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-zinc-600 bg-black/50 px-2 py-0.5 rounded">
          Live simulation
        </span>
      </div>
    </div>
  )
}

export default CILogSimulation
