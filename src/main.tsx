import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NhostProvider } from '@nhost/react'
import { nhost } from './nhost'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './lib/apolloClient'



// Add error boundary for the entire app
function AppWrapper() {
  return (
    <StrictMode>
      <NhostProvider nhost={nhost}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </NhostProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<AppWrapper />)
