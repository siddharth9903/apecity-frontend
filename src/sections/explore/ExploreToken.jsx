import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { useMotionValue } from "framer-motion";
import { useRaisedShadow } from "../../hooks/useRaisedShadow";

const initialItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ExploreToken = () => {
    const [items, setItems] = useState(initialItems);
    useEffect(() => {
        const interval = setInterval(() => {
          const shuffledItems = [...items].sort(() => Math.random() - 0.5);
          setItems(shuffledItems);
        }, 3000); 
    
        return () => clearInterval(interval);
      }, [items]); 
    return (
        <>
            <table className="w-full border-separate border-spacing-y-3">
                <Reorder.Group as="tbody" axis="y" onReorder={setItems} values={items}>
                    {items.map((item) => (
                        <Item key={item} item={item} />
                    ))}
                </Reorder.Group>
            </table>
            <div className="my-4">
                <div className="flex gap-x-5 items-center justify-center">
                    <div className="h-9 w-9  rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center">
                        <MdKeyboardArrowLeft className="group:hover: text-white text-xl" />
                    </div>
                    <div className="text-white flex gap-x-2 items-center pfont-400">
                        <span>2</span>
                        <span>/</span>
                        <span>10</span>
                    </div>
                    <div className="h-9 w-9  rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center">
                        <MdKeyboardArrowRight className="group:hover: text-white text-xl" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExploreToken;

export const Item = ({ item }) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    const navigate = useNavigate()
    return (
        <Reorder.Item as="tr" onClick={()=>navigate('/token')} value={item} id={item} className="bg-[#28282d] hover:bg-[#39393e] cursor-pointer rounded-md" style={{ boxShadow, y }}>
            <td className="w-[40%] px-4 py-4">
                <div className="flex items-center gap-x-2">
                    <span className="text-sm text-[#848489] pfont-400">#</span>
                    <span className="pfont-600 text-sm uppercase text-white">andy</span>
                    <span className="text-sm text-[#cccccc] pfont-400">Andy</span>
                    <span><img className="w-5" src="/images/logo/andy.webp" alt="" /></span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] text-sm pfont-400">1H</span>
                    <span className="pfont-600 text-sm text-[#b0dc73]">23.3%</span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] text-sm pfont-400">24H</span>
                    <span className="pfont-600 text-sm text-[#f56565]">-80.3%</span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] uppercase text-sm pfont-400">vol</span>
                    <span className="text-sm text-white pfont-600">$12.2M</span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] uppercase text-sm pfont-400">liq</span>
                    <span className="text-sm text-white pfont-600">$12.2M</span>
                </div>
            </td>
        </Reorder.Item>
    );
};

