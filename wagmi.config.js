import { defineConfig } from '@wagmi/cli'
import { etherscan, react } from '@wagmi/cli/plugins'
import { erc20Abi } from 'viem'
import { baseSepolia } from 'wagmi/chains'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20Abi,
    },
  ],
  plugins: [
    etherscan({
      apiKey: process.env.ETHERSCAN_API_KEY,
      chainId: baseSepolia.id,
    }),
    react(),
  ],
})