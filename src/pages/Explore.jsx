import { useNavigate } from "react-router-dom"
import ExploreToken from "../sections/explore/ExploreToken"
import Select from 'react-select';
import { IoSearch } from "react-icons/io5";
const Explore = () => {
    const navigate = useNavigate();
    const options = [
        { value: '0', label: 'Bump Order' },
        { value: '1', label: 'Last Reply' },
        { value: '2', label: 'Reply Count' },
        { value: '3', label: 'Market Cap' },
        { value: '4', label: 'Creation Time' }
    ]
    const options1 = [
        { value: '0', label: 'asc' },
        { value: '1', label: 'dsc' }
    ]
    const options2 = [
        { value: '0', label: 'On' },
        { value: '2', label: 'Off' },
        { value: '3', label: 'Every 5s' },
        { value: '4', label: 'Every 10s' },
        { value: '5', label: 'Every 30s' }
    ]
    return (
        <>
            <div className="container-fluid pt-[70px] bg-black">
                <div className="bs-container">
                    <div className="row">
                        <div className="col-12 pt-10">
                            <div className="flex justify-center">
                                <button onClick={() => navigate('/create')} className="bg-[#475dc0] transition-all duration-300 hover:bg-blue-500 hover:scale-105 border-none text-white flex items-center tracking-[1px] roboto-500 gap-x-2 px-6 py-2 rounded-md">
                                    Create Your Coin
                                </button>
                            </div>
                        </div>
                        <div className="col-12 rounded-md mt-10 py-4 px-2 bg-[#28282d]">
                            <div className="row filter-section">
                                <div className="col-4 px-2">
                                    <h3 className="text-white roboto-500 ">Search :</h3>
                                    <div className="mt-1.5 items-center border-[2px] rounded gap-x-2 border-[#4b4b50] px-4 flex">
                                        <IoSearch  className="text-xl text-[#6e767d]"/>
                                        <input type="text" placeholder="Search" className="w-full text-white focus:outline-none  border-none bg-transparent placeholder:text-[#6e767d] roboto-400 rounded h-[42px]" />
                                    </div>
                                </div>
                                <div className="col-3 px-2">
                                    <h3 className="text-white roboto-500 ">Sort By :</h3>
                                    <div className="mt-1.5">
                                        <Select  placeholder='Sort By' className="roboto-400" options={options} />
                                    </div>
                                </div>
                                <div className="col-2 px-2">
                                    <h3 className="text-white roboto-500 ">Order By :</h3>
                                    <div className="mt-1.5">
                                        <Select placeholder='Order By' className="roboto-400" options={options1} />
                                    </div>
                                </div>
                                <div className="col-3 px-2">
                                    <div>
                                        <h3 className="text-white roboto-500 ">Reorder :</h3>
                                        <div className="mt-1.5">
                                            <Select  placeholder='Select' className="roboto-400" options={options2} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 mb-3 mt-3">
                            <ExploreToken />
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Explore

