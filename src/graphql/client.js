import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';

// Create an HTTP link
const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API_ENDPOINT,
});

// Create the authentication link
// const authLink = setContext((_, { headers }) => {
//     const token = getConfig().authToken;
//     return {
//         headers: {
//             ...headers,
//             ...(token ? { authorization: `${token}` } : {}),
//         },
//     };
// });

// Create the Apollo client
const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_API_ENDPOINT,
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export default client;