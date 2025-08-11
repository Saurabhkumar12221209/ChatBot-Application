

export function FallbackUI() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>🚀 ChatBot Application</h1>
      <div style={{
        maxWidth: '600px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>Configuration Required</h2>
        <p>This application requires Nhost configuration to function properly.</p>
        
        <h3>To fix this:</h3>
        <ol style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          <li>Create a <code>.env</code> file in the <code>web</code> directory</li>
          <li>Add your Nhost credentials:</li>
        </ol>
        
        <pre style={{
          backgroundColor: '#2d3748',
          color: '#e2e8f0',
          padding: '15px',
          borderRadius: '5px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`# web/.env
VITE_NHOST_SUBDOMAIN=your-subdomain
VITE_NHOST_REGION=eu-central-1`}
        </pre>
        
        <p><strong>Note:</strong> Replace <code>your-subdomain</code> with your actual Nhost project subdomain.</p>
        
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Reload After Configuration
        </button>
      </div>
    </div>
  )
}
