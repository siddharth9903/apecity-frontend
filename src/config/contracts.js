import { optimism, polygon, sepolia } from "viem/chains";
import { supportedChains } from "./chains"
import { tenderlyChain } from "./chains/tenderlyChain";

export const contractAddresses = {
    [tenderlyChain.id]: {
        factoryAddress: '0xC746B03Cf61E373fea448e0975BE4588A64746d7'
    },
    [sepolia.id]: {
        factoryAddress: '0xC746B03Cf61E373fea448e0975BE4588A64746d7'
    },
    [polygon.id]: {
        factoryAddress: '0xC746B03Cf61E373fea448e0975BE4588A64746d7'
    },
    [optimism.id]: {
        factoryAddress: '0xC746B03Cf61E373fea448e0975BE4588A64746d7'
    },
}

export function getFactoryContractAddress(chainId){
    return contractAddresses[chainId].factoryAddress || null;
}