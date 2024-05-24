import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { Reorder } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { useMotionValue } from 'framer-motion';
import { useRaisedShadow } from '../../hooks/useRaisedShadow';
import { TOKENS_QUERY, TOTAL_TOKENS_QUERY } from '../../graphql/queries/tokenQueries';
import { convertIpfsUrl } from '../../utils/formats';

const ExploreToken = () => {
    const [tokens, setTokens] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const { data: totalTokensData, loading: totalTokensLoading, error: totalTokensError } = useQuery(TOTAL_TOKENS_QUERY,{
        pollInterval: 2000
    });
    const totalTokens = totalTokensData?.factory?.tokenCount || 0;

    const { data: tokensData, loading: tokensLoading, error: tokensError } = useQuery(TOKENS_QUERY, {
        variables: {
            first: pageSize,
            skip: (currentPage - 1) * pageSize,
        },
    });

    useEffect(() => {
        if (tokensData) {
            setTokens(tokensData.tokens);
        }
    }, [tokensData]);

    useEffect(() => {
        setTotalPages(Math.ceil(totalTokens / pageSize));
    }, [totalTokens, pageSize]);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (totalTokensLoading || tokensLoading) {
        return <div>Loading...</div>;
    }

    if (totalTokensError || tokensError) {
        return <div>Error: {totalTokensError?.message || tokensError?.message}</div>;
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="md:w-full max-md:w-[720px] max-md:overflow-x-auto border-separate border-spacing-y-3">
                    <Reorder.Group as="tbody" axis="y" values={tokens}>
                        {tokens.map((item) => (
                            <Item key={item.id} item={item} />
                        ))}
                    </Reorder.Group>
                </table>
            </div>
            <div className="my-4">
                <div className="flex gap-x-5 items-center justify-center">
                    <div
                        className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center"
                        onClick={handlePreviousPage}
                    >
                        <MdKeyboardArrowLeft className="group:hover: text-white text-xl" />
                    </div>
                    <div className="text-white flex gap-x-2 items-center pfont-400">
                        <span>{currentPage}</span>
                        <span>/</span>
                        <span>{totalPages}</span>
                    </div>
                    <div
                        className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center"
                        onClick={handleNextPage}
                    >
                        <MdKeyboardArrowRight className="group:hover: text-white text-xl" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExploreToken;

export const Item = ({ item }) => {
    const { id, name, symbol, metaData } = item;
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    const navigate = useNavigate();

    return (
        <Reorder.Item
            as="tr"
            onClick={() => navigate(`/token/${id}`)}
            value={id}
            id={id}
            className="bg-[#28282d] hover:bg-[#39393e] cursor-pointer rounded-md"
            style={{ boxShadow, y }}
        >
            <td className="w-[40%] px-4 py-4">
                <div className="flex items-center gap-x-2">
                    <span className="text-sm text-[#848489] pfont-400">#</span>
                    <span className="pfont-600 text-sm uppercase text-white">{symbol}</span>
                    <span className="text-sm text-[#cccccc] pfont-400">{name}</span>
                    <span>
                        <img className="w-5" src={convertIpfsUrl(metaData?.image)} alt="" />
                    </span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] text-sm pfont-400">1H</span>
                    <span className="pfont-600 text-sm text-[#b0dc73]">23.3%</span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] text-sm pfont-400">24H</span>
                    <span className="pfont-600 text-sm text-[#f56565]">-80.3%</span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] uppercase text-sm pfont-400">vol</span>
                    <span className="text-sm text-white pfont-600">$12.2M</span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] uppercase text-sm pfont-400">liq</span>
                    <span className="text-sm text-white pfont-600">$12.2M</span>
                </div>
            </td>
        </Reorder.Item>
    );
};
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
// import { Reorder } from 'framer-motion';
// import { useQuery } from '@apollo/client';
// import { gql } from '@apollo/client';
// import { useMotionValue } from "framer-motion";
// import { useRaisedShadow } from "../../hooks/useRaisedShadow";

