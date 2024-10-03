import { defineChain } from "viem";

export const rpcUrl = 'https://virtual.base.rpc.tenderly.co/1fc2e09b-1a7e-4895-ace9-a7fa5c88bc46'

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