// ethers.js
import { JsonRpcProvider, FallbackProvider } from 'ethers'
import { useMemo } from 'react'
import { useClient } from 'wagmi'

export function clientToProvider(client) {
    const { chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        // ensAddress: chain.contracts?.ensRegistry?.address,
    }

    if (transport.type === 'fallback'){

        return new FallbackProvider(
            transport.transports.map(
                ({ value }) => new HttpProvider(value?.rpcUrl, network),
            ),
        )
    }
    return new JsonRpcProvider(transport.rpcUrl, network)
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId } = {}) {
    const client = useClient({ chainId })
    return useMemo(() => (client ? clientToProvider(client) : undefined), [client])
}
// // ethers.js
// import { providers } from 'ethers'
// import { useMemo } from 'react'
// import { useClient } from 'wagmi'

// export function clientToProvider(client) {
//     const { chain, transport } = client
//     const network = {
//         chainId: chain.id,
//         name: chain.name,
//         ensAddress: chain.contracts?.ensRegistry?.address,
//     }
//     if (transport.type === 'fallback')
//         return new providers.FallbackProvider(
//             transport.transports.map(
//                 ({ value }) => new providers.JsonRpcProvider(value?.url, network),
//             ),
//         )
//     return new providers.JsonRpcProvider(transport.url, network)
// }

// /** Hook to convert a viem Client to an ethers.js Provider. */
// export function useEthersProvider({ chainId } = {}) {
//     const client = useClient({ chainId })
//     return useMemo(() => (client ? clientToProvider(client) : undefined), [client])
// }