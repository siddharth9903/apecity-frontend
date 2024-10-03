import { mainnet, sepolia, polygon, optimism } from 'wagmi/chains'
import { tenderlyChain } from './tenderlyChain'

export const supportedChains = [mainnet, tenderlyChain, polygon, optimism]

export const chainLogos = {
    [tenderlyChain.id]: '/images/chains_logos/tenderly_logo.svg',
    [mainnet.id]: '/images/chains_logos/ethereum_logo.svg',
}

export const getChainLogo = (chainId) => {
    return chainLogos[chainId];
}



