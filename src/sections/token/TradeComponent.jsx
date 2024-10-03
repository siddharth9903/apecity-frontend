import Decimal from 'decimal.js';
import { useState, useMemo, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BigNumber from 'bignumber.js';
import { uniswapFormula } from '../../utils/uniswapHelper';
import 'react-responsive-modal/styles.css';
import { formatNumber } from '../../utils/formats';
import { useAccount, useBalance, useReadContract, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import QuickSelect from './QuickSelect';
import InputField from './InputField';
import { useSnackbar } from 'notistack';
import { getContractAbi } from '../../config/abis';
import { CONTRACT, CURVE_TYPE } from '../../constants';
import { apeFormula } from '../../utils/apeFormula';

const TradeType = Object.freeze({
    BUY: 0,
    SELL: 1
});

const TradeComponent = ({ token, bondingCurve, nativeCurrency, chainId }) => {
    const { enqueueSnackbar } = useSnackbar();
    const curveType = token?.curveType;

    const [tabIndex, setTabIndex] = useState(TradeType.BUY);
    const [ethTrade, setEthTrade] = useState(true);

    const [open1, setOpen1] = useState(false);
    const onOpenModal1 = () => setOpen1(true);
    const onCloseModal1 = () => setOpen1(false);
    const [open2, setOpen2] = useState(false);
    const onOpenModal2 = () => setOpen2(true);
    const onCloseModal2 = () => setOpen2(false);
    const [userTokenBalance, setUserTokenBalance] = useState(0)
    const { address: userAddress } = useAccount();

    const ethReserve = useMemo(() => {
        return bondingCurve?.ethReserve || '0';
    }, [bondingCurve]);

    const tokenReserve = useMemo(() => {
        return bondingCurve?.tokenReserve || '0';
    }, [bondingCurve]);

    const supply = useMemo(() => {
        return bondingCurve?.circulatingSupply || '0';
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
        const ethInWei = buyAmountEth || '0';
        if (curveType == CURVE_TYPE.UNISWAP) {
            return uniswapFormula.calculatePurchaseReturn(ethInWei, ethReserve, tokenReserve);
        } else if (curveType == CURVE_TYPE.APE) {
            return new BigNumber(
                apeFormula.calculatePurchaseReturn(supply, ethReserve, connectorWeight, ethInWei)
            ).toString();
        } else {
            return '0'
        }
    }, [supply, connectorWeight, buyAmountEth, ethReserve, tokenReserve]);

    const saleReturn = useMemo(() => {
        const tokensInWei = sellAmountToken || '0';
        if (curveType == CURVE_TYPE.UNISWAP) {
            return uniswapFormula.calculateSaleReturn(tokensInWei, ethReserve, tokenReserve);
        } else if (curveType == CURVE_TYPE.APE) {
            return new BigNumber(
                apeFormula.calculateSaleReturn(supply, ethReserve, connectorWeight, tokensInWei)
            ).toString();
        } else {
            return '0'
        }
    }, [supply, connectorWeight, sellAmountToken, ethReserve, tokenReserve]);

    const estimateEthIn = useMemo(() => {
        const tokensOutWei = buyAmountToken || '0';
        if (curveType == CURVE_TYPE.UNISWAP) {
            return uniswapFormula.estimateEthInForExactTokensOut(tokensOutWei, ethReserve, tokenReserve);
        } else if (curveType == CURVE_TYPE.APE) {
            return new BigNumber(
                apeFormula.estimateEthInForExactTokensOut(supply, ethReserve, connectorWeight, tokensOutWei)
            ).toString();
        } else {
            return '0'
        }
    }, [supply, connectorWeight, buyAmountToken, ethReserve, tokenReserve]);

    const estimateTokenIn = useMemo(() => {
        const ethOutWei = sellAmountEth || '0';
        if (curveType == CURVE_TYPE.UNISWAP) {
            return uniswapFormula.estimateTokenInForExactEthOut(ethOutWei, ethReserve, tokenReserve);
        } else if (curveType == CURVE_TYPE.APE) {
            return new BigNumber(
                apeFormula.estimateTokenInForExactEthOut(supply, ethReserve, connectorWeight, ethOutWei)
            ).toString();
        } else {
            return '0'
        }
    }, [supply, connectorWeight, sellAmountEth, ethReserve, tokenReserve]);

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
            console.log('error', error)
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
                    let estimateEthIn;
                    let tokensOutWei = values?.buyAmountToken || '0'
                    if (curveType == CURVE_TYPE.UNISWAP) {
                        estimateEthIn = new BigNumber(
                            uniswapFormula.estimateEthInForExactTokensOut(tokensOutWei, ethReserve, tokenReserve)
                        ).toString();
                    } else if (curveType == CURVE_TYPE.APE) {
                        estimateEthIn = new BigNumber(
                            apeFormula.estimateEthInForExactTokensOut(supply, ethReserve, connectorWeight, tokensOutWei)
                        ).toString()
                    } else {
                        estimateEthIn = '0';
                    }

                    value = estimateEthIn
                }
            } else {
                if (ethTrade) {
                    let estimateTokenIn;
                    const ethOutWei = sellAmountEth || '0';
                    if (curveType == CURVE_TYPE.UNISWAP) {
                        estimateTokenIn = new BigNumber(
                            uniswapFormula.estimateTokenInForExactEthOut(ethOutWei, ethReserve, tokenReserve)
                        ).toString();
                    } else if (curveType == CURVE_TYPE.APE) {
                        estimateTokenIn = new BigNumber(
                            apeFormula.estimateTokenInForExactEthOut(supply, ethReserve, connectorWeight, ethOutWei)
                        ).toString();
                    } else {
                        estimateTokenIn = '0'
                    }

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
                    abi: getContractAbi(CONTRACT.ERC20, curveType),
                    address: token.address,
                    functionName: "approve",
                    args: [bondingCurve.address, adjustedInputAmount.toFixed()],
                    value: valueToSend
                })
            }

            writeContract({
                abi: getContractAbi(CONTRACT.BONDING_CURVE, curveType),
                address: bondingCurve.address,
                functionName: functionName,
                args: args,
                value: valueToSend
            })

        } catch (error) {
            console.error('Error executing transaction:', error);
        }
    };

    const onSubmitFillRemaining = async () => {
        try {
            const value = bondingCurve?.ethAmountToCompleteCurve
            const inputAmount = new Decimal(value).mul(new Decimal(10).pow(18));
            const adjustedInputAmount = inputAmount.mul(1.01);
            const valueToSend = adjustedInputAmount.toFixed(0);

            await writeContractAsync({
                abi: getContractAbi(CONTRACT.BONDING_CURVE, curveType),
                address: bondingCurve.address,
                functionName: 'buy',
                args: [],
                value: valueToSend,
            });
        } catch (error) {
            console.error('Error executing transaction:', error);
        }
    };

    const onSubmitSellPortfolio = async () => {
        try {
            const inputAmount = new Decimal(decimalUserTokenBalance).mul(new Decimal(10).pow(18));
            const adjustedInputAmount = inputAmount;

            await writeContractAsync({
                abi: getContractAbi(CONTRACT.ERC20, curveType),
                address: token.address,
                functionName: 'approve',
                args: [bondingCurve.address, adjustedInputAmount.toFixed()],
                value: '0',
            });

            await writeContractAsync({
                abi: getContractAbi(CONTRACT.BONDING_CURVE, curveType),
                address: bondingCurve.address,
                functionName: 'sell',
                args: [adjustedInputAmount.toFixed()],
                value: '0',
            });
        } catch (error) {
            console.error('Error executing transaction:', error);
        }
    };

    const { data: userTokenBalanceData, isLoading: isTokenBalanceLoading, isError: isError2, refetch } = useReadContract({
        abi: getContractAbi(CONTRACT.ERC20, curveType),
        address: token?.address,
        functionName: 'balanceOf',
        args: [userAddress],
        watch: true,
    })

    useEffect(() => {
        setUserTokenBalance(userTokenBalanceData)
    }, [userTokenBalanceData])

    useEffect(() => {
        refetch()
    }, [isConfirmed, refetch])

    const decimalUserTokenBalance = useMemo(() => {
        return userTokenBalance ? formatEther(userTokenBalance) : 0
    }, [userTokenBalance]);

    const formattedUserTokenBalance = useMemo(() => {
        return formatNumber(decimalUserTokenBalance)
    }, [decimalUserTokenBalance]);

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
                                <Tab className={`p-2 cursor-pointer text-center pfont-500 rounded ${tabIndex == TradeType.SELL ? 'bg-[#FF5252] text-white' : 'bg-gray-800 text-grey-600'}`}>
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
                                            Switch to {nativeCurrency.symbol}
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
                                                nativeCurrency={nativeCurrency}
                                                isToken={false}
                                            />
                                            <QuickSelect
                                                setValue={setValue}
                                                name="buyAmountEth"
                                                isToken={false}
                                                nativeCurrency={nativeCurrency}
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
                                                tokenImage={token?.metadata?.image}
                                            />
                                            <QuickSelect
                                                setValue={setValue}
                                                name="buyAmountToken"
                                                isToken={true}
                                                nativeCurrency={nativeCurrency}
                                                tokenAmountsOptions={[
                                                    {
                                                        key: '25M',
                                                        value: '25000000'
                                                    },
                                                    {
                                                        key: '50M',
                                                        value: '50000000'
                                                    },
                                                    {
                                                        key: '75M',
                                                        value: '75000000'
                                                    },
                                                    {
                                                        key: '100M',
                                                        value: '100000000'
                                                    },
                                                ]}
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
                                                            {`It will cost ${estimateEthIn} (~${formatNumber(estimateEthIn)}) ${nativeCurrency.symbol}`}
                                                        </div>
                                                    )
                                            }
                                        </>
                                    )}
                                </div>
                                <button
                                    type='submit'
                                    className="inline-flex mt-2 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#48bb78] hover:text-black"
                                >
                                    Place Trade
                                </button>
                                <button
                                    type='button'
                                    onClick={onSubmitFillRemaining}
                                    className="inline-flex mt-3 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#48bb78] hover:text-black"
                                >
                                    Ape remaining curve
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
                                            Switch to {nativeCurrency.symbol}
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
                                                chainId={chainId}
                                                name="sellAmountEth"
                                                nativeCurrency={nativeCurrency}
                                                isToken={false}
                                            />
                                            <QuickSelect
                                                setValue={setValue}
                                                name="sellAmountEth"
                                                isToken={false}
                                                nativeCurrency={nativeCurrency}
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
                                                chainId={chainId}
                                                name="sellAmountToken"
                                                tokenSymbol={token?.symbol}
                                                isToken={true}
                                                tokenImage={token?.metadata?.image}
                                            />
                                            <QuickSelect
                                                setValue={setValue}
                                                name="sellAmountToken"
                                                isToken={true}
                                                nativeCurrency={nativeCurrency}
                                                tokenAmountsOptions={[
                                                    {
                                                        key: '25%',
                                                        value: 0.25 * decimalUserTokenBalance
                                                    },
                                                    {
                                                        key: '50%',
                                                        value: 0.5 * decimalUserTokenBalance
                                                    },
                                                    {
                                                        key: '75%',
                                                        value: 0.75 * decimalUserTokenBalance
                                                    },
                                                    {
                                                        key: '100%',
                                                        value: decimalUserTokenBalance
                                                    }
                                                ]}
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
                                                            {`You are about to receive ${saleReturn} (~${formatNumber(saleReturn)}) ${nativeCurrency.symbol}`}
                                                        </div>
                                                    )
                                            }

                                        </>
                                    )}
                                </div>
                                <div className="flex mt-3 flex-col">
                                    <button
                                        type='submit'
                                        className="inline-flex mt-3 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#48bb78] hover:text-black"
                                    >
                                        Place Trade
                                    </button>
                                    <button
                                        type='button'
                                        onClick={onSubmitSellPortfolio}
                                        className="inline-flex mt-3 pfont-400 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 bg-[#48bb78] pfont-500 text-white w-full py-3 rounded-md hover:bg-[#48bb78] hover:text-black"
                                    >
                                        Eject
                                    </button>
                                </div>
                            </form>

                        </TabPanel>

                        {/* your balance: {new BigNumber(userTokenBalance).div(new BigNumber(10 ** 18)).toFixed(18).toString()} */}
                        Your balance: {decimalUserTokenBalance} (~{formattedUserTokenBalance})
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default TradeComponent;