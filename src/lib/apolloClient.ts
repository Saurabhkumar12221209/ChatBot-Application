import { ApolloClient, InMemoryCache, split, HttpLink, ApolloLink } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient as createWsClient } from 'graphql-ws'
import { nhost } from '../nhost'
import { setContext } from '@apollo/client/link/context'

const httpLink = new HttpLink({
  uri: nhost.graphql.getUrl(),
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
const httpUrl = nhost.graphql.getUrl()
const url = new URL(httpUrl)
url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
const wsUrl = url.toString()

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


