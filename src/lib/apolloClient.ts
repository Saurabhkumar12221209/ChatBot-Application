import { ApolloClient, InMemoryCache, split, HttpLink, ApolloLink } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient as createWsClient } from 'graphql-ws'
import { nhost } from '../nhost'
import { setContext } from '@apollo/client/link/context'

// Create a fallback URI in case Nhost is not properly configured
const getGraphQLUri = () => {
  try {
    return nhost.graphql.getUrl()
  } catch (error) {
    console.warn('⚠️  Nhost not properly configured, using fallback URI')
    return 'https://demo.nhost.run/v1/graphql'
  }
}

const httpLink = new HttpLink({
  uri: getGraphQLUri(),
})

const authLink = setContext(async (_, { headers }) => {
  const token = await nhost.auth.getAccessToken()
  return {
    headers: {
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
})

// Derive ws url from http url
let wsUrl: string
try {
  const httpUrl = nhost.graphql.getUrl()
  const url = new URL(httpUrl)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  wsUrl = url.toString()
} catch (error) {
  console.warn('⚠️  WebSocket URL generation failed, using fallback')
  wsUrl = 'wss://demo.nhost.run/v1/graphql'
}

const wsLink = new GraphQLWsLink(
  createWsClient({
    url: wsUrl,
    connectionParams: async () => {
      const token = await nhost.auth.getAccessToken()
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    },
  })
)

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition' && def.operation === 'subscription'
  },
  wsLink,
  httpLink
)

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, splitLink]),
  cache: new InMemoryCache(),
})


