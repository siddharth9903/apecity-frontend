import { gql } from '@apollo/client';

export const BONDING_CURVE_QUERY = gql`
  query BondingCurveData($id: String!) {
    BondingCurve_by_pk(id: $id) {
      id
      chainId
      address
      virtualEthReserve
      virtualTokenReserve
      ethReserve
      tokenReserve
      reserveRatio
      circulatingSupply
      active
      currentPrice
      marketCap
      ethAmountToCompleteCurve
      totalEthAmountToCompleteCurve
      uniswapRouter
      uniswapLiquidityPool
      lpCreationTimestamp  
      txCount
      timestamp
      blockNumber
      lastActivity
      volume
      buyVolume
      sellVolume
    }
  }
`;

export const GET_BONDING_CURVE_TRADES_QUERY = gql`
  query GetBondingCurveTrades($bondingCurveId: String!) {
    Trade(
        where: {bondingCurve: {id: {_eq: $bondingCurveId}}}
        order_by: {timestamp: desc}
    ){
      id
      transaction {
        id
        hash
      }
      timestamp
      tradeType
      inAmount
      outAmount
      avgPrice
      openPrice
      closePrice
      user {
        id
        address
      }
    }
  }
`;
