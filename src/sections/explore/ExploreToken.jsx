import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { Reorder } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { useMotionValue } from 'framer-motion';
import { useRaisedShadow } from '../../hooks/useRaisedShadow';
import { TOKENS_QUERY, TOTAL_TOKENS_QUERY } from '../../graphql/queries/tokenQueries';
import { convertIpfsUrl } from '../../utils/formats';

const ExploreToken = ({ searchTerm, sortBy, orderBy, reorderInterval }) => {
    const [tokens, setTokens] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const { data: totalTokensData, loading: totalTokensLoading, error: totalTokensError } = useQuery(TOTAL_TOKENS_QUERY, {
        pollInterval: 2000
    });
    const totalTokens = totalTokensData?.factory?.tokenCount || 0;

    const { data: tokensData, loading: tokensLoading, error: tokensError } = useQuery(TOKENS_QUERY, {
        variables: {
            first: pageSize,
            skip: (currentPage - 1) * pageSize,
            orderBy: sortBy,
            orderDirection: orderBy,
            // searchTerm: searchTerm || undefined,
        },
        pollInterval: reorderInterval ? reorderInterval * 1000 : 0,
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