import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getConfig } from '../configs/getConfig';

const httpLink = createHttpLink({
    uri: getConfig().graphqlEndpoint,
});

const authLink = setContext((_, { headers }) => {
    const token = getConfig().authToken;
    return {
        headers: {
            ...headers,
            ...(token ? { authorization: `${token}` } : {}),
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export default client;