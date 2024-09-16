// src/hooks/useContracts.js
import { useNetwork, useContract, useProvider } from 'wagmi'
import { memeTokenABI, memeTradingABI } from '../config/abis'
import { contractAddresses } from '../config/contracts'

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