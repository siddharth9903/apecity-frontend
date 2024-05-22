import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowDown, FaCircleArrowLeft } from 'react-icons/fa6';
import { Collapse } from 'react-collapse';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import { useTransaction, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useSnackbar } from 'notistack';
import { abi as apeFactoryABI, deployedContractAddress as apeFactoryContractAddress } from '../contracts/ApeFactory';
import { formatNumber } from '../utils/formats';
import { calculatePurchaseReturn, estimateEthInForExactTokensOut, initialConstants } from '../utils/apeFormula';
import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';
import InputField from '../sections/token/InputField';
import QuickSelect from '../sections/token/QuickSelect';
import ipfsClient from '../ipfs/client';
import { ethers } from 'ethers';
import { parseEventLogs } from 'viem';
import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from '../ipfs/pinataClient';

const pinataApiKey = PINATA_API_KEY
const pinataSecretApiKey = PINATA_SECRET_API_KEY


const Create = () => {
    const [open1, setOpen1] = useState(false);
    const [open, setOpen] = useState(false);
    const onOpenBuyModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [ethTrade, setEthTrade] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (ethTrade) {
            setValue('buyAmountEth', estimateEthIn)
        } else {
            setValue('buyAmountToken', purchaseReturn)
        }
    }, [ethTrade])

    const handleSwitchCurrency = () => {
        setEthTrade(!ethTrade);
    };

    const CreateCoinSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        symbol: Yup.string().required('Ticker is required'),
        image: Yup.mixed().required('Logo is required'),
        description: Yup.string().required('Description is required'),
        twitter: Yup.string(),
        telegram: Yup.string(),
        website: Yup.string(),
        buyAmountEth: Yup.string().matches(/^\d*\.?\d*$/, 'Must be a valid number').test('positive', 'Must be greater than or equal to 0', value => parseFloat(value) >= 0),
        buyAmountToken: Yup.string().matches(/^\d*\.?\d*$/, 'Must be a valid number').test('positive', 'Must be greater than or equal to 0', value => parseFloat(value) >= 0),

    });

    const { register, handleSubmit, watch, getValues, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(CreateCoinSchema),
        defaultValues: {
            buyAmountEth: '0',
            buyAmountToken: '0'
        },
    });

    const buyAmountEth = watch('buyAmountEth');
    const buyAmountToken = watch('buyAmountToken');
    const tokenSymbol = watch('symbol');

    const purchaseReturn = useMemo(() => {
        return new BigNumber(calculatePurchaseReturn(initialConstants.circulatingSupply, initialConstants.poolBalance, initialConstants.reserveRatio, buyAmountEth || '0')).toString();
    }, [buyAmountEth]);

    const estimateEthIn = useMemo(() => {
        return new BigNumber(estimateEthInForExactTokensOut(initialConstants.circulatingSupply, initialConstants.poolBalance, initialConstants.reserveRatio, buyAmountToken || '0')).toString();
    }, [buyAmountToken]);


    const {
        data: hash,
        error,
        isPending,
        writeContract,
        writeContractAsync
    } = useWriteContract()

    // const hash1 = "0x27fc20affe6d667d52408ac11991ea962f328a25d9ed5d3d39b70d1026be8b1e"
    const { data: receiptData, isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash: hash,
        })

    // console.log('tx receipt data: ', receiptData);

    // // // parseEventLogs(receiptData.logs)
    // const eventLogs = parseEventLogs({
    //     abi: apeFactoryABI,
    //     eventName: 'TokenCreated',
    //     logs: receiptData?.logs,
    // })

    // console.log('ssslogs', eventLogs)


    // // const factoryInterface = new ethers.Interface(apeFactoryABI);
    // // const decodedLogs = data.logs.map((log) => factoryInterface.parseLog(log));

    // // console.log('sssDecodedLogs', decodedLogs)
    // // const tokenCreatedEvent = decodedLogs.find(
    // //     (event) => event.name === 'TokenCreated'
    // // );
    // // const tokenAddress = tokenCreatedEvent.args.token;

    // // console.log('newest created token address', tokenAddress)
    // // const transactionDetails = useTransaction({
    // //     hash,
    // // })

    // console.log('transactionDetails',transactionDetails);

    useEffect(() => {
        if (isConfirmed) {
            enqueueSnackbar('Transaction successful of Token creation', { variant: 'success' });
            const eventLogs = parseEventLogs({
                abi: apeFactoryABI,
                eventName: 'TokenCreated',
                logs: receiptData?.logs,
            })
            console.log('eventLogs', eventLogs)
            if (eventLogs?.length > 0) {
                let tokenAddress = eventLogs[0]?.args?.token
                console.log('tokenAddress', tokenAddress.toLowerCase())
                setIsLoading(true);

                setTimeout(() => {
                    setIsLoading(false);
                    navigate(`/token/${tokenAddress.toLowerCase()}`);
                }, 10000);
                // navigate(`/token/${tokenAddress.toLowerCase()}?wait=10`)
            }

        } else if (error) {
            // enqueueSnackbar('Error executing transaction: ' + error.message, { variant: 'error' });
            console.log('error', error)
            enqueueSnackbar('Error executing token creation transaction: ' + error.details, { variant: 'error' });
        }
    }, [isConfirmed, error, enqueueSnackbar]);

    // const executeTokenCreation = async () => {
    //     try {

    //         onCloseModal();
    //         const values = getValues()

    //         // Upload image to IPFS
    //         const imageFile = values.image[0];

    //         const imageFormData = new FormData();
    //         imageFormData.append('file', imageFile);

    //         const imageUploadResponse = await axios.post(
    //             'https://api.pinata.cloud/pinning/pinFileToIPFS',
    //             imageFormData,
    //             {
    //                 headers: {
    //                     'Content-Type': `multipart/form-data; boundary=${imageFormData._boundary}`,
    //                     pinata_api_key: pinataApiKey,
    //                     pinata_secret_api_key: pinataSecretApiKey,
    //                 },
    //             }
    //         );

    //         const imgIpfsHash = imageUploadResponse.data.IpfsHash
    //         const imageURI = `https://ipfs.io/ipfs/${imgIpfsHash}`;
    //         console.log('imageURI', imageURI)
    //         // await ipfsClient.pin.add(imgIpfsHash);
    //         // console.log('also added to local ipfs')

    //         // Create metadata with the image URI
    //         const metadata = {
    //             name: values.name,
    //             description: values.description,
    //             symbol: values.symbol,
    //             image: imageURI,
    //             twitter: values.twitter,
    //             telegram: values.telegram,
    //             website: values.website,
    //         };

    //         console.log('metadata', metadata)

    //         const metadataUploadResponse = await axios.post(
    //             'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    //             metadata,
    //             {
    //                 headers: {
    //                     pinata_api_key: pinataApiKey,
    //                     pinata_secret_api_key: pinataSecretApiKey,
    //                 },
    //             }
    //         );

    //         const metaDataIpfsHash = metadataUploadResponse.data.IpfsHash
    //         const metadataURI = `https://ipfs.io/ipfs/${metaDataIpfsHash}`;
    //         console.log('metadataURI', metadataURI)
    //         // await ipfsClient.pin.add(metaDataIpfsHash);

    //         const tokenURI = metadataURI

    //         const args = [values.name, values.symbol, tokenURI]

    //         let value = 0;
    //         if (ethTrade) {
    //             value = values?.buyAmountEth;
    //         } else {
    //             const estimateEthIn = new BigNumber(
    //                 estimateEthInForExactTokensOut(
    //                     initialConstants.circulatingSupply,
    //                     initialConstants.poolBalance,
    //                     initialConstants.reserveRatio,
    //                     values?.buyAmountToken || '0'
    //                 )
    //             ).toString();
    //             value = estimateEthIn;
    //         }

    //         const inputAmount = new Decimal(value).mul(new Decimal(10).pow(18));
    //         const adjustedInputAmount = inputAmount.mul(1.01);

    //         await writeContractAsync({
    //             abi: apeFactoryABI,
    //             address: apeFactoryContractAddress,
    //             functionName: 'createToken',
    //             args: args,
    //             value: adjustedInputAmount.toFixed(),
    //         });

    //         return
    //     } catch (error) {
    //         console.error('Error executing transaction:', error);
    //     }
    // };


    const executeTokenCreation = async () => {
        try {

            onCloseModal();
            const values = getValues()

            // Upload image to IPFS
            const imageFile = values.image[0];
            const imageAdded = await ipfsClient.add(imageFile);
            const imageURI = `https://ipfs.io/ipfs/${imageAdded.path}`;

            await ipfsClient.pin.add(imageAdded.path);

            // Create metadata with the image URI
            const metadata = {
                name: values.name,
                description: values.description,
                symbol: values.symbol,
                image: imageURI,
                twitter: values.twitter,
                telegram: values.telegram,
                website: values.website,
            };

            // Upload metadata to IPFS
            const metadataAdded = await ipfsClient.add(JSON.stringify(metadata));
            const tokenURI = `https://ipfs.io/ipfs/${metadataAdded.path}`;

            // Pin the metadata
            await ipfsClient.pin.add(metadataAdded.path);

            console.log('imageURI', imageURI)
            console.log('tokenURI', tokenURI)

            // return
            const args = [values.name, values.symbol, tokenURI]


            let value = 0;
            if (ethTrade) {
                value = values?.buyAmountEth;
            } else {
                const estimateEthIn = new BigNumber(
                    estimateEthInForExactTokensOut(
                        initialConstants.circulatingSupply,
                        initialConstants.poolBalance,
                        initialConstants.reserveRatio,
                        values?.buyAmountToken || '0'
                    )
                ).toString();
                value = estimateEthIn;
            }

            const inputAmount = new Decimal(value).mul(new Decimal(10).pow(18));
            const adjustedInputAmount = inputAmount.mul(1.01);

            await writeContractAsync({
                abi: apeFactoryABI,
                address: apeFactoryContractAddress,
                functionName: 'createToken',
                args: args,
                value: adjustedInputAmount.toFixed(),
            });

            return
        } catch (error) {
            console.error('Error executing transaction:', error);
        }
    };
    
    console.log('errors', errors)

    if (isConfirming || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container-fluid create-coin min-h-screen bg-fixed bg-center bg-no-repeat bg-cover pt-[70px]'>
            <div className="bs-container relative">
                <div className='absolute z-[11]  sm:pt-10 left-2 sm:left-0 top-0'>
                    <button onClick={() => navigate('/')} className='pl-2 max-sm:gap-x-2 flex items-center bg-transparent'>
                        <FaCircleArrowLeft className='text-white text-2xl' />
                        <span className='text-white sm:hidden pfont-500'>Go back</span>
                    </button>
                </div>
                <div className="row py-10 justify-center">
                    <div className="col-xxl-4 col-lg-5 col-md-7 col-sm-9 col-11 bg-black border-[2px] border-[#27272a]  rounded-md p-7">
                        <div>
                            {/* <form onSubmit={handleSubmit((values) => onSubmit(values))}> */}
                            <form onSubmit={handleSubmit((values) => onOpenBuyModal())}>
                                <div className='flex flex-col gap-y-4'>
                                    <div>
                                        <label className='roboto-400 tracking-[0.5px] text-white'>Name :</label>
                                        <input
                                            className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none'
                                            type="text"
                                            {...register('name')}
                                        />
                                        {errors.name && <span className='text-red-500'>{errors.name.message}</span>}
                                    </div>
                                    <div>
                                        <label className='roboto-400 tracking-[0.5px] text-white'>Ticker :</label>
                                        <input
                                            className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none'
                                            type="text"
                                            {...register('symbol')}
                                        />
                                        {errors.symbol && <span className='text-red-500'>{errors.symbol.message}</span>}
                                    </div>
                                    <div>
                                        <label className='roboto-400 tracking-[0.5px] text-white'>Logo :</label>
                                        <div className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-3 px-3 outline-none focus:outline-none'>
                                            <input type="file" {...register('image')} />
                                        </div>
                                        {errors.image && <span className='text-red-500'>{errors.image.message}</span>}
                                    </div>
                                    <div>
                                        <label className='roboto-400 tracking-[0.5px] text-white'>Description :</label>
                                        <textarea
                                            rows={4}
                                            className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none'
                                            type="text"
                                            {...register('description')}
                                        />
                                        {errors.description && <span className='text-red-500'>{errors.description.message}</span>}
                                    </div>
                                    <div>
                                        <div onClick={() => setOpen1(!open1)} className='flex gap-x-1.5 items-center  cursor-pointer'>
                                            <span className='roboto-400 tracking-[0.5px] text-white'>Show more options</span>
                                            <FaArrowDown className={`text-white ${open1 ? 'rotate-180' : 'rotate-0'}`} />
                                        </div>
                                        <Collapse isOpened={open1}>
                                            <div className='flex gap-y-3 flex-col pt-3 pb-2'>
                                                <div>
                                                    <label className='roboto-400 tracking-[0.5px] text-white'>Twitter :</label>
                                                    <input
                                                        className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none'
                                                        type="text"
                                                        {...register('twitter')}
                                                    />
                                                </div>
                                                <div>
                                                    <label className='roboto-400 tracking-[0.5px] text-white'>Telegram :</label>
                                                    <input
                                                        className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50] bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none'
                                                        type="text"
                                                        {...register('telegram')}
                                                    />
                                                </div>
                                                <div>
                                                    <label className='roboto-400 tracking-[0.5px] text-white'>Website :</label>
                                                    <input
                                                        className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none'
                                                        type="text"
                                                        {...register('website')}
                                                    />
                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>

                                    <div>
                                        <button
                                            type='submit'
                                            className="bg-gradient-to-br from-zinc-900 to-zinc-900   dark:bg-zinc-800  transition-all duration-300  hover:scale-105 text-center border-none w-full text-white flex justify-center items-center tracking-[1px] roboto-500 gap-x-2 px-4 py-2.5 rounded-md"
                                        >
                                            Create Coin
                                        </button>
                                        <p className='text-white mt-3.5 roboto-400'>Cost to deploy: ~0.02 ETH</p>
                                    </div>
                                </div>
                            </form>

                            <Modal
                                styles={{ padding: 0 }}
                                open={open}
                                showCloseIcon={false}
                                blockScroll={false}
                                onClose={onCloseModal}
                                center
                            >
                                {/* <form onSubmit={handleSubmit(values => onSubmit(values))}> */}
                                <div className='sm:w-[470px] border px-5 py-5 sm:py-6 sm:px-6 border-white rounded-xl flex gap-y-3 flex-col bg-[#1b1d28]'>
                                    <div className='w-full   flex justify-center items-center'>
                                        <div className="text-center">
                                            <h3 className="text-center tracking-[0.5px] roboto-400 text-white text-[17px]">Choose how many {tokenSymbol} you want to buy </h3>
                                            <p className='text-center tracking-[0.5px] mt-1 roboto-400 text-white text-[17px]'>(optional)</p>
                                            <p className='text-center tracking-[0.5px] mt-3.5 mb-3 pfont-400 text-white text-sm'>Tip: its optional but buying a small amount of coins helps protect your coin from snipers</p>
                                        </div>
                                    </div>
                                    <div className="flex mb-2 justify-end w-full gap-2">
                                        <button
                                            className="text-xs py-1 pfont-400 px-2  rounded bg-gray-800 text-gray-300"
                                            type="button"
                                            onClick={handleSwitchCurrency}
                                        >
                                            Switch to {ethTrade ? tokenSymbol : 'ETH'}
                                        </button>
                                    </div>
                                    <div>
                                        {ethTrade ?
                                            (
                                                <>
                                                    <div className="flex items-center rounded-md relative">
                                                        <input
                                                            className="flex h-11 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                                            type="number"
                                                            placeholder="0.0"
                                                            step="0.00000000000001"
                                                            {...register('buyAmountEth')}
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
                                                    <p className='text-center tracking-[0.5px] mt-3.5 mb-3 pfont-400 text-white text-sm'>
                                                        {
                                                            errors?.buyAmountToken ?
                                                                (
                                                                    <div className='mt-1'>
                                                                        {`${errors?.buyAmountToken?.message}`}
                                                                    </div>
                                                                ) :
                                                                (
                                                                    <div className='mt-1'>
                                                                        {`You will receive ${purchaseReturn} (~${formatNumber(purchaseReturn)}) ${tokenSymbol}`}
                                                                    </div>
                                                                )}
                                                    </p>
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <div className="flex items-center rounded-md relative">
                                                        <input
                                                            className="flex h-11 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                                            type="number"
                                                            placeholder="0.0"
                                                            step="0.00000000000001"
                                                            {...register('buyAmountToken')}
                                                        />
                                                        <div className="flex items-center ml-2 absolute right-2">
                                                            <span className="text-white pfont-400 mr-2">{tokenSymbol}</span>
                                                        </div>
                                                    </div>
                                                    {
                                                        <p className='text-center tracking-[0.5px] mt-3.5 mb-3 pfont-400 text-white text-sm'>
                                                            {
                                                                errors?.buyAmountEth ?
                                                                    (
                                                                        <div className='mt-1'>
                                                                            {`${errors?.buyAmountToken?.message}`}
                                                                        </div>
                                                                    ) :
                                                                    (
                                                                        <div className='mt-1'>
                                                                            {`It will cost ${estimateEthIn} (~${formatNumber(estimateEthIn)}) ETH`}
                                                                        </div>
                                                                    )}
                                                        </p>
                                                    }
                                                </>
                                            )
                                        }

                                    </div>
                                    <div className="flex mt-2 justify-center">
                                        <button
                                            onClick={executeTokenCreation}
                                            // type="submit"
                                            className="bg-[#475dc0] transition-all duration-300 hover:bg-blue-500 hover:scale-105 border-none text-white flex items-center tracking-[1px] roboto-500 gap-x-2 w-full text-center justify-center py-2.5 rounded-md"
                                        >
                                            Create Coin
                                        </button>
                                    </div>
                                    <p className='text-white mt-2 text-center pfont-400'>Cost to deploy: ~$1</p>
                                </div>
                                {/* </form> */}

                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;