import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getConfig } from '../configs/getConfig';

// Create an HTTP link
const httpLink = new HttpLink({
    uri: getConfig().graphqlEndpoint,
    // uri: 'http://ecs-api-graph-tenderly-lb-1919492898.us-east-1.elb.amazonaws.com/subgraphs/name/APE?type=api'
});

// Create a WebSocket link
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:8001/subgraphs/name/APE',
    // uri: 'ws://ecs-ws-graph-tenderly-lb-247375954.us-east-1.elb.amazonaws.com/subgraphs/name/APE',
    // uri: 'ws://ecs-api-graph-tenderly-lb-1919492898.us-east-1.elb.amazonaws.com/subgraphs/name/APE?type=ws',
    // uri: 'https://ws.apecity.fun/subgraphs/name/APE',
    // uri: 'http://184.72.85.174:8001/subgraphs/name/APE',
    // uri: 'ws://184.72.85.174:8001/subgraphs/name/APE',
    // uri: 'https://ws.apecity.fun/subgraphs/name/APE',
    // uri: 'https://2bhu85569j.execute-api.us-east-1.amazonaws.com/subgraphs/name/APE',
    // uri: 'http://2bhu85569j.execute-api.us-east-1.amazonaws.com/subgraphs/name/APE',
    // uri: 'https://2bhu85569j.execute-api.us-east-1.amazonaws.com',
    
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


// import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { setContext } from '@apollo/client/link/context';
// import { getConfig } from '../configs/getConfig';

// const httpLink = createHttpLink({
//     uri: getConfig().graphqlEndpoint,
// });

// const wsLink = new WebSocketLink({
//     uri: `ws://localhost:8001/graphql`,
//     options: {
//         reconnect: true,
//     },
// });

// // Split link to use HTTP for queries and mutations, and WebSocket for subscriptions
// const splitLink = split(
//     ({ query }) => {
//         const definition = getMainDefinition(query);
//         return (
//             definition.kind === 'OperationDefinition' &&
//             definition.operation === 'subscription'
//         );
//     },
//     wsLink,
//     authLink.concat(httpLink),
// );



// const authLink = setContext((_, { headers }) => {
//     const token = getConfig().authToken;
//     return {
//         headers: {
//             ...headers,
//             ...(token ? { authorization: `${token}` } : {}),
//         },
//     };
// });

// const client = new ApolloClient({
//     // link: authLink.concat(splitLink),
//     link: splitLink,
//     cache: new InMemoryCache(),
//     connectToDevTools: true,
// });


// export default client;