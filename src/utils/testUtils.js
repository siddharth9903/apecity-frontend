import {
    calculatePurchaseReturn,
    calculateSaleReturn,
    estimateEthInForExactTokensOut,
    estimateTokenInForExactEthOut
} from "./uniswapHelper.js";

// Example usage
const ethReserve1 = '20.00';
const tokenReserve1 = '100000.00';
const ethIn = '5.0'
const tokenOut = '20000.00'

// const ethReserve1 = '1.153432835820895523';
// const tokenReserve1 = '728260869.565217391304347826';
// const ethIn = '3.04656716418'
// const tokenOut = '528260869.565217391304347826'

const ethReserve2 = '25.00';
const tokenReserve2 = '80000.00';
const tokenIn = '20000.00'
const ethOut = '5.0'



function runExample(name, func, ...args) {
    console.log(name);
    console.log('Input:', ...args);
    try {
        const result = func(...args);
        console.log('Output:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
    console.log();
}

runExample('Example 1: Calculate Purchase Return', calculatePurchaseReturn, ethIn, ethReserve1, tokenReserve1);
runExample('Example 2: Calculate Sale Return', calculateSaleReturn, tokenIn, ethReserve2, tokenReserve2);
runExample('Example 3: Estimate ETH In for Exact Tokens Out', estimateEthInForExactTokensOut, tokenOut, ethReserve1, tokenReserve1);
runExample('Example 4: Estimate Tokens In for Exact ETH Out', estimateTokenInForExactEthOut, ethOut, ethReserve2, tokenReserve2);
runExample('Edge Case: Zero Input', calculatePurchaseReturn, '0', ethReserve1, tokenReserve1);