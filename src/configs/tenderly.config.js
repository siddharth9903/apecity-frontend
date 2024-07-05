import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createPublicClient, defineChain, http } from 'viem'
import { injected } from '@wagmi/connectors'
import { metadata, projectId } from './walletConnect.config';

// export const rpcUrl = 'https://virtual.base.rpc.tenderly.co/c070adf9-120d-4186-95f8-ca0978df9c08'
export const rpcUrl = 'https://virtual.base.rpc.tenderly.co/b67fff04-bd69-4b14-907a-3912e44f3f1d'

// Create a custom chain configuration for your Tenderly chain
export const vTenderlyBaseChain = defineChain({
    id: 8454, // Replace with your Tenderly chain ID
    name: 'BaseTenderly Chain',
    network: 'base-tenderly',
    nativeCurrency: {
        decimals: 18,
        name: 'vEther',
        symbol: 'vETH',
    },
    rpcUrls: {
        default: {
            http: [rpcUrl], // Replace with your Tenderly RPC URL
        },
    },
    blockExplorers: {
        default: {
            name: 'Base Tenderly Explorer',
            url: rpcUrl, // Replace with your Tenderly explorer URL
        },
    },
    testnet: true,
});

export const chains = [vTenderlyBaseChain]
export const defaultChain = vTenderlyBaseChain

export const config = defaultWagmiConfig({
    autoConnect: true,
    publicClient: () => createPublicClient({ chain: vTenderlyBaseChain }),
    webSocketPublicClient: () => createPublicClient({ chain: vTenderlyBaseChain, transport: WebSocketTransport() }),
    connectors: [new injected()],
    chains,
    projectId,
    metadata,
    transports: {
        [vTenderlyBaseChain.id]: http(rpcUrl),
    },
});








// // Create a custom chain configuration for your Tenderly chain
// export const vLocalChain = defineChain({
//     id: 1337, // Replace with your Tenderly chain ID
//     name: 'LocalChain',
//     network: 'local-chain',
//     nativeCurrency: {
//         decimals: 18,
//         name: 'lEther',
//         symbol: 'lETH',
//     },
//     rpcUrls: {
//         default: {
//             http: ['http://127.0.0.1:8545/'], // Replace with your Tenderly RPC URL
//         },
//     },
// });



