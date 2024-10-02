import { optimism, polygon, sepolia } from "viem/chains";
import { supportedChains } from "./chains"
import { tenderlyChain } from "./chains/tenderlyChain";
import { CURVE_TYPE } from "../constants";

export const contractAddresses = {
    [tenderlyChain.id]: {
        apeFactoryAddress: '0x9C6f1BE1Be7603029bB067BC554136e907620A5d',
        pumpFactoryAddress: '0x523E838a30068C8544A61882A0FEd125324ee0ec'
    },
    [sepolia.id]: {
        apeFactoryAddress: '0x9C6f1BE1Be7603029bB067BC554136e907620A5d',
        pumpFactoryAddress: '0x523E838a30068C8544A61882A0FEd125324ee0ec'
    },
    [polygon.id]: {
        apeFactoryAddress: '0x9C6f1BE1Be7603029bB067BC554136e907620A5d',
        pumpFactoryAddress: '0x523E838a30068C8544A61882A0FEd125324ee0ec'
    },
    [optimism.id]: {
        apeFactoryAddress: '0x9C6f1BE1Be7603029bB067BC554136e907620A5d',
        pumpFactoryAddress: '0x523E838a30068C8544A61882A0FEd125324ee0ec'
    },
}

export function getFactoryContractAddress(chainId, factoryType) {
    if (factoryType == CURVE_TYPE.UNISWAP) {
        return contractAddresses[chainId].pumpFactoryAddress || null;
    } else if (factoryType == CURVE_TYPE.APE) {
        return contractAddresses[chainId].apeFactoryAddress || null;
    }
}