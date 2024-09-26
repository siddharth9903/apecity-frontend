import client from './graphql/client';
import { GET_BONDING_CURVE, GET_BONDING_CURVES, GET_BONDING_CURVES_FOR_CHART_QUERY, GET_BONDING_CURVE_FOR_CHART_QUERY, GET_BONDING_CURVE_TRADES, GET_BONDING_CURVE_TRADES_FOR_CHART_QUERY } from './graphql/queries/chartQueries';
import { useSelector, useDispatch } from 'react-redux';
import { setFetchedData } from './redux/chartDataSlice';
import store from './redux/store';
import { BONDING_CURVE_TRADE_SUBSCRIPTION } from './graphql/subscriptions/chartSubscriptions';
import { gql } from '@apollo/client';

let count = 0


const channelToSubscription = new Map();


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
        { value: 'Apecity', name: 'Ape City', desc: 'Ape City' },
        // { value: 'Kraken', name: 'Kraken', desc: 'Kraken bitcoin exchange' },
    ],
    // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
    symbols_types: [
        { name: 'Coins', value: 'Coins' }
    ]
};

function processNewTradesToBar(newTrades, resolution, existingTrades) {
    const allTrades = [...existingTrades, ...newTrades];
    let updatedBar = null;

    for (const trade of allTrades) {
        const tradeTime = parseFloat(trade.timestamp * 1000);
        const tradeOpenPrice = parseFloat(trade.openPrice);
        const tradeClosePrice = parseFloat(trade.closePrice);
        const tradeType = trade.tradeType;

        if (!updatedBar || tradeTime >= updatedBar.time + getBarPeriod(resolution)) {
            // Start a new bar
            updatedBar = {
                time: tradeTime,
                open: tradeOpenPrice.toFixed(18),
                high: tradeClosePrice.toFixed(18),
                low: tradeOpenPrice.toFixed(18),
                close: tradeClosePrice.toFixed(18),
            };
        } else {
            // Update the current bar
            updatedBar.high = Math.max(updatedBar.high, tradeType === 'BUY' ? tradeClosePrice : tradeOpenPrice).toFixed(18);
            updatedBar.low = Math.min(updatedBar.low, tradeType === 'BUY' ? tradeOpenPrice : tradeClosePrice).toFixed(18);
            updatedBar.close = tradeClosePrice;
        }
    }

    return updatedBar;
}


function createDataFeed(tokenDetails) {

    let subscriptionObserver = null;
    const subscriptionObservers = new Map();

    const modifiedDataFeed = {
        onReady: (callback) => {
            setTimeout(() => callback(configurationData));
        },

        searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
            const { data } = await client.query({
                query: GET_BONDING_CURVES_FOR_CHART_QUERY,
            });
            const symbols = data?.BondingCurve?.map((curve) => ({
                symbol: curve.token.symbol,
                full_name: curve.token.name,
                description: curve.token.metadata?.description,
                exchange: 'Ape City',
                has_intraday: true,
                type: 'Coin',
                tokenAddress: curve.token.address,
                bondingCurveAddress: curve.address,
                ticker: curve.token.symbol,
            }));
            onResultReadyCallback(symbols);
        },

        resolveSymbol: async (symbol, onSymbolResolvedCallback, onResolveErrorCallback) => {
            const { data } = await client.query({
                query: GET_BONDING_CURVE_FOR_CHART_QUERY,
                variables: { id: tokenDetails?.bondingCurve?.id },
            });
            const bondingCurve = data.BondingCurve_by_pk
            const token = bondingCurve.token
            const symbolInfo = {
                symbol: token.symbol,
                name: token.name,
                // description: token.metadata?.description,
                type: 'Coin',
                session: '24x7',
                timezone: 'Etc/UTC',
                exchange: 'Ape City',
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
            // console.log('[getBars]: Method call with :');
            const { from, to, firstDataRequest, countBack } = periodParams;
            const state = store.getState(); // Get the current state from the Redux store
            let fetchedData = state.data[tokenDetails?.bondingCurve?.address];

            try {
                if (!fetchedData || firstDataRequest) {
                    // Fetch data from the API and store it in the state
                    const { data } = await client.query({
                        query: GET_BONDING_CURVE_TRADES_FOR_CHART_QUERY,
                        variables: {
                            bondingCurveId: tokenDetails?.bondingCurve?.id,
                        },
                    });

                    if (!data.Trade || data.Trade.length === 0) {
                        onHistoryCallback([], { noData: true });
                        return;
                    }

                    fetchedData = data.Trade
                    store.dispatch(setFetchedData({ bondingCurveAddress: tokenDetails?.bondingCurve?.address, data: data.Trade })); // Dispatch the action to update the Redux store
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
                    const tradeType = trade.tradeType;

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

        // subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        //     // console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);

        //     // Get the last trade timestamp from the Redux store
        //     const state = store.getState();
        //     const fetchedData = state.data[token?.bondingCurve?.address];
        //     const lastTradeTimestamp = fetchedData ? fetchedData[fetchedData.length - 1].timestamp : 0;

        //     const observableSubscription = client.subscribe({
        //         query: BONDING_CURVE_TRADE_SUBSCRIPTION,
        //         variables: { bondingCurveId: token?.bondingCurve?.address, afterTimestamp: lastTradeTimestamp },
        //     });

        //     const subscription = observableSubscription.subscribe({
        //         next: ({ data }) => {
        //             const newTrades = data.newTrades;

        //             if (newTrades.length == 0) {
        //                 return;
        //             }

        //             // Process the new trades and get the updated bar
        //             const updatedBar = processNewTradesToBar(newTrades, resolution, fetchedData);
        //             console.log('token?.bondingCurve?.address', token?.bondingCurve?.address);

        //             // Update the Redux store with the new trades
        //             store.dispatch(setFetchedData({ bondingCurveAddress: token?.bondingCurve?.address, data: [...fetchedData, ...newTrades] }));

        //             // Call the onRealtimeCallback with the updated bar
        //             onRealtimeCallback(updatedBar);
        //         },
        //         error: (error) => {
        //             console.error('Subscription error:', error);
        //         },
        //     });

        //     // Store the subscription observer
        //     subscriptionObservers.set(subscriberUID, subscription);
        // },

        // unsubscribeBars: (subscriberUID) => {
        //     const subscription = subscriptionObservers.get(subscriberUID);
        //     if (subscription) {
        //         // Unsubscribe from the subscription
        //         subscription.unsubscribe();

        //         // Remove the subscription observer from the map
        //         subscriptionObservers.delete(subscriberUID);
        //     }
        // },
    }
    return modifiedDataFeed
}
export default createDataFeed