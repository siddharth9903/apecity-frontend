import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowDown, FaCircleArrowLeft } from "react-icons/fa6";
import { Collapse } from 'react-collapse';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Modal from 'react-responsive-modal';
const Create = () => {
    const [open1, setOpen1] = useState(false);
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const navigate = useNavigate()
    const CreateCoinSchema = Yup.object().shape({

    })
    const { register, control, setValue, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(CreateCoinSchema)
    })
    const onSubmit = (values) => {
        onOpenModal()
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
                    <div className="col-xxl-4 col-lg-5 col-md-7 col-sm-9 col-11 bg-[#28282d] shadow-1 rounded-md p-7">
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='flex flex-col gap-y-4'>
                                    <div>
                                        <label className='roboto-400 tracking-[0.5px] text-white'>Name :</label>
                                        <input className='w-full border-[2px] border-[#4b4b50]  bg-[#28282d] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
                                    </div>
                                    <div>
                                        <label className='roboto-400 tracking-[0.5px] text-white'>Ticker :</label>
                                        <input className='w-full border-[2px] border-[#4b4b50]  bg-[#28282d] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
                                    </div>
                                    <div>
                                        <label className='roboto-400 tracking-[0.5px] text-white'>Logo :</label>
                                        <div className='w-full border-[2px] border-[#4b4b50]  bg-[#28282d] mt-1.5 rounded text-white roboto-400 text-base py-3 px-3 outline-none focus:outline-none'>
                                            <input type="file" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='roboto-400 tracking-[0.5px] text-white'>Description :</label>
                                        <textarea rows={4} className='w-full border-[2px] border-[#4b4b50]  bg-[#28282d] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
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
                                                    <input className='w-full border-[2px] border-[#4b4b50]  bg-[#28282d] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
                                                </div>
                                                <div>
                                                    <label className='roboto-400 tracking-[0.5px] text-white'>Telegram :</label>
                                                    <input className='w-full border-[2px] border-[#4b4b50]  bg-[#28282d] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
                                                </div>
                                                <div>
                                                    <label className='roboto-400 tracking-[0.5px] text-white'>Website :</label>
                                                    <input className='w-full border-[2px] border-[#4b4b50]  bg-[#28282d] mt-1.5 rounded text-white roboto-400 text-base py-2 px-4 outline-none focus:outline-none' type="text" />
                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>

                                    <div>
                                        <button type='submit' className="bg-[#475dc0] transition-all duration-300 hover:bg-blue-500 hover:scale-105 text-center border-none w-full text-white flex justify-center items-center tracking-[1px] roboto-500 gap-x-2 px-4 py-2.5 rounded-md">
                                            Create Coin
                                        </button>
                                        <p className='text-white mt-2 roboto-400'>Cost to deploy: ~0.02 ETH</p>
                                    </div>
                                </div>
                            </form>
                            <Modal styles={{
                                padding: 0
                            }} open={open} showCloseIcon={false} blockScroll={false} onClose={onCloseModal} center>
                                <div className='sm:w-[470px] border px-5 py-5 sm:py-6 sm:px-6 border-white rounded-xl flex gap-y-3 flex-col bg-[#1b1d28]'>
                                    <div className='w-full   flex justify-center items-center'>
                                        <div className="text-center">
                                            <h3 className="text-center tracking-[0.5px] roboto-400 text-white text-[17px]">Choose how many [sdvcdf] you want to buy </h3>
                                            <p className='text-center tracking-[0.5px] mt-1 roboto-400 text-white text-[17px]'>(optional)</p>
                                            <p className='text-center tracking-[0.5px] mt-3.5 mb-3 pfont-400 text-white text-sm'>Tip: its optional but buying a small amount of coins helps protect your coin from snipers</p>
                                        </div>
                                    </div>
                                    <div className="flex mb-2 justify-end w-full gap-2">

                                        <button className="text-xs py-1 pfont-400 px-2 rounded bg-gray-800 text-gray-300" type="button"
                                        >Switch to sdvcdf
                                        </button>
                                    </div>
                                    <div>
                                        <div className="flex items-center rounded-md relative">
                                            <input

                                                className="flex h-11 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                                                placeholder="0.0" type="number" />
                                            <div className="flex items-center ml-2 absolute right-2"><span className="text-white pfont-400 mr-2">ETH</span>
                                                <img className="w-7 h-7 rounded-full"
                                                    src="/images/logo/eth.svg"
                                                    alt="ETH" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex mt-2 justify-center">
                                        <button onClick={onCloseModal} className="bg-[#475dc0] transition-all duration-300 hover:bg-blue-500 hover:scale-105 border-none text-white flex items-center tracking-[1px] roboto-500 gap-x-2 w-full text-center justify-center py-2.5 rounded-md">Create Coin</button>
                                    </div>
                                    <p className='text-white mt-2 text-center pfont-400'>Cost to deploy: ~$1</p>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create;
