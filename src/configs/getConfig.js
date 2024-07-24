import {
    chains as baseConfigChains,
    rpcUrl as baseRpcUrl,
    config as baseProviderConfig,
    defaultChain as baseDefaultChain
} from "./base.config"
import {
    chains as tenderlyConfigChains,
    rpcUrl as tenderlyRpcUrl,
    config as tenderlyProviderConfig,
    defaultChain as tenderlyDefaultChain
} from "./tenderly.config"


// const baseConfig = {
//     rpcUrl: baseRpcUrl,
//     chains: baseConfigChains,
//     config: baseProviderConfig,
//     defaultChain: baseDefaultChain,
//     graphqlEndpoint: 'https://base.apecity.xyz/subgraphs/name/APE',
//     wsEndpoint: 'wss://base.apecity.xyz/subgraphs/name/APE?type=ws',
//     ipfsEndpoint: 'https://ipfs.apecity.xyz',
//     authToken: 'secretToken',
//     apeFactoryAddress: '0xb4FBc25204d26C4a937F4CBa67087F70B21bb6c5'
// }

const tenderlyConfig = {
    rpcUrl: tenderlyRpcUrl,
    chains: tenderlyConfigChains,
    config: tenderlyProviderConfig,
    defaultChain: tenderlyDefaultChain,
    graphqlEndpoint: 'https://tend.apecity.xyz/subgraphs/name/APE',
    wsEndpoint: 'wss://tend.apecity.xyz/subgraphs/name/APE?type=ws',
    ipfsEndpoint: 'https://ipfs.apecity.xyz',
    authToken: 'secretToken',
    apeFactoryAddress: '0x0fDc7bf21a167A20C49FcA41CCbc3ABa354AcfbD'
}

const baseConfig = tenderlyConfig


export const getConfig = () => {
    const network = import.meta.env.VITE_NETWORK
    const env = import.meta.env.VITE_ENVIRONMENT

    let defaultConfig;
    switch (network) {
        case 'BASE': {
            defaultConfig = baseConfig
            break;
        }
        case 'TENDERLY': {
            defaultConfig = tenderlyConfig
            break;
        }
        default: {
            defaultConfig = tenderlyConfig
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


