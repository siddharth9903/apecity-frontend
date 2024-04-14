import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa"
import { MdFilterAlt } from "react-icons/md"

const Transactions = () => {
    return (
        <>

            <table className="border-collapse w-full">
                <thead className="">
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
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">USD</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">$base</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">sol</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">price</span>
                                <MdFilterAlt className="text-[#A6A6A6] text-sm" />
                            </div>
                        </th>
                        <th className="px-4 py-2 border border-[#5e5e6b] bg-[#2e2e33]">
                            <div className="flex items-center justify-start">
                                <span className="uppercase text-white pfont-600 text-xs mr-1.5">maker</span>
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
                    {Array.from({ length: 40 }).map((item, index) => (
                        <tr key={index} className="bg-[#1d1d22] odd:text-[#f56565] even:text-[#48bb78]">
                            <td className="text-[#848489] border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-400">55s ago</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-400">Sell</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">4373773</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">4373773</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">4373773</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">4373773</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <span className="text-xs pfont-600">4373773</span>
                            </td>
                            <td className="text-center border border-[#5e5e6b]">
                                <span className="text-[#A6A6A6]  flex items-center justify-center"><FaExternalLinkAlt className="text-sm" /></span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Transactions
