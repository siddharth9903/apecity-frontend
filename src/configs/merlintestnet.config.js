import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createPublicClient, defineChain, http } from 'viem'
import { injected } from '@wagmi/connectors'
import { metadata, projectId } from './walletConnect.config';

export const rpcUrl = 'https://testnet-rpc.merlinchain.io/'

// Create a custom chain configuration for your Tenderly chain
export const merlinTestnetChain = defineChain({
    id: 686868, // Replace with your Tenderly chain ID
    name: 'Merlin Testnet',
    network: 'tenderly',
    nativeCurrency: {
        decimals: 8,
        name: 'BTC',
        symbol: 'BTC',
    },
    rpcUrls: {
        default: {
            http: [rpcUrl], // Replace with your Tenderly RPC URL
        },
    },
    blockExplorers: {
        default: {
            name: 'Block Explorer',
            url: 'https://testnet-scan.merlinchain.io/'
        },
    },
    testnet: true,
});

export const chains = [merlinTestnetChain]
export const defaultChain = merlinTestnetChain

export const config = defaultWagmiConfig({
    autoConnect: true,
    publicClient: () => createPublicClient({ chain: merlinTestnetChain }),
    webSocketPublicClient: () => createPublicClient({ chain: merlinTestnetChain, transport: WebSocketTransport() }),
    connectors: [new injected()],
    chains,
    projectId,
    metadata,
    transports: {
        [merlinTestnetChain.id]: http(rpcUrl),
    },
});