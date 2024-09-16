
// src/config/wagmi.js
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { supportedChains } from './chains';

export const projectId = '50a795bb1959766590ff9de27a43d8bd';

export const metadata = {
    name: 'Ape City',
    description: 'Provides bonding curve functional trade',
    url: 'https://apecity.fun',
    icons: ['https://yourapp.com/favicon.ico'],
};

// 2. Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: supportedChains,
  projectId,
  metadata
})