// const TOKENS_QUERY = gql`
//   query GetTokens($first: Int!, $skip: Int!) {
//     tokens(first: $first, skip: $skip, orderBy: createdAtTimestamp, orderDirection: desc) {
//       id
//       name
//       symbol
//       imageURL
//     }
//   }
// `;

// const TOTAL_TOKENS_QUERY = gql`
//   query GetTotalTokens {
//     factory(id: "0x5FbDB2315678afecb367f032d93F642f64180aa3") {
//       tokenCount
//     }
//   }
// `;

// const ExploreToken = () => {
//     const [tokens, setTokens] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [totalPages, setTotalPages] = useState(1);
//     const navigate = useNavigate();

//     const { data: totalTokensData } = useQuery(TOTAL_TOKENS_QUERY);
//     const totalTokens = totalTokensData?.factory?.tokenCount || 0;

//     const { data: tokensData, loading, error } = useQuery(TOKENS_QUERY, {
//         variables: {
//             first: pageSize,
//             skip: (currentPage - 1) * pageSize,
//         },
//     });

//     useEffect(() => {
//         if (tokensData) {
//             setTokens(tokensData.tokens);
//         }
//     }, [tokensData]);

//     useEffect(() => {
//         setTotalPages(Math.ceil(totalTokens / pageSize));
//     }, [totalTokens, pageSize]);

//     const handlePreviousPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const handleNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error.message}</div>;
//     }

//     return (
//         <>
//             <div className="overflow-x-auto">
//                 <table className="md:w-full max-md:w-[720px] max-md:overflow-x-auto border-separate border-spacing-y-3">
//                     <Reorder.Group as="tbody" axis="y" values={tokens}>
//                         {tokens.map((item) => (
//                             <Item key={item.id} item={item} />
//                         ))}
//                     </Reorder.Group>
//                 </table>
//             </div>
//             <div className="my-4">
//                 <div className="flex gap-x-5 items-center justify-center">
//                     <div
//                         className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center"
//                         onClick={handlePreviousPage}
//                     >
//                         <MdKeyboardArrowLeft className="group:hover: text-white text-xl" />
//                     </div>
//                     <div className="text-white flex gap-x-2 items-center pfont-400">
//                         <span>{currentPage}</span>
//                         <span>/</span>
//                         <span>{totalPages}</span>
//                     </div>
//                     <div
//                         className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center"
//                         onClick={handleNextPage}
//                     >
//                         <MdKeyboardArrowRight className="group:hover: text-white text-xl" />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ExploreToken;

// export const Item = ({ item }) => {
//     const { id, name, symbol, imageURL } = item;
//     const y = useMotionValue(0);
//     const boxShadow = useRaisedShadow(y);
//     const navigate = useNavigate();

//     return (
//         <Reorder.Item
//             as="tr"
//             onClick={() => navigate(`/token/${id}`)}
//             value={id}
//             id={id}
//             className="bg-[#28282d] hover:bg-[#39393e] cursor-pointer rounded-md"
//             style={{ boxShadow, y }}
//         >
//             <td className="w-[40%] px-4 py-4">
//                 <div className="flex items-center gap-x-2">
//                     <span className="text-sm text-[#848489] pfont-400">#</span>
//                     <span className="pfont-600 text-sm uppercase text-white">{symbol}</span>
//                     <span className="text-sm text-[#cccccc] pfont-400">{name}</span>
//                     <span>
//                         <img className="w-5" src={imageURL} alt="" />
//                     </span>
//                 </div>
//             </td>
//             <td className="px-4 py-4">
//                 <div className="flex gap-x-2 items-center">
//                     <span className="text-[#808080] text-sm pfont-400">1H</span>
//                     <span className="pfont-600 text-sm text-[#b0dc73]">23.3%</span>
//                 </div>
//             </td>
//             <td className="px-4 py-4">
//                 <div className="flex gap-x-2 items-center">
//                     <span className="text-[#808080] text-sm pfont-400">24H</span>
//                     <span className="pfont-600 text-sm text-[#f56565]">-80.3%</span>
//                 </div>
//             </td>
//             <td className="px-4 py-4">
//                 <div className="flex gap-x-2 items-center">
//                     <span className="text-[#808080] uppercase text-sm pfont-400">vol</span>
//                     <span className="text-sm text-white pfont-600">$12.2M</span>
//                 </div>
//             </td>
//             <td className="px-4 py-4">
//                 <div className="flex gap-x-2 items-center">
//                     <span className="text-[#808080] uppercase text-sm pfont-400">liq</span>
//                     <span className="text-sm text-white pfont-600">$12.2M</span>
//                 </div>
//             </td>
//         </Reorder.Item>
//     );
// };
// // import { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
// // import { Reorder } from 'framer-motion';
// // import { useReadContract, useReadContracts } from 'wagmi';
// // import { ApeFactoryContractConfig } from '../../contracts/config';
// // import { abi as erc20Abi } from '../../contracts/ERC20';
// // import { useMotionValue } from "framer-motion";
// // import { useRaisedShadow } from "../../hooks/useRaisedShadow";

