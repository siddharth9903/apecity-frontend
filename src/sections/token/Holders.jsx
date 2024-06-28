import { FaExternalLinkAlt } from "react-icons/fa"
import { MdFilterAlt } from "react-icons/md"
import { holderColumns } from "../../utils/columns";

const Holders = () => {
    return (
        <>
            <div className="overflow-x-auto">
                <table className="border-collapse xl:w-full max-xl:w-[900px] max-md:overflow-x-auto w-full">
                    <thead className="">
                        <tr>
                            {
                                holderColumns.map((item, index) => (
                                    <th style={{ width: item?.width ? `${item.width}%` : 'auto' }} key={index} className={`px-4 border  border-[#5e5e6b] py-2 bg-[#2e2e33]`}>
                                        <div className="flex items-center justify-center">
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

                                <td className="border border-[#5e5e6b] px-4 py-2">
                                    <div className="flex items-center justify-center">
                                        <span className="text-white text-sm pfont-600">0x3860...32cb</span>
                                    </div>
                                </td>
                                <td className="border border-[#5e5e6b] text-center px-4 py-2">
                                    <span className="text-[15px] text-white pfont-600">5.61%</span>
                                </td>
                                <td className="border border-[#5e5e6b] px-4 py-2">
                                    <div className="flex gap-x-3 items-center">
                                        <div>
                                            <p className="text-[#e6e6e6] text-sm pfont-500">561.1M</p>
                                        </div>
                                        <div className="bg-[#848489] flex-1  h-1 rounded-full">
                                            <div style={{ width: '50%' }} className="bg-white rounded-full h-full"></div>
                                        </div>
                                        <div>
                                            <p className="text-white text-sm pfont-500">10.0B</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="border border-[#5e5e6b] text-center px-4 py-2">
                                    <span className="text-[15px] text-white pfont-600">$437K</span>
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
            </div>
        </>
    )
}

export default Holders;
