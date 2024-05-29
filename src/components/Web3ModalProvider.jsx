// components/Web3ModalProvider.js
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { defineChain, http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tenderlyBaseIdChainRpcUrl, vLocalChain, vTenderlyBaseChain } from '../../tenderly.config';
import { injected } from '@wagmi/connectors'

// import { hardhat } from 'wagmi/chains';
const queryClient = new QueryClient();
const projectId = '50a795bb1959766590ff9de27a43d8bd';
const metadata = {
    name: 'Apecity',
    description: 'Provides bonding curve functional trade',
    url: 'https://apecity.fun',
    icons: ['https://yourapp.com/favicon.ico'],
};


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
    connectors: [new injected()],
    chains: [vTenderlyBaseChain],
    projectId,
    metadata,
    transports: {
        [vTenderlyBaseChain.id]: http(tenderlyBaseIdChainRpcUrl),
    },
});

// const config2 = createConfig({
//     chains: [vTenderlyBaseChain],
//     transports: {
//         [vTenderlyBaseChain.id]: http('https://virtual.base.rpc.tenderly.co/7817edf3-f43a-4498-9cf9-c44c0164e1ed'),
//     },
//     publicClient: () => createPublicClient({ chain: vTenderlyBaseChain }),
//     webSocketPublicClient: () => createPublicClient({ chain: vTenderlyBaseChain, transport: WebSocketTransport() }),
//     connectors: [new InjectedConnector({ chains })],
//     chains: [vTenderlyBaseChain],
//     projectId,
//     metadata,

//     // connectors: [
//     //     walletConnect({ projectId, metadata, showQrModal: false }),
//     //     injected({ shimDisconnect: true }),
//     //     coinbaseWallet({
//     //         appName: metadata.name,
//     //         appLogoUrl: metadata.icons[0]
//     //     })
//     // ]
// })


createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true,
    enableOnramp: true,
    allowUnsupportedChain: true,
    defaultChain: vTenderlyBaseChain
});

export function Web3ModalProvider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}