// components/Web3ModalProvider.js
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { defineChain } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vLocalChain, vTenderlyBaseChain } from '../../tenderly.config';
// import { hardhat } from 'wagmi/chains';
const queryClient = new QueryClient();
const projectId = '50a795bb1959766590ff9de27a43d8bd';
const metadata = {
    name: 'Apecity',
    description: 'Provides bonding curve functional trade',
    url: 'https://apecity.fun',
    icons: ['https://yourapp.com/favicon.ico'],
};

// // Create a custom chain configuration for your Tenderly chain
// const tenderlyChain = defineChain({
//     id: 8453, // Replace with your Tenderly chain ID
//     name: 'BaseTenderly Chain',
//     network: 'base-tenderly',
//     nativeCurrency: {
//         decimals: 18,
//         name: 'ETH',
//         symbol: 'ETH',
//     },
//     rpcUrls: {
//         default: {
//             http: ['https://virtual.base.rpc.tenderly.co/431b304f-522f-416d-99ec-cd50deb63c8a'], // Replace with your Tenderly RPC URL
//         },
//     },
//     blockExplorers: {
//         default: {
//             name: 'Base Tenderly Explorer',
//             url: 'https://dashboard.tenderly.co/explorer/vnet/431b304f-522f-416d-99ec-cd50deb63c8a', // Replace with your Tenderly explorer URL
//         },
//     },
//     // testnet: true,
// });

// const config = defaultWagmiConfig({
//     autoConnect: true,
//     publicClient: () => createPublicClient({ chain: vTenderlyBaseChain }),
//     webSocketPublicClient: () => createPublicClient({ chain: vTenderlyBaseChain, transport: WebSocketTransport() }),
//     chains: [vTenderlyBaseChain],
//     projectId,
//     metadata,
// });

const config = defaultWagmiConfig({
    autoConnect: true,
    publicClient: () => createPublicClient({ chain: vTenderlyBaseChain }),
    webSocketPublicClient: () => createPublicClient({ chain: vTenderlyBaseChain, transport: WebSocketTransport() }),
    chains: [vTenderlyBaseChain],
    projectId,
    metadata,
});

createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true,
    enableOnramp: true,
});

export function Web3ModalProvider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}
// // components/Web3ModalProvider.js
// import { createWeb3Modal } from '@web3modal/wagmi/react';
// import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
// import { WagmiProvider } from 'wagmi';
// import { hardhat } from 'wagmi/chains';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const queryClient = new QueryClient();

// const projectId = '50a795bb1959766590ff9de27a43d8bd';

// const metadata = {
//     name: 'Apecity',
//     description: 'Provides bonding curve functional trade',
//     url: 'https://yourapp.com',
//     icons: ['https://yourapp.com/favicon.ico'],
// };

// // const chains = [baseSepolia];
// const chains = [hardhat];
// const config = defaultWagmiConfig({
//     chains,
//     projectId,
//     metadata,
// });

// createWeb3Modal({
//     wagmiConfig: config,
//     projectId,
//     enableAnalytics: true,
//     enableOnramp: true,
// });

// export function Web3ModalProvider({ children }) {
//     return (
//         <WagmiProvider config={config}>
//             <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//         </WagmiProvider>
//     );
// }


// "https://dashboard.tenderly.co/explorer/vnet/431b304f-522f-416d-99ec-cd50deb63c8a/address/0xa941ABb07aD9763EEc74f8001fd4512A5AdBa7D6"
// "https://dashboard.tenderly.co/explorer/vnet/431b304f-522f-416d-99ec-cd50deb63c8a/tx/0x6f33690da2c7ee88adc7a1e48770afe0c48f73913487cb4e6f7861dba8ebb0d4"
// "https://dashboard.tenderly.co/Siddharth009/apefun/testnet/0e8aa2c3-dc0d-40e8-a104-6d868b59bb9e/wallet/0xa941abb07ad9763eec74f8001fd4512a5adba7d6"