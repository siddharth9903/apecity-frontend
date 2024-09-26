import { gql } from '@apollo/client';

export const GET_BONDING_CURVES_FOR_CHART_QUERY = gql`
  query GetBondingCurves {
    BondingCurve(limit: 1000) {
      id
      address
      token {
        id
        address
        symbol
        name
        metadata {
          description
        }
      }
      currentPrice
      marketCap
      timestamp
    }
  }
`;

export const GET_BONDING_CURVE_FOR_CHART_QUERY = gql`
  query GetBondingCurve($id: String!) {
    BondingCurve_by_pk(id: $id) {
        id
        token {
          id
          symbol
          name
          metadata {
            description
          }
        }
        currentPrice
        marketCap
        timestamp
      }
  }
`

export const GET_BONDING_CURVE_TRADES_FOR_CHART_QUERY = gql`
  query GetBondingCurveTrades($bondingCurveId: String!) {
    Trade(
      where: {bondingCurve: {id: {_eq: $bondingCurveId}}}
      order_by: {timestamp: asc}
    ) {
      id
      timestamp
      tradeType
      inAmount
      outAmount
      avgPrice
      openPrice
      closePrice
    }
  }
`;



export const GET_BONDING_CURVES = gql`
  query GetBondingCurves {
    bondingCurves(first: 1000) {
      id
      token {
        id
        symbol
        name
        metadata {
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
      orderBy: {timestamp:"asc"}
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

export const GET_BONDING_CURVE_TRADES_SUBSCRIPTION = gql`
  subscription GetBondingCurveTrades($bondingCurveId: ID!) {
    trades(
      where: { bondingCurve: $bondingCurveId }
      orderBy: timestamp
      orderDirection: desc
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

export const GET_BONDING_CURVE = gql`
  query GetBondingCurve($id: ID!) {
      bondingCurve(id: $id) {
        id
        token {
          id
          symbol
          name
          metadata {
            description
          }
        }
        currentPrice
        marketCap
        createdAtTimestamp
      }
  }
`