import Decimal from 'decimal.js';
import { useState, useMemo } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BigNumber from 'bignumber.js';
import { Modal } from 'react-responsive-modal';
import { calculatePurchaseReturn, calculateSaleReturn, estimateEthInForExactTokensOut, estimateTokenInForExactEthOut } from '../../utils/apeFormula';
import 'react-responsive-modal/styles.css';
import { formatNumber } from '../../utils/formats';

const TradeComponent = ({ token, bondingCurve }) => {
    const [tabIndex2, setTabIndex2] = useState(0);
    const [eth, setETH] = useState(true);
    const price = 1;

    const [open1, setOpen1] = useState(false);
    const onOpenModal1 = () => setOpen1(true);
    const onCloseModal1 = () => setOpen1(false);
    const [open2, setOpen2] = useState(false);
    const onOpenModal2 = () => setOpen2(true);
    const onCloseModal2 = () => setOpen2(false);

    const TradeSchema = Yup.object().shape({
        value: Yup.number().positive('Must be a positive number').required('Input is required'),
    });

    const { register, control, setValue, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(TradeSchema),
    });

    const onSubmit = (values) => {
        console.log(values);
    };

    const value = useWatch({
        name: 'value',
        control,
    });

    const supply = useMemo(() => {
        return bondingCurve?.circulatingSupply || '0';
    }, [bondingCurve]);

    const connectorBalance = useMemo(() => {
        return bondingCurve?.poolBalance || '0';
    }, [bondingCurve]);

    const connectorWeight = useMemo(() => {
        return bondingCurve?.reserveRatio || '0';
    }, [bondingCurve]);

    const inputInWei = useMemo(() => {
        if (!value) return '0';
        // return new Decimal(value).times(10 ** 18).toString();
        return value || '0'
    }, [value]);

    const purchaseReturn = useMemo(() => {
        return new BigNumber(calculatePurchaseReturn(supply, connectorBalance, connectorWeight, inputInWei)).toString();
    }, [supply, connectorBalance, connectorWeight, inputInWei]);


    const saleReturn = useMemo(() => {
        return new BigNumber(calculateSaleReturn(supply, connectorBalance, connectorWeight, inputInWei)).toString();
    }, [supply, connectorBalance, connectorWeight, inputInWei]);

    const estimateEthIn = useMemo(() => {
        return new BigNumber(estimateEthInForExactTokensOut(supply, connectorBalance, connectorWeight, inputInWei)).toString();
    }, [supply, connectorBalance, connectorWeight, inputInWei]);

    const estimateTokenIn = useMemo(() => {
        return new BigNumber(estimateTokenInForExactEthOut(supply, connectorBalance, connectorWeight, inputInWei)).toString();
    }, [supply, connectorBalance, connectorWeight, inputInWei]);

    return (
        <div className='mt-3'>
            <div className="grid gap-x-4 gap-y-2">
                <div className="border border-[#343439] px-4 py-3 rounded-lg text-gray-400 grid gap-4">
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
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex justify-between w-full gap-2">
                                    {eth ? (
                                        <button
                                            type='button'
                                            onClick={() => setETH(false)}
                                            className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
                                        >
                                            Switch to {token?.symbol}
                                        </button>
                                    ) : (
                                        <button
                                            type='button'
                                            onClick={() => setETH(true)}
                                            className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
                                        >
                                            Switch to ETH
                                        </button>
                                    )}
                                    <button
                                        onClick={onOpenModal1}
                                        className="text-xs py-1 pfont-400 px-2 rounded bg-gray-800 text-gray-300"
                                        type="button"
                                    >
                                        Set max slippage
                                    </button>
                                </div>
                                <div className="flex mt-3 flex-col">
                                    {eth ? (
                                        <div className="flex items-center rounded-md relative">
                                            <input
                                                {...register('value')}
                                                className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                                placeholder="0.0"
                                                type="number"
                                            />
                                            <div className="flex items-center ml-2 absolute right-2">
                                                <span className="text-white pfont-400 mr-2">ETH</span>
                                                <img
                                                    className="w-7 h-7 rounded-full"
                                                    src="/images/logo/eth.svg"
                                                    alt="ETH"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center rounded-md relative">
                                            <input
                                                {...register('value')}
                                                className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                                placeholder="0.0"
                                                type="number"
                                            />
                                            <div className="flex items-center ml-2 absolute right-2">
                                                <span className="text-white pfont-400 mr-2">{token?.symbol}</span>
                                                <img
                                                    className="w-7 h-7 rounded-full"
                                                    src="/images/token/legit.jpeg"
                                                    alt="ETH"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {eth ? (
                                        <>
                                            <div className="flex flex-wrap gap-3 mt-2 py-1 rounded-lg">
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', null)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', 0.5)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    0.5 ETH
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', 1)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    1 ETH
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', 2.5)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    2.5 ETH
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', 5)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    5 ETH
                                                </button>
                                            </div>
                                            <div className='mt-1'>
                                                {`You will receive ${purchaseReturn} (~${formatNumber(purchaseReturn)}) ${token?.symbol}`}
                                            </div>
                                        </>
                                    ) : (
                                        <div className='mt-1'>
                                            {`It will cost ${estimateEthIn} (~${formatNumber(estimateEthIn)}) ETH`}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type='submit'
                                    className="inline-flex mt-2 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#b0dc73] hover:text-black"
                                >
                                    Place Trade
                                </button>
                            </form>
                        </TabPanel>
                        <TabPanel>
                            <form>
                                <div className="flex justify-between w-full gap-2">
                                    {eth ? (
                                        <button
                                            type='button'
                                            onClick={() => setETH(false)}
                                            className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
                                        >
                                            Switch to {token?.symbol}
                                        </button>
                                    ) : (
                                        <button
                                            type='button'
                                            onClick={() => setETH(true)}
                                            className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
                                        >
                                            Switch to ETH
                                        </button>
                                    )}
                                    <button
                                        onClick={onOpenModal2}
                                        className="text-xs py-1 pfont-400 px-2 rounded bg-gray-800 text-gray-300"
                                        type="button"
                                    >
                                        Set max slippage
                                    </button>
                                </div>
                                <div className="flex mt-3 flex-col">
                                    {eth ? (
                                        <div className="flex items-center rounded-md relative">
                                            <input
                                                {...register('value')}
                                                className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                                placeholder="0.0"
                                                type="number"
                                            />
                                            <div className="flex items-center ml-2 absolute right-2">
                                                <span className="text-white pfont-400 mr-2">ETH</span>
                                                <img
                                                    className="w-7 h-7 rounded-full"
                                                    src="/images/logo/eth.svg"
                                                    alt="ETH"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center rounded-md relative">
                                            <input
                                                {...register('value')}
                                                className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                                placeholder="0.0"
                                                type="number"
                                            />
                                            <div className="flex items-center ml-2 absolute right-2">
                                                <span className="text-white pfont-400 mr-2">{token?.symbol}</span>
                                                <img
                                                    className="w-7 h-7 rounded-full"
                                                    src="/images/token/legit.jpeg"
                                                    alt="ETH"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {eth ? (
                                        <>
                                            <div className="flex flex-wrap gap-3 mt-2 py-1 rounded-lg">
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', null)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', 0.5)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    0.5 ETH
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', 1)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    1 ETH
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', 2.5)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    2.5 ETH
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => setValue('value', 5)}
                                                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    5 ETH
                                                </button>
                                            </div>
                                            <div className='mt-1'>
                                                {`You will sell ${estimateTokenIn} (~${formatNumber(estimateTokenIn)}) ${token?.symbol}`}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex mt-2 p-1 rounded-lg">
                                                <button
                                                    type='button'
                                                    className="text-xs py-1 -ml-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    type='button'
                                                    className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    25%
                                                </button>
                                                <button
                                                    type='button'
                                                    className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    50%
                                                </button>
                                                <button
                                                    type='button'
                                                    className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    75%
                                                </button>
                                                <button
                                                    type='button'
                                                    className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300"
                                                >
                                                    100%
                                                </button>
                                            </div>
                                            <div className='mt-1'>
                                                {`You are about to receive ${saleReturn} (~${formatNumber(saleReturn)}) ETH`}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button
                                    type='submit'
                                    className="inline-flex mt-3 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#b0dc73] hover:text-black"
                                >
                                    Place Trade
                                </button>
                            </form>
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default TradeComponent;


// import { useState, useMemo } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import { useForm, useWatch } from 'react-hook-form';
// import * as Yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import BigNumber from 'bignumber.js';
// import { calculatePurchaseReturn, calculateSaleReturn, estimateEthInForExactTokensOut, estimateTokenInForExactEthOut } from '../../utils/apeFormula';
// import 'react-responsive-modal/styles.css';
// import { Modal } from 'react-responsive-modal';

// const TradeComponent = ({ token, bondingCurve }) => {
//     const [tabIndex2, setTabIndex2] = useState(0);
//     const [eth, setETH] = useState(true);
//     const price = 1;

//     const [open1, setOpen1] = useState(false);
//     const onOpenModal1 = () => setOpen1(true);
//     const onCloseModal1 = () => setOpen1(false);
//     const [open2, setOpen2] = useState(false);
//     const onOpenModal2 = () => setOpen2(true);
//     const onCloseModal2 = () => setOpen2(false);

//     const TradeSchema = Yup.object().shape({
//         value: Yup.number().positive('Must be a positive number').required('Input is required'),
//     });

//     const { register, control, setValue, handleSubmit, formState: { errors } } = useForm({
//         resolver: yupResolver(TradeSchema),
//     });

//     const onSubmit = (values) => {
//         console.log(values);
//     };

//     const value = useWatch({
//         name: 'value',
//         control,
//     });

//     const supply = useMemo(() => {
//         return bondingCurve?.circulatingSupply || '0';
//     }, [bondingCurve]);

//     const connectorBalance = useMemo(() => {
//         return bondingCurve?.poolBalance || '0';
//     }, [bondingCurve]);

//     const connectorWeight = useMemo(() => {
//         return bondingCurve?.reserveRatio || '0';
//     }, [bondingCurve]);

//     const inputInWei = useMemo(() => {
//         if (!value) return '0';
//         return new BigNumber(value).times(10 ** 18).toString();
//     }, [value]);

//     const purchaseReturn = useMemo(() => {
//         return new BigNumber(calculatePurchaseReturn(supply, connectorBalance, connectorWeight, inputInWei)).div(10 ** 18).toString();
//     }, [supply, connectorBalance, connectorWeight, inputInWei]);

//     const saleReturn = useMemo(() => {
//         return new BigNumber(calculateSaleReturn(supply, connectorBalance, connectorWeight, inputInWei)).div(10 ** 18).toString();
//     }, [supply, connectorBalance, connectorWeight, inputInWei]);

//     const estimateEthIn = useMemo(() => {
//         return new BigNumber(estimateEthInForExactTokensOut(supply, connectorBalance, connectorWeight, inputInWei)).div(10 ** 18).toString();
//     }, [supply, connectorBalance, connectorWeight, inputInWei]);

//     const estimateTokenIn = useMemo(() => {
//         return new BigNumber(estimateTokenInForExactEthOut(supply, connectorBalance, connectorWeight, inputInWei)).div(10 ** 18).toString();
//     }, [supply, connectorBalance, connectorWeight, inputInWei]);

//     return (
//         <div className='mt-3'>
//             <div className="grid gap-x-4 gap-y-2">
//                 <div className="border border-[#343439] px-4 py-3 rounded-lg text-gray-400 grid gap-4">
//                     <Tabs selectedIndex={tabIndex2} onSelect={(index) => setTabIndex2(index)}>
//                         <TabList>
//                             <div className="grid grid-cols-2 gap-2 mb-3">
//                                 <Tab className={`p-2 cursor-pointer text-center pfont-500 rounded ${tabIndex2 == 0 ? 'bg-[#48bb78] text-white' : 'bg-gray-800 text-grey-600'}`}>
//                                     Buy
//                                 </Tab>
//                                 <Tab className={`p-2 cursor-pointer text-center pfont-500 rounded ${tabIndex2 == 1 ? 'bg-red-400 text-white' : 'bg-gray-800 text-grey-600'}`}>
//                                     Sell
//                                 </Tab>
//                             </div>
//                         </TabList>
//                         <TabPanel>
//                             <form onSubmit={handleSubmit(onSubmit)}>
//                                 <div className="flex justify-between w-full gap-2">
//                                     {eth ? (
//                                         <button
//                                             type='button'
//                                             onClick={() => setETH(false)}
//                                             className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
//                                         >
//                                             Switch to LEGIT
//                                         </button>
//                                     ) : (
//                                         <button
//                                             type='button'
//                                             onClick={() => setETH(true)}
//                                             className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
//                                         >
//                                             Switch to ETH
//                                         </button>
//                                     )}
//                                     <button
//                                         onClick={onOpenModal1}
//                                         className="text-xs py-1 pfont-400 px-2 rounded bg-gray-800 text-gray-300"
//                                         type="button"
//                                     >
//                                         Set max slippage
//                                     </button>
//                                 </div>
//                                 <div className="flex mt-3 flex-col">
//                                     {eth ? (
//                                         <div className="flex items-center rounded-md relative">
//                                             <input
//                                                 {...register('value')}
//                                                 className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
//                                                 placeholder="0.0"
//                                                 type="number"
//                                             />
//                                             <div className="flex items-center ml-2 absolute right-2">
//                                                 <span className="text-white pfont-400 mr-2">ETH</span>
//                                                 <img
//                                                     className="w-7 h-7 rounded-full"
//                                                     src="/images/logo/eth.svg"
//                                                     alt="ETH"
//                                                 />
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center rounded-md relative">
//                                             <input
//                                                 // {...register('value')}
//                                                 className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
//                                                 placeholder="0.0"
//                                                 type="number"
//                                             />
//                                             <div className="flex items-center ml-2 absolute right-2">
//                                                 <span className="text-white pfont-400 mr-2">LEGIT</span>
//                                                 <img
//                                                     className="w-7 h-7 rounded-full"
//                                                     src="/images/token/legit.jpeg"
//                                                     alt="ETH"
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                     {eth ? (
//                                         <>
//                                             <div className="flex flex-wrap gap-3 mt-2 py-1 rounded-lg">
//                                                 <button
//                                                     type='button'
//                                                     onClick={() => setValue('value', null)}
//                                                     className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
//                                                 >
//                                                     Reset
//                                                 </button>
//                                                 <button
//                                                     type='button'
//                                                     onClick={() => setValue('value', 0.5)}
//                                                     className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
//                                                 >
//                                                     0.5 ETH
//                                                 </button>
//                                                 <button
//                                                     type='button'
//                                                     onClick={() => setValue('value', 1)}
//                                                     className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
//                                                 >
//                                                     1 ETH
//                                                 </button>
//                                                 <button
//                                                     type='button'
//                                                     onClick={() => setValue('value', 2.5)}
//                                                     className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
//                                                 >
//                                                     2.5 ETH
//                                                 </button>
//                                                 <button
//                                                     type='button'
//                                                     onClick={() => setValue('value', 5)}
//                                                     className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
//                                                 >
//                                                     5 ETH
//                                                 </button>
//                                             </div>
//                                             <div className='mt-1'>
//                                                 {eth && price && (
//                                                     <div>
//                                                         {`You will receive ${new BigNumber(calculatePurchaseReturn(
//                                                             bondingCurve?.circulatingSupply.toString(),
//                                                             bondingCurve?.poolBalance.toString(),
//                                                             bondingCurve?.reserveRatio,
//                                                             new BigNumber(price).times(1e18).toString()
//                                                         )).div(1e18).toString()} LEGIT`}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </>
//                                     ) : null}
//                                 </div>
//                                 <button
//                                     type='submit'
//                                     className="inline-flex mt-2 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#b0dc73] hover:text-black"
//                                 >
//                                     Place Trade
//                                 </button>
//                             </form>
//                         </TabPanel>
//                         <TabPanel>
//                             <form>
//                                 <div className="flex justify-between w-full gap-2">
//                                     {eth ? (
//                                         <button
//                                             type='button'
//                                             onClick={() => setETH(false)}
//                                             className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
//                                         >
//                                             Switch to LEGIT
//                                         </button>
//                                     ) : (
//                                         <button
//                                             type='button'
//                                             onClick={() => setETH(true)}
//                                             className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
//                                         >
//                                             Switch to ETH
//                                         </button>
//                                     )}
//                                     <button
//                                         onClick={onOpenModal2}
//                                         className="text-xs py-1 pfont-400 px-2 rounded bg-gray-800 text-gray-300"
//                                         type="button"
//                                     >
//                                         Set max slippage
//                                     </button>
//                                 </div>
//                                 <div className="flex mt-3 flex-col">
//                                     {eth ? (
//                                         <div className="flex items-center rounded-md relative">
//                                             <input
//                                                 {...register('value')}
//                                                 className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
//                                                 placeholder="0.0"
//                                                 type="number"
//                                             />
//                                             <div className="flex items-center ml-2 absolute right-2">
//                                                 <span className="text-white pfont-400 mr-2">ETH</span>
//                                                 <img
//                                                     className="w-7 h-7 rounded-full"
//                                                     src="/images/logo/eth.svg"
//                                                     alt="ETH"
//                                                 />
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center rounded-md relative">
//                                             <input
//                                                 // {...register('value')}
//                                                 className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
//                                                 placeholder="0.0"
//                                                 type="number"
//                                             />
//                                             <div className="flex items-center ml-2 absolute right-2">
//                                                 <span className="text-white pfont-400 mr-2">LEGIT</span>
//                                                 <img
//                                                     className="w-7 h-7 rounded-full"
//                                                     src="/images/token/legit.jpeg"
//                                                     alt="ETH"
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                     <div className="flex mt-2 p-1 rounded-lg">
//                                         <button
//                                             type='button'
//                                             className="text-xs py-1 -ml-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
//                                         >
//                                             Reset
//                                         </button>
//                                         <button
//                                             type='button'
//                                             className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300"
//                                         >
//                                             25%
//                                         </button>
//                                         <button
//                                             type='button'
//                                             className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300"
//                                         >
//                                             50%
//                                         </button>
//                                         <button
//                                             type='button'
//                                             className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300"
//                                         >
//                                             75%
//                                         </button>
//                                         <button
//                                             type='button'
//                                             className="text-xs py-1 px-2 ml-1 rounded pfont-400 bg-gray-800 text-gray-300"
//                                         >
//                                             100%
//                                         </button>
//                                     </div>
//                                     {!eth && price && (
//                                         <div className='mt-1'>
//                                             {`You will receive ${new BigNumber(calculateSaleReturn(
//                                                 bondingCurve?.circulatingSupply.toString(),
//                                                 bondingCurve?.poolBalance.toString(),
//                                                 bondingCurve?.reserveRatio,
//                                                 new BigNumber(price).times(1e18).toString()
//                                             )).div(1e18).toString()} ETH`}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <button
//                                     type='submit'
//                                     className="inline-flex mt-3 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#b0dc73] hover:text-black"
//                                 >
//                                     Place Trade
//                                 </button>
//                             </form>
//                         </TabPanel>
//                     </Tabs>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TradeComponent;