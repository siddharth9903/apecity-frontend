import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { base } from 'wagmi/chains';
import { metadata, projectId } from './walletConnect.config';

export const rpcUrl = 'https://base.gateway.tenderly.co/7eSxf2jVQXhRN3QZ4bRkBj'

export const chains = [base]
export const defaultChain = base

export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata
})