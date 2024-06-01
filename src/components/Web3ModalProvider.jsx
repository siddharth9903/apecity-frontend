// components/Web3ModalProvider.js
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metadata, projectId } from '../configs/walletConnect.config';
import { getConfig } from '../configs/getConfig';

const queryClient = new QueryClient();


createWeb3Modal({
    wagmiConfig: getConfig().config,
    projectId,
    enableAnalytics: true,
    enableOnramp: true,
    allowUnsupportedChain: true,
    chains: getConfig().chains,
    defaultChain: getConfig().defaultChain,
});

export function Web3ModalProvider({ children }) {
    return (
        <WagmiProvider config={getConfig().config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}