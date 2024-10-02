// src/hooks/useContracts.js
import { useNetwork, useContract, useProvider } from 'wagmi'
import { contractAddresses } from '../config/contracts'

// src/config/abis.js
export const memeTokenABI = [
    // ... ABI for meme token contract
]

export const memeTradingABI = [
    // ... ABI for meme trading contract
]


export function useContracts() {
  const { chain } = useNetwork()
  const provider = useProvider()

  const chainId = chain?.id

  const memeTokenContract = useContract({
    address: chainId ? contractAddresses[chainId].memeToken : undefined,
    abi: memeTokenABI,
    signerOrProvider: provider,
  })

  const memeTradingContract = useContract({
    address: chainId ? contractAddresses[chainId].memeTrading : undefined,
    abi: memeTradingABI,
    signerOrProvider: provider,
  })

  return { memeTokenContract, memeTradingContract }
}