// // const useFetchTokenAddressesInRange = (startIndex, endIndex) => {
// //     return useReadContract({
// //         ...ApeFactoryContractConfig,
// //         functionName: 'getTokensInRange',
// //         args: [startIndex, endIndex],
// //     });
// // };

// // const ExploreToken = () => {
// //     const [tokens, setTokens] = useState([]);
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const [pageSize, setPageSize] = useState(10);
// //     const [totalPages, setTotalPages] = useState(1);
// //     const navigate = useNavigate();

// //     const { data: totalTokens } = useReadContract({
// //         ...ApeFactoryContractConfig,
// //         functionName: 'allTokensLength',
// //     });

// //     console.log('totalTokens',totalTokens)
// //     const startIndex = (currentPage - 1) * pageSize;
// //     const endIndex = startIndex + pageSize > totalTokens ? totalTokens : startIndex + pageSize;

// //     const { data: currentPageTokenAddresses } = useFetchTokenAddressesInRange(startIndex, endIndex);

// //     const { data: tokenMetaData, error: tokenMetaDataError } = useReadContracts({
// //         contracts: (currentPageTokenAddresses || []).map((address) => [
// //             {
// //                 address,
// //                 abi: erc20Abi,
// //                 functionName: 'name',
// //             },
// //             {
// //                 address,
// //                 abi: erc20Abi,
// //                 functionName: 'symbol',
// //             },
// //             {
// //                 address,
// //                 abi: erc20Abi,
// //                 functionName: 'imageURL',
// //             },
// //         ]).flat(),
// //         onError: (error) => {
// //             console.error('Error fetching token metadata:', error);
// //         },
// //     });

// //     useEffect(() => {
// //         if (tokenMetaData) {
// //             const tokensWithMetaData = (currentPageTokenAddresses || []).map((address, index) => ({
// //                 address,
// //                 name: tokenMetaData[index * 3]?.result || '',
// //                 symbol: tokenMetaData[index * 3 + 1]?.result || '',
// //                 imageURL: tokenMetaData[index * 3 + 2]?.result || '',
// //             }));
// //             setTokens(tokensWithMetaData);
// //         }
// //     }, [currentPageTokenAddresses, tokenMetaData]);

// //     useEffect(() => {
// //         if (totalTokens) {
// //             setTotalPages(Math.ceil(Number(totalTokens) / pageSize));
// //         }
// //     }, [totalTokens, pageSize]);

// //     const handlePreviousPage = () => {
// //         if (currentPage > 1) {
// //             setCurrentPage(currentPage - 1);
// //         }
// //     };

// //     const handleNextPage = () => {
// //         if (currentPage < totalPages) {
// //             setCurrentPage(currentPage + 1);
// //         }
// //     };

// //     console.log('currentPageTokenAddresses', currentPageTokenAddresses)
// //     console.log('tokenMetaData', tokenMetaData)
// //     console.log('tokens', tokens)


