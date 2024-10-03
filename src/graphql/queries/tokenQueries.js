import { gql } from '@apollo/client';

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
        chainId
        curveType
        name
        address
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
  query GetToken($id: String!) {
    Token_by_pk(id: $id) {
      id
      chainId
      curveType
      address
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
        address
        timestamp
      }
    }
  }
`;
//   subscription BondingCurveUpdated($id: ID!) {
//     bondingCurveUpdated: bondingCurve(id: $id) {
//       id
//       reserveRatio
//       poolBalance
//       circulatingSupply
//       active
//       currentPrice
//       marketCap
//       ethAmountToCompleteCurve
//       tokenAmountToCompleteCurve
//       totalEthAmountToCompleteCurve
//       totalTokenAmountToCompleteCurve
//       uniswapRouter
//       uniswapLiquidityPool
//       lpCreationTimestamp
//       txCount
//       createdAtTimestamp
//       createdAtBlockNumber
//     }
//   }
// `;