import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { MdFilterAlt } from "react-icons/md";
import { formatDistanceToNow } from 'date-fns';
import { shortenText } from "../../utils/helper";
import { formatNumber } from "../../utils/formats";
import { chainNativeExplorer } from "../../utils/native";

const Transactions = ({ trades, tokenName, nativeCurrency }) => {

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
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">{nativeCurrency.symbol}</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">{tokenName}</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        {/* <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">Avg. Price</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th> */}
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
                        <tr key={trade.id} className={trade?.tradeType === 'BUY' ? "bg-[#1d1d22] text-[#48bb78]" : "bg-[#1d1d22] text-[#FF5252]"}>

                            <td className="text-[#848489] border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-400">{formatDistanceToNow(new Date(trade.timestamp * 1000), { addSuffix: true })}</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-400">{trade.tradeType}</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">
                                    {trade.tradeType === "BUY" ? formatNumber(trade.inAmount) : formatNumber(trade.outAmount)}
                                </span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">
                                    {trade.tradeType === "BUY" ? formatNumber(trade.outAmount) : formatNumber(trade.inAmount)}
                                </span>
                            </td>
                            {/* <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">{formatNumber(trade.avgPrice)}</span>
                            </td> */}
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">{shortenText(trade.user.address, 6)}</span>
                            </td>
                            <td className="text-center border border-[#5e5e6b]">
                                <a href={`${chainNativeExplorer(nativeCurrency.chainId)}/tx/${trade.transaction.hash}`} target="_blank" rel="noopener noreferrer" className="text-[#A6A6A6] flex items-center justify-center">
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