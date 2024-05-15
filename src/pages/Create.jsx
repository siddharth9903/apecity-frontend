import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowDown, FaCircleArrowLeft } from 'react-icons/fa6';
import { Collapse } from 'react-collapse';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useSnackbar } from 'notistack';
import { abi as apeFactoryABI, deployedContractAddress as apeFactoryContractAddress } from '../contracts/ApeFactory';
import { create } from 'ipfs-http-client';

const Create = () => {
    const [open1, setOpen1] = useState(false);
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const CreateCoinSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        symbol: Yup.string().required('Ticker is required'),
        image: Yup.mixed().required('Logo is required'),
        description: Yup.string().required('Description is required'),
        twitter: Yup.string(),
        telegram: Yup.string(),
        website: Yup.string(),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(CreateCoinSchema),
    });

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
            enqueueSnackbar('Transaction successful of Token creation', { variant: 'success' });
        } else if (error) {
            // enqueueSnackbar('Error executing transaction: ' + error.message, { variant: 'error' });
            console.log('error',error)
            enqueueSnackbar('Error executing token creation transaction: ' + error.details, { variant: 'error' });
        }
    }, [isConfirmed, error, enqueueSnackbar]);

    // const onSubmit = async (values) => {
    //     try {
    //         const pinataApiKey = '2af4035e1b6e3eb66373';
    //         const pinataSecretApiKey = '87d2e5d485aef7a99cc1aaece489cd26752e76f5d1aedbe45c47c9258b8d16c8';

    //         // Upload image to IPFS
    //         const imageFile = values.image[0];
    //         const imageFormData = new FormData();
    //         imageFormData.append('file', imageFile);
    //         const imageResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', imageFormData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 pinata_api_key: pinataApiKey,
    //                 pinata_secret_api_key: pinataSecretApiKey,
    //             },
    //         });
    //         const imageHash = imageResponse.data.IpfsHash;
    //         const imageURI = `https://ipfs.io/ipfs/${imageHash}`;

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

    //         // Upload metadata to IPFS
    //         const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
    //             headers: {
    //                 pinata_api_key: pinataApiKey,
    //                 pinata_secret_api_key: pinataSecretApiKey,
    //             },
    //         });
    //         const metadataHash = metadataResponse.data.IpfsHash;
    //         const tokenURI = `https://ipfs.io/ipfs/${metadataHash}`;

    //         const args = [values.name, values.symbol, tokenURI]
    //         console.log('args', args)

    //         writeContract({
    //             abi: apeFactoryABI,
    //             address: apeFactoryContractAddress,
    //             functionName: 'createToken',
    //             args: args,
    //             value: '0'
    //         })

    //         // onOpenModal();
    //     } catch (error) {
    //         console.error('Error creating token:', error);
    //     }
    // };

    /*
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:5001", "http://localhost:3000", "http://127.0.0.1:5001", "https://webui.ipfs.io"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'
    */
    const onSubmit = async (values) => {
        try {
            const client = create({ url: 'http://localhost:5001' });
            console.log('sdsdsd')

            // Upload image to IPFS
            const imageFile = values.image[0];
            const imageAdded = await client.add(imageFile);
            const imageURI = `https://ipfs.io/ipfs/${imageAdded.path}`;

            await client.pin.add(imageAdded.path);
            console.log('imageURI', imageURI)

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
            const metadataAdded = await client.add(JSON.stringify(metadata));
            const tokenURI = `https://ipfs.io/ipfs/${metadataAdded.path}`;

            // Pin the metadata
            await client.pin.add(metadataAdded.path);

            const args = [values.name, values.symbol, tokenURI]
            console.log('args', args)

            writeContract({
                abi: apeFactoryABI,
                address: apeFactoryContractAddress,
                functionName: 'createToken',
                args: args,
                value: '0'
            })
        } catch (error) {
            console.error('Error creating token:', error);
        }
    };




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
                            <form onSubmit={handleSubmit(onSubmit)}>
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
                                <div className='sm:w-[470px] border px-5 py-5 sm:py-6 sm:px-6 border-white rounded-xl flex gap-y-3 flex-col bg-[#1b1d28]'>
                                    <div className='w-full   flex justify-center items-center'>
                                        <div className="text-center">
                                            <h3 className="text-center tracking-[0.5px] roboto-400 text-white text-[17px]">Choose how many [sdvcdf] you want to buy </h3>
                                            <p className='text-center tracking-[0.5px] mt-1 roboto-400 text-white text-[17px]'>(optional)</p>
                                            <p className='text-center tracking-[0.5px] mt-3.5 mb-3 pfont-400 text-white text-sm'>Tip: its optional but buying a small amount of coins helps protect your coin from snipers</p>
                                        </div>
                                    </div>
                                    <div className="flex mb-2 justify-end w-full gap-2">
                                        <button
                                            className="text-xs py-1 pfont-400 px-2  rounded bg-gray-800 text-gray-300"
                                            type="button"
                                        >
                                            Switch to sdvcdf
                                        </button>
                                    </div>
                                    <div>
                                        <div className="flex items-center rounded-md relative">
                                            <input
                                                className="flex h-11 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
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
                                    </div>
                                    <div className="flex mt-2 justify-center">
                                        <button
                                            onClick={onCloseModal}
                                            className="bg-[#475dc0] transition-all duration-300 hover:bg-blue-500 hover:scale-105 border-none text-white flex items-center tracking-[1px] roboto-500 gap-x-2 w-full text-center justify-center py-2.5 rounded-md"
                                        >
                                            Create Coin
                                        </button>
                                    </div>
                                    <p className='text-white mt-2 text-center pfont-400'>Cost to deploy: ~$1</p>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;

// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import { FaArrowDown, FaCircleArrowLeft } from "react-icons/fa6";
// import { Collapse } from 'react-collapse';
// import * as Yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useForm } from 'react-hook-form';
// import Modal from 'react-responsive-modal';
// import { create } from 'ipfs-http-client';

// const Create = () => {
//     const [open1, setOpen1] = useState(false);
//     const [open, setOpen] = useState(false);
//     const onOpenModal = () => setOpen(true);
//     const onCloseModal = () => setOpen(false);
//     const navigate = useNavigate()
//     const CreateCoinSchema = Yup.object().shape({

//     })
//     const { register, control, setValue, handleSubmit, formState: { errors } } = useForm({
//         resolver: yupResolver(CreateCoinSchema)
//     })
//     // const onSubmit = (values) => {
//     //     onOpenModal()
//     // }

//     const onSubmit = async (values) => {
//         try {
//             const auth = 'YOUR_INFURA_API_KEY';
//             const client = create({ url: 'https://ipfs.infura.io:5001', headers: { authorization: `Basic ${Buffer.from(auth).toString('base64')}` } });

//             // Upload image to IPFS
//             console.log('values',values)
//             const imageFile = values.image[0];
//             const { cid: imageCid } = await client.add(imageFile);
//             const imageURI = `https://ipfs.infura.io/ipfs/${imageCid}`;

//             // Create metadata with the image URI
//             const metadata = {
//                 name: values.name,
//                 description: values.description,
//                 symbol: values.symbol,
//                 image: imageURI,
//                 twitter: values.twitter,
//                 telegram: values.telegram,
//                 website: values.website,
//             };

//             // Upload metadata to IPFS
//             const { cid: metadataCid } = await client.add(JSON.stringify(metadata));
//             const tokenURI = `https://ipfs.infura.io/ipfs/${metadataCid}`;

//             // Update the tokenURI in the contract config
//             // contractConfig.args[3] = tokenURI;

//             // Call the createToken function
//             // createToken?.();

//             // onOpenModal();
//         } catch (error) {
//             console.error('Error creating token:', error);
//         }
//     };

//     return (
//         <div className='container-fluid create-coin min-h-screen bg-fixed bg-center bg-no-repeat bg-cover pt-[70px]'>
//             <div className="bs-container relative">
//                 <div className='absolute z-[11]  sm:pt-10 left-2 sm:left-0 top-0'>
//                     <button onClick={() => navigate('/')} className='pl-2 max-sm:gap-x-2 flex items-center bg-transparent'>
//                         <FaCircleArrowLeft className='text-white text-2xl' />
//                         <span className='text-white sm:hidden pfont-500'>Go back</span>
//                     </button>
                    
