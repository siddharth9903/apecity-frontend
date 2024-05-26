import { gql } from '@apollo/client';
import { deployedContractAddress as apeFactoryAddress } from '../../contracts/ApeFactory';

export const TOKENS_QUERY = gql`
  query GetTokens($first: Int!, $skip: Int!) {
    # tokens(first: $first, skip: $skip, orderBy: createdAtTimestamp, orderDirection: desc) {
    tokens(first: $first, skip: $skip, orderDirection: desc) {
      id
      name
      symbol
      metaData {
        description
        id
        image
        telegram
        twitter
        website
      }
    }
  }
`;

export const TOTAL_TOKENS_QUERY = gql`
  query GetTotalTokens {
    factory(id: "${apeFactoryAddress}") {
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
      metaData {
        description
        id
        image
        telegram
        twitter
        website
      }
      bondingCurve {
        id
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