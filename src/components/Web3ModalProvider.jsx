// components/Web3ModalProvider.js
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, projectId } from '../config/wagmi'
import { supportedChains } from '../config/chains';

const queryClient = new QueryClient();

createWeb3Modal({
    wagmiConfig: config,
    projectId,
    chains: supportedChains[0],
    // enableAnalytics: true,
    // enableOnramp: true,
    allowUnsupportedChain: false,
    defaultChain: supportedChains,
});

export function Web3ModalProvider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}