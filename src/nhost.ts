import { NhostClient } from '@nhost/nhost-js'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN as string | undefined
const region = import.meta.env.VITE_NHOST_REGION as string | undefined

// Check if we have proper configuration
const hasValidConfig = subdomain && region && subdomain !== 'demo'

// Default values to prevent blank page - replace with your actual Nhost credentials
const defaultSubdomain = subdomain ?? 'demo' // Replace 'demo' with your actual subdomain
const defaultRegion = region ?? 'eu-central-1' // Replace with your actual region

export const nhost = new NhostClient({
  subdomain: defaultSubdomain,
  region: defaultRegion,
})

// Export configuration status
export const nhostConfig = {
  hasValidConfig,
  subdomain: defaultSubdomain,
  region: defaultRegion,
  isDemo: !hasValidConfig
}

// Add console warning for development
if (import.meta.env.DEV) {
  if (!hasValidConfig) {
    console.warn('⚠️  Nhost Configuration Required:')
    console.warn('   Using demo configuration - create a .env file with:')
    console.warn('   VITE_NHOST_SUBDOMAIN=your-subdomain')
    console.warn('   VITE_NHOST_REGION=your-region')
  } else {
    console.log('✅ Nhost Configuration Loaded:', { subdomain: defaultSubdomain, region: defaultRegion })
  }
}


