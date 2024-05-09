import { defineChain } from 'viem'

// Create a custom chain configuration for your Tenderly chain
export const vTenderlyBaseChain = defineChain({
    id: 8453, // Replace with your Tenderly chain ID
    name: 'BaseTenderly Chain',
    network: 'base-tenderly',
    nativeCurrency: {
        decimals: 18,
        name: 'vEther',
        symbol: 'vETH',
    },
    rpcUrls: {
        default: {
            http: ['https://virtual.base.rpc.tenderly.co/7817edf3-f43a-4498-9cf9-c44c0164e1ed'], // Replace with your Tenderly RPC URL
        },
    },
    blockExplorers: {
        default: {
            name: 'Base Tenderly Explorer',
            url: 'https://dashboard.tenderly.co/explorer/vnet/7817edf3-f43a-4498-9cf9-c44c0164e1ed', // Replace with your Tenderly explorer URL
        },
    },
    // testnet: true,
});

// Create a custom chain configuration for your Tenderly chain
export const vLocalChain = defineChain({
    id: 1337, // Replace with your Tenderly chain ID
    name: 'LocalChain',
    network: 'local-chain',
    nativeCurrency: {
        decimals: 18,
        name: 'lEther',
        symbol: 'lETH',
    },
    rpcUrls: {
        default: {
            http: ['http://127.0.0.1:8545/'], // Replace with your Tenderly RPC URL
        },
    },
});



