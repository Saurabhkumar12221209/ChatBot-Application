import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { NhostProvider, useAuthenticated, useAuthenticationStatus } from '@nhost/react'
import { nhost } from '../nhost'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '../lib/apolloClient'

export function AppLayout() {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <AuthGate>
          <div style={{ display: 'flex', height: '100vh' }}>
            <aside style={{ width: 260, borderRight: '1px solid #eee', padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>Chatbot</h3>
              <nav style={{ display: 'grid', gap: 8 }}>
                <NavLink to="/">Chats</NavLink>
              </nav>
              <div style={{ marginTop: 'auto' }}>
                <UserActions />
              </div>
            </aside>
            <main style={{ flex: 1, padding: 16 }}>
              <Outlet />
            </main>
          </div>
        </AuthGate>
      </ApolloProvider>
    </NhostProvider>
  )
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const navigate = useNavigate()

  if (isLoading) return null
  if (!isAuthenticated) {
    navigate('/auth')
    return null
  }
  return <>{children}</>
}

function UserActions() {
  const isAuthed = useAuthenticated()
  if (!isAuthed) return null
  return (
    <button onClick={() => nhost.auth.signOut()}>Sign out</button>
  )
}