// //     // const initialItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// //     // const [items, setItems] = useState(initialItems);
// //     // useEffect(() => {
// //     //     const interval = setInterval(() => {
// //     //         const shuffledItems = [...items].sort(() => Math.random() - 0.5);
// //     //         setItems(shuffledItems);
// //     //     }, 3000);

// //     //     return () => clearInterval(interval);
// //     // }, [items]);

// //     return (
// //         <>
// //             <div className="overflow-x-auto">
// //                 <table className="md:w-full max-md:w-[720px] max-md:overflow-x-auto border-separate border-spacing-y-3">
// //                     <Reorder.Group as="tbody" axis="y" values={tokens}>
// //                         {tokens.map((item) => (
// //                             <Item key={item.address} item={item} />
// //                         ))}
// //                     </Reorder.Group>
// //                 </table>
// //             </div>
// //             <div className="my-4">
// //                 <div className="flex gap-x-5 items-center justify-center">
// //                     <div className="h-9 w-9  rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center">
// //                         <MdKeyboardArrowLeft className="group:hover: text-white text-xl" />
// //                     </div>
// //                     <div className="text-white flex gap-x-2 items-center pfont-400">
// //                         <span>2</span>
// //                         <span>/</span>
// //                         <span>10</span>
// //                     </div>
// //                     <div className="h-9 w-9  rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center">
// //                         <MdKeyboardArrowRight className="group:hover: text-white text-xl" />
// //                     </div>
// //                 </div>
// //             </div>
// //         </>
// //     )
// // };

// // export default ExploreToken;

// // export const Item = ({ item }) => {
// //     const {address, name, symbol, imageURL} = item;
// //     const y = useMotionValue(0);
// //     const boxShadow = useRaisedShadow(y);
// //     const navigate = useNavigate()
// //     console.log('imageURL',imageURL)
// //     return (
// //         <Reorder.Item as="tr" onClick={() => navigate(`/token/${address}`)} value={address} id={address} className="bg-[#28282d] hover:bg-[#39393e] cursor-pointer rounded-md" style={{ boxShadow, y }}>
// //             <td className="w-[40%] px-4 py-4">
// //                 <div className="flex items-center gap-x-2">
// //                     <span className="text-sm text-[#848489] pfont-400">#</span>
// //                     <span className="pfont-600 text-sm uppercase text-white">{symbol}</span>
// //                     <span className="text-sm text-[#cccccc] pfont-400">{name}</span>
// //                     <span><img className="w-5" src={imageURL} alt="" /></span>
// //                 </div>
// //             </td>
// //             <td className="px-4 py-4">
// //                 <div className="flex gap-x-2 items-center">
// //                     <span className="text-[#808080] text-sm pfont-400">1H</span>
// //                     <span className="pfont-600 text-sm text-[#b0dc73]">23.3%</span>
// //                 </div>
// //             </td>
// //             <td className="px-4 py-4">
// //                 <div className="flex gap-x-2 items-center">
// //                     <span className="text-[#808080] text-sm pfont-400">24H</span>
// //                     <span className="pfont-600 text-sm text-[#f56565]">-80.3%</span>
// //                 </div>
// //             </td>
// //             <td className="px-4 py-4">
// //                 <div className="flex gap-x-2 items-center">
// //                     <span className="text-[#808080] uppercase text-sm pfont-400">vol</span>
// //                     <span className="text-sm text-white pfont-600">$12.2M</span>
// //                 </div>
// //             </td>
// //             <td className="px-4 py-4">
// //                 <div className="flex gap-x-2 items-center">
// //                     <span className="text-[#808080] uppercase text-sm pfont-400">liq</span>
// //                     <span className="text-sm text-white pfont-600">$12.2M</span>
// //                 </div>
// //             </td>
// //         </Reorder.Item>
// //     );
// // };



