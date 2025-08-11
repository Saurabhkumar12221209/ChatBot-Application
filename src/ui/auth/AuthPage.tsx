import { useAuthenticationStatus } from '@nhost/react'
import { nhost } from '../../nhost'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AuthPage() {
  return <AuthForm />
}

function AuthForm() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthenticationStatus()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate('/')
    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await nhost.auth.signUp({ email, password })
        if (error) throw error
      } else {
        const { error } = await nhost.auth.signIn({ email, password })
        if (error) throw error
      }
      navigate('/')
    } catch (err: any) {
      setError(err?.message ?? 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '10vh auto' }}>
      <h2 style={{ marginTop: 0 }}>Email {mode === 'signup' ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setMode((m) => (m === 'signup' ? 'signin' : 'signup'))}>
          Switch to {mode === 'signup' ? 'Sign In' : 'Sign Up'}
        </button>
      </div>
    </div>
  )
}


