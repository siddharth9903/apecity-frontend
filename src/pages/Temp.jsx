import { useEffect, useRef } from 'react';
import Datafeed from '../datafeed';

const Temp = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const widgetOptions = {
            symbol: 'AAPL',
            interval: '60',
            fullscreen: false,
            container: containerRef.current,
            // library_path: 'https://charting-library.tradingview-widget.com/charting_library/charting_library.standalone.js',
            library_path: 'charting_library.js',
            datafeed: Datafeed,
        };

        const widget = new window.TradingView.widget(widgetOptions);

        return () => {
            if (widget !== null) {
                widget.remove();
            }
        };
    }, []);

    return <div ref={containerRef} style={{ height: '500px' }}></div>;
};

export default Temp;
// import { useMemo, useRef, useState } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import { BsChatSquare, BsThreeDotsVertical, BsTwitterX, CgMenuRightAlt, FaChevronRight, FaExternalLinkAlt, FaFire, FaFireAlt, FaInfoCircle, FaRegCopy, FaSearch, FaSketch, FaTelegramPlane, FiChevronDown, RxCross2 } from './../assets/icons/vander';
// import Transactions from '../sections/token/Transactions';
// import { shortenText } from '../utils/helper';
// import { Tooltip } from 'react-tooltip';
// import Holders from '../sections/token/Holders';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import { FreeMode } from 'swiper/modules';
// import 'react-responsive-modal/styles.css';
// import { Modal } from 'react-responsive-modal';
// import Tokens from '../sections/token/Tokens';
// import { FaCircleArrowLeft } from "react-icons/fa6";
// import { useForm, useWatch } from 'react-hook-form';
// import * as Yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { enqueueSnackbar } from 'notistack';
// import copy from 'copy-to-clipboard';
// import { FaChartSimple } from "react-icons/fa6";
// import { useNavigate, useParams } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
// import { TOKEN_QUERY, TOKEN_TRADES_QUERY } from '../graphql/queries/tokenQueries';
// import TokenDetails from '../sections/token/TokenDetails';
// import TradeComponent from '../sections/token/TradeComponent';
// import { formatNumber } from '../utils/formats';
// import Datafeed from '../datafeed';

// const Temp = () => {
//     const navigate = useNavigate();
//     // let { tokenAddress } = useParams();
//     const tokenAddress = "0x6ef6696991e30cefb1d16c01376ef57d053da436"

//     const [tabIndex, setTabIndex] = useState(0);
//     const [tabIndex1, setTabIndex1] = useState(0);
//     const [tabIndex2, setTabIndex2] = useState(0);
//     const [tabIndex3, setTabIndex3] = useState(0);
//     const [open, setOpen] = useState(false);
//     const onOpenModal = () => setOpen(true);
//     const onCloseModal = () => setOpen(false);
//     const [open1, setOpen1] = useState(false);
//     const onOpenModal1 = () => setOpen1(true);
//     const onCloseModal1 = () => setOpen1(false);
//     const [open2, setOpen2] = useState(false);
//     const onOpenModal2 = () => setOpen2(true);
//     const [eth, setETH] = useState(true);
//     const onCloseModal2 = () => setOpen2(false);
//     const TradeSchema = Yup.object().shape({});

//     const { data: tokenData, loading: tokenLoading, error: tokenError } = useQuery(TOKEN_QUERY, {
//         variables: { id: tokenAddress },
//     });

//     const [tradesPage, setTradesPage] = useState(1);
//     const tradesPageSize = 10;

//     const { data: tradesData, loading: tradesLoading, error: tradesError } = useQuery(TOKEN_TRADES_QUERY, {
//         variables: {
//             bondingCurveId: tokenData?.token?.bondingCurve?.id,
//             first: tradesPageSize,
//             skip: (tradesPage - 1) * tradesPageSize,
//         },
//         skip: !tokenData?.token?.bondingCurve?.id,
//         pollInterval: 2000,
//     });

//     const token = tokenData?.token;
//     const bondingCurve = token?.bondingCurve;
//     const trades = tradesData?.trades;
//     const bondingCurveProgress = 100 - (bondingCurve?.ethAmountToCompleteCurve / bondingCurve?.totalEthAmountToCompleteCurve) * 100;
//     const remainingSupplyInCurve = bondingCurve?.tokenAmountToCompleteCurve;

//     const targetDivRef = useRef(null);
//     const { register, control, setValue, handleSubmit, formState: { errors } } = useForm({
//         resolver: yupResolver(TradeSchema),
//     });
//     const onSubmit = (values) => { };
//     const value = useWatch({
//         name: 'value',
//         control,
//     });
//     const handleClick = () => {
//         if (targetDivRef.current) {
//             targetDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         } else {
//             console.error("Target div with ref 'targetDivRef' not found.");
//         }
//     };
//     const price = useMemo(() => {
//         return value == undefined || value == null || value == '' ? null : `${parseFloat(value) * 307636.863473} ETH`;
//     }, [value]);

//     console.log('tokenAddress', tokenAddress);

//     const widgetOptions = {
//         symbol: token?.id,
//         interval: '60',
//         fullscreen: false,
//         container: 'tv_chart_container',
//         // library_path: 'https://charting-library.tradingview-widget.com/charting_library/',
//         library_path: 'https://charting-library.tradingview-widget.com/charting_library/charting_library.standalone.js',
//         datafeed: Datafeed,
//     };

//     // function initOnReady() {
//     //     var widget = window.tvWidget = new TradingView.widget({
//     //         library_path: "https://charting-library.tradingview-widget.com/charting_library/",
//     //         // debug: true, // uncomment this line to see Library errors and warnings in the console
//     //         fullscreen: true,
//     //         symbol: 'AAPL',
//     //         interval: '1D',
//     //         container: "tv_chart_container",
//     //         // datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo-feed-data.tradingview.com"),
//     //         datafeed: Datafeed,
//     //         locale: "en",
//     //         disabled_features: [],
//     //         enabled_features: [],
//     //     });
//     // };

//     // window.addEventListener('DOMContentLoaded', initOnReady, false);


//     return (
//         <>
//             {/* <div id="tv_chart_container" style={{ height: '450px' }}></div> */}

//             <div id="tv_chart_container"></div>
//         </>
//     );
// };

// export default Temp;