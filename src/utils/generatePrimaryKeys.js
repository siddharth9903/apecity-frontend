export function generateTokenId(tokenAddress, chainId) {
    return ""
      .concat(tokenAddress.toLowerCase())
      .concat("-")
      .concat(chainId.toString());
  }
  