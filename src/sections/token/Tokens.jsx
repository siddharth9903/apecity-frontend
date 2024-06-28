const Tokens = () => {
    return (
        <>
            <table className="min-[845px]:w-full w-[800px] border-separate border-spacing-y-3">
                <tbody>
                    {Array.from({ length: 40 }).map((item, index) => (
                        <tr key={index} className="bg-[#28282d] hover:bg-[#39393e] rounded-md">
                            <td className="w-[40%] px-4 py-3">
                                <div className="flex items-center gap-x-2">
                                    <span className="text-sm text-[#848489] pfont-400">#{index + 1}</span>
                                    <span className="pfont-600 text-sm uppercase text-white">andy</span>
                                    <span className="text-sm text-[#cccccc] pfont-400">Andy</span>
                                    <span><img className="w-5" src="/images/logo/andy.webp" alt="" /></span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-x-2 items-center">
                                    <span className="text-[#808080] text-sm pfont-400">1H</span>
                                    <span className="pfont-600 text-sm text-[#48bb78]">23.3%</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-x-2 items-center">
                                    <span className="text-[#808080] text-sm pfont-400">24H</span>
                                    <span className="pfont-600 text-sm text-[#FF5252]">-80.3%</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-x-2 items-center">
                                    <span className="text-[#808080] uppercase text-sm pfont-400">vol</span>
                                    <span className="text-sm text-white pfont-600">$12.2M</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-x-2 items-center">
                                    <span className="text-[#808080] uppercase text-sm pfont-400">liq</span>
                                    <span className="text-sm text-white pfont-600">$12.2M</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Tokens;
