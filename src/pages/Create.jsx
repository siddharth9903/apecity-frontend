import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowDown, FaCircleArrowLeft } from "react-icons/fa6";
import { Collapse } from 'react-collapse';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
const Create = () => {
    const [open, setOpen] = useState(false);
    const navigate=useNavigate()
    const CreateCoinSchema = Yup.object().shape({

    })
    const { register, control, setValue, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(CreateCoinSchema)
    })
    const onSubmit=(values)=>{

    }
    return (
        <div className='container-fluid create-coin min-h-screen bg-fixed bg-center bg-no-repeat bg-cover pt-[70px]'>
            <div className="bs-container relative">
                <div className='absolute z-[11] pt-10 left-0 top-0'>
                    <button onClick={()=>navigate('/')} className='pl-2 bg-transparent'>
                        <FaCircleArrowLeft className='text-white text-2xl' />
                    </button>
                </div>
                <div className="row py-10 justify-center">
                    <div className="col-4 bg-[#28282d] shadow-1 rounded-md p-7">
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
                                        <div onClick={() => setOpen(!open)} className='flex gap-x-1.5 items-center  cursor-pointer'>
                                            <span className='roboto-400 tracking-[0.5px] text-white'>Show more options</span>
                                            <FaArrowDown className={`text-white ${open ? 'rotate-180' : 'rotate-0'}`} />
                                        </div>
                                        <Collapse isOpened={open}>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create;