// // // import { useEffect, useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
// // // import { Reorder, useMotionValue } from 'framer-motion';
// // // import { useRaisedShadow } from '../../hooks/useRaisedShadow';
// // // import { useReadContract, useInfiniteReadContracts, useReadContracts } from 'wagmi';
// // // import { ApeFactoryContractConfig } from '../../contracts/config';
// // // import { deployedContractAddress as apeFactoryAddress,abi as apeFactoryAbi} from '../../contracts/ApeFactory';
// // // import { abi as erc20Abi } from '../../contracts/ERC20'


// // // const useFetchTokenAddressesInRange = (startIndex, endIndex) => {
// // //     return useReadContract({
// // //         ...ApeFactoryContractConfig,
// // //         functionName: 'getTokensInRange',
// // //         args: [startIndex, endIndex]
// // //     });
// // // }
// // // const useFetchTokenMetaData = (tokenAddress) => {
// // //     const tokenConfig = {
// // //         address: tokenAddress,
// // //         abi: erc20Abi,
// // //     };
// // //     return useReadContracts({
// // //         contracts: [
// // //             {
// // //                 ...tokenConfig,
// // //                 functionName: 'name',
// // //             },
// // //             {
// // //                 ...tokenConfig,
// // //                 functionName: 'symbol',
// // //             },
// // //             {
// // //                 ...tokenConfig,
// // //                 functionName: 'imageURL',
// // //             }
// // //         ],
// // //     })
// // // }

// // // const useFetchTokenMetaDataOfArray = (tokenAddresses) => {
// // //     return tokenAddresses.map((address) => useFetchTokenMetaData(address))
// // // }


// // // const ExploreToken = () => {
// // //     const [tokens, setTokens] = useState([]);
// // //     const [currentPage, setCurrentPage] = useState(1);
// // //     const [pageSize, setPageSize] = useState(10);
// // //     const [totalPages, setTotalPages] = useState(1);
// // //     const navigate = useNavigate();

// // //     const { data: totalTokens } = useReadContract({
// // //         ...ApeFactoryContractConfig,
// // //         functionName: 'allTokensLength',
// // //     });
// // //     console.log('totalTokens',totalTokens)
// // //     console.log('totalPages',totalPages)


// // //     const startIndex = (currentPage - 1) * pageSize;
// // //     const endIndex = (startIndex + pageSize) > totalTokens ? totalTokens : (startIndex + pageSize);
// // //     const { data: currentPageTokenAddresses } = useFetchTokenAddressesInRange(startIndex, endIndex)
// // //     console.log('currentPageTokenAddresses',currentPageTokenAddresses)

// // //     const {data: tokensWithMetaData} = useFetchTokenMetaDataOfArray(currentPageTokenAddresses)
// // //     console.log('tokensWithMetaData',tokensWithMetaData)

// // //     // const {data: tokensInRange} = useReadContract({
// // //     //     ...ApeFactoryContractConfig,
// // //     //     functionName: 'getTokensInRange',
// // //     //     args: [0, 1]
// // //     // });
// // //     // console.log('tokensInRange',tokensInRange)

// // //     // const tokenAddressesIndexArr = [0,1];
// // //     // const {data: tokenAddressesData} = useReadContracts({
// // //     //     contracts: tokenAddressesIndexArr.map(tokenIndex => {
// // //     //         return {
// // //     //             ...ApeFactoryContractConfig,
// // //     //             functionName: 'allTokens',
// // //     //             args: [tokenIndex],
// // //     //         }
// // //     //     })
// // //     // })

// // //     // console.log('tokenAddressesData', tokenAddressesData)

// // //     // const { data: allTokenAddresses, fetchNextPage } = useInfiniteReadContracts({
// // //     //     // cacheKey: 'allTokenAddresses2',
// // //     //     contracts(pageParam) {
// // //     //         console.log('pageParam', pageParam)
// // //     //         const startIndex = (pageParam - 1) * pageSize;
// // //     //         const endIndex = startIndex + pageSize;
// // //     //         return [...Array(endIndex - startIndex)].map((_, index) => ({
// // //     //             address: apeFactoryAddress,
// // //     //             abi: apeFactoryAbi,
// // //     //             functionName: 'allTokens',
// // //     //             args: [startIndex + index],
// // //     //         }));
// // //     //     },
// // //     //     query: {
// // //     //         initialPageParam: 0,
// // //     //         getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
// // //     //             return lastPageParam + 1
// // //     //         }
// // //     //     }
// // //     // });

