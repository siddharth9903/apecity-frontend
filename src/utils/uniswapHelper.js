import { formatEther, parseEther } from 'viem';

const toWei = (value) => parseEther(value);
const fromWei = (value) => formatEther(value);

const initialConstants = {
    virtualEthReserve: "0.84",
    virtualTokenReserve: "1000000000"
}

const calculatePurchaseReturn = (ethIn, ethReserve, tokenReserve) => {
    try {
        if (ethIn === '0' || ethReserve === '0' || tokenReserve === '0') return '0';

        const ethInWei = BigInt(toWei(ethIn));
        const ethReserveWei = BigInt(toWei(ethReserve));
        const tokenReserveWei = BigInt(toWei(tokenReserve));

        const tokenOut = (tokenReserveWei * ethInWei) / (ethReserveWei + ethInWei);

        return fromWei(tokenOut);
    } catch (error) {
        return '0'
    }
};

const calculateSaleReturn = (tokensIn, ethReserve, tokenReserve) => {
    try {
        if (tokensIn === '0' || ethReserve === '0' || tokenReserve === '0') return '0';

        const tokensInWei = BigInt(toWei(tokensIn));
        const ethReserveWei = BigInt(toWei(ethReserve));
        const tokenReserveWei = BigInt(toWei(tokenReserve));

        const ethOut = (ethReserveWei * tokensInWei) / (tokenReserveWei + tokensInWei);

        return fromWei(ethOut);
    } catch (error) {
        return '0'
    }
};

const estimateEthInForExactTokensOut = (tokensOut, ethReserve, tokenReserve) => {
    try {
        if (tokensOut === '0' || ethReserve === '0' || tokenReserve === '0') return '0';

        const tokensOutWei = BigInt(toWei(tokensOut));
        const ethReserveWei = BigInt(toWei(ethReserve));
        const tokenReserveWei = BigInt(toWei(tokenReserve));

        const ethIn = (ethReserveWei * tokensOutWei) / (tokenReserveWei - tokensOutWei) + BigInt(1);

        return fromWei(ethIn);
    } catch (error) {
        return '0'
    }
};

const estimateTokenInForExactEthOut = (ethOut, ethReserve, tokenReserve) => {
    try {
        if (ethOut === '0' || ethReserve === '0' || tokenReserve === '0') return '0';

        const ethOutWei = BigInt(toWei(ethOut));
        const ethReserveWei = BigInt(toWei(ethReserve));
        const tokenReserveWei = BigInt(toWei(tokenReserve));

        const tokensIn = (tokenReserveWei * ethOutWei) / (ethReserveWei - ethOutWei) + BigInt(1);

        return fromWei(tokensIn);
    } catch (error) {
        return '0'
    }
};

export const uniswapFormula = {
    calculatePurchaseReturn,
    calculateSaleReturn,
    estimateEthInForExactTokensOut,
    estimateTokenInForExactEthOut,
    initialConstants
}
