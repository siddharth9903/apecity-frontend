import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { CgMenuRightAlt, FaMedal, FaSketch, FaWater } from './../assets/icons/vander';
import Transactions from '../sections/token/Transactions';

const Token = () => {
    const [tabIndex, setTabIndex] = useState(0);
    return (
        <>
            <div className="container-fluid ">
                <div className='relative h-screen pt-[94px]'>
                    <div className="fixed h-screen flex flex-col w-[calc(100%-400px)] left-0 top-0">
                        <div className="w-full h-[400px] bg-lime-300">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore eum iure cumque voluptatibus explicabo blanditiis quisquam hic quibusdam ad totam adipisci magnam, consequuntur aliquam beatae incidunt consectetur sit exercitationem distinctio vel voluptates repellat. Cupiditate natus explicabo at, eligendi eius tempora, doloremque ratione amet veritatis error adipisci voluptatem nisi in! A animi, impedit corrupti asperiores officia labore veniam recusandae harum fugit omnis dicta, non, tempore facilis ipsa deleniti quibusdam adipisci nihil molestiae! In culpa ab, facilis error est nulla inventore at reprehenderit ipsam impedit quas accusantium nesciunt delectus velit officiis alias atque nam fugit! Voluptate impedit recusandae hic, voluptatem maiores pariatur.</p>
                        </div>
                        <div className='flex-1 bg-red-300 overflow-y-auto'>
                            <div className='h-[900px] bg-slate-300'>

                            </div>
                        </div>
                    </div>
                    <div className="absolute  h-screen bg-blue-300 w-[400px] right-0 top-0 overflow-auto">

                    </div>
                </div>
            </div>

        </>
    )
}

export default Token
{/* <div>
                                <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                                    <div className='bg-[#17171c]  px-2  flex items-center'>
                                        <TabList className='flex gap-x-4 items-center'>
                                            <Tab className='focus:border-none'>
                                                <div className={`${tabIndex == 0 ? 'text-white border-white border-b-2' : 'text-[#A6A6A6]'}  cursor-pointer py-2 hover:text-white flex items-center`}>
                                                    <span><CgMenuRightAlt /></span>
                                                    <span className='pfont-500 text-sm ml-1.5'>Transactions</span>
                                                </div>
                                            </Tab>
                                            <Tab className='focus:border-none'>
                                                <div className={`${tabIndex == 1 ? 'text-white border-white border-b-2' : 'text-[#A6A6A6]'} cursor-pointer py-2 hover:text-white flex items-center`}>
                                                    <span className='text-sm'><FaMedal /></span>
                                                    <span className='pfont-500 text-sm ml-1.5'>Top Traders</span>
                                                </div>
                                            </Tab>
                                            <Tab className='focus:border-none'>
                                                <div className={`${tabIndex == 2 ? 'text-white border-white border-b-2' : 'text-[#A6A6A6]'} cursor-pointer py-2 hover:text-white flex items-center`}>
                                                    <span className='text-sm'><FaSketch /></span>
                                                    <span className='pfont-500 text-sm ml-1.5'>Holders(706)</span>
                                                </div>
                                            </Tab>
                                            <Tab className='focus:border-none'>
                                                <div className={`${tabIndex == 3 ? 'text-white border-white border-b-2' : 'text-[#A6A6A6]'} cursor-pointer py-2 hover:text-white flex items-center`}>
                                                    <span className='text-sm'><FaWater /></span>
                                                    <span className='pfont-500 text-sm ml-1.5'> Liquidity Providers(2)</span>
                                                </div>
                                            </Tab>

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
                                </Tabs>
                            </div> */}