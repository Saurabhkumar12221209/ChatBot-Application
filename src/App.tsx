import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ErrorBoundary } from 'react-error-boundary'
import { nhostConfig } from './nhost'
import { FallbackUI } from './ui/FallbackUI'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      <h2>Something went wrong</h2>
      <p>Error: {error.message}</p>
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  )
}

export default function App() {
  // Show fallback UI if no valid Nhost configuration
  if (!nhostConfig.hasValidConfig) {
    return <FallbackUI />
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}
