import client from './graphql/client';
import { GET_BONDING_CURVE, GET_BONDING_CURVES, GET_BONDING_CURVE_TRADES } from './graphql/queries/chartQueries';
import { useSelector, useDispatch } from 'react-redux';
import { setFetchedData } from './redux/chartDataSlice';
import store from './redux/store';

let count = 0


function getBarPeriod(resolution) {
    switch (resolution) {
        case '1D':
            return 24 * 60 * 60 * 1000; // 1 day in milliseconds
        case '1H':
            return 60 * 60 * 1000; // 1 hour in milliseconds
        case '5':
            return 5 * 60 * 1000; // 5 minutes in milliseconds
        // Add more cases for other resolutions
        default:
            throw new Error(`Unknown resolution: ${resolution}`);
    }
}

const configurationData = {
    // Represents the resolutions for bars supported by your datafeed
    // supported_resolutions: ['5', '1D', '1W', '1M'],
    supported_resolutions: ['5','1D'],
    // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
    exchanges: [
        { value: 'Apecity', name: 'Apecity', desc: 'Apecity' },
        // { value: 'Kraken', name: 'Kraken', desc: 'Kraken bitcoin exchange' },
    ],
    // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
    symbols_types: [
        { name: 'Coins', value: 'Coins' }
    ]
};

