import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
    const token = import.meta.env.VITE_AUTH_TOKEN;
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

// import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';

// const httpLink = createHttpLink({
//     uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
// });

// const authLink = setContext((_, { headers }) => {
//     return {
//         headers: {
//             ...headers,
//             authorization: `${import.meta.env.VITE_AUTH_TOKEN}`, // Use your token here
//         }
//     }
// });

// const client = new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache(),
//     connectToDevTools: true,
// });

// export default client;




// // import { ApolloClient, InMemoryCache } from '@apollo/client';

// // const client = new ApolloClient({
// //     uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
// //     cache: new InMemoryCache(),
// //     connectToDevTools: true, 
// // });

// // export default client;