import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    connectToDevTools: true, 
});

export default client;