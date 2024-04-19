import * as React from "react";
import { useState } from "react";
import { Reorder } from "framer-motion";
import { useMotionValue } from "framer-motion";
import { useRaisedShadow } from "../hooks/useRaisedShadow";
const initialItems = ["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"];

export default function App() {
    const [items, setItems] = useState(initialItems);

    return (
        <table>

            <Reorder.Group as="tbody" axis="y" onReorder={setItems} values={items}>
                {items.map((item) => (
                    <Item key={item} item={item} />
                ))}
            </Reorder.Group>
        </table>
    );
}



export const Item = ({ item }) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);

    return (
        <Reorder.Item as="tr" value={item} id={item} className="bg-[#28282d] hover:bg-[#39393e] cursor-pointer rounded-md" style={{ boxShadow, y }}>
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

