import { gql } from '@apollo/client';
import { deployedContractAddress as apeFactoryAddress } from '../../contracts/ApeFactory';

export const TOKENS_QUERY = gql`
  query GetTokens(
    $first: Int!
    $skip: Int!
    $orderBy: [Token_order_by!]
  ) {
    Token (
        limit: $first
        offset: $skip
        order_by: $orderBy
    ){
        id
        name
        symbol
        metadata {
          id
          description
          image
          name
          symbol
          telegram
          twitter
          website
        }
        bondingCurve {
          active
          marketCap
          volume
          txCount
        }
    }
  }
`;

// Updated query
export const TOTAL_TOKENS_QUERY = gql`
  query GetTotalTokens {
    Factory {
        tokenCount
    }
  }
`;

export const TOKEN_QUERY = gql`
  query GetToken($id: ID!) {
    token(id: $id) {
      id
      name
      symbol
      decimals
      totalSupply
      metadata {
        description
        id
        image
        telegram
        twitter
        website
      }
      bondingCurve {
        id
        createdAtTimestamp
      }
    }
  }
`;

export const BONDING_CURVE_QUERY = gql`
  query GetBondingCurve($id: ID!) {
      bondingCurve(id: $id) {
        id
        reserveRatio
        poolBalance
        circulatingSupply
        active
        currentPrice
        marketCap
        ethAmountToCompleteCurve
        tokenAmountToCompleteCurve
        totalEthAmountToCompleteCurve
        totalTokenAmountToCompleteCurve
        uniswapRouter
        uniswapLiquidityPool
        lpCreationTimestamp
        txCount
        createdAtTimestamp
        createdAtBlockNumber
      }
  }
`;

export const TOKEN_TRADES_QUERY = gql`
  query GetTokenTrades($bondingCurveId: ID!, $first: Int!, $skip: Int!) {
    trades(
      where: { bondingCurve: $bondingCurveId }
      orderBy: timestamp
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      id
      transaction {
        id
      }
      timestamp
      type
      inAmount
      outAmount
      avgPrice
      openPrice
      closePrice
      user {
        id
      }
    }
  }
`;
export const BONDING_CURVE_SUBSCRIPTION = gql`
  subscription BondingCurveUpdated($id: ID!) {
    bondingCurveUpdated: bondingCurve(id: $id) {
      id
      reserveRatio
      poolBalance
      circulatingSupply
      active
      currentPrice
      marketCap
      ethAmountToCompleteCurve
      tokenAmountToCompleteCurve
      totalEthAmountToCompleteCurve
      totalTokenAmountToCompleteCurve
      uniswapRouter
      uniswapLiquidityPool
      lpCreationTimestamp
      txCount
      createdAtTimestamp
      createdAtBlockNumber
    }
  }
`;