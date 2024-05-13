import { useEffect, useMemo, useRef, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BsChatSquare, BsThreeDotsVertical, BsTwitterX, CgMenuRightAlt, FaChevronRight, FaExternalLinkAlt, FaFire, FaFireAlt, FaInfoCircle, FaRegCopy, FaSearch, FaSketch, FaTelegramPlane, FiChevronDown, RxCross2 } from './../assets/icons/vander';
import Transactions from '../sections/token/Transactions';
import { shortenText, timestampToDate } from '../utils/helper';
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
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import copy from 'copy-to-clipboard';
import { FaChartSimple } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { TOKEN_QUERY, TOKEN_TRADES_QUERY } from '../graphql/queries/tokenQueries';
import TokenDetails from '../sections/token/TokenDetails';
import TradeComponent from '../sections/token/TradeComponent';
import { formatNumber } from '../utils/formats';
import Datafeed from '../datafeed';
import { createChart } from 'lightweight-charts';


const Token = () => {
    const navigate = useNavigate()
    let { tokenAddress } = useParams();
    const chartContainerRef = useRef(null);

    const [tabIndex, setTabIndex] = useState(0);
    const [tabIndex1, setTabIndex1] = useState(0);
    const [tabIndex2, setTabIndex2] = useState(0);
    const [tabIndex3, setTabIndex3] = useState(0)
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const [open1, setOpen1] = useState(false);
    const onOpenModal1 = () => setOpen1(true);
    const onCloseModal1 = () => setOpen1(false);
    const [open2, setOpen2] = useState(false);
    const onOpenModal2 = () => setOpen2(true);
    const [eth, setETH] = useState(true)
    const onCloseModal2 = () => setOpen2(false);

    const [aggregationInterval, setAggregationInterval] = useState(300)


    const { data: tokenData, loading: tokenLoading, error: tokenError } = useQuery(TOKEN_QUERY, {
        variables: { id: tokenAddress },
    });

    const [tradesPage, setTradesPage] = useState(1);
    const tradesPageSize = 10;

    const { data: tradesData, loading: tradesLoading, error: tradesError } = useQuery(TOKEN_TRADES_QUERY, {
        variables: {
            bondingCurveId: tokenData?.token?.bondingCurve?.id,
            first: tradesPageSize,
            skip: (tradesPage - 1) * tradesPageSize,
        },
        skip: !tokenData?.token?.bondingCurve?.id,
        pollInterval: 2000
    });


    const token = tokenData?.token;
    const bondingCurve = token?.bondingCurve;
    const trades = tradesData?.trades;
    const bondingCurveProgess = 100 - ((bondingCurve?.ethAmountToCompleteCurve / bondingCurve?.totalEthAmountToCompleteCurve) * 100)
    const remainingSupplyInCurve = bondingCurve?.tokenAmountToCompleteCurve


    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, {
                layout: {
                    textColor: 'black',
                    background: { type: 'solid', color: 'white' },
                },
                // crosshair: {
                //     mode: CrosshairMode.Normal,
                // },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

            const trades = tradesData?.trades;

            if (trades) {
                const aggregatedData = trades.reduce((acc, trade) => {
                    const timestamp = trade.timestamp * 1000;
                    const intervalKey = Math.floor(timestamp / (aggregationInterval * 1000)) * (aggregationInterval * 1000);
                    if (!acc[intervalKey]) {
                        acc[intervalKey] = {
                            time: timestamp,
                            open: Number(trade.avgPrice),
                            high: Number(trade.avgPrice),
                            low: Number(trade.avgPrice),
                            close: Number(trade.avgPrice),
                        };
                    } else {
                        acc[intervalKey].high = Math.max(acc[intervalKey].high, Number(trade.avgPrice));
                        acc[intervalKey].low = Math.min(acc[intervalKey].low, Number(trade.avgPrice));
                        acc[intervalKey].close = Number(trade.avgPrice);
                    }
                    return acc;
                }, {});

                const candlestickData = Object.values(aggregatedData).sort(
                    (a, b) => a.time - b.time
                );

                candlestickSeries.setData(candlestickData);
            }

            chart.timeScale().fitContent();

            return () => {
                chart.remove();
            };
        }
    }, [tradesData, aggregationInterval]);


    // useEffect(() => {
    //     if (chartContainerRef.current) {
    //         const chart = createChart(chartContainerRef.current, {
    //             layout: {
    //                 textColor: 'black',
    //                 background: { type: 'solid', color: 'white' },
    //             },
    //             // crosshair: {
    //             //     mode: CrosshairMode.Normal,
    //             // },
    //             timeScale: {
    //                 timeVisible: true,
    //                 secondsVisible: false,
    //             },
    //         });

    //         const candlestickSeries = chart.addCandlestickSeries({
    //             upColor: '#26a69a',
    //             downColor: '#ef5350',
    //             borderVisible: false,
    //             wickUpColor: '#26a69a',
    //             wickDownColor: '#ef5350',
    //         });

    //         const trades = tradesData?.trades;

    //         if (trades) {
    //             const aggregatedData = trades.reduce((acc, trade) => {
    //                 const timestamp = trade.timestamp * 1000;
    //                 const hourKey = Math.floor(timestamp / 3600000) * 3600000;
    //                 if (!acc[hourKey]) {
    //                     acc[hourKey] = {
    //                         time: timestamp,
    //                         open: Number(trade.avgPrice),
    //                         high: Number(trade.avgPrice),
    //                         low: Number(trade.avgPrice),
    //                         close: Number(trade.avgPrice),
    //                     };
    //                 } else {
    //                     acc[hourKey].high = Math.max(acc[hourKey].high, Number(trade.avgPrice));
    //                     acc[hourKey].low = Math.min(acc[hourKey].low, Number(trade.avgPrice));
    //                     acc[hourKey].close = Number(trade.avgPrice);
    //                 }
    //                 return acc;
    //             }, {});

    //             const candlestickData = Object.values(aggregatedData).sort(
    //                 (a, b) => a.time - b.time
    //             );

    //             candlestickSeries.setData(candlestickData);
    //         }

    //         chart.timeScale().fitContent();

    //         return () => {
    //             chart.remove();
    //         };
    //     }
    // }, [tradesData]);

    const targetDivRef = useRef(null);
    const { register, control, setValue, handleSubmit, formState: { errors } } = useForm({
        // resolver: yupResolver(TradeSchema)
    })
    const onSubmit = (values) => {

    }
    const value = useWatch({
        name: 'value',
        control
    });
    const handleClick = () => {
        if (targetDivRef.current) {
            targetDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.error("Target div with ref 'targetDivRef' not found.");
        }
    };
    const price = useMemo(() => {
        return value == undefined || value == null || value == '' ? null : `${parseFloat(value) * 307636.863473} ETH`;
    }, [value])

    console.log("tokenAddress",tokenAddress)


    const widgetOptions = {
        symbol: token?.id,
        interval: '60',
        fullscreen: false,
        container: 'tv_chart_container',
        library_path: '/charting_library/',
        datafeed: Datafeed,
    };


    return (
        <>
            <div className="container-fluid pt-[69px] bg-black">
                <div className='lg:relative lg:h-screen lg:flex lg:justify-between'>
                    <div className={`lg:w-[calc(100%-400px)] ${tabIndex3 == 0 && 'max-lg:hidden'} lg:h-screen lg:overflow-y-auto lg:absolute lg:left-0 lg:top-0 bg-[#17171c] token-left`}>
                        <div className='w-full  relative px-3 py-3 bg-[#17171c]'>
                            <div className='absolute z-[11] h-full left-0 top-0'>
                                <button onClick={() => navigate('/')} className='h-full pl-2 bg-transparent'>
                                    <FaCircleArrowLeft className='text-white text-xl' />
                                </button>
                            </div>
                            <div className='pl-7'>
                                <Swiper
                                    freeMode={true}
                                    slidesPerView={'auto'}
                                    spaceBetween={12}
                                    modules={[FreeMode]}
                                // breakpoints={{
                                //     1600: {
                                //         slidesPerView: 6,
                                //         spaceBetween: 10
                                //     },
                                //     1400: {
                                //         slidesPerView: 5,
                                //         spaceBetween: 10
                                //     },
                                //     1200: {
                                //         slidesPerView: 4,
                                //         spaceBetween: 10
                                //     },
                                //     992: {
                                //         slidesPerView: 3,
                                //         spaceBetween: 10
                                //     },
                                //     768: {
                                //         slidesPerView: 4,
                                //         spaceBetween: 10
                                //     },
                                //     576: {
                                //         slidesPerView: 3,
                                //         spaceBetween: 10
                                //     },
                                //     400: {
                                //         slidesPerView: 2,
                                //         spaceBetween: 10
                                //     },
                                //     0: {
                                //         slidesPerView: 1,
                                //         spaceBetween: 10
                                //     }
                                // }}
                                >
                                    <SwiperSlide style={{ width: '174px' }}>
                                        <button className='flex items-center w-full gap-x-2 py-1 bg-[#2e2e33] px-2 rounded-md'>
                                            <span className='text-sm text-[#A7A7AC]'>#1</span>
                                            <img className='w-5' src="/images/icons/svg/blerf.webp" alt="" />
                                            <span className='text-white pfont-600 uppercase'>blerf</span>
                                            <span className='pfont-500 text-sm text-[#d0332a]'>-31.67%</span>
                                        </button>
                                    </SwiperSlide>
                                    {
                                        Array.from({ length: 7 })?.map((_, index) => (
                                            <SwiperSlide style={{ width: '174px' }} key={index}>
                                                <button className='flex w-[174px] h-[32px] items-center gap-x-2 py-1  px-2 rounded-md'>
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
                                        <div className='lg:w-[800px] flex gap-y-2 flex-col bg-[#1d1d22] h-[70vh]'>
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
                                            <div className='flex-1 px-3 tokens-table-wrapper overflow-x-auto overflow-y-auto'>
                                                <Tokens />
                                            </div>
                                            <div className='bg-[#28282d]  w-full  py-3 px-3'>
                                                <div className='flex gap-x-4 w-full items-center justify-center'>
                                                    <button className="rounded-md flex gap-x-2 px-3 py-2 items-center border-none bg-[#475dc0]">
                                                        <span><FaFire className='text-white text-sm' /></span>
                                                        <span className='text-white pfont-600 text-sm'>All Trending Tokens on Ethereum</span>
                                                        <span><FaChevronRight className='text-white text-[13px]' /></span>
                                                    </button>
                                                    <button className='flex items-center gap-x-1.5 bg-transparent'>
                                                        <FaInfoCircle className='text-[#cccccc]' />
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
                                {/* <AdvancedRealTimeChart height={450} width={'100%'} theme="dark"></AdvancedRealTimeChart> */}

                                <div ref={chartContainerRef} style={{ height: '450px', width: '100%' }}></div>
                                {/* <div id="tv_chart_container" style={{ height: '450px' }}></div> */}
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
                                    </div>
                                    <TabPanel>
                                        <Transactions trades={trades} />
                                    </TabPanel>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <div className={`lg:border-l  ${tabIndex3 == 1 && 'max-lg:hidden'} lg:h-screen lg:overflow-y-auto lg:absolute  lg:right-0 lg:top-0 lg:border-[#5e5e6b] bg-[#17171c] lg:w-[400px] token-right`}>
                        <div className='pb-10'>
                            <div className='bg-[#222227] px-3 py-2'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-x-2'>
                                        <img className='w-7' src="/images/token/token1.webp" alt="" />
                                        <p className='space-500 text-[17px] text-white'>{token?.name}</p>
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
                                            <span className='text-white text-[17px] space-600'>{token?.name}</span>
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
                                <img className='hover:scale-105 w-full  transition-all duration-300' src="/images/token/token-bg-1.webp" alt="" />
                            </div>
                            <div className='xs:pl-4 pl-3 pr-3 xs:pr-4 lg:pr-2'>
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
                                    <button onClick={handleClick} className='bg-[#4b4b50] rounded-e  flex justify-center items-center px-3 py-1  text-[#FFFFFFFB]'>

                                        <span className=''>
                                            <FiChevronDown />
                                        </span>
                                    </button>
                                </div>
                                <div className='flex mt-3 gap-x-2'>
                                    <div className='flex-1 py-2 rounded border border-[#5e5e6b]'>
                                        <p className='uppercase  text-center text-[#797979] pfont-400 text-sm'>price usd</p>
                                        <p className='text-white text-[15px] text-center pfont-600'>$0.0886777</p>
                                    </div>
                                    <div className='flex-1 py-2 rounded border border-[#5e5e6b]'>
                                        <p className='uppercase  text-center text-[#797979] pfont-400 text-sm'>price</p>
                                        <p className='text-white text-[15px] text-center pfont-600'>{bondingCurve?.currentPrice} WETH</p>
                                    </div>
                                </div>
                                {/* <div className='border border-[#343439] mt-3 px-3 py-2.5 rounded-lg'>
                                    <div className='flex items-center gap-x-2'>
                                        <p className='pfont-500 text-[#8e94a0] text-sm'>bonding curve progress: {formatNumber(bondingCurveProgess)}%</p>
                                        <FaInfoCircle data-tooltip-id='bonding_curve' className='text-[#8e94a0] cursor-pointer' />
                                    </div>
                                    <div className='mt-2'>
                                        <div className={`rounded-full w-full sm:w-[100%] h-4 bg-[#374151]`}>
                                            <a className='w-full' data-tooltip-id='bonding_curve' >
                                                <div style={{ width: '80%' }} className='srounded-full cursor-pointer h-full bg-[#48bb78]'>
                                                </div>
                                            </a>
                                            <Tooltip opacity={1} style={{ backgroundColor: '#111116' }} className='z-[10] ' id="bonding_curve">
                                                <div className='w-[330px]'>
                                                    <p className='pfont-500 mt-3 text-[#8e94a0] text-sm'>when the market cap reaches $63,375 all the liquidity from the bonding curve will be deposited into Raydium and burned. progression increases as the price goes up.</p>
                                                    <p className='pfont-500 mt-3 text-[#8e94a0] text-sm'>there are {remainingSupplyInCurve} tokens still available for sale in the bonding curve and there is 0.686 ETH in the bonding curve.</p>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>

                                </div> */}
                                <div className='border border-[#343439] mt-3 px-3 py-2.5 rounded-lg'>
                                    <div className='flex items-center gap-x-2'>
                                        <p className='pfont-500 text-[#8e94a0] text-sm'>bonding curve progress: {formatNumber(bondingCurveProgess)}%</p>
                                        <FaInfoCircle data-tooltip-id='bonding_curve' className='text-[#8e94a0] cursor-pointer' />
                                    </div>
                                    <div className='mt-2'>
                                        <div className={`rounded-full w-full sm:w-[100%] h-4 bg-[#374151] relative`}>
                                            <a className='w-full' data-tooltip-id='bonding_curve'>
                                                <div style={{ width: `${bondingCurveProgess}%` }} className='srounded-full cursor-pointer h-full bg-[#48bb78] absolute top-0 left-0'>
                                                </div>
                                            </a>
                                            <Tooltip opacity={1} style={{ backgroundColor: '#111116' }} className='z-[10] ' id="bonding_curve">
                                                <div className='w-[330px]'>
                                                    <p className='pfont-500 mt-3 text-[#8e94a0] text-sm'>when the market cap reaches $63,375 all the liquidity from the bonding curve will be deposited into Raydium and burned. progression increases as the price goes up.</p>
                                                    <p className='pfont-500 mt-3 text-[#8e94a0] text-sm'>there are {remainingSupplyInCurve} tokens still available for sale in the bonding curve and there is 0.686 ETH in the bonding curve.</p>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                                {
                                    token  && bondingCurve && <TradeComponent token={token} bondingCurve={bondingCurve}/>
                                }
                                
                                {
                                    token && trades && <TokenDetails token={token} trades={trades} />
                                }
    
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
                                {/* <div className='flex mt-5 gap-x-2'>
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
                                </div> */}
                                <div ref={targetDivRef} className='pt-[2rem] mt-5'>
                                    <div className='gradient-1 sm:px-5 shadow-1 rounded-2xl'>
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
                                                {/* <button className='bg-[#4b4b50]  rounded  flex justify-center items-center px-4 py-2  text-[#FFFFFFFB]'>
                                                    <img className='w-4' src="/images/icons/svg/web.svg" alt="" />
                                                    <span className='pfont-600 ml-2 text-sm'>
                                                        Docs
                                                    </span>
                                                </button> */}
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
                <div className={`lg:hidden flex justify-between w-full fixed left-0 bg-[#060606] bottom-0 h-[50px]`}>
                    <button onClick={() => setTabIndex3(0)} className={`flex-1 outline-none gap-x-2 flex h-[50px] text-white justify-center items-center border-none  ${tabIndex3 == 0 ? 'bg-[#475dc0]' : 'bg-[#060606]'} `}>
                        <span><FaInfoCircle /> </span>
                        <span className='pfont-400'>Info</span>
                    </button>
                    <button onClick={() => setTabIndex3(1)} className={`flex-1 outline-none border-none h-[50px] gap-x-2 text-white flex justify-center items-center    ${tabIndex3 == 1 ? 'bg-[#475dc0]' : 'bg-[#060606]'}`}>
                        <span><FaChartSimple /></span>
                        <span className='pfont-400'>Chart+Txns</span>
                    </button>
                </div>
            </div>
            <Modal styles={{
                padding: 0
            }} open={open1} showCloseIcon={false} blockScroll={false} onClose={onCloseModal1} center>
                <div className='sm:w-[470px] border px-5 py-5 sm:py-6 sm:px-6 border-white rounded-xl flex gap-y-3 flex-col bg-[#1b1d28]'>
                    <div className='w-full   flex justify-center items-center'>
                        <div className="text-center">
                            <h3 className="text-center tracking-[0.5px] roboto-400 text-white text-lg">Set max. slippage (%)</h3>

                        </div>
                    </div>
                    <div>
                        <div className="flex items-center rounded-md relative">
                            <input

                                className="flex h-11 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                placeholder="0.0" type="number" />

                        </div>
                    </div>
                    <div>
                        <p className='text-center tracking-[0.5px] mt-2.5 mb-2 pfont-400 text-white text-sm'>This is the maximum amount of slippage you are willing to accept when placing trades</p>
                    </div>
                    <div className="flex  justify-center">
                        <button onClick={onCloseModal1} className="bg-[#475dc0] transition-all duration-300 hover:bg-blue-500 hover:scale-105 border-none text-white flex items-center tracking-[1px] roboto-500 gap-x-2 w-full text-center justify-center py-2.5 rounded-md">Close</button>
                    </div>
                </div>
            </Modal>
            <Modal styles={{
                padding: 0
            }} open={open2} showCloseIcon={false} blockScroll={false} onClose={onCloseModal2} center>
                <div className='sm:w-[470px] border px-5 py-5 sm:py-6 sm:px-6 border-white rounded-xl flex gap-y-3 flex-col bg-[#1b1d28]'>
                    <div className='w-full   flex justify-center items-center'>
                        <div className="text-center">
                            <h3 className="text-center tracking-[0.5px] roboto-400 text-white text-lg">Set max. slippage (%)</h3>

                        </div>
                    </div>
                    <div>
                        <div className="flex items-center rounded-md relative">
                            <input

                                className="flex h-11 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                placeholder="0.0" type="number" />

                        </div>
                    </div>
                    <div>
                        <p className='text-center tracking-[0.5px] mt-2.5 mb-2 pfont-400 text-white text-sm'>This is the maximum amount of slippage you are willing to accept when placing trades</p>
                    </div>
                    <div className="flex  justify-center">
                        <button onClick={onCloseModal2} className="bg-[#475dc0] transition-all duration-300 hover:bg-blue-500 hover:scale-105 border-none text-white flex items-center tracking-[1px] roboto-500 gap-x-2 w-full text-center justify-center py-2.5 rounded-md">Close</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Token
