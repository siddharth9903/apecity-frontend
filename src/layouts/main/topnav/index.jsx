import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import SimpleBarReact from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';

import { Menu, Bell, ShoppingCart, DollarSign, Truck } from 'feather-icons-react'
import { LuSearch, BiWallet, AiOutlineUser, MdOutlineSettings, AiOutlineLogout } from "./../../../assets/icons/vander.jsx"

export default function Topnav({ setToggle, toggle }) {
    const [notification, setNotification] = useState(false);
    const [userData, setUserData] = useState(false);

    useEffect(() => {
        let handlar = () => {
            setNotification(false)
        }
        let user = () => {
            setUserData(false)
        }
        document.addEventListener("mousedown", handlar)
        document.addEventListener("mousedown", user)
    }, [])

    const notificationtoggle = () => {
        setNotification(!notification)
    }
    const userHandler = () => {
        setUserData(!userData)
    }
    const toggleHandler = () => {
        setToggle(!toggle)
    }
    const metamask = async () => {
        try {
            //Basic Actions Section
            const onboardButton = document.getElementById('connectWallet')

            //   metamask modal
            const modal = document.getElementById('modal-metamask')
            const closeModalBtn = document.getElementById('close-modal')

            //   wallet address
            const myPublicAddress = document.getElementById('myPublicAddress')

            //Created check function to see if the MetaMask extension is installed
            const isMetaMaskInstalled = () => {
                //Have to check the ethereum binding on the window object to see if it's installed
                const { ethereum } = window
                return Boolean(ethereum && ethereum.isMetaMask)
            }

            const onClickConnect = async () => {
                if (!isMetaMaskInstalled()) {
                    //meta mask not installed
                    modal.classList.add('show')
                    modal.style.display = 'block'
                    return
                }
                try {
                    // eslint-disable-next-line no-undef
                    await ethereum.request({ method: 'eth_requestAccounts' })
                    // eslint-disable-next-line no-undef
                    const accounts = await ethereum.request({ method: 'eth_accounts' })
                    myPublicAddress.innerHTML =
                        accounts[0].split('').slice(0, 6).join('') +
                        '...' +
                        accounts[0]
                            .split('')
                            .slice(accounts[0].length - 7, accounts[0].length)
                            .join('')
                } catch (error) {
                    console.error(error)
                }
            }

            const closeModal = () => {
                modal.classList.remove('show')
                modal.style.display = 'none'
            }

            if (isMetaMaskInstalled()) {
                // eslint-disable-next-line no-undef
                const accounts = await ethereum.request({ method: 'eth_accounts' })
                if (!!accounts[0]) {
                    myPublicAddress.innerHTML =
                        accounts[0].split('').slice(0, 6).join('') +
                        '...' +
                        accounts[0]
                            .split('')
                            .slice(accounts[0].length - 7, accounts[0].length)
                            .join('')
                }
            }

            onboardButton.addEventListener('click', onClickConnect)
            closeModalBtn.addEventListener('click', closeModal)
        } catch (error) { }
    }
    return (
        <div className="top-header">
            <div className="header-bar flex justify-between">
                <div className="flex items-center space-x-1">
                    <Link to="#" className="xl:hidden block me-2">
                        <img src={'/images/logo/logo-icon-32.png'} className="md:hidden block" alt="" />
                        <span className="md:block hidden">
                            <img src={'/images/logo/logo-dark.png'} className="inline-block dark:hidden" alt="" />
                            <img src={'/images/logo/logo-light.png'} className="hidden dark:inline-block" alt="" />
                        </span>
                    </Link>
                    {/* <Link to="#" id="close-sidebar" className="btn btn-icon btn-sm rounded-full inline-flex bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white">
                        <Menu className="h-4 w-4" onClick={toggleHandler} />
                    </Link> */}
                    {/* <div className="ps-1.5">
                        <div className="form-icon relative sm:block hidden">
                            <LuSearch className="absolute top-1/2 -translate-y-1/2 start-3" />
                            <input type="text" className="form-input w-56 ps-9 py-2 px-3 h-8 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 bg-white" name="s" id="searchItem" placeholder="Search..." />
                        </div>
                    </div> */}
                </div>

                <ul className="list-none mb-0 space-x-1">
                    <li className="dropdown inline-block relative">
                        <button data-dropdown-toggle="dropdown" className="dropdown-toggle btn btn-icon btn-sm rounded-full inline-flex bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white" type="button" onClick={notificationtoggle}>
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-0 end-0 flex items-center justify-center bg-emerald-600 text-white text-[10px] font-bold rounded-full w-2 h-2 after:content-[''] after:absolute after:h-2 after:w-2 after:bg-emerald-600 after:top-0 after:end-0 after:rounded-full after:animate-ping"></span>
                        </button>
                        <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-64 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-700  ${notification ? "block" : "hidden"}`}  >
                            <span className="px-4 py-4 flex justify-between">
                                <span className="font-semibold">Notifications</span>
                                <span className="flex items-center justify-center bg-emerald-600/20 text-emerald-600 text-[10px] font-bold rounded-full w-5 max-h-5 ms-1">3</span>
                            </span>
                            <SimpleBarReact className='h-64'>
                                <ul className="py-2 text-start h-64 border-t border-gray-100 dark:border-gray-800" >
                                    <li>
                                        <Link to="#" className="block font-medium py-1.5 px-4">
                                            <div className="flex">
                                                <div className="h-10 w-10 rounded-full shadow shadow-violet-600/10 dark:shadow-gray-700 bg-violet-600/10 dark:bg-slate-800 text-violet-600 dark:text-white flex items-center justify-center">
                                                    <ShoppingCart className="h-4 w-4" />
                                                </div>
                                                <div className="ms-2">
                                                    <span className="text-[15px] font-semibold block">Order Complete</span>
                                                    <small className="text-slate-400">15 min ago</small>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="block font-medium py-1.5 px-4">
                                            <div className="flex">
                                                <img src={'/images/client/04.jpg'} className="h-10 w-10 rounded-full shadow dark:shadow-gray-700" alt="" />
                                                <div className="ms-2">
                                                    <span className="text-[15px] font-semibold block"><span className="font-bold">Message</span> from Luis</span>
                                                    <small className="text-slate-400">1 hour ago</small>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="block font-medium py-1.5 px-4">
                                            <div className="flex">
                                                <div className="h-10 w-10 rounded-full shadow shadow-violet-600/10 dark:shadow-gray-700 bg-violet-600/10 dark:bg-slate-800 text-violet-600 dark:text-white flex items-center justify-center">
                                                    <DollarSign className="h-4 w-4" />
                                                </div>
                                                <div className="ms-2">
                                                    <span className="text-[15px] font-semibold block"><span className="font-bold">Received Bid</span></span>
                                                    <small className="text-slate-400">2 hour ago</small>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="block font-medium py-1.5 px-4">
                                            <div className="flex">
                                                <div className="h-10 w-10 rounded-full shadow shadow-violet-600/10 dark:shadow-gray-700 bg-violet-600/10 dark:bg-slate-800 text-violet-600 dark:text-white flex items-center justify-center">
                                                    <Truck className="h-4 w-4" />
                                                </div>
                                                <div className="ms-2">
                                                    <span className="text-[15px] font-semibold block">Please check your activities</span>
                                                    <small className="text-slate-400">Yesterday</small>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="block font-medium py-1.5 px-4">
                                            <div className="flex">
                                                <img src={'/images/client/05.jpg'} className="h-10 w-10 rounded-full shadow dark:shadow-gray-700" alt="" />
                                                <div className="ms-2">
                                                    <span className="text-[15px] font-semibold block"><span className="font-bold">Cally</span> started following you</span>
                                                    <small className="text-slate-400">2 days ago</small>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </SimpleBarReact>
                        </div>
                    </li>
                    <li className="inline-block mb-0">
                        <Link to="#" onClick={metamask} id="connectWallet" className="btn btn-icon btn-sm rounded-full inline-flex bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><BiWallet /></Link>
                    </li>
                    <li className="dropdown inline-block relative">
                        <button data-dropdown-toggle="dropdown" className="dropdown-toggle items-center" type="button">
                            <span className="btn btn-icon btn-sm rounded-full inline-flex bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white" onClick={userHandler}><img src={'/images/client/05.jpg'} className="rounded-full" alt="" /></span>
                        </button>
                        <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-48 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 ${userData ? "block" : "hidden"}`} >
                            <div className="relative">
                                <div className="py-8 bg-gradient-to-tr from-violet-600 to-red-600"></div>
                                <div className="absolute px-4 -bottom-7 start-0">
                                    <div className="flex items-end">
                                        <img src={'/images/client/05.jpg'} className="rounded-full w-10 h-w-10 shadow dark:shadow-gray-700" alt="" />

                                        <span className="font-semibold text-[15px] ms-1">Jenny Jimenez</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 px-4">
                                <h5 className="font-semibold text-[15px]">Wallet:</h5>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-slate-400">qhut0...hfteh45</span>
                                    <Link to="#" className="text-violet-600"><BiWallet /></Link>
                                </div>
                            </div>

                            <div className="mt-4 px-4">
                                <h5 className="text-[15px]">Balance: <span className="text-violet-600 font-semibold">0.00045ETH</span></h5>
                            </div>

                            <ul className="py-2 text-start">
                                <li>
                                    <Link to="/creator-profile" className="flex items-center text-[14px] font-semibold py-1.5 px-4 hover:text-violet-600"><AiOutlineUser className="text-[16px] align-middle me-1" /> Profile</Link>
                                </li>
                                <li>
                                    <Link to="/creator-profile-setting" className="flex items-center text-[14px] font-semibold py-1.5 px-4 hover:text-violet-600"><MdOutlineSettings className="text-[16px] align-middle me-1" /> Settings</Link>
                                </li>
                                <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>
                                <li>
                                    <Link to="/login" className="flex items-center text-[14px] font-semibold py-1.5 px-4 hover:text-violet-600"><AiOutlineLogout className="text-[16px] align-middle me-1" /> Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}