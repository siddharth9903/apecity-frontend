import { gql } from '@apollo/client';

export const GET_BONDING_CURVES = gql`
  query GetBondingCurves {
    bondingCurves(first: 1000) {
      id
      token {
        id
        symbol
        name
        metaData {
          description
        }
      }
      currentPrice
      marketCap
      createdAtTimestamp
    }
  }
`;

export const GET_BONDING_CURVE_TRADES = gql`
  query GetBondingCurveTrades($bondingCurveId: ID!) {
    trades(
      where: { bondingCurve: $bondingCurveId }
      orderBy: timestamp
      orderDirection: asc
    ) {
      id
      timestamp
      type
      inAmount
      outAmount
      avgPrice
      openPrice
      closePrice
    }
  }
`;

export const GET_BONDING_CURVE = gql`
  query GetBondingCurve($id: ID!) {
      bondingCurve(id: $id) {
        id
        token {
          id
          symbol
          name
          metaData {
            description
          }
        }
        currentPrice
        marketCap
        createdAtTimestamp
      }
  }
`