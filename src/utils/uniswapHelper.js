import { formatEther, parseEther } from 'viem';

const toWei = (value) => parseEther(value);
const fromWei = (value) => formatEther(value);

export const initialConstants = {
    virtualEthReserve:"0.84",
    virtualTokenReserve:"1000000000"
}

export const calculatePurchaseReturn = (ethIn, ethReserve, tokenReserve) => {
  if (ethIn === '0' || ethReserve === '0' || tokenReserve === '0') return '0';

  const ethInWei = BigInt(toWei(ethIn));
  const ethReserveWei = BigInt(toWei(ethReserve));
  const tokenReserveWei = BigInt(toWei(tokenReserve));

  const tokenOut = (tokenReserveWei * ethInWei) / (ethReserveWei + ethInWei);

  return fromWei(tokenOut);
};

export const calculateSaleReturn = (tokensIn, ethReserve, tokenReserve) => {
  if (tokensIn === '0' || ethReserve === '0' || tokenReserve === '0') return '0';

  const tokensInWei = BigInt(toWei(tokensIn));
  const ethReserveWei = BigInt(toWei(ethReserve));
  const tokenReserveWei = BigInt(toWei(tokenReserve));

  const ethOut = (ethReserveWei * tokensInWei) / (tokenReserveWei + tokensInWei);

  return fromWei(ethOut);
};

export const estimateEthInForExactTokensOut = (tokensOut, ethReserve, tokenReserve) => {
  if (tokensOut === '0' || ethReserve === '0' || tokenReserve === '0') return '0';

  const tokensOutWei = BigInt(toWei(tokensOut));
  const ethReserveWei = BigInt(toWei(ethReserve));
  const tokenReserveWei = BigInt(toWei(tokenReserve));

  const ethIn = (ethReserveWei * tokensOutWei) / (tokenReserveWei - tokensOutWei) + BigInt(1);

  return fromWei(ethIn);
};

export const estimateTokenInForExactEthOut = (ethOut, ethReserve, tokenReserve) => {
  if (ethOut === '0' || ethReserve === '0' || tokenReserve === '0') return '0';

  const ethOutWei = BigInt(toWei(ethOut));
  const ethReserveWei = BigInt(toWei(ethReserve));
  const tokenReserveWei = BigInt(toWei(tokenReserve));

  const tokensIn = (tokenReserveWei * ethOutWei) / (ethReserveWei - ethOutWei) + BigInt(1);

  return fromWei(tokensIn);
};