function createDataFeed(_symbol, _tokenAddress, _bondingCurveAddress) {

    const modifiedDataFeed = {
        onReady: (callback) => {
            setTimeout(() => callback(configurationData));
        },

        searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
            const { data } = await client.query({
                query: GET_BONDING_CURVES,
            });
            const symbols = data.bondingCurves.map((curve) => ({
                symbol: curve.token.symbol,
                full_name: curve.token.name,
                description: curve.token.metaData?.description,
                exchange: 'Apecity',
                has_intraday: true,
                type: 'Coin',
                tokenAddress: curve.token.id,
                bondingCurveAddress: curve.id,
                ticker: curve.id,
            }));
            onResultReadyCallback(symbols);
        },

        resolveSymbol: async (symbol, onSymbolResolvedCallback, onResolveErrorCallback) => {

            const { data } = await client.query({
                query: GET_BONDING_CURVE,
                variables: { id: _bondingCurveAddress },
            });
            const bondingCurve = data.bondingCurve
            const token = bondingCurve.token
            const symbolInfo = {
                symbol: token.symbol,
                name: token.name,
                // description: token.metaData?.description,
                type: 'Coin',
                session: '24x7',
                timezone: 'Etc/UTC',
                exchange: 'Apecity',
                minmov: 1,
                pricescale: 1000000000000000,
                has_intraday: true,
                // visible_plots_set: 'ohlcv',
                visible_plots_set: 'ohlc',
                // has_intraday: true,
                // has_weekly_and_monthly: false,
                // supported_resolutions: ['1', '15', '30', '60', '1D', '1W', '1M'],
                supported_resolutions: ['5','1D'],
            };
            if (!symbolInfo) {
                console.log('[resolveSymbol]: Cannot resolve symbol', symbol);
                onResolveErrorCallback('Cannot resolve symbol');
                return;
            }
            console.log('[resolveSymbol]: Symbol resolved', symbol);
            onSymbolResolvedCallback(symbolInfo);
        },

        getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
            const { from, to, firstDataRequest, countBack } = periodParams;
            const state = store.getState(); // Get the current state from the Redux store
            let fetchedData = state.data[_bondingCurveAddress];

            try {
                if (!fetchedData || firstDataRequest) {
                    // Fetch data from the API and store it in the state
                    const { data } = await client.query({
                        query: GET_BONDING_CURVE_TRADES,
                        variables: {
                            bondingCurveId: _bondingCurveAddress,
                        },
                    });

                    if (!data.trades || data.trades.length === 0) {
                        onHistoryCallback([], { noData: true });
                        return;
                    }

                    fetchedData = data.trades
                    store.dispatch(setFetchedData({ bondingCurveAddress: _bondingCurveAddress, data: data.trades })); // Dispatch the action to update the Redux store
                }


                const filteredData = fetchedData?.filter((trade) => {
                    const tradeTime = parseFloat(trade.timestamp * 1000);
                    return tradeTime >= from * 1000 && tradeTime < to * 1000;
                });

                if (!filteredData) {
                    onHistoryCallback([], { noData: false });
                    return;
                }

                const bars = [];
                let currentBar = null;

                for (const trade of filteredData) {
                    const tradeTime = parseFloat(trade.timestamp * 1000);
                    const tradeOpenPrice = parseFloat(trade.openPrice);
                    const tradeClosePrice = parseFloat(trade.closePrice);
                    const tradeType = trade.type;

                    if (!currentBar || tradeTime >= currentBar.time + getBarPeriod(resolution)) {
                        // Start a new bar
                        currentBar = {
                            time: tradeTime,
                            open: tradeOpenPrice.toFixed(18),
                            high: tradeClosePrice.toFixed(18),
                            low: tradeOpenPrice.toFixed(18),
                            close: tradeClosePrice.toFixed(18),
                        };
                        bars.push(currentBar);
                    } else {
                        // Update the current bar
                        currentBar.high = Math.max(currentBar.high, tradeType === 'BUY' ? tradeClosePrice : tradeOpenPrice).toFixed(18);
                        currentBar.low = Math.min(currentBar.low, tradeType === 'BUY' ? tradeOpenPrice : tradeClosePrice).toFixed(18);
                        currentBar.close = tradeClosePrice;
                    }
                }

                onHistoryCallback(bars, { noData: false });
            } catch (error) {
                console.log('[getBars]: Error', error);
                onErrorCallback(error);
            }
        },

        // getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        //     const { from, to, firstDataRequest, countBack } = periodParams;

        //     try {
        //         const { data } = await client.query({
        //             query: GET_BONDING_CURVE_TRADES,
        //             variables: {
        //                 bondingCurveId: _bondingCurveAddress,
        //             },
        //         });
        //         console.log('query happening'+count)
        //         count++

        //         if (!data.trades || data.trades.length === 0) {
        //             onHistoryCallback([], { noData: false });
        //             return;
        //         }

        //         const bars = [];
        //         let currentBar = null;

        //         for (const trade of data.trades) {
        //             const tradeTime = parseFloat(trade.timestamp * 1000); // Convert timestamp to milliseconds
        //             const tradeOpenPrice = parseFloat(trade.openPrice);
        //             const tradeClosePrice = parseFloat(trade.closePrice);
        //             const tradeType = trade.type;

        //             if (!currentBar || tradeTime >= currentBar.time + getBarPeriod(resolution)) {
        //                 // Start a new bar
        //                 currentBar = {
        //                     time: tradeTime,
        //                     open: tradeOpenPrice.toFixed(18),
        //                     high: tradeClosePrice.toFixed(18),
        //                     low: tradeOpenPrice.toFixed(18),
        //                     close: tradeClosePrice.toFixed(18),
        //                 };
        //                 bars.push(currentBar);
        //             } else {
        //                 // Update the current bar
        //                 currentBar.high = Math.max(currentBar.high, tradeType === 'BUY' ? tradeClosePrice : tradeOpenPrice).toFixed(18);
        //                 currentBar.low = Math.min(currentBar.low, tradeType === 'BUY' ? tradeOpenPrice : tradeClosePrice).toFixed(18);
        //                 currentBar.close = tradeClosePrice;
        //             }
        //         }

        //         onHistoryCallback(bars, { noData: true });
        //     } catch (error) {
        //         console.log('[getBars]: Error', error);
        //         onErrorCallback(error);
        //     }
        // },

        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
            console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
        },

        unsubscribeBars: (subscriberUID) => {
            console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        },
    }
    return modifiedDataFeed
}
export default createDataFeed