// // //     // console.log('allTokenAddresses',allTokenAddresses)

// // //     // console.log('allTokenAddresses',allTokenAddresses)
// // //     function handlePreviousPage () {
// // //         if (currentPage > 1) {
// // //             setCurrentPage(currentPage - 1);
// // //         }
// // //     };

// // //     function handleNextPage() {
// // //         if (currentPage < totalPages) {
// // //             setCurrentPage(currentPage + 1);
// // //         }
// // //     };

// // //     useEffect(() => {
// // //         const startIndex = (currentPage - 1) * pageSize;
// // //         const endIndex = (startIndex + pageSize) > totalTokens ? totalTokens : (startIndex + pageSize);
// // //         const { data: currentPageTokenAddresses } = useFetchTokenAddressesInRange(startIndex, endIndex);
// // //         console.log('currentPageTokenAddresses', currentPageTokenAddresses)

// // //         // setCurrentPageTokenAddresses(data);

// // //     }, [currentPage]);

// // //     useEffect(() => {
// // //         if (totalTokens) {
// // //             console.log('Number(totalTokens)', Number(totalTokens))
// // //             setTotalPages(Math.ceil(Number(totalTokens) / 10));
// // //         }
// // //     }, [totalTokens]);

// // //     return (
// // //         <>
// // //         ss
// // //             {/* <div className="overflow-x-auto">
// // //                 <table className="md:w-full max-md:w-[720px] max-md:overflow-x-auto border-separate border-spacing-y-3">
// // //                     <Reorder.Group as="tbody" axis="y" values={tokens}>
// // //                         {tokens.map((token) => (
// // //                             <TokenItem key={token.address} token={token} />
// // //                         ))}
// // //                     </Reorder.Group>
// // //                 </table>
// // //             </div>
// // //             <div className="my-4">
// // //                 <div className="flex gap-x-5 items-center justify-center">
// // //                     <div
// // //                         className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center"
// // //                         onClick={handlePreviousPage}
// // //                     >
// // //                         <MdKeyboardArrowLeft className="group:hover: text-white text-xl" />
// // //                     </div>
// // //                     <div className="text-white flex gap-x-2 items-center pfont-400">
// // //                         <span>{currentPage}</span>
// // //                         <span>/</span>
// // //                         <span>{totalPages}</span>
// // //                     </div>
// // //                     <div
// // //                         className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center"
// // //                         onClick={handleNextPage}
// // //                     >
// // //                         <MdKeyboardArrowRight className="group:hover: text-white text-xl" />
// // //                     </div>
// // //                 </div>
// // //             </div> */}
// // //         </>
// // //     );
// // // };

// // // export default ExploreToken;

// // // // import { useEffect, useState } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
// // // // import { Reorder, useMotionValue } from "framer-motion";
// // // // import { useRaisedShadow } from "../../hooks/useRaisedShadow";
// // // // import { useReadContract, useWatchContractEvent } from 'wagmi';
// // // // import { deployedContractAddress as apeFactoryAddress,abi as apeFactoryAbi} from '../../contracts/ApeFactory';

// // // // console.log("apeFactoryAddress", apeFactoryAddress)
// // // // console.log("apeFactoryAbi", apeFactoryAbi)

// // // // const ExploreToken = () => {
// // // //     const [tokens, setTokens] = useState([]);
// // // //     const navigate = useNavigate();

// // // //     const { data: allTokens } = useReadContract({
// // // //         address: apeFactoryAddress,
// // // //         abi: apeFactoryAbi,
// // // //         functionName: 'allTokens',
// // // //     });

// // // //     // const allTokensLength = useReadContract({
// // // //     //     address: apeFactoryAddress,
// // // //     //     abi: apeFactoryAbi,
// // // //     //     functionName: 'allTokensLength',
// // // //     // });

// // // //     const { data : allTokensLength} = useReadContract({
// // // //         address: apeFactoryAddress,
// // // //         abi: apeFactoryAbi,
// // // //         functionName: 'allTokensLength',
// // // //     });

// // // //     console.log('allTokensLength', allTokensLength) 
    
// // // //     // useContractEvent({
// // // //     //     address: apeFactoryAddress,
// // // //     //     abi: apeFactoryAbi,
// // // //     //     eventName: 'TokenCreated',
// // // //     //     listener: (event) => {
// // // //     //         const newToken = event.args.token;
// // // //     //         setTokens((prevTokens) => [...prevTokens, newToken]);
// // // //     //     },
// // // //     // });

// // // //     useWatchContractEvent({
// // // //         address: apeFactoryAddress,
// // // //         apeFactoryAbi,
// // // //         eventName: 'TokenCreated',
// // // //         onLogs(logs) {
// // // //             console.log('New logs!', logs)
// // // //         },
// // // //     })


// // // //     useEffect(() => {
// // // //         if (allTokens) {
// // // //             setTokens(allTokens);
// // // //         }
// // // //     }, [allTokens]);

// // // //     return (
// // // //         <>
// // // //             <div className="overflow-x-auto">
// // // //                 <table className="md:w-full max-md:w-[720px] max-md:overflow-x-auto border-separate border-spacing-y-3">
// // // //                     <Reorder.Group as="tbody" axis="y" values={tokens}>
// // // //                         {tokens.map((token) => (
// // // //                             <TokenItem key={token} token={token} />
// // // //                         ))}
// // // //                     </Reorder.Group>
// // // //                 </table>
// // // //             </div>
// // // //             <div className="my-4">
// // // //                 <div className="flex gap-x-5 items-center justify-center">
// // // //                     <div className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center">
// // // //                         <MdKeyboardArrowLeft className="group:hover: text-white text-xl" />
// // // //                     </div>
// // // //                     <div className="text-white flex gap-x-2 items-center pfont-400">
// // // //                         <span>2</span>
// // // //                         <span>/</span>
// // // //                         <span>10</span>
// // // //                     </div>
// // // //                     <div className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center">
// // // //                         <MdKeyboardArrowRight className="group:hover: text-white text-xl" />
// // // //                     </div>
// // // //                 </div>
// // // //             </div>
// // // //         </>
// // // //     );
// // // // };

// // // // export default ExploreToken;

// // // // const TokenItem = ({ token }) => {
// // // //     const y = useMotionValue(0);
// // // //     const boxShadow = useRaisedShadow(y);
// // // //     const navigate = useNavigate();

// // // //     const handleTokenClick = () => {
// // // //         navigate(`/token/${token}`);
// // // //     };

// // // //     return (
// // // //         <Reorder.Item
// // // //             as="tr"
// // // //             onClick={handleTokenClick}
// // // //             value={token}
// // // //             id={token}
// // // //             className="bg-[#28282d] hover:bg-[#39393e] cursor-pointer rounded-md"
// // // //             style={{ boxShadow, y }}
// // // //         >
// // // //             {/* Render token details */}
// // // //         </Reorder.Item>
// // // //     );
// // // // };
// // // // // import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
// // // // // import { useNavigate } from "react-router-dom";
// // // // // import { useEffect, useState } from "react";
// // // // // import { Reorder } from "framer-motion";
// // // // // import { useMotionValue } from "framer-motion";
// // // // // import { useRaisedShadow } from "../../hooks/useRaisedShadow";

// // // // // const initialItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// // // // // const ExploreToken = () => {
// // // // //     const [items, setItems] = useState(initialItems);
// // // // //     useEffect(() => {
// // // // //         const interval = setInterval(() => {
// // // // //             const shuffledItems = [...items].sort(() => Math.random() - 0.5);
// // // // //             setItems(shuffledItems);
// // // // //         }, 3000);