//                 </div>
//                 <div className="row py-10 justify-center">
//                     <div  className="col-xxl-4 col-lg-5 col-md-7 col-sm-9 col-11 bg-black border-[2px] border-[#27272a]  rounded-md p-7">
//                         <div>
//                             <form onSubmit={handleSubmit(onSubmit)}>
//                                 <div className='flex flex-col gap-y-4'>
//                                     <div>
//                                         <label className='roboto-400 tracking-[0.5px] text-white'>Name :</label>
//                                         <input className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
//                                     </div>
//                                     <div>
//                                         <label className='roboto-400 tracking-[0.5px] text-white'>Ticker :</label>
//                                         <input className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
//                                     </div>
//                                     <div>
//                                         <label className='roboto-400 tracking-[0.5px] text-white'>Logo :</label>
//                                         <div className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-3 px-3 outline-none focus:outline-none'>
//                                             <input type="file" />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label className='roboto-400 tracking-[0.5px] text-white'>Description :</label>
//                                         <textarea rows={4} className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
//                                     </div>
//                                     <div>
//                                         <div onClick={() => setOpen1(!open1)} className='flex gap-x-1.5 items-center  cursor-pointer'>
//                                             <span className='roboto-400 tracking-[0.5px] text-white'>Show more options</span>
//                                             <FaArrowDown className={`text-white ${open1 ? 'rotate-180' : 'rotate-0'}`} />
//                                         </div>
//                                         <Collapse isOpened={open1}>
//                                             <div className='flex gap-y-3 flex-col pt-3 pb-2'>
//                                                 <div>
//                                                     <label className='roboto-400 tracking-[0.5px] text-white'>Twitter :</label>
//                                                     <input className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
//                                                 </div>
//                                                 <div>
//                                                     <label className='roboto-400 tracking-[0.5px] text-white'>Telegram :</label>
//                                                     <input className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50] bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
//                                                 </div>
//                                                 <div>
//                                                     <label className='roboto-400 tracking-[0.5px] text-white'>Website :</label>
//                                                     <input className='w-full focus:border-[2px] focus:border-[#6b7280] border-[1px] border-[#4b4b50]  bg-[#27272a] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
//                                                 </div>
//                                             </div>
//                                         </Collapse>
//                                     </div>

//                                     <div>
//                                         <button type='submit' className=" bg-gradient-to-br from-zinc-900 to-zinc-900   dark:bg-zinc-800  transition-all duration-300  hover:scale-105 text-center border-none w-full text-white flex justify-center items-center tracking-[1px] roboto-500 gap-x-2 px-4 py-2.5 rounded-md">
//                                             Create Coin
//                                         </button>
//                                         <p className='text-white mt-3.5 roboto-400'>Cost to deploy: ~0.02 ETH</p>
//                                     </div>
//                                 </div>
//                             </form>
//                             <Modal styles={{
//                                 padding: 0
//                             }} open={open} showCloseIcon={false} blockScroll={false} onClose={onCloseModal} center>
//                                 <div className='sm:w-[470px] border px-5 py-5 sm:py-6 sm:px-6 border-white rounded-xl flex gap-y-3 flex-col bg-[#1b1d28]'>
//                                     <div className='w-full   flex justify-center items-center'>
//                                         <div className="text-center">
//                                             <h3 className="text-center tracking-[0.5px] roboto-400 text-white text-[17px]">Choose how many [sdvcdf] you want to buy </h3>
//                                             <p className='text-center tracking-[0.5px] mt-1 roboto-400 text-white text-[17px]'>(optional)</p>
//                                             <p className='text-center tracking-[0.5px] mt-3.5 mb-3 pfont-400 text-white text-sm'>Tip: its optional but buying a small amount of coins helps protect your coin from snipers</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex mb-2 justify-end w-full gap-2">

//                                         <button className="text-xs py-1 pfont-400 px-2  rounded bg-gray-800 text-gray-300" type="button"
//                                         >Switch to sdvcdf
//                                         </button>
//                                     </div>
//                                     <div>
//                                         <div className="flex items-center rounded-md relative">
//                                             <input

//                                                 className="flex h-11 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
//                                                 placeholder="0.0" type="number" />
//                                             <div className="flex items-center ml-2 absolute right-2"><span className="text-white pfont-400 mr-2">ETH</span>
//                                                 <img className="w-7 h-7 rounded-full"
//                                                     src="/images/logo/eth.svg"
//                                                     alt="ETH" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="flex mt-2 justify-center">
//                                         <button onClick={onCloseModal} className="bg-[#475dc0] transition-all duration-300 hover:bg-blue-500 hover:scale-105 border-none text-white flex items-center tracking-[1px] roboto-500 gap-x-2 w-full text-center justify-center py-2.5 rounded-md">Create Coin</button>
//                                     </div>
//                                     <p className='text-white mt-2 text-center pfont-400'>Cost to deploy: ~$1</p>
//                                 </div>
//                             </Modal>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Create;

