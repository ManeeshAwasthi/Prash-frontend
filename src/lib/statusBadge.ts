export function statusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case 'pending':
      return { label: 'Pending', className: 'border-zinc-700 text-zinc-400' }
    case 'diagnosing':
      return { label: 'Analyzing…', className: 'border-amber-700 text-amber-400' }
    case 'diagnosed':
      return { label: 'Ready to Apply', className: 'border-blue-700 text-blue-400' }
    case 'applying':
      return { label: 'Creating PR…', className: 'border-violet-700 text-violet-400' }
    case 'fixed':
    case 'waiting_verification':
      return { label: 'Verifying…', className: 'border-violet-700 text-violet-400' }
    case 'verified':
      return { label: 'Verified ✓', className: 'border-emerald-700 text-emerald-400' }
    case 'iteration_2':
      return { label: 'Retrying…', className: 'border-orange-700 text-orange-400' }
    case 'diagnosis_failed':
    case 'exhausted':
      return { label: 'Failed', className: 'border-red-800 text-red-400' }
    case 'skipped':
      return { label: 'Skipped', className: 'border-zinc-700 text-zinc-500' }
    default:
      return { label: status, className: 'border-zinc-700 text-zinc-400' }
  }
}

export const POLLING_STATUSES = new Set([
  'pending', 'diagnosing', 'applying', 'fixed', 'waiting_verification', 'iteration_2',
])
