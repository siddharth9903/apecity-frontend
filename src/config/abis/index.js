import apeFactoryAbi from './ape/ApeFactory';
import apeBondingCurveAbi from './ape/BondingCurve';
import pumpFactoryAbi from './uniswap/PumpFactory';
import uniswapBondingCurveAbi from './uniswap/BondingCurve';
import erc20Abi from './ERC20';
import uniswapRouterAbi from './UniswapRouter02';
import { CONTRACT, CURVE_TYPE } from '../../constants';

export const abis = {
    [CURVE_TYPE.APE]:{
        [CONTRACT.FACTORY] : apeFactoryAbi,
        [CONTRACT.BONDING_CURVE] : apeBondingCurveAbi,
        [CONTRACT.ERC20] : erc20Abi,
        [CONTRACT.UNISWAP_ROUTER] : uniswapRouterAbi,
    },
    [CURVE_TYPE.UNISWAP]:{
        [CONTRACT.FACTORY] : pumpFactoryAbi,
        [CONTRACT.BONDING_CURVE] : uniswapBondingCurveAbi,
        [CONTRACT.ERC20] : erc20Abi,
        [CONTRACT.UNISWAP_ROUTER] : uniswapRouterAbi,
    }
}


export const getContractAbi = (contract, curveType) => {
    return abis[curveType][contract];
}