// components/Web3ModalProvider.js
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { defineChain, http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tenderlyBaseIdChainRpcUrl, vLocalChain, vTenderlyBaseChain } from '../../tenderly.config';
import { injected } from '@wagmi/connectors'
import { hardhat, base } from 'wagmi/chains';

export const baseRpcUrl = 'https://base.gateway.tenderly.co/7eSxf2jVQXhRN3QZ4bRkBj'

const queryClient = new QueryClient();
const projectId = '50a795bb1959766590ff9de27a43d8bd';
const metadata = {
    name: 'Apecity',
    description: 'Provides bonding curve functional trade',
    url: 'https://apecity.fun',
    icons: ['https://yourapp.com/favicon.ico'],
};

//for baseIdTenderly
// const config = defaultWagmiConfig({
//     autoConnect: true,
//     publicClient: () => createPublicClient({ chain: vTenderlyBaseChain }),
//     webSocketPublicClient: () => createPublicClient({ chain: vTenderlyBaseChain, transport: WebSocketTransport() }),
//     connectors: [new injected()],
//     chains: [vTenderlyBaseChain],
//     projectId,
//     metadata,
//     transports: {
//         [vTenderlyBaseChain.id]: http(tenderlyBaseIdChainRpcUrl),
//     },
// });

// const config = defaultWagmiConfig({
//     autoConnect: true,
//     publicClient: () => createPublicClient({ chain: base }),
//     webSocketPublicClient: () => createPublicClient({ chain: base, transport: WebSocketTransport() }),
//     connectors: [new injected()],
//     chains: [base],
//     projectId,
//     metadata,
//     transports: {
//         [base.id]: http(baseRpcUrl),
//     },
// });

const chains = [base]
const config = defaultWagmiConfig({ chains, projectId, metadata })


createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true,
    enableOnramp: true,
    allowUnsupportedChain: true,
    chains,
    // defaultChain: vTenderlyBaseChain
    defaultChain: base,
});

export function Web3ModalProvider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}