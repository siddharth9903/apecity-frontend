import { gql } from '@apollo/client';

export const BONDING_CURVE_TRADE_SUBSCRIPTION = gql`
  subscription BondingCurveTradeSubscription($bondingCurveId: String!, $afterTimestamp: BigInt!) {
    newTrades: trades(
      where: { bondingCurve: $bondingCurveId, timestamp_gte: $afterTimestamp }
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

// export const BONDING_CURVE_TRADE_SUBSCRIPTION = gql`
//   subscription BondingCurveTradeSubscription($bondingCurveId: ID!) {
//     trades(
//       where: { bondingCurve: $bondingCurveId }
//       orderBy: timestamp
//       orderDirection: asc
//     ) {
//       id
//       timestamp
//       type
//       inAmount
//       outAmount
//       avgPrice
//       openPrice
//       closePrice
//     }
//   }
// `;