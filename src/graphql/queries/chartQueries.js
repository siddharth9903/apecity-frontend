import { gql } from '@apollo/client';

export const GET_BONDING_CURVES = gql`
  query GetBondingCurves {
    bondingCurves(first: 1000) {
      id
      token {
        id
        symbol
        name
      }
      currentPrice
      marketCap
      createdAtTimestamp
    }
  }
`;

export const GET_BONDING_CURVE_TRADES = gql`
  query GetBondingCurveTrades($bondingCurveId: ID!, $from: Int!, $to: Int!) {
    trades(
      where: { bondingCurve: $bondingCurveId, timestamp_gte: $from, timestamp_lte: $to }
      orderBy: timestamp
      orderDirection: asc
    ) {
      id
      timestamp
      type
      inAmount
      outAmount
      avgPrice
    }
  }
`;