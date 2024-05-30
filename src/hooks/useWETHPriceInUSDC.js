// import { useEffect, useState } from 'react';
// import { WETH_ADDRESS } from '../sections/token/TokenDetails';
// import { useReadContract } from 'wagmi';
// import { getAddress, parseEther } from 'viem';
// import { abi as UNISWAP_ROUTER_ABI } from '../contracts/UniswapRouter02';

// const USDC_ADDRESS = getAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');

// // Uniswap Router contract address and ABI on Ethereum mainnet
// const UNISWAP_ROUTER_ADDRESS = '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24';
// // const UNISWAP_ROUTER_ABI = [
// //     'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
// //     'function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB)'
// // ];

// const useWETHPrice = () => {
//     const { data, isLoading } = useReadContract({
//         address: UNISWAP_ROUTER_ADDRESS,
//         abi: UNISWAP_ROUTER_ABI,
//         functionName: 'getAmountsOut',
//         args: [
//             parseEther('1').toString(), // 1 WETH in Wei
//             [WETH_ADDRESS, USDC_ADDRESS] // Path from WETH to USDC
//         ],
//         watch: true
//     });

//     // const wethPrice = data ? data[1].toString() / 1e6 : null; // USDC price with 6 decimals
//     const wethPrice = data; // USDC price with 6 decimals

//     return { wethPrice, isLoading };
// };

// export default useWETHPrice;
// // import { useEffect, useState } from 'react';
// // import { WETH_ADDRESS } from '../sections/token/TokenDetails';
// // import { useReadContract } from 'wagmi';
// // import { getAddress, parseEther } from 'viem';


// // const USDC_ADDRESS = getAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')

// // // Uniswap Router contract address and ABI on Ethereum mainnet
// // const UNISWAP_ROUTER_ADDRESS = '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24';
// // const UNISWAP_ROUTER_ABI = [
// //     'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
// //     'function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB)'
// // ]; // Replace with the actual Uniswap Router ABI


// // const useWETHPrice = () => {
// //     const result = useReadContract({
// //         address: UNISWAP_ROUTER_ADDRESS,
// //         abi: UNISWAP_ROUTER_ABI,
// //         functionName: 'getAmountsOut',
// //         args: [
// //             parseEther('1').toString(), // 1 WETH in Wei
// //             [WETH_ADDRESS, USDC_ADDRESS]
// //         ],
// //         // watch: true, // Watch for changes
// //         // refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
// //     });

// //     console.log('result', result)
// //     console.log('result.data', result.data)
// //     // console.log('oop price data', data)
// //     // console.log('isError', isError)
// //     // const formatPrice = () => {
// //     //     if (!price) return null;
// //     //     return price.toString() / 1e6; // USDC price with 6 decimals
// //     // };

// //     // return { wethPrice: formatPrice(), isLoading };
// //     // return { wethPrice: data, isLoading };
// // };

// // export default useWETHPrice;