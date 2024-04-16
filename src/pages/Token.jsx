import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BsChatSquare, BsThreeDotsVertical, BsTwitterX, CgMenuRightAlt, FaChevronRight, FaExternalLinkAlt, FaFire, FaFireAlt, FaInfoCircle, FaRegCopy, FaSearch, FaSketch, FaTelegramPlane, FiChevronDown, RxCross2 } from './../assets/icons/vander';
import Transactions from '../sections/token/Transactions';
import { shortenText } from '../utils/helper';
import { Tooltip } from 'react-tooltip';
import Holders from '../sections/token/Holders';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import Tokens from '../sections/token/Tokens';
import { FaCircleArrowLeft } from "react-icons/fa6";
const Token = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [tabIndex1, setTabIndex1] = useState(0);
    const [tabIndex2, setTabIndex2] = useState(0);
    const [open, setOpen] = useState(false);

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    return (
        <>
            <div className="container-fluid bg-black">
                <div className='relative h-screen flex justify-between'>
                    <div className="w-[calc(100%-400px)] h-screen overflow-y-auto absolute left-0 top-0 bg-[#17171c] token-left">
                        <div className='w-full relative px-3 py-3 bg-[#17171c]'>
                            <div className='absolute z-[11] h-full left-0 top-0'>
                                <button className='h-full pl-2 bg-transparent'>
                                    <FaCircleArrowLeft className='text-white text-xl'/>
                                </button>        
                            </div>
                            <div className='pl-7'>
                                <Swiper
                                    slidesPerView={6}
                                    spaceBetween={10}
                                    freeMode={true}
                                    modules={[FreeMode]}
                                    className="mySwiper"
                                >
                                    <SwiperSlide>
                                        <button className='flex items-center gap-x-2 py-1 bg-[#2e2e33] px-2 rounded-md'>
                                            <span className='text-sm text-[#A7A7AC]'>#1</span>
                                            <img className='w-5' src="/images/icons/svg/blerf.webp" alt="" />
                                            <span className='text-white pfont-600 uppercase'>blerf</span>
                                            <span className='pfont-500 text-sm text-[#d0332a]'>-31.67%</span>
                                        </button>
                                    </SwiperSlide>
                                    {
                                        Array.from({ length: 7 }).map((_, index) => (
                                            <SwiperSlide key={index}>
                                                <button className='flex items-center gap-x-2 py-1  px-2 rounded-md'>
                                                    <span className='text-sm text-[#A7A7AC]'>#{index + 2}</span>
                                                    <img className='w-5' src="/images/icons/svg/blerf.webp" alt="" />
                                                    <span className='text-white pfont-600 uppercase'>blerf</span>
                                                    <span className='pfont-500 text-sm text-[#d0332a]'>-31.67%</span>
                                                </button>
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>


                            </div>
                            <div className='absolute z-[11] h-full right-0 top-0'>
                                <div className='py-2 h-full'>
                                    <button onClick={onOpenModal} className='flex rounded-s-lg h-full gap-x-1 px-2 bg-[#ff6600] items-center'>
                                        <FaFireAlt className='text-white text-lg' />
                                        <FaChevronRight className='text-white text-sm' />
                                    </button>
                                    <Modal styles={{
                                        padding: 0
                                    }} open={open} showCloseIcon={false} blockScroll={false} onClose={onCloseModal} center>
                                        <div className='w-[800px] flex gap-y-2 flex-col bg-[#1d1d22] h-[70vh]'>
                                            <div className='bg-[#28282d]  w-full  py-2 px-3 flex items-center justify-between'>
                                                <div>

                                                    <div className='flex'>
                                                        <button className={`px-3 py-2 rounded-s cursor-pointer bg-[#343439] border border-[#ffffff29]`}>
                                                            <p className={`pfont-600 text-white text-center text-sm `}>5M</p>
                                                        </button>
                                                        <button className={`px-3 py-2 cursor-pointer bg-transparent border border-[#ffffff29]`}>
                                                            <p className={`pfont-600 text-white text-center text-sm `}>1H</p>
                                                        </button >
                                                        <button className={`px-3 py-2  cursor-pointer  bg-transparent border border-[#ffffff29]`}>
                                                            <p className={`pfont-600 text-white text-center text-sm `}>6H</p>
                                                        </button >
                                                        <button className={`px-3 py-2 cursor-pointer rounded-e bg-transparent border border-[#ffffff29]`}>
                                                            <p className={`pfont-600 text-white text-center text-sm `}>24H</p>
                                                        </button >
                                                    </div>
                                                </div>
                                                <div>
                                                    <button onClick={onCloseModal} className="bg-transparent rounded p-1 border border-[#ffffff29]">
                                                        <RxCross2 className='text-white text-xl' />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='flex-1 px-3 tokens-table-wrapper overflow-y-auto'>
                                                <Tokens />
                                            </div>
                                            <div className='bg-[#28282d]  w-full  py-3 px-3'>
                                                <div className='flex gap-x-4 w-full items-center justify-center'>
                                                    <button  className="rounded-md flex gap-x-2 px-3 py-2 items-center border-none bg-[#475dc0]">
                                                        <span><FaFire className='text-white text-sm'/></span>
                                                        <span className='text-white pfont-600 text-sm'>All Trending Tokens on Ethereum</span>
                                                        <span><FaChevronRight className='text-white text-[13px]' /></span>
                                                    </button>
                                                    <button className='flex items-center gap-x-1.5 bg-transparent'>
                                                        <FaInfoCircle className='text-[#cccccc]'/>
                                                        <span className='text-[#cccccc] pfont-500'>About</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">

                            <div className=''>
                                <AdvancedRealTimeChart height={450} width={'100%'} theme="dark"></AdvancedRealTimeChart>
                            </div>

                        </div>
                        <div className='w-full  flex-1'>
                            <div>
                                <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                                    <div className='bg-[#17171c]  px-2  flex items-center'>
                                        <TabList className='flex gap-x-4 items-center'>
                                            <Tab className='focus:border-none focus:outline-none'>
                                                <div className={`${tabIndex == 0 ? 'text-white border-white border-b-2' : 'text-[#A6A6A6]'}  cursor-pointer py-2 hover:text-white flex items-center`}>
                                                    <span><BsChatSquare /></span>
                                                    <span className='pfont-500 text-sm ml-1.5'>Chats</span>
                                                </div>
                                            </Tab>
                                            <Tab className='focus:border-none focus:outline-none'>
                                                <div className={`${tabIndex == 1 ? 'text-white border-white border-b-2' : 'text-[#A6A6A6]'}  cursor-pointer py-2 hover:text-white flex items-center`}>
                                                    <span><CgMenuRightAlt /></span>
                                                    <span className='pfont-500 text-sm ml-1.5'>Transactions</span>
                                                </div>
                                            </Tab>
                                            {/* <Tab className='focus:border-none focus:outline-none'>
                                                <div className={`${tabIndex == 2 ? 'text-white border-white border-b-2' : 'text-[#A6A6A6]'} cursor-pointer py-2 hover:text-white flex items-center`}>
                                                    <span className='text-sm'><FaMedal /></span>
                                                    <span className='pfont-500 text-sm ml-1.5'>Top Traders</span>
                                                </div>
                                            </Tab> */}
                                            <Tab className='focus:border-none focus:outline-none'>
                                                <div className={`${tabIndex == 2 ? 'text-white border-white border-b-2' : 'text-[#A6A6A6]'} cursor-pointer py-2 hover:text-white flex items-center`}>
                                                    <span className='text-sm'><FaSketch /></span>
                                                    <span className='pfont-500 text-sm ml-1.5'>Holders(706)</span>
                                                </div>
                                            </Tab>
                                            {/* <Tab className='focus:border-none focus:outline-none'>
                                                <div className={`${tabIndex == 4 ? 'text-white border-white border-b-2' : 'text-[#A6A6A6]'} cursor-pointer py-2 hover:text-white flex items-center`}>
                                                    <span className='text-sm'><FaWater /></span>
                                                    <span className='pfont-500 text-sm ml-1.5'> Liquidity Providers(2)</span>
                                                </div>
                                            </Tab> */}

                                        </TabList>
                                        <div>

                                        </div>
                                    </div>
                                    <TabPanel>
                                        <Transactions />
                                    </TabPanel>
                                    <TabPanel>
                                        <Transactions />
                                    </TabPanel>
                                    {/* <TabPanel>
                                        <Orders />
                                    </TabPanel> */}
                                    <TabPanel>
                                        <Holders />
                                    </TabPanel>
                                    {/* <TabPanel>
                                        <Providers />
                                    </TabPanel> */}
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <div className="border-l h-screen overflow-y-auto absolute  right-0 top-0 border-[#5e5e6b] bg-[#17171c] w-[400px] token-right">
                        <div className='pb-10'>
                            <div className='bg-[#222227] px-3 py-2'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-x-2'>
                                        <img className='w-7' src="/images/token/token1.webp" alt="" />
                                        <p className='space-500 text-[17px] text-white'>Brick Block</p>
                                    </div>
                                    <div className='border cursor-pointer hover:bg-[#ffffff14] py-1.5 px-1.5 flex justify-center items-center border-[#ffffff29] rounded'>
                                        <BsThreeDotsVertical className='text-white' />
                                    </div>
                                </div>
                            </div>
                            <div className='bg-[#111116] py-1.5 flex justify-center'>
                                <div>
                                    <div className='flex gap-x-2 justify-center items-center'>
                                        <div className='flex gap-x-1 justify-center items-center'>
                                            <span className='text-white text-[17px] space-600'>Brick Block</span>
                                            <span className='text-[#A7A7AC]'><FaRegCopy /></span>
                                        </div>
                                        <span className='text-white'>/</span>
                                        <span className='uppercase text-white text-[17px] space-600'>weth</span>
                                        <div className='flex gap-x-1 justify-center items-center'>
                                            <span><img src="/images/icons/svg/rank.svg" alt="" /></span>
                                            <span className='text-[#ff9900] pfont-600'>#2</span>
                                        </div>
                                    </div>
                                    <div className='flex gap-x-2 mt-1 justify-center items-center'>
                                        <div className='flex gap-x-1 justify-center items-center'>
                                            <span><img className='w-4' src="/images/icons/svg/base.svg" alt="" /></span>
                                            <span className='text-[#A7A7AC] pfont-400 text-sm'>Base</span>
                                        </div>
                                        <div>
                                            <span className='text-[#A7A7AC] text-sm'><FaChevronRight /></span>
                                        </div>
                                        <div className='flex gap-x-1 justify-center items-center'>
                                            <span><img className='w-4' src="/images/icons/svg/uniswap.webp" alt="" /></span>
                                            <span className='text-[#A7A7AC] pfont-400 text-sm'>Uniswap</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='relative overflow-hidden '>
                                <img className='hover:scale-105  transition-all duration-300' src="/images/token/token-bg-1.webp" alt="" />
                            </div>
                            <div className='pl-4 pr-2'>
                                <div className='flex gap-x-[1px]'>
                                    <button className='bg-[#4b4b50] flex-1 rounded-s  flex justify-center items-center px-3 py-1  text-[#FFFFFFFB]'>
                                        <img className='w-4' src="/images/icons/svg/web.svg" alt="" />
                                        <span className='pfont-500 ml-2 text-sm'>
                                            Website
                                        </span>
                                    </button>
                                    <button className='bg-[#4b4b50]  flex-1 flex justify-center items-center px-3 py-1  text-[#FFFFFFFB]'>
                                        <BsTwitterX className='text-sm' />
                                        <span className='pfont-500 ml-2 text-sm'>
                                            Twitter
                                        </span>
                                    </button>
                                    <button className='bg-[#4b4b50]  flex-1 flex justify-center items-center px-3 py-1  text-[#FFFFFFFB]'>
                                        <FaTelegramPlane className='' />
                                        <span className='pfont-500 ml-2 text-sm'>
                                            Telegram
                                        </span>
                                    </button>
                                    <button className='bg-[#4b4b50] rounded-e  flex justify-center items-center px-3 py-1  text-[#FFFFFFFB]'>

                                        <span className=''>
                                            <FiChevronDown />
                                        </span>
                                    </button>
                                </div>
                                <div className='flex mt-4 gap-x-2'>
                                    <div className='flex-1 py-2 rounded border border-[#5e5e6b]'>
                                        <p className='uppercase  text-center text-[#797979] pfont-400 text-sm'>price usd</p>
                                        <p className='text-white text-[15px] text-center pfont-600'>$0.0886777</p>
                                    </div>
                                    <div className='flex-1 py-2 rounded border border-[#5e5e6b]'>
                                        <p className='uppercase  text-center text-[#797979] pfont-400 text-sm'>price</p>
                                        <p className='text-white text-[15px] text-center pfont-600'>0.0886777 WETH</p>
                                    </div>
                                </div>
                                <div className='border border-[#343439] mt-3 px-3 py-2.5 rounded-lg'>
                                    <p className='pfont-500 text-[#8e94a0] text-sm'>bonding curve progress: 4%</p>
                                    <div className='mt-2'>
                                        <div className='rounded-full w-[90%] h-4 bg-[#374151]'>
                                            <a className='w-full' data-tooltip-id='bonding_curve' >
                                                <div style={{ width: '80%' }} className='rounded-full cursor-pointer h-full bg-[#48bb78]'>
                                                </div>
                                            </a>
                                            <Tooltip opacity={1} style={{ backgroundColor: '#111116' }} className='z-[10] ' id="bonding_curve">
                                                <div className='w-[330px]'>
                                                    <p className='pfont-500 mt-3 text-[#8e94a0] text-sm'>when the market cap reaches $63,375 all the liquidity from the bonding curve will be deposited into Raydium and burned. progression increases as the price goes up.</p>
                                                    <p className='pfont-500 mt-3 text-[#8e94a0] text-sm'>there are 769,105,722 tokens still available for sale in the bonding curve and there is 0.686 ETH in the bonding curve.</p>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>

                                </div>
                                <div className='mt-3'>
                                    <div className="grid gap-x-4 gap-y-2">
                                        <div className="border border-[#343439] px-4 py-3 rounded-lg  text-gray-400 grid gap-4">
                                            <Tabs selectedIndex={tabIndex2} onSelect={(index) => setTabIndex2(index)}>
                                                <TabList>
                                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                                        <Tab className={`p-2 cursor-pointer text-center pfont-500 rounded ${tabIndex2 == 0 ? 'bg-[#48bb78] text-white' : 'bg-gray-800 text-grey-600'}`}>
                                                            Buy
                                                        </Tab>
                                                        <Tab className={`p-2 cursor-pointer text-center pfont-500 rounded ${tabIndex2 == 1 ? 'bg-red-400 text-white' : 'bg-gray-800 text-grey-600'}`}>
                                                            Sell
                                                        </Tab>
                                                    </div>
                                                </TabList>
                                                <TabPanel>
                                                    <div>
                                                        <div className="flex justify-between w-full gap-2">
                                                            <button
                                                                className="text-xs py-1 px-2 pfont-400 rounded  bg-gray-800 text-gray-300">Switch
                                                                to WW420
                                                            </button>
                                                            <button className="text-xs py-1 pfont-400 px-2 rounded bg-gray-800 text-gray-300" type="button"
                                                            >Set max
                                                                slippage
                                                            </button>
                                                        </div>
                                                        <div className="flex mt-3 flex-col">
                                                            <div className="flex items-center rounded-md relative">
                                                                <input
                                                                    className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                                                    placeholder="0.0" type="number" />
                                                                <div className="flex items-center ml-2 absolute right-2"><span className="text-white pfont-400 mr-2">ETH</span>
                                                                    <img className="w-7 h-7 rounded-full"
                                                                        src="/images/logo/eth.svg"
                                                                        alt="ETH" />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-3 mt-2  p-1 rounded-lg">
                                                                <button
                                                                    className="text-xs py-1  px-2 rounded pfont-400  bg-gray-800 text-gray-300">Reset
                                                                </button>
                                                                <button
                                                                    className="text-xs py-1 px-2  rounded pfont-400 bg-gray-800 text-gray-300">0.25
                                                                    ETH
                                                                </button>
                                                                <button
                                                                    className="text-xs py-1 px-2  rounded pfont-400 bg-gray-800 text-gray-300">0.5
                                                                    ETH
                                                                </button>
                                                                <button
                                                                    className="text-xs py-1 px-2  rounded pfont-400 bg-gray-800 text-gray-300">1
                                                                    ETH
                                                                </button>
                                                                <button
                                                                    className="text-xs py-1 px-2  rounded pfont-400 bg-gray-800 text-gray-300">2.5
                                                                    ETH
                                                                </button>
                                                                <button
                                                                    className="text-xs py-1 px-2  rounded pfont-400 bg-gray-800 text-gray-300">5
                                                                    ETH
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="inline-flex mt-3 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#b0dc73] hover:text-black">
                                                            Place
                                                            Trade
                                                        </button>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel>
                                                    <div>
                                                        <div className="flex justify-end w-full gap-2">

                                                            <button className="text-xs py-1 pfont-400 px-2 rounded bg-gray-800 text-gray-300" type="button"
                                                            >Set max slippage
                                                            </button>
                                                        </div>
                                                        <div className="flex mt-4 flex-col">
                                                            <div className="flex items-center rounded-md relative ">
                                                                <input
                                                                    className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                                                    id="amount" placeholder="0.0" type="number" />
                                                                <div className="flex items-center ml-2 absolute right-2"><span className="text-white pfont-400 mr-2">WW420</span>
                                                                    <img className="w-8 h-8 rounded-full"
                                                                        src="/images/logo/ww4.jpeg"
                                                                        alt="ETH" />
                                                                </div>
                                                            </div>
                                                            <div className="flex mt-4  p-1 rounded-lg">
                                                                <button
                                                                    className="text-xs py-1 -ml-1 px-2 rounded pfont-400  bg-gray-800 text-gray-300">Reset
                                                                </button>
                                                                <button
                                                                    className="text-xs py-1 px-2 ml-1 rounded  pfont-400 bg-gray-800 text-gray-300">25%

                                                                </button>
                                                                <button
                                                                    className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300">50%

                                                                </button>
                                                                <button
                                                                    className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300">75%

                                                                </button>
                                                                <button
                                                                    className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300">100%

                                                                </button>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="inline-flex mt-3 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#b0dc73] hover:text-black">
                                                            Place
                                                            Trade
                                                        </button>
                                                    </div>
                                                </TabPanel>
                                            </Tabs>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <Tabs selectedIndex={tabIndex1} onSelect={(index) => setTabIndex1(index)}>
                                        <TabList>
                                            <div className='flex'>
                                                <Tab className={`flex-1 py-2 rounded-s cursor-pointer ${tabIndex1 == 0 ? 'bg-[#343439]' : 'bg-transparent'} border border-[#343439]`}>
                                                    <p className={`${tabIndex1 == 0 ? 'pfont-600 text-white' : 'pfont-500 text-[#797979]'} text-center text-sm `}>5M</p>
                                                    <p className='text-[#b0dc73] pfont-600 text-center'>0.16%</p>
                                                </Tab>
                                                <Tab className={`flex-1 py-2 cursor-pointer ${tabIndex1 == 1 ? 'bg-[#343439]' : 'bg-transparent'} border border-[#343439]`}>
                                                    <p className={`${tabIndex1 == 1 ? 'pfont-600 text-white' : 'pfont-500 text-[#797979]'} text-center text-sm `}>1H</p>
                                                    <p className='text-[#d0332a] pfont-600 text-center'>-0.16%</p>
                                                </Tab>
                                                <Tab className={`flex-1 py-2 rounded-s cursor-pointer ${tabIndex1 == 2 ? 'bg-[#343439]' : 'bg-transparent'} border border-[#343439]`}>
                                                    <p className={`${tabIndex1 == 2 ? 'pfont-600 text-white' : 'pfont-500 text-[#797979]'} text-center text-sm `}>1H</p>
                                                    <p className='text-[#b0dc73] pfont-600 text-center'>0.16%</p>
                                                </Tab>
                                                <Tab className={`flex-1 py-2 cursor-pointer rounded-e ${tabIndex1 == 3 ? 'bg-[#343439]' : 'bg-transparent'} border border-[#343439]`}>
                                                    <p className={`${tabIndex1 == 3 ? 'pfont-600 text-white' : 'pfont-500 text-[#797979]'} text-center text-sm `}>1H</p>
                                                    <p className='text-[#d0332a] pfont-600 text-center'>-0.16%</p>
                                                </Tab>
                                            </div>
                                        </TabList>
                                        <TabPanel >
                                            <div className='border rounded-b flex py-4 px-4 border-[#343439]'>
                                                <div className='pr-7 border-r flex flex-col justify-between border-[#343439]'>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>TXNS</p>
                                                        <p className='pfont-500 text-white text-[17px]'>1205</p>
                                                    </div>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>volume</p>
                                                        <p className='pfont-500 text-white text-[17px]'>$2.4M</p>
                                                    </div>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>makers</p>
                                                        <p className='pfont-500 text-white text-[17px]'>555</p>
                                                    </div>
                                                </div>
                                                <div className='flex-1 pl-4'>
                                                    <div className='flex flex-col gap-y-5'>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byus</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sells</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '60%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '40%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byu vol</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>$1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sell vol</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>$442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '40%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '60%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byuers</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sellers</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '70%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '30%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel >
                                            <div className='border rounded-b flex py-4 px-4 border-[#343439]'>
                                                <div className='pr-7 border-r flex flex-col justify-between border-[#343439]'>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>TXNS</p>
                                                        <p className='pfont-500 text-white text-[17px]'>1205</p>
                                                    </div>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>volume</p>
                                                        <p className='pfont-500 text-white text-[17px]'>$2.4M</p>
                                                    </div>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>makers</p>
                                                        <p className='pfont-500 text-white text-[17px]'>555</p>
                                                    </div>
                                                </div>
                                                <div className='flex-1 pl-4'>
                                                    <div className='flex flex-col gap-y-5'>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byus</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sells</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '60%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '40%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byu vol</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>$1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sell vol</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>$442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '40%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '60%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byuers</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sellers</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '70%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '30%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel >
                                            <div className='border rounded-b flex py-4 px-4 border-[#343439]'>
                                                <div className='pr-7 border-r flex flex-col justify-between border-[#343439]'>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>TXNS</p>
                                                        <p className='pfont-500 text-white text-[17px]'>1205</p>
                                                    </div>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>volume</p>
                                                        <p className='pfont-500 text-white text-[17px]'>$2.4M</p>
                                                    </div>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>makers</p>
                                                        <p className='pfont-500 text-white text-[17px]'>555</p>
                                                    </div>
                                                </div>
                                                <div className='flex-1 pl-4'>
                                                    <div className='flex flex-col gap-y-5'>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byus</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sells</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '60%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '40%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byu vol</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>$1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sell vol</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>$442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '40%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '60%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byuers</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sellers</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '70%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '30%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel >
                                            <div className='border rounded-b flex py-4 px-4 border-[#343439]'>
                                                <div className='pr-7 border-r flex flex-col justify-between border-[#343439]'>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>TXNS</p>
                                                        <p className='pfont-500 text-white text-[17px]'>1205</p>
                                                    </div>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>volume</p>
                                                        <p className='pfont-500 text-white text-[17px]'>$2.4M</p>
                                                    </div>
                                                    <div className=''>
                                                        <p className={`pfont-500 text-[#797979] uppercase text-sm`}>makers</p>
                                                        <p className='pfont-500 text-white text-[17px]'>555</p>
                                                    </div>
                                                </div>
                                                <div className='flex-1 pl-4'>
                                                    <div className='flex flex-col gap-y-5'>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byus</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sells</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '60%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '40%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byu vol</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>$1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sell vol</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>$442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '40%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '60%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>byuers</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>1062</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`pfont-500 text-[#797979] uppercase text-sm`}>sellers</p>
                                                                    <p className='pfont-400 text-white text-[17px]'>442</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex mt-1 gap-x-1'>
                                                                <div style={{ width: '70%' }} className='rounded-full bg-[#b0dc73] h-1.5'>

                                                                </div>
                                                                <div style={{ width: '30%' }} className='rounded-full bg-[#d0332a] h-1.5'>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                    </Tabs>
                                </div>
                                <div className='mt-4'>
                                    <div>
                                        <div className='flex border-b pt-3 pb-2 border-b-[#343439]  justify-between items-center'>
                                            <p className='text-sm text-white pfont-400'>
                                                Pair created
                                            </p>
                                            <p className='text-sm text-white pfont-500'>
                                                18h 22m ago
                                            </p>
                                        </div>
                                        <div className='flex border-b pt-3 pb-2 border-b-[#343439]  justify-between items-center'>
                                            <p className='text-sm text-white pfont-400'>
                                                Pooled Brick Block
                                            </p>
                                            <p className='text-sm  flex items-center gap-x-3 text-white pfont-500'>
                                                <span>228,468,585</span>
                                                <span>18h 22m ago</span>
                                            </p>
                                        </div>
                                        <div className='flex border-b pt-3 pb-2 border-b-[#343439]  justify-between items-center'>
                                            <p className='text-sm text-white pfont-400'>
                                                Pooled ETH
                                            </p>
                                            <p className='text-sm  flex items-center gap-x-3 text-white pfont-500'>
                                                <span>15,990</span>
                                                <span>$2.4M</span>
                                            </p>
                                        </div>
                                        <div className='flex border-b pt-3 pb-2 border-b-[#343439]  justify-between items-center'>
                                            <p className='text-sm text-white pfont-400'>
                                                Pair
                                            </p>
                                            <div className='flex items-center gap-x-3'>
                                                <div className='flex gap-x-1 px-2 py-1 cursor-pointer rounded-md text-[#ffffffeb] hover:bg-[#ffffff29] bg-[#ffffff14] items-center'>
                                                    <span>
                                                        <FaRegCopy className='text-sm' />
                                                    </span>
                                                    <span className='pfont-400 text-sm'>
                                                        {shortenText('FHjxJM4nU7YHCbwqsmRs5M89m6BG1FygopXsj4vFSRVy', 10)}
                                                    </span>
                                                </div>
                                                <div className='flex gap-x-2 text-[#cccccc] items-center'>
                                                    <span className='uppercase pfont-400 text-sm'>LPs</span>
                                                    <span><FaExternalLinkAlt className='text-xs' /></span>
                                                </div>
                                                <div className='flex gap-x-2 text-[#cccccc] items-center'>
                                                    <span className='uppercase pfont-400 text-sm'>exp</span>
                                                    <span><FaExternalLinkAlt className='text-xs' /></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex border-b pt-3 pb-2 border-b-[#343439]  justify-between items-center'>
                                            <p className='text-sm text-white pfont-400'>
                                                Brick Block
                                            </p>
                                            <div className='flex items-center gap-x-3'>
                                                <div className='flex gap-x-1 px-2 py-1 cursor-pointer rounded-md text-[#ffffffeb] hover:bg-[#ffffff29] bg-[#ffffff14] items-center'>
                                                    <span>
                                                        <FaRegCopy className='text-sm' />
                                                    </span>
                                                    <span className='pfont-400 text-sm'>
                                                        {shortenText('FHjxJM4nU7YHCbwqsmRs5M89m6BG1FygopXsj4vFSRVy', 10)}
                                                    </span>
                                                </div>
                                                <div className='flex gap-x-2 text-[#cccccc] items-center'>
                                                    <span className='uppercase pfont-400 text-sm'>LPs</span>
                                                    <span><FaExternalLinkAlt className='text-xs' /></span>
                                                </div>
                                                <div className='flex gap-x-2 text-[#cccccc] items-center'>
                                                    <span className='uppercase pfont-400 text-sm'>exp</span>
                                                    <span><FaExternalLinkAlt className='text-xs' /></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex border-b pt-3 pb-2 border-b-[#343439]  justify-between items-center'>
                                            <p className='text-sm text-white pfont-400'>
                                                WETH
                                            </p>
                                            <div className='flex items-center gap-x-3'>
                                                <div className='flex gap-x-1 px-2 py-1 cursor-pointer rounded-md text-[#ffffffeb] hover:bg-[#ffffff29] bg-[#ffffff14] items-center'>
                                                    <span>
                                                        <FaRegCopy className='text-sm' />
                                                    </span>
                                                    <span className='pfont-400 text-sm'>
                                                        {shortenText('FHjxJM4nU7YHCbwqsmRs5M89m6BG1FygopXsj4vFSRVy', 10)}
                                                    </span>
                                                </div>
                                                <div className='flex gap-x-2 text-[#cccccc] items-center'>
                                                    <span className='uppercase pfont-400 text-sm'>LPs</span>
                                                    <span><FaExternalLinkAlt className='text-xs' /></span>
                                                </div>
                                                <div className='flex gap-x-2 text-[#cccccc] items-center'>
                                                    <span className='uppercase pfont-400 text-sm'>exp</span>
                                                    <span><FaExternalLinkAlt className='text-xs' /></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex mt-5 gap-x-2'>
                                    <div className='flex-1 py-1.5 flex items-center justify-center gap-x-1.5 rounded border border-[#5e5e6b]'>
                                        <BsTwitterX className='text-white  text-sm' />
                                        <p className='text-white text-sm text-center pfont-500'>Search on Twitter</p>
                                    </div>
                                    <div className='flex-1 py-1.5 flex items-center justify-center gap-x-1.5 rounded border border-[#5e5e6b]'>
                                        <FaSearch className='text-white  text-sm' />
                                        <p className='text-white text-sm text-center pfont-500'>Other Pairs</p>
                                    </div>
                                </div>
                                <div className='flex mt-5 gap-x-2'>
                                    <div className='hover:bg-[#ffffff14] py-2 flex-1 rounded border border-[#ffffff29]'>
                                        <div className='flex justify-center'>
                                            <img src="/images/icons/svg/rocket.svg" alt="" />
                                        </div>
                                        <p className='pfont-400 text-white text-center'>1917</p>
                                    </div>
                                    <div className='hover:bg-[#ffffff14] py-2 flex-1 rounded border border-[#ffffff29]'>
                                        <div className='flex justify-center'>
                                            <img src="/images/icons/svg/fire.svg" alt="" />
                                        </div>
                                        <p className='pfont-400 text-white text-center'>198</p>
                                    </div>
                                    <div className='hover:bg-[#ffffff14] py-2 flex-1 rounded border border-[#ffffff29]'>
                                        <div className='flex justify-center'>
                                            <img src="/images/icons/svg/emoji.svg" alt="" />
                                        </div>
                                        <p className='pfont-400 text-white text-center'>198</p>
                                    </div>
                                    <div className='hover:bg-[#ffffff14] py-2 flex-1 rounded border border-[#ffffff29]'>
                                        <div className='flex justify-center'>
                                            <img src="/images/icons/svg/flag.svg" alt="" />
                                        </div>
                                        <p className='pfont-400 text-white text-center'>198</p>
                                    </div>
                                </div>
                                <div className='pt-[2rem] mt-5'>
                                    <div className='gradient-1 px-5 shadow-1 rounded-2xl'>
                                        <div className='translate-y-[-2rem]'>
                                            <div className='flex justify-center'>
                                                <img className='w-[30%]' src="/images/token/token1.webp" alt="" />
                                            </div>
                                            <div className='mt-2'>
                                                <p className='text-center text-white text-2xl space-500'>BB</p>
                                            </div>
                                            <div className='flex flex-wrap justify-center mt-4 gap-3'>
                                                <button className='bg-[#4b4b50]  rounded  flex justify-center items-center px-4 py-2  text-[#FFFFFFFB]'>
                                                    <img className='w-4' src="/images/icons/svg/web.svg" alt="" />
                                                    <span className='pfont-600 ml-2 text-sm'>
                                                        Website
                                                    </span>
                                                </button>
                                                <button className='bg-[#4b4b50]  rounded  flex justify-center items-center px-4 py-2  text-[#FFFFFFFB]'>
                                                    <img className='w-4' src="/images/icons/svg/web.svg" alt="" />
                                                    <span className='pfont-600 ml-2 text-sm'>
                                                        Docs
                                                    </span>
                                                </button>
                                                <button className='bg-[#4b4b50]  rounded  flex justify-center items-center px-4 py-2  text-[#FFFFFFFB]'>
                                                    <BsTwitterX className='text-sm' />
                                                    <span className='pfont-600 ml-2 text-sm'>
                                                        Twitter
                                                    </span>
                                                </button>
                                                <button className='bg-[#4b4b50]  rounded  flex justify-center items-center px-4 py-2  text-[#FFFFFFFB]'>
                                                    <FaTelegramPlane className='' />
                                                    <span className='pfont-600 ml-2 text-sm'>
                                                        Telegram
                                                    </span>
                                                </button>

                                            </div>
                                            <div className='mt-4 px-3'>
                                                <p className='text-white pfont-400 text-center'>
                                                    Get ready for a paw-some adventure with Based Shiba, the newest sensation on the BASE blockchain! Embracing the spirit of memes and good vibes, Based Shiba is not just a token; it’s a community-driven movement that’s here to shake things up in the crypto world.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Token
