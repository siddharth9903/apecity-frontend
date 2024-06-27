// import React from 'react';
// import { useSubscription, gql } from '@apollo/client';

// const TOKENS_SUBSCRIPTION = gql`
//   subscription TokensUpdated {
//   bondingCurve(id: "0xe4d1d1c08e544ca117c53257ed64a6566c81cfaa") {
//     token {
//       name
//       symbol
//     }
//     trades {
//       id
//       timestamp
//     }
//   }
//   }
// `;

// const BondingCurveSubscription = () => {
//   const { data, loading, error } = useSubscription(TOKENS_SUBSCRIPTION);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;


//   return (

//     <div className="container-fluid pt-[70px] bg-black">
//       <div className="bs-container-md max-md:px-3">
//     <div style={{color:'white'}}>
//           <h2>Token Updates</h2>
//       name: {data?.bondingCurve?.token?.name}
//       symbol: {data?.bondingCurve?.token?.symbol}
//       {data?.bondingCurve?.trades?.map((trade, idx) => (
//         <div key={trade.timestamp}>
//           <h3>TRADE #{idx}</h3>
//           <p>timestamp: {trade?.timestamp}</p>
//         </div>
//       ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BondingCurveSubscription;
