import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:8000/subgraphs/name/APE',
    cache: new InMemoryCache(),
    connectToDevTools: true, 
});

export default client;