// // // // //         return () => clearInterval(interval);
// // // // //     }, [items]);
// // // // //     return (
// // // // //         <>
// // // // //             <div className="overflow-x-auto">
// // // // //                 <table className="md:w-full max-md:w-[720px] max-md:overflow-x-auto border-separate border-spacing-y-3">
// // // // //                     <Reorder.Group as="tbody" axis="y" onReorder={setItems} values={items}>
// // // // //                         {items.map((item) => (
// // // // //                             <Item key={item} item={item} />
// // // // //                         ))}
// // // // //                     </Reorder.Group>
// // // // //                 </table>
// // // // //             </div>
// // // // //             <div className="my-4">
// // // // //                 <div className="flex gap-x-5 items-center justify-center">
// // // // //                     <div className="h-9 w-9  rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center">
// // // // //                         <MdKeyboardArrowLeft className="group:hover: text-white text-xl" />
// // // // //                     </div>
// // // // //                     <div className="text-white flex gap-x-2 items-center pfont-400">
// // // // //                         <span>2</span>
// // // // //                         <span>/</span>
// // // // //                         <span>10</span>
// // // // //                     </div>
// // // // //                     <div className="h-9 w-9  rounded-full bg-[#475dc0] hover:bg-blue-500 cursor-pointer shadow-gray-700 flex justify-center items-center">
// // // // //                         <MdKeyboardArrowRight className="group:hover: text-white text-xl" />
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>
// // // // //         </>
// // // // //     )
// // // // // }

// // // // // export default ExploreToken;

// // // // // export const Item = ({ item }) => {
// // // // //     const y = useMotionValue(0);
// // // // //     const boxShadow = useRaisedShadow(y);
// // // // //     const navigate = useNavigate()
// // // // //     return (
// // // // //         <Reorder.Item as="tr" onClick={() => navigate(`/token/${item}`)} value={item} id={item} className="bg-[#28282d] hover:bg-[#39393e] cursor-pointer rounded-md" style={{ boxShadow, y }}>
// // // // //             <td className="w-[40%] px-4 py-4">
// // // // //                 <div className="flex items-center gap-x-2">
// // // // //                     <span className="text-sm text-[#848489] pfont-400">#</span>
// // // // //                     <span className="pfont-600 text-sm uppercase text-white">andy</span>
// // // // //                     <span className="text-sm text-[#cccccc] pfont-400">Andy</span>
// // // // //                     <span><img className="w-5" src="/images/logo/andy.webp" alt="" /></span>
// // // // //                 </div>
// // // // //             </td>
// // // // //             <td className="px-4 py-4">
// // // // //                 <div className="flex gap-x-2 items-center">
// // // // //                     <span className="text-[#808080] text-sm pfont-400">1H</span>
// // // // //                     <span className="pfont-600 text-sm text-[#b0dc73]">23.3%</span>
// // // // //                 </div>
// // // // //             </td>
// // // // //             <td className="px-4 py-4">
// // // // //                 <div className="flex gap-x-2 items-center">
// // // // //                     <span className="text-[#808080] text-sm pfont-400">24H</span>
// // // // //                     <span className="pfont-600 text-sm text-[#f56565]">-80.3%</span>
// // // // //                 </div>
// // // // //             </td>
// // // // //             <td className="px-4 py-4">
// // // // //                 <div className="flex gap-x-2 items-center">
// // // // //                     <span className="text-[#808080] uppercase text-sm pfont-400">vol</span>
// // // // //                     <span className="text-sm text-white pfont-600">$12.2M</span>
// // // // //                 </div>
// // // // //             </td>
// // // // //             <td className="px-4 py-4">
// // // // //                 <div className="flex gap-x-2 items-center">
// // // // //                     <span className="text-[#808080] uppercase text-sm pfont-400">liq</span>
// // // // //                     <span className="text-sm text-white pfont-600">$12.2M</span>
// // // // //                 </div>
// // // // //             </td>
// // // // //         </Reorder.Item>
// // // // //     );
// // // // // };

