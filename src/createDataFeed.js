import client from './graphql/client';
import { GET_BONDING_CURVE, GET_BONDING_CURVES, GET_BONDING_CURVE_TRADES } from './graphql/queries/chartQueries';
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
        { value: 'Apecity', name: 'Apecity', desc: 'Apecity' },
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
        const tradeType = trade.type;

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


function createDataFeed(_symbol, _tokenAddress, _bondingCurveAddress) {
    let subscriptionObserver = null;
    const subscriptionObservers = new Map();

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
            // console.log('[getBars]: Method call with :');

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

        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
            // console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);

            // Get the last trade timestamp from the Redux store
            const state = store.getState();
            const fetchedData = state.data[_bondingCurveAddress];
            const lastTradeTimestamp = fetchedData ? fetchedData[fetchedData.length - 1].timestamp : 0;

            const observableSubscription = client.subscribe({
                query: BONDING_CURVE_TRADE_SUBSCRIPTION,
                variables: { bondingCurveId: _bondingCurveAddress, afterTimestamp: lastTradeTimestamp },
            });

            const subscription = observableSubscription.subscribe({
                next: ({ data }) => {
                    const newTrades = data.newTrades;

                    if (newTrades.length == 0) {
                        return;
                    }

                    // Process the new trades and get the updated bar
                    const updatedBar = processNewTradesToBar(newTrades, resolution, fetchedData);
                    console.log('_bondingCurveAddress', _bondingCurveAddress);

                    // Update the Redux store with the new trades
                    store.dispatch(setFetchedData({ bondingCurveAddress: _bondingCurveAddress, data: [...fetchedData, ...newTrades] }));

                    // Call the onRealtimeCallback with the updated bar
                    onRealtimeCallback(updatedBar);
                },
                error: (error) => {
                    console.error('Subscription error:', error);
                },
            });

            // Store the subscription observer
            subscriptionObservers.set(subscriberUID, subscription);
        },

        unsubscribeBars: (subscriberUID) => {
            const subscription = subscriptionObservers.get(subscriberUID);
            if (subscription) {
                // Unsubscribe from the subscription
                subscription.unsubscribe();

                // Remove the subscription observer from the map
                subscriptionObservers.delete(subscriberUID);
            }
        },

        // subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        //     // console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);

        //     // Get the last trade timestamp from the Redux store
        //     const state = store.getState();
        //     const fetchedData = state.data[_bondingCurveAddress];
        //     const lastTradeTimestamp = fetchedData ? fetchedData[fetchedData.length - 1].timestamp : 0;

        //     const observableSubscription = client.subscribe({
        //         query: BONDING_CURVE_TRADE_SUBSCRIPTION,
        //         variables: { bondingCurveId: _bondingCurveAddress, afterTimestamp: lastTradeTimestamp},
        //     });

        //     const subscription = observableSubscription.subscribe({
        //         next: ({ data }) => {
        //             const newTrades = data.newTrades;

        //             if (newTrades.length == 0) {
        //                 return;
        //             }

        //             // Process the new trades and get the updated bar
        //             const updatedBar = processNewTradesToBar(newTrades, resolution, fetchedData);
        //             console.log('updatedBar',updatedBar)
        //             // Update the Redux store with the new trades
        //             store.dispatch(setFetchedData({ bondingCurveAddress: _bondingCurveAddress, data: [...fetchedData, ...newTrades] }));

        //             // Call the onRealtimeCallback with the updated bar
        //             onRealtimeCallback(updatedBar);
        //         },
        //         error: (error) => {
        //             console.error('Subscription error:', error);
        //         },
        //     });
            

        //     // No need to store the subscription observer
        //     // Apollo Client will handle the subscription lifecycle automatically
        // },

        // unsubscribeBars: (subscriberUID) => {
        //     // console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        // },
    }
    return modifiedDataFeed
}
export default createDataFeed