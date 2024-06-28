import { FaExternalLinkAlt } from "react-icons/fa"
import { MdFilterAlt } from "react-icons/md"
import { orderCoulumns } from "../../utils/columns";

const Orders = () => {
    return (
        <>

            <table className="border-collapse w-full">
                <thead className="">
                    <tr>
                        {
                            orderCoulumns.map((item, index) => (
                                <th key={index} className="px-4 border border-[#5e5e6b] py-2 bg-[#2e2e33]">
                                    <div className="flex items-center justify-start">
                                        <span className="uppercase text-white pfont-600 text-xs mr-1.5">{item.name}</span>
                                    </div>
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 40 }).map((item, index) => (
                        <tr key={index} className="bg-[#1d1d22] odd:text-[#FF5252] even:text-[#48bb78]">
                            <td className="text-[#848489] text-center border border-[#5e5e6b] px-4 py-2">
                                <span className="text-sm pfont-400">#{index + 1}</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <div className="flex items-center gap-x-2 justify-center">
                                    <span><img src="/images/icons/svg/maker.svg" /></span>
                                    <span className="text-[#48bb78] text-sm pfont-500">0xd24E...d0A7</span>
                                </div>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <div className="flex  flex-col items-end">
                                    <span className="pfont-500 text-sm text-[#FF5252] text-right">$16.5k</span>
                                    <div>
                                        <span className="text-[#848489] text-xs pfont-500">5.9B/365</span>
                                        <span className="text-[#848489] text-xs pfont-400"> txns</span>
                                    </div>
                                </div>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <div className="flex  flex-col items-end">
                                    <span className="pfont-500 text-sm text-[#48bb78] text-right">$16.5k</span>
                                    <div>
                                        <span className="text-[#848489] text-xs pfont-500">5.9B/365</span>
                                        <span className="text-[#848489] text-xs pfont-400"> txns</span>
                                    </div>
                                </div>
                            </td>
                            <td className="border border-[#5e5e6b] text-center px-4 py-2">
                                <span className="text-[15px] text-[#48bb78] pfont-600">$4373773</span>
                            </td>
                            <td className="border border-[#5e5e6b] text-center px-4 py-2">
                                <span className="text-[15px] text-white pfont-600">$437K</span>
                            </td>
                            <td className="border border-[#5e5e6b] px-4 py-2">
                                <div className="flex  flex-col items-center">
                                    <div className="pfont-600 gap-x-2 flex items-center text-sm text-center">
                                        <span className="text-white">2.8B</span>
                                        <span className="text-[#848489] pfont-500">of</span>
                                        <span className="text-white">5.6B</span>
                                    </div>
                                    <div className="bg-[#848489] mt-2  w-full h-1 rounded-full">
                                        <div style={{ width: '50%' }} className="bg-white rounded-full h-full"></div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-center border border-[#5e5e6b]">
                                <span className="text-[#A6A6A6]  flex items-center justify-center"><MdFilterAlt className="text-xl" /></span>
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

export default Orders;
