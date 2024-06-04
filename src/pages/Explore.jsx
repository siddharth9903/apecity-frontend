import { useNavigate } from "react-router-dom"
import ExploreToken from "../sections/explore/ExploreToken"
import Select from 'react-select';
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { TOKENS_QUERY, TOKEN_SEARCH_QUERY, TOTAL_TOKENS_QUERY } from "../graphql/queries/tokenQueries";
import { useReadContract } from "wagmi";
import { getAddress, parseEther } from 'viem';
import { abi as UNISWAP_ROUTER_ABI } from '../contracts/UniswapRouter02';
// import { WETH_ADDRESS } from "../sections/token/TokenDetails";
import { UNISWAP_ROUTER_ADDRESS, USDC_ADDRESS, WETH_ADDRESS } from "../contracts/constants";

const Explore = () => {
    const navigate = useNavigate();
    const [wethPriceIntoUSD, setWethPriceIntoUSD] = useState(0)

    // const { wethPrice, isLoading: isWethPriceLoading } = useWETHPrice();
    const { data: wethPrice, isLoading: isWethPriceLoading } = useReadContract({
        address: UNISWAP_ROUTER_ADDRESS,
        abi: UNISWAP_ROUTER_ABI,
        functionName: 'getAmountsOut',
        args: [
            parseEther('1').toString(), // 1 WETH in Wei
            [WETH_ADDRESS, USDC_ADDRESS] // Path from WETH to USDC
        ],
        watch: true
    });

    useEffect(()=>{
        if(wethPrice){
            const formattedPrice = wethPrice ? wethPrice[1].toString() / 1e6 : null;
            setWethPriceIntoUSD(formattedPrice)
        }
    }, [wethPrice])

    const sortingOptions = [
        { value: '0', label: 'Bump Order' },
        // { value: '1', label: 'Last Reply' },
        // { value: '2', label: 'Reply Count' },
        { value: '3', label: 'Market Cap' },
        { value: '4', label: 'Creation Time' }
    ];
    const orderOptions = [
        { value: '0', label: 'asc' },
        { value: '1', label: 'dsc' }
    ];
    const timeIntervalOptions = [
        { value: '0', label: 'On' },
        { value: '2', label: 'Off' },
        { value: '3', label: 'Every 5s' },
        { value: '4', label: 'Every 10s' },
        { value: '5', label: 'Every 30s' }
    ];
    const [sortBy, setSortBy] = useState('bondingCurve__createdAtTimestamp');
    const [orderBy, setOrderBy] = useState('desc');
    const [reorderInterval, setReorderInterval] = useState(2000);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [getSearchResults, { loading: searchLoading, error: searchError }] = useLazyQuery(TOKEN_SEARCH_QUERY, {
        onCompleted: (data) => {
            const resultTokens = data?.tokenMetaDataSearch?.map(result => result?.token)
            setSearchResults(resultTokens);
        }
    });
    const handleSearch = () => {
        getSearchResults({ variables: { searchTerm } });
    };
    const handleSortBy = (option) => {
        switch (option.value) {
            case '0':
                setSortBy('bondingCurve__lastActivity');
                setOrderBy('desc');
                break;
            case '3':
                setSortBy('bondingCurve__marketCap');
                setOrderBy('desc');
                break;
            case '4':
                setSortBy('bondingCurve__createdAtTimestamp');
                setOrderBy('desc');
                break;
            default:
                setSortBy('bondingCurve__createdAtTimestamp');
                setOrderBy('desc');
        }
    };

    const handleOrderBy = (option) => {
        setOrderBy(option.value === '0' ? 'asc' : 'desc');
    };

    const handleReorder = (option) => {
        clearInterval(reorderInterval);
        switch (option.value) {
            case '3':
                setReorderInterval(5000);
                break;
            case '4':
                setReorderInterval(10000);
                break;
            case '5':
                setReorderInterval(30000);
                break;
            default:
                setReorderInterval(2000);
        }
    };
    return (
        <>
            <div className="container-fluid pt-[70px] bg-black">
                <div className="bs-container-md max-md:px-3">
                    <div className="row">
                        <div className="col-12 pt-10">
                            <div className="flex justify-center">
                                <button onClick={() => navigate('/create')} className="bg-[#475dc0] transition-all duration-300 hover:bg-blue-500  hover:scale-105 border-none text-white flex items-center tracking-[1px] roboto-500 gap-x-2 px-6 py-2 rounded-md">
                                    Create Your Coin
                                </button>
                            </div>
                        </div>
                        <div className="col-12 rounded-md mt-10 py-4 px-2 bg-[#28282d]">
                            <div className="row filter-section">
                                <div className="col-lg-4 col-xs-6 px-2">
                                    <h3 className="text-white roboto-400 ">Search for token:</h3>
                                    <div className="mt-1.5 items-center border-[2px] rounded gap-x-2 border-[#4b4b50] px-4 flex">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className="w-full text-white focus:outline-none border-none bg-transparent placeholder:text-[#6e767d] roboto-400 rounded h-[42px]"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button
                                            className="bg-[#475dc0] text-white px-4 py-2 rounded-md"
                                            onClick={handleSearch}
                                            disabled={searchLoading}
                                        >
                                            {searchLoading ? 'Searching...' : <IoSearch className="text-xl" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-xs-6 max-xs:mt-4 px-2">
                                    <h3 className="text-white roboto-400 ">Sort By :</h3>
                                    <div className="mt-1.5">
                                        <Select 
                                            placeholder='Sort By' 
                                            className="roboto-400" 
                                            options={sortingOptions} 
                                            onChange={handleSortBy}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-2 max-lg:mt-4 col-6 px-2">
                                    <h3 className="text-white roboto-400 ">Order By :</h3>
                                    <div className="mt-1.5">
                                        <Select 
                                            placeholder='Order By' 
                                            className="roboto-400" 
                                            options={orderOptions} 
                                            onChange={handleOrderBy}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 max-lg:mt-4 col-6 px-2">
                                    <div>
                                        <h3 className="text-white roboto-400 ">Reorder :</h3>
                                        <div className="mt-1.5">
                                            <Select 
                                                placeholder='Select' 
                                                className="roboto-400" 
                                                options={timeIntervalOptions} 
                                                onChange={handleReorder}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-3 mt-3">
                            <ExploreToken
                                searchResults={searchResults}
                                sortBy={sortBy}
                                orderBy={orderBy}
                                reorderInterval={reorderInterval}
                                wethPrice={wethPriceIntoUSD}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Explore

