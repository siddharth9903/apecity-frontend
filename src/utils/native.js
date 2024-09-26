import { supportedChains } from "../config/chains"

const chainNativeProperties = supportedChains.reduce((acc, chain) => {
    acc[chain.id] = {
        chainId: chain.id,
        name: chain.nativeCurrency.name,
        symbol: chain.nativeCurrency.symbol,
        decimals: chain.nativeCurrency.decimals,
        blockExplorers: chain.blockExplorers
    }
    return acc
})

export function nativeCurrencyDetails(chainId) {
    return chainNativeProperties[chainId] ? {
        name: chainNativeProperties[chainId].name,
        symbol: chainNativeProperties[chainId].symbol,
        decimals: chainNativeProperties[chainId].decimals,
        chainId: chainNativeProperties[chainId].chainId
    } : {
        name: 'Unknown',
        symbol: 'UNKNOWN',
        decimals: 18
    }
}

// Helper function to get symbol by chain ID
export function nativeCurrencySymbol(chainId) {
    return nativeCurrencyDetails(chainId).symbol
}

// Helper function to format amount according to native currency decimals
export function formatNativeCurrencyAmount(amount, chainId) {
    const { decimals } = nativeCurrencyDetails(chainId)
    return (Number(amount) / 10 ** decimals).toFixed(decimals)
}

export function chainNativeExplorer(chainId) {
    return chainNativeProperties[chainId] ? chainNativeProperties[chainId]?.blockExplorers?.default?.url : ""
}