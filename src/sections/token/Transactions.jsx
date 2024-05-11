import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { MdFilterAlt } from "react-icons/md";
import { formatDistanceToNow } from 'date-fns';
import { shortenText } from "../../utils/helper";
import { formatNumber } from "../../utils/formats";

const Transactions = ({ trades, tokenName }) => {
    return (
        <div className="overflow-x-auto">
            <table className="border-collapse xl:w-full max-xl:w-[900px] max-md:overflow-x-auto">
                <thead>
                    <tr>
                        <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">Date</span>
                                <FaCalendarAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">Type</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">ETH</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">{tokenName}</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">Avg. Price</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">User</span>
                            </div>
                        </th>
                        <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
                            <div>
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">TXN</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {trades?.map((trade) => (
                        <tr key={trade.id} className={trade?.type === 'BUY' ? "bg-[#1d1d22] text-[#48bb78]" : "bg-[#1d1d22] text-[#f56565]"}>

                            {console.log('trade',trade)}
                            <td className="text-[#848489] border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-400">{formatDistanceToNow(new Date(trade.timestamp * 1000), { addSuffix: true })}</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-400">{trade.type}</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">
                                    {trade.type === "BUY" ? formatNumber(trade.inAmount) : formatNumber(trade.outAmount)}
                                </span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">
                                    {trade.type === "BUY" ? formatNumber(trade.outAmount) : formatNumber(trade.inAmount)}
                                </span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">{formatNumber(trade.avgPrice)}</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">{shortenText(trade.user.id, 6)}</span>
                            </td>
                            <td className="text-center border border-[#5e5e6b]">
                                <a href={`https://etherscan.io/tx/${trade.transaction.id}`} target="_blank" rel="noopener noreferrer" className="text-[#A6A6A6] flex items-center justify-center">
                                    <FaExternalLinkAlt className="text-sm" />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
// import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
// import { MdFilterAlt } from "react-icons/md";
// import { formatDistanceToNow } from 'date-fns';
// import { shortenText } from "../../utils/helper";
// import { formatNumber } from "../../utils/formats";


// const RepeatingDecimal = ({ decimal }) => {
//     // Convert the decimal to a string
//     const decimalString = decimal.toString();

//     // Check if the decimal has repeating digits
//     const indexOfDecimal = decimalString.indexOf('.');
//     const indexOfOpenParenthesis = decimalString.indexOf('(');
//     const repeatingPart = decimalString.substring(
//         indexOfOpenParenthesis + 1,
//         decimalString.length - 1
//     );

//     // If there's a repeating part, format it with parentheses
//     const formattedDecimal = indexOfOpenParenthesis !== -1 ? (
//         <span>
//             {decimalString.substring(0, indexOfOpenParenthesis)}
//             <span style={{ fontSize: 'smaller' }}>({repeatingPart})</span>
//         </span>
//     ) : (
//         decimalString
//     );

//     return <span>{formattedDecimal}</span>;
// };



// const Transactions = ({ trades }) => {
//     return (
//         <div className="overflow-x-auto">
//             <table className="border-collapse xl:w-full max-xl:w-[900px] max-md:overflow-x-auto">
//                 <thead>
//                     <tr>
//                         <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
//                             <div className="flex items-center justify-start">
//                                 <span className="uppercase text-white pfont-600 text-xs mr-1.5">Date</span>
//                                 <FaCalendarAlt className="text-[#A6A6A6] text-sm" />
//                             </div>
//                         </th>
//                         <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
//                             <div className="flex items-center justify-start">
//                                 <span className="uppercase text-white pfont-600 text-xs mr-1.5">Type</span>
//                                 <MdFilterAlt className="text-[#A6A6A6] text-sm" />
//                             </div>
//                         </th>
//                         <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
//                             <div className="flex items-center justify-start">
//                                 <span className="uppercase text-white pfont-600 text-xs mr-1.5">In Amount</span>
//                                 <MdFilterAlt className="text-[#A6A6A6] text-sm" />
//                             </div>
//                         </th>
//                         <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
//                             <div className="flex items-center justify-start">
//                                 <span className="uppercase text-white pfont-600 text-xs mr-1.5">Out Amount</span>
//                                 <MdFilterAlt className="text-[#A6A6A6] text-sm" />
//                             </div>
//                         </th>
//                         <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
//                             <div className="flex items-center justify-start">
//                                 <span className="uppercase text-white pfont-600 text-xs mr-1.5">Avg. Price</span>
//                                 <MdFilterAlt className="text-[#A6A6A6] text-sm" />
//                             </div>
//                         </th>
//                         <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
//                             <div className="flex items-center justify-start">
//                                 <span className="uppercase text-white pfont-600 text-xs mr-1.5">User</span>
//                             </div>
//                         </th>
//                         <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
//                             <div>
//                                 <span className="uppercase text-white pfont-600 text-xs mr-1.5">TXN</span>
//                             </div>
//                         </th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {trades.map((trade) => (
//                         <tr key={trade.id} className="bg-[#1d1d22] odd:text-[#f56565] even:text-[#48bb78]">
//                             <td className="text-[#848489] border border-[#5e5e6b] px-4 py-2">
//                                 <span className="text-xs pfont-400">{formatDistanceToNow(new Date(trade.timestamp * 1000), { addSuffix: true })}</span>
//                             </td>
//                             <td className="border border-[#5e5e6b] px-4 py-2">
//                                 <span className="text-xs pfont-400">{trade.type}</span>
//                             </td>
//                             <td className="border border-[#5e5e6b] px-4 py-2">
//                                 <span className="text-xs pfont-600">{formatNumber(trade.inAmount)}</span>
//                             </td>
//                             <td className="border border-[#5e5e6b] px-4 py-2">
//                                 <span className="text-xs pfont-600">{formatNumber(trade.outAmount)}</span>
//                             </td>
//                             <td className="border border-[#5e5e6b] px-4 py-2">
//                                 <span className="text-xs pfont-600">{formatNumber(trade.avgPrice)}</span>
//                                 {console.log(trade.avgPrice,formatNumber(trade.avgPrice))}
//                             </td>
//                             <td className="border border-[#5e5e6b] px-4 py-2">
//                                 <span className="text-xs pfont-600">{shortenText(trade.user.id, 6)}</span>
//                             </td>
//                             <td className="text-center border border-[#5e5e6b]">
//                                 <a href={`https://etherscan.io/tx/${trade.transaction.id}`} target="_blank" rel="noopener noreferrer" className="text-[#A6A6A6] flex items-center justify-center">
//                                     <FaExternalLinkAlt className="text-sm" />
//                                 </a>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Transactions;
// // import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa"
// // import { MdFilterAlt } from "react-icons/md"

// // const Transactions = () => {
// //     return (
// //         <>

// //             <div className="overflow-x-auto">
// //                 <table className="border-collapse xl:w-full max-xl:w-[900px] max-md:overflow-x-auto">
// //                     <thead className="">
// //                         <tr>
// //                             <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
// //                                 <div className="flex items-center justify-start">
// //                                     <span className="uppercase text-white pfont-600 text-xs mr-1.5">Date</span>
// //                                     <FaCalendarAlt className="text-[#A6A6A6] text-sm" />
// //                                 </div>
// //                             </th>
// //                             <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
// //                                 <div className="flex items-center justify-start">
// //                                     <span className="uppercase text-white pfont-600 text-xs mr-1.5">Type</span>
// //                                     <MdFilterAlt className="text-[#A6A6A6] text-sm" />
// //                                 </div>
// //                             </th>
// //                             <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
// //                                 <div className="flex items-center justify-start">
// //                                     <span className="uppercase text-white pfont-600 text-xs mr-1.5">USD</span>
// //                                     <MdFilterAlt className="text-[#A6A6A6] text-sm" />
// //                                 </div>
// //                             </th>
// //                             <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
// //                                 <div className="flex items-center justify-start">
// //                                     <span className="uppercase text-white pfont-600 text-xs mr-1.5">$base</span>
// //                                     <MdFilterAlt className="text-[#A6A6A6] text-sm" />
// //                                 </div>
// //                             </th>
// //                             <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
// //                                 <div className="flex items-center justify-start">
// //                                     <span className="uppercase text-white pfont-600 text-xs mr-1.5">sol</span>
// //                                     <MdFilterAlt className="text-[#A6A6A6] text-sm" />
// //                                 </div>
// //                             </th>
// //                             <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
// //                                 <div className="flex items-center justify-start">
// //                                     <span className="uppercase text-white pfont-600 text-xs mr-1.5">price</span>
// //                                     <MdFilterAlt className="text-[#A6A6A6] text-sm" />
// //                                 </div>
// //                             </th>
// //                             <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
// //                                 <div className="flex items-center justify-start">
// //                                     <span className="uppercase text-white pfont-600 text-xs mr-1.5">maker</span>
// //                                 </div>
// //                             </th>
// //                             <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
// //                                 <div>
// //                                     <span className="uppercase text-white pfont-600 text-xs mr-1.5">TXN</span>
// //                                 </div>
// //                             </th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {Array.from({ length: 40 }).map((item, index) => (
// //                             <tr key={index} className="bg-[#1d1d22] odd:text-[#f56565] even:text-[#48bb78]">
// //                                 <td className="text-[#848489] border border-[#5e5e6b] px-4 py-2">
// //                                     <span className="text-xs pfont-400">55s ago</span>
// //                                 </td>
// //                                 <td className="border border-[#5e5e6b] px-4 py-2">
// //                                     <span className="text-xs pfont-400">Sell</span>
// //                                 </td>
// //                                 <td className="border border-[#5e5e6b] px-4 py-2">
// //                                     <span className="text-xs pfont-600">4373773</span>
// //                                 </td>
// //                                 <td className="border border-[#5e5e6b] px-4 py-2">
// //                                     <span className="text-xs pfont-600">4373773</span>
// //                                 </td>
// //                                 <td className="border border-[#5e5e6b] px-4 py-2">
// //                                     <span className="text-xs pfont-600">4373773</span>
// //                                 </td>
// //                                 <td className="border border-[#5e5e6b] px-4 py-2">
// //                                     <span className="text-xs pfont-600">4373773</span>
// //                                 </td>
// //                                 <td className="border border-[#5e5e6b] px-4 py-2">
// //                                     <span className="text-xs pfont-600">4373773</span>
// //                                 </td>
// //                                 <td className="text-center border border-[#5e5e6b]">
// //                                     <span className="text-[#A6A6A6]  flex items-center justify-center"><FaExternalLinkAlt className="text-sm" /></span>
// //                                 </td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </>
// //     )
// // }

// // export default Transactions
