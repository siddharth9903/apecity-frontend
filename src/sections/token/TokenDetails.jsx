import { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaRegCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { shortenText } from '../../utils/helper';
import { enqueueSnackbar } from 'notistack';
import copy from 'copy-to-clipboard';
import { formatNumber } from '../../utils/formats';
import { chainNativeExplorer } from '../../utils/native';

const TokenDetails = ({ token, trades, bondingCurve, nativeCurrency }) => {
    const [tabIndex1, setTabIndex1] = useState(0);
    const [tradeStats, setTradeStats] = useState({
        txns: 0,
        volumeEth: 0,
        makers: 0,
        buys: 0,
        sells: 0,
        buyVolEth: 0,
        sellVolEth: 0,
        buyers: 0,
        sellers: 0,
    });

    useEffect(() => {
        const calculateTradeStats = () => {
            const stats = {
                txns: trades?.length || 0,
                volumeEth: 0,
                makers: new Set(),
                buys: 0,
                sells: 0,
                buyVolEth: 0,
                sellVolEth: 0,
                buyers: new Set(),
                sellers: new Set(),
            };

            trades.forEach((trade) => {
                stats.makers.add(trade.user.id);

                if (trade.tradeType === 'BUY') {
                    stats.buys += 1;
                    stats.buyVolEth += parseFloat(trade.inAmount);
                    stats.buyers.add(trade.user.id);
                } else {
                    stats.sells += 1;
                    stats.sellVolEth += parseFloat(trade.outAmount);
                    stats.sellers.add(trade.user.id);
                }
            });

            setTradeStats({
                txns: stats.txns,
                volumeEth: stats.buyVolEth + stats.sellVolEth,
                makers: stats.makers.size,
                buys: stats.buys,
                sells: stats.sells,
                buyVolEth: stats.buyVolEth,
                sellVolEth: stats.sellVolEth,
                buyers: stats.buyers.size,
                sellers: stats.sellers.size,
            });
        };

        calculateTradeStats();
    }, [trades]);

    return (
        <div className="mt-4">
            <Tabs selectedIndex={tabIndex1} onSelect={(index) => setTabIndex1(index)}>
                <TabList>
                    <div className="flex">
                        <Tab
                            className={`flex-1 py-2 rounded-s cursor-pointer ${tabIndex1 === 0 ? 'bg-[#343439]' : 'bg-transparent'
                                } border border-[#343439]`}
                        >
                            <p
                                className={`${tabIndex1 === 0 ? 'pfont-600 text-white' : 'pfont-500 text-[#797979]'
                                    } text-center text-xs`}
                            >
                                Stats
                            </p>
                            {/* <p className="text-[#48bb78] pfont-600 text-center text-sm">0.16%</p> */}
                        </Tab>
                    </div>
                </TabList>
                <TabPanel>
                    <div className="border rounded-b flex py-3 px-3 border-[#343439]">
                        <div className="pr-7 border-r flex flex-col justify-between border-[#343439]">
                            <div>
                                <p className="pfont-500 text-[#797979] uppercase text-xs">TXNS</p>
                                <p className="pfont-500 text-white text-sm">{tradeStats.txns}</p>
                            </div>
                            <div>
                                <p className="pfont-500 text-[#797979] uppercase text-xs">volume</p>
                                <p className="pfont-500 text-white text-sm">{formatNumber(tradeStats.volumeEth)} {nativeCurrency.symbol}</p>
                            </div>
                            <div>
                                <p className="pfont-500 text-[#797979] uppercase text-xs">unique traders</p>
                                <p className="pfont-500 text-white text-sm">{tradeStats.makers}</p>
                            </div>
                        </div>
                        <div className="flex-1 pl-4">
                            <div className="flex flex-col gap-y-3">
                                <div>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="pfont-500 text-[#797979] uppercase text-xs">buys</p>
                                            <p className="pfont-400 text-white text-sm">{tradeStats.buys}</p>
                                        </div>
                                        <div>
                                            <p className="pfont-500 text-[#797979] uppercase text-xs">sells</p>
                                            <p className="pfont-400 text-white text-sm">{tradeStats.sells}</p>
                                        </div>
                                    </div>
                                    <div className="flex mt-1 gap-x-1">
                                        <div
                                            style={{ width: `${(tradeStats.buys / tradeStats.txns) * 100}%` }}
                                            className="rounded-full bg-[#48bb78] h-1.5"
                                        ></div>
                                        <div
                                            style={{ width: `${(tradeStats.sells / tradeStats.txns) * 100}%` }}
                                            className="rounded-full bg-[#FF5252] h-1.5"
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="pfont-500 text-[#797979] uppercase text-xs">buy vol</p>
                                            <p className="pfont-400 text-white text-sm">
                                                {formatNumber(tradeStats.buyVolEth)} {nativeCurrency.symbol}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="pfont-500 text-[#797979] uppercase text-xs">sell vol</p>
                                            <p className="pfont-400 text-white text-sm">
                                                {formatNumber(tradeStats.sellVolEth)} {nativeCurrency.symbol}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex mt-1 gap-x-1">
                                        <div
                                            style={{ width: `${(tradeStats.buyVolEth / tradeStats.volumeEth) * 100}%` }}
                                            className="rounded-full bg-[#48bb78] h-1.5"
                                        ></div>
                                        <div
                                            style={{ width: `${(tradeStats.sellVolEth / tradeStats.volumeEth) * 100}%` }}
                                            className="rounded-full bg-[#FF5252] h-1.5"
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="pfont-500 text-[#797979] uppercase text-xs">buyers</p>
                                            <p className="pfont-400 text-white text-sm">{tradeStats.buyers}</p>
                                        </div>
                                        <div>
                                            <p className="pfont-500 text-[#797979] uppercase text-xs">sellers</p>
                                            <p className="pfont-400 text-white text-sm">{tradeStats.sellers}</p>
                                        </div>
                                    </div>
                                    <div className="flex mt-1 gap-x-1">
                                        <div
                                            style={{ width: `${(tradeStats.buyers / tradeStats.makers) * 100}%` }}
                                            className="rounded-full bg-[#48bb78] h-1.5"
                                        ></div>
                                        <div
                                            style={{ width: `${(tradeStats.sellers / tradeStats.makers) * 100}%` }}
                                            className="rounded-full bg-[#FF5252] h-1.5"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                {/* Other tab panels */}
            </Tabs>
            <div className="mt-4">
                <div>

                    {
                        !bondingCurve?.active ? (

                            <>

                                <div className="flex border-b pt-3 pb-2 border-b-[#343439] justify-between items-center">
                                    <p className="text-sm text-white pfont-400">Pair created</p>
                                    <p className="text-sm text-white pfont-500">
                                        {new Date(bondingCurve?.lpCreationTimestamp * 1000).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex border-b pt-3 pb-2 border-b-[#343439] justify-between items-center">
                                    <p className="text-sm text-white pfont-400">Pair</p>
                                    <div className="flex items-center gap-x-3">
                                        <div
                                            onClick={() => {
                                                enqueueSnackbar('copied', { autoHideDuration: 1000 });
                                                copy(bondingCurve?.uniswapLiquidityPool);
                                            }}
                                            className="flex gap-x-1 px-2 py-1 cursor-pointer rounded-md text-[#ffffffeb] hover:bg-[#ffffff29] bg-[#ffffff14] items-center"
                                        >
                                            <span>
                                                <FaRegCopy className="text-sm" />
                                            </span>
                                            <span className="pfont-400 text-sm">
                                                {shortenText(bondingCurve?.uniswapLiquidityPool, 10)}
                                            </span>
                                        </div>
                                        <a href={`${chainNativeExplorer(nativeCurrency.chainId)}/token/tokenholderchart/${bondingCurve?.uniswapLiquidityPool}`} target='_blank'>
                                            <div className="flex gap-x-2 text-[#cccccc] items-center">
                                                <span className="uppercase pfont-400 text-sm">LPs</span>
                                                <span>
                                                    <FaExternalLinkAlt className="text-xs" />
                                                </span>
                                            </div>
                                        </a>
                                        <a href={`${chainNativeExplorer(nativeCurrency.chainId)}/address/${bondingCurve?.uniswapLiquidityPool}`} target='_blank'>
                                            <div className="flex gap-x-2 text-[#cccccc] items-center">
                                                <span className="uppercase pfont-400 text-sm">EXP</span>
                                                <span>
                                                    <FaExternalLinkAlt className="text-xs" />
                                                </span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </>
                        ) :
                            (
                                <>
                                    <div className="flex border-b pt-3 pb-2 border-b-[#343439] justify-between items-center">
                                        <p className="text-sm text-white pfont-400">BC created</p>
                                        <p className="text-sm text-white pfont-500">
                                            {new Date(bondingCurve?.timestamp * 1000).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex border-b pt-3 pb-2 border-b-[#343439] justify-between items-center">
                                        <p className="text-sm text-white pfont-400">BC</p>
                                        <div className="flex items-center gap-x-3">
                                            <div
                                                onClick={() => {
                                                    enqueueSnackbar('copied', { autoHideDuration: 1000 });
                                                    copy(bondingCurve?.address);
                                                }}
                                                className="flex gap-x-1 px-2 py-1 cursor-pointer rounded-md text-[#ffffffeb] hover:bg-[#ffffff29] bg-[#ffffff14] items-center"
                                            >
                                                <span>
                                                    <FaRegCopy className="text-sm" />
                                                </span>
                                                <span className="pfont-400 text-sm">
                                                    {shortenText(bondingCurve?.address, 10)}
                                                </span>
                                            </div>

                                            <a href={`${chainNativeExplorer(nativeCurrency.chainId)}/address/${bondingCurve?.address}`} target='_blank'>
                                                <div className="flex gap-x-2 text-[#cccccc] items-center">
                                                    <span className="uppercase pfont-400 text-sm">exp</span>
                                                    <span>
                                                        <FaExternalLinkAlt className="text-xs" />
                                                    </span>
                                                </div>
                                            </a>

                                        </div>
                                    </div>
                                </>
                            )
                    }
                    <div className="flex border-b pt-3 pb-2 border-b-[#343439] justify-between items-center">
                        <p className="text-sm text-white pfont-400">{token?.name}</p>
                        <div className="flex items-center gap-x-3">
                            <div
                                onClick={() => {
                                    enqueueSnackbar('copied', { autoHideDuration: 1000 });
                                    copy(token?.address);
                                }}
                                className="flex gap-x-1 px-2 py-1 cursor-pointer rounded-md text-[#ffffffeb] hover:bg-[#ffffff29] bg-[#ffffff14] items-center"
                            >
                                <span>
                                    <FaRegCopy className="text-sm" />
                                </span>
                                <span className="pfont-400 text-sm">{shortenText(token?.address, 10)}</span>
                            </div>
                            <a href={`${chainNativeExplorer(nativeCurrency.chainId)}/token/tokenholderchart/${token?.address}`} target='_blank'>
                                <div className="flex gap-x-2 text-[#cccccc] items-center">
                                    <span className="uppercase pfont-400 text-sm">HLD</span>
                                    <span>
                                        <FaExternalLinkAlt className="text-xs" />
                                    </span>
                                </div>
                            </a>

                            <a href={`${chainNativeExplorer(nativeCurrency.chainId)}/token/${token?.address}`} target='_blank'>
                                <div className="flex gap-x-2 text-[#cccccc] items-center">
                                    <span className="uppercase pfont-400 text-sm">EXP</span>
                                    <span>
                                        <FaExternalLinkAlt className="text-xs" />
                                    </span>
                                </div>
                            </a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenDetails;