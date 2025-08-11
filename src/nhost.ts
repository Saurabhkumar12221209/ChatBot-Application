import { NhostClient } from '@nhost/nhost-js'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN as string | undefined
const region = import.meta.env.VITE_NHOST_REGION as string | undefined
const backendUrl = import.meta.env.VITE_NHOST_BACKEND_URL as string | undefined

export const nhost = new NhostClient(
  backendUrl
    ? { backendUrl }
    : {
        subdomain: subdomain ?? '',
        region: region ?? '',
      }
)


