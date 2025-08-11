import { NhostClient } from '@nhost/nhost-js'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN as string | undefined
const region = import.meta.env.VITE_NHOST_REGION as string | undefined

export const nhost = new NhostClient({
  subdomain: subdomain ?? '',
  region: region ?? '',
})


