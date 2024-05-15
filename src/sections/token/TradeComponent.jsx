import Decimal from 'decimal.js';
import { useState, useMemo, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BigNumber from 'bignumber.js';
import { Modal } from 'react-responsive-modal';
import { calculatePurchaseReturn, calculateSaleReturn, estimateEthInForExactTokensOut, estimateTokenInForExactEthOut } from '../../utils/apeFormula';
import 'react-responsive-modal/styles.css';
import { formatNumber } from '../../utils/formats';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { abi as bondingCurveABI } from '../../contracts/BondingCurve';
import { parseEther } from 'viem';
import { abi as erc20ABI } from '../../contracts/ERC20';
import QuickSelect from './QuickSelect';
import InputField from './InputField';
import { useSnackbar } from 'notistack';
import { CgLayoutGrid } from 'react-icons/cg';

const TradeType = Object.freeze({
    BUY: 0,
    SELL: 1
});

const TradeComponent = ({ token, bondingCurve }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [tabIndex, setTabIndex] = useState(TradeType.BUY);
    const [ethTrade, setEthTrade] = useState(true);

    const [open1, setOpen1] = useState(false);
    const onOpenModal1 = () => setOpen1(true);
    const onCloseModal1 = () => setOpen1(false);
    const [open2, setOpen2] = useState(false);
    const onOpenModal2 = () => setOpen2(true);
    const onCloseModal2 = () => setOpen2(false);

    const supply = useMemo(() => {
        return bondingCurve?.circulatingSupply || '0';
    }, [bondingCurve]);

    const connectorBalance = useMemo(() => {
        return bondingCurve?.poolBalance || '0';
    }, [bondingCurve]);

    const connectorWeight = useMemo(() => {
        return bondingCurve?.reserveRatio || '0';
    }, [bondingCurve]);

    const TradeSchema = Yup.object().shape({
        buyAmountEth: Yup.string().matches(/^\d*\.?\d*$/, 'Must be a valid number').test('positive', 'Must be greater than or equal to 0', value => parseFloat(value) >= 0),
        buyAmountToken: Yup.string().matches(/^\d*\.?\d*$/, 'Must be a valid number').test('positive', 'Must be greater than or equal to 0', value => parseFloat(value) >= 0),
        sellAmountEth: Yup.string().matches(/^\d*\.?\d*$/, 'Must be a valid number').test('positive', 'Must be greater than or equal to 0', value => parseFloat(value) >= 0),
        sellAmountToken: Yup.string().matches(/^\d*\.?\d*$/, 'Must be a valid number').test('positive', 'Must be greater than or equal to 0', value => parseFloat(value) >= 0),
    });

    const { register, control, setValue, handleSubmit, watch, formState: { errors: formErrors } } = useForm({
        resolver: yupResolver(TradeSchema),
        defaultValues: {
            buyAmountEth: '0',
            buyAmountToken: '0',
            sellAmountEth: '0',
            sellAmountToken: '0'
        },
    });

    const buyAmountEth = watch('buyAmountEth');
    const buyAmountToken = watch('buyAmountToken');
    const sellAmountEth = watch('sellAmountEth');
    const sellAmountToken = watch('sellAmountToken');

    const purchaseReturn = useMemo(() => {
        return new BigNumber(calculatePurchaseReturn(supply, connectorBalance, connectorWeight, buyAmountEth || '0')).toString();
    }, [supply, connectorBalance, connectorWeight, buyAmountEth]);

    const saleReturn = useMemo(() => {
        return new BigNumber(calculateSaleReturn(supply, connectorBalance, connectorWeight, sellAmountToken || '0')).toString();
    }, [supply, connectorBalance, connectorWeight, sellAmountToken]);

    const estimateEthIn = useMemo(() => {
        return new BigNumber(estimateEthInForExactTokensOut(supply, connectorBalance, connectorWeight, buyAmountToken || '0')).toString();
    }, [supply, connectorBalance, connectorWeight, buyAmountToken]);

    const estimateTokenIn = useMemo(() => {
        return new BigNumber(estimateTokenInForExactEthOut(supply, connectorBalance, connectorWeight, sellAmountEth || '0')).toString();
    }, [supply, connectorBalance, connectorWeight, sellAmountEth]);

    const { address } = useAccount();

    const {
        data: hash,
        error,
        isPending,
        writeContract,
        writeContractAsync
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    useEffect(() => {
        if (isConfirmed) {
            enqueueSnackbar('Transaction successful', { variant: 'success' });
        } else if (error) {
            // enqueueSnackbar('Error executing transaction: ' + error.message, { variant: 'error' });
            enqueueSnackbar('Error executing transaction: ' + error.details, { variant: 'error' });
        }
    }, [isConfirmed, error, enqueueSnackbar]);

    useEffect(() => {
        if (ethTrade) {
            setValue('buyAmountEth', estimateEthIn)
            setValue('sellAmountEth', saleReturn)
        } else {
            setValue('buyAmountToken', purchaseReturn)
            setValue('sellAmountToken', estimateTokenIn)
        }
    }, [ethTrade])

    const onSubmit = async (values) => {
        try {
            let value = 0
            if (tabIndex === TradeType.BUY) {
                if (ethTrade) {
                    value = values?.buyAmountEth
                } else {
                    const estimateEthIn = new BigNumber(estimateEthInForExactTokensOut(supply, connectorBalance, connectorWeight, values?.buyAmountToken || '0')).toString();
                    value = estimateEthIn
                }
            } else {
                value = values?.sellAmountToken
                if (ethTrade) {
                    const estimateTokenIn = new BigNumber(estimateTokenInForExactEthOut(supply, connectorBalance, connectorWeight, values?.sellAmountEth || '0')).toString();
                    value = estimateTokenIn
                } else {
                    value = values?.sellAmountToken
                }
            }

            const inputAmount = new Decimal(value).mul(new Decimal(10).pow(18));
            const adjustedInputAmount = tabIndex === TradeType.BUY ? inputAmount.mul(1.01) : inputAmount;

            const functionName = tabIndex === TradeType.BUY ? 'buy' : 'sell';

            const args = tabIndex === TradeType.BUY ? [] : [adjustedInputAmount.toFixed()];
            const valueToSend = tabIndex === TradeType.BUY ? adjustedInputAmount.toFixed() : '0';

            if (tabIndex === TradeType.SELL) {
                await writeContractAsync({
                    abi: erc20ABI,
                    address: token.id,
                    functionName: "approve",
                    args: [bondingCurve.id, adjustedInputAmount.toFixed()],
                    value: valueToSend
                })
            }

            writeContract({
                abi: bondingCurveABI,
                address: bondingCurve.id,
                functionName: functionName,
                args: args,
                value: valueToSend
            })

        } catch (error) {
            console.error('Error executing transaction:', error);
        }
    };


    return (
        <div className='mt-3'>
            <div className="grid gap-x-4 gap-y-2">
                <div className="border border-[#343439] px-4 py-3 rounded-lg text-gray-400 grid gap-4">
                    <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                        <TabList>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <Tab className={`p-2 cursor-pointer text-center pfont-500 rounded ${tabIndex == TradeType.BUY ? 'bg-[#48bb78] text-white' : 'bg-gray-800 text-grey-600'}`}>
                                    Buy
                                </Tab>
                                <Tab className={`p-2 cursor-pointer text-center pfont-500 rounded ${tabIndex == TradeType.SELL ? 'bg-red-400 text-white' : 'bg-gray-800 text-grey-600'}`}>
                                    Sell
                                </Tab>
                            </div>
                        </TabList>
                        <TabPanel>
                            <form onSubmit={handleSubmit(values => onSubmit(values))}>
                                <div className="flex justify-between w-full gap-2">
                                    {ethTrade ? (
                                        <button
                                            type='button'
                                            onClick={() => setEthTrade(false)}
                                            className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
                                        >
                                            Switch to {token?.symbol}
                                        </button>
                                    ) : (
                                        <button
                                            type='button'
                                            onClick={() => setEthTrade(true)}
                                            className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
                                        >
                                            Switch to ETH
                                        </button>
                                    )}
                                    {/* <button
                                        onClick={onOpenModal1}
                                        className="text-xs py-1 pfont-400 px-2 rounded bg-gray-800 text-gray-300"
                                        type="button"
                                    >
                                        Set max slippage
                                    </button> */}
                                </div>
                                <div className="flex mt-3 flex-col">
                                    {ethTrade ? (
                                        <>
                                            <InputField
                                                register={register}
                                                name="buyAmountEth"
                                                symbol="ETH"
                                                isToken={false}
                                            />
                                            <QuickSelect
                                                setValue={setValue}
                                                name="buyAmountEth"
                                                isToken={false}
                                            />
                                            {
                                                formErrors?.buyAmountEth ?
                                                    (
                                                        <div className='mt-1'>
                                                            {`${formErrors?.buyAmountEth?.message}`}
                                                        </div>
                                                    ) :
                                                    (
                                                        <div className='mt-1'>
                                                            {`You will receive ${purchaseReturn} (~${formatNumber(purchaseReturn)}) ${token?.symbol}`}
                                                        </div>
                                                    )
                                            }
                                        </>
                                    ) : (
                                        <>
                                            <InputField
                                                register={register}
                                                name="buyAmountToken"
                                                tokenSymbol={token?.symbol}
                                                isToken={true}
                                            />
                                            <QuickSelect
                                                setValue={setValue}
                                                name="buyAmountToken"
                                                isToken={true}
                                            />
                                            {
                                                formErrors?.buyAmountToken ?
                                                    (
                                                        <div className='mt-1'>
                                                            {`${formErrors?.buyAmountToken?.message}`}
                                                        </div>
                                                    ) :
                                                    (
                                                        <div className='mt-1'>
                                                            {`It will cost ${estimateEthIn} (~${formatNumber(estimateEthIn)}) ETH`}
                                                        </div>
                                                    )
                                            }
                                        </>
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
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex justify-between w-full gap-2">
                                    {ethTrade ? (
                                        <button
                                            type='button'
                                            onClick={() => setEthTrade(false)}
                                            className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
                                        >
                                            Switch to {token?.symbol}
                                        </button>
                                    ) : (
                                        <button
                                            type='button'
                                            onClick={() => setEthTrade(true)}
                                            className="text-xs py-1 px-2 pfont-400 rounded bg-gray-800 text-gray-300"
                                        >
                                            Switch to ETH
                                        </button>
                                    )}
                                    {/* <button
                                        onClick={onOpenModal2}
                                        className="text-xs py-1 pfont-400 px-2 rounded bg-gray-800 text-gray-300"
                                        type="button"
                                    >
                                        Set max slippage
                                    </button> */}
                                </div>
                                <div className="flex mt-3 flex-col">
                                    {ethTrade ? (
                                        <>
                                            <InputField
                                                register={register}
                                                name="sellAmountEth"
                                                symbol="ETH"
                                                isToken={false}
                                            />
                                            <QuickSelect
                                                setValue={setValue}
                                                name="sellAmountEth"
                                                isToken={false}
                                            />
                                            {
                                                formErrors?.sellAmountEth ?
                                                    (
                                                        <div className='mt-1'>
                                                            {`${formErrors?.sellAmountEth?.message}`}
                                                        </div>
                                                    ) :
                                                    (
                                                        <div className='mt-1'>
                                                            {`You will sell ${estimateTokenIn} (~${formatNumber(estimateTokenIn)}) ${token?.symbol}`}
                                                        </div>
                                                    )
                                            }

                                        </>
                                    ) : (
                                        <>
                                            <InputField
                                                register={register}
                                                name="sellAmountToken"
                                                tokenSymbol={token?.symbol}
                                                isToken={true}
                                            />
                                            <QuickSelect
                                                setValue={setValue}
                                                name="sellAmountToken"
                                                isToken={true}
                                            />
                                            {
                                                formErrors?.sellAmountToken ?
                                                    (
                                                        <div className='mt-1'>
                                                            {`${formErrors?.sellAmountToken?.message}`}
                                                        </div>
                                                    ) :
                                                    (
                                                        <div className='mt-1'>
                                                            {`You are about to receive ${saleReturn} (~${formatNumber(saleReturn)}) ETH`}
                                                        </div>
                                                    )
                                            }

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