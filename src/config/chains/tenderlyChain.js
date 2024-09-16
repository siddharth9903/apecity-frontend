import { defineChain } from "viem";

export const rpcUrl = 'https://virtual.base.rpc.tenderly.co/6725e05d-6353-4342-8e6d-fd822c6086ce'

export const tenderlyChain = defineChain({
    id: 8454,
    name: 'tenderly Chain',
    network: 'tenderly',
    nativeCurrency: {
        decimals: 18,
        name: 'vEther',
        symbol: 'vETH',
    },
    rpcUrls: {
        default: {
            http: [rpcUrl],
        },
    },
    blockExplorers: {
        default: {
            name: 'Tenderly Explorer',
            url: rpcUrl,
        },
    },
    testnet: true,
});