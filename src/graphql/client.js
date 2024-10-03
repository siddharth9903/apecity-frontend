import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';

// Create the Apollo client
const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_API_ENDPOINT,
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export default client;