import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createPublicClient, defineChain, http } from 'viem'
import { injected } from '@wagmi/connectors'
import { metadata, projectId } from './walletConnect.config';

export const rpcUrl = 'https://virtual.base.rpc.tenderly.co/3f03ea4a-aebd-445c-94ca-22dee8209cb8'

// Create a custom chain configuration for your Tenderly chain
export const tenderlyChain = defineChain({
    id: 8455, // Replace with your Tenderly chain ID
    name: 'tenderly Chain',
    network: 'tenderly',
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
            name: 'Tenderly Explorer',
            url: rpcUrl, // Replace with your Tenderly explorer URL
        },
    },
    testnet: true,
});

export const chains = [tenderlyChain]
export const defaultChain = tenderlyChain

export const config = defaultWagmiConfig({
    autoConnect: true,
    publicClient: () => createPublicClient({ chain: tenderlyChain }),
    webSocketPublicClient: () => createPublicClient({ chain: tenderlyChain, transport: WebSocketTransport() }),
    connectors: [new injected()],
    chains,
    projectId,
    metadata,
    transports: {
        [tenderlyChain.id]: http(rpcUrl),
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



