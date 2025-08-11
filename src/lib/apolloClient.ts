import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { NhostApolloClient } from '@nhost/apollo'
import { nhost } from '../nhost'

// Use NhostApolloClient which attaches auth headers and supports subscriptions
export const apolloClient: ApolloClient<unknown> = new NhostApolloClient({
  nhost,
  gqlEndpoint: nhost.graphql.getUrl(),
  cache: new InMemoryCache(),
})


