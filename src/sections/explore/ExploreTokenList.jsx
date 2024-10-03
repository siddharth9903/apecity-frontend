import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { Reorder } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { useMotionValue } from 'framer-motion';
import { useRaisedShadow } from '../../hooks/useRaisedShadow';
import { TOKENS_QUERY, TOTAL_TOKENS_QUERY } from '../../graphql/queries/tokenQueries';
import { createIpfsUrlFromContentHash, formatNumber } from '../../utils/formats';
import { FaCircleInfo } from "react-icons/fa6";
import { nativeCurrencyDetails } from '../../utils/native';
import { getChainLogo } from '../../config/chains';


const ExploreTokenList = ({ searchResults, sortBy, orderBy, reorderInterval }) => {
    const [tokens, setTokens] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const { data: totalTokensData, loading: totalTokensLoading, error: totalTokensError } = useQuery(TOTAL_TOKENS_QUERY, {
        pollInterval: 1000,
        fetchPolicy: 'no-cache'
    });
    const totalTokens = totalTokensData?.Factory?.reduce((acc, curr) => acc + (curr.tokenCount || 0), 0) || 0;

    const { data: tokensData, loading: tokensLoading, error: tokensError } = useQuery(TOKENS_QUERY, {
        variables: {
            first: pageSize,
            skip: (currentPage - 1) * pageSize,
            orderBy: [orderBy],
        },
        fetchPolicy: 'no-cache',
        pollInterval: reorderInterval ? reorderInterval : 5000
    });

    useEffect(() => {
        if (searchResults) {
            setTokens(searchResults);
        }
    }, [searchResults]);

    useEffect(() => {
        if (tokensData) {
            setTokens(tokensData?.Token);
        }
    }, [tokensData]);

    useEffect(() => {
        setTotalPages(Math.ceil(totalTokens / pageSize));
    }, [totalTokens, pageSize]);

    useEffect(() => {
        const searchResultTokens = searchResults.length
        setTotalPages(Math.ceil(searchResultTokens / pageSize));
    }, [searchResults, pageSize]);

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
                        {tokens && tokens?.map((item) => (
                            <Item key={item.id} item={item} />
                        ))}
                    </Reorder.Group>
                </table>
            </div>
            <div className="my-4">
                <div className="flex gap-x-5 items-center justify-center">
                    <div
                        className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-[#850F8D]  cursor-pointer shadow-gray-700 flex justify-center items-center"
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
                        className="h-9 w-9 rounded-full bg-[#475dc0] hover:bg-[#850F8D]  cursor-pointer shadow-gray-700 flex justify-center items-center"
                        onClick={handleNextPage}
                    >
                        <MdKeyboardArrowRight className="group:hover: text-white text-xl" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExploreTokenList;

export const Item = ({ item }) => {
    console.log('item', item)
    const { id, chainId, curveType, address, name, symbol, metadata, bondingCurve } = item;
    const nativeCurrency = nativeCurrencyDetails(chainId);
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    const navigate = useNavigate();

    return (
        <Reorder.Item
            as="tr"
            onClick={() => navigate(`/token/${chainId}/${address}`)}
            value={id}
            id={id}
            className="bg-[#28282d] hover:bg-[#39393e] cursor-pointer rounded-md"
            style={{ boxShadow, y }}
        >
            <td className="w-[25%] px-4 py-4">
                <div className="flex items-center gap-x-2">
                    <span className="text-sm text-[#848489] pfont-400">#</span>
                    <span className="pfont-600 text-sm uppercase text-white">{symbol}</span>
                    <span className="text-sm text-[#cccccc] pfont-400">{name}</span>
                    <span>
                        <img className="w-5" src={createIpfsUrlFromContentHash(metadata?.image)} alt="" />
                    </span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] uppercase text-sm font-400">chain</span>
                    <img src={getChainLogo(chainId)} className="h-6 w-6" alt="Ethereum Logo" />
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] uppercase text-sm pfont-400">curve</span>
                    <span className="text-sm text-white pfont-600">{curveType}</span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] text-sm pfont-400">MC</span>
                    <span className="pfont-600 text-sm text-[#48bb78]">{formatNumber(bondingCurve?.marketCap)} {nativeCurrency?.symbol}
                    </span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] text-sm pfont-400">VOL</span>
                    <span className="pfont-600 text-sm text-[#48bb78]">{formatNumber(bondingCurve?.volume)} {nativeCurrency?.symbol}
                    </span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-x-2 items-center">
                    <span className="text-[#808080] uppercase text-sm pfont-400">txn count</span>
                    <span className="text-sm text-white pfont-600">{formatNumber(bondingCurve?.txCount)}</span>
                </div>
            </td>
        </Reorder.Item>
    );
};