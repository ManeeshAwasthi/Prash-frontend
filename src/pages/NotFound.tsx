import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center gap-4">
      <p className="text-6xl font-bold text-zinc-700">404</p>
      <p className="text-zinc-400">Page not found.</p>
      <Button variant="outline" className="border-zinc-700 text-zinc-300" onClick={() => navigate('/')}>
        Go home
      </Button>
    </div>
  )
}
