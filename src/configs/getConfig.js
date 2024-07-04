import {
    chains as baseConfigChains,
    rpcUrl as baseRpcUrl,
    config as baseProviderConfig,
    defaultChain as baseDefaultChain
} from "./base.config"
import {
    chains as baseIdTenderlyConfigChains,
    rpcUrl as baseIdTenderlyRpcUrl,
    config as baseIdTenderlyProviderConfig,
    defaultChain as baseIdTenderlyDefaultChain
} from "./tenderly.config"


// const baseConfig = {
//     rpcUrl: baseRpcUrl,
//     chains: baseConfigChains,
//     config: baseProviderConfig,
//     defaultChain: baseDefaultChain,
//     graphqlEndpoint: 'https://ffd04q3km9.execute-api.us-east-2.amazonaws.com/subgraphs/name/APE',
//     ipfsEndpoint: 'https://ipfs.apecity.xyz',
//     authToken: 'secretToken',
//     apeFactoryAddress: '0xb4FBc25204d26C4a937F4CBa67087F70B21bb6c5'
// }

const baseIdTenderlyConfig = {
    rpcUrl: baseIdTenderlyRpcUrl,
    chains: baseIdTenderlyConfigChains,
    config: baseIdTenderlyProviderConfig,
    defaultChain: baseIdTenderlyDefaultChain,
    graphqlEndpoint: 'https://tend.apecity.xyz/subgraphs/name/APE',
    wsEndpoint: 'wss://tend.apecity.xyz/subgraphs/name/APE?type=ws',
    ipfsEndpoint: 'https://ipfs.apecity.xyz',
    authToken: 'secretToken',
    apeFactoryAddress: '0x89de37f99a0ea5a6594eda4ee567d97e1b8111d9'
}

const baseConfig = baseIdTenderlyConfig


export const getConfig = () => {
    const network = import.meta.env.VITE_NETWORK
    const env = import.meta.env.VITE_ENVIRONMENT

    let defaultConfig;
    switch (network) {
        case 'BASE': {
            defaultConfig = baseConfig
            break;
        }
        case 'BASEIDTENDERLY': {
            defaultConfig = baseIdTenderlyConfig
            break;
        }
        default: {
            defaultConfig = baseIdTenderlyConfig
            break;
        }
    }

    if (env == 'development') {
        return {
            ...defaultConfig,
            graphqlEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT,
            wsEndpoint: import.meta.env.VITE_WS_ENDPOINT,
            ipfsEndpoint: import.meta.env.VITE_IPFS_ENDPOINT,
            authToken: import.meta.env.VITE_AUTH_TOKEN
        }
    }

    return defaultConfig
}


