import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getConfig } from '../configs/getConfig';

// Create an HTTP link
const httpLink = new HttpLink({
    uri: getConfig().graphqlEndpoint,
});

// Create a WebSocket link
const wsLink = new WebSocketLink({
    uri: getConfig().wsEndpoint,
    // uri: 'wss://tend.apecity.xyz/subgraphs/name/APE?type=ws',
    options: {
        reconnect: true,
        connectionParams: {
            // Enable subscriptions logging
            loggerEnabled: true,
        },
    },
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

// const headerTypeLink = setContext((_, { headers }) => {
//     const definition = getMainDefinition(_.query);
//     const isSubscription = definition.kind === 'OperationDefinition' && definition.operation === 'subscription';

//     return {
//         headers: {
//             ...headers,
//             type: isSubscription ? 'ws' : 'api',
//         },
//     };
// });

const queryTypeLink = setContext((_, { headers }) => {
    const definition = getMainDefinition(_.query);
    const isSubscription = definition.kind === 'OperationDefinition' && definition.operation === 'subscription';

    const uri = isSubscription ? `${wsLink.uri}?type=ws` : `${httpLink.uri}?type=api`;

    return {
        uri,
        headers,
    };
});


// Use the split function to combine HTTP and WebSocket links
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    // queryTypeLink.concat(wsLink),
    // queryTypeLink.concat(httpLink)
    wsLink,
    httpLink
);

// Create the Apollo client
const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export default client;