import client from './graphql/client';
import { GET_BONDING_CURVE, GET_BONDING_CURVES, GET_BONDING_CURVE_TRADES } from './graphql/queries/chartQueries';

const configurationData = {
    // Represents the resolutions for bars supported by your datafeed
    // supported_resolutions: ['5','1D', '1W', '1M'],
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

export default {
    onReady: (callback) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    },

    searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
        console.log('[searchSymbols]: Method call');
        const { data } = await client.query({
            query: GET_BONDING_CURVES,
        });
        const symbols = data.bondingCurves.map((curve) => ({
            symbol: curve.token.symbol,
            full_name: curve.token.name,
            description: curve.token.metaData?.description,
            exchange: 'Apecity',
            type: 'Coin',
            tokenAddress: curve.token.id,
            bondingCurveAddress: curve.id,
            ticker: curve.id,
        }));
        onResultReadyCallback(symbols);
    },

    resolveSymbol: async (symbol, onSymbolResolvedCallback, onResolveErrorCallback) => {
        console.log('[resolveSymbol]: Method call', symbol);

        const { data } = await client.query({
            query: GET_BONDING_CURVE,
            variables: { id: symbol },
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
            pricescale: 100,
            has_intraday: true,
            has_weekly_and_monthly: false,
            supported_resolutions: ['1', '15', '30', '60', '1D', '1W', '1M'],
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
        console.log('[getBars]: Method call', symbolInfo);
        const { from, to, firstDataRequest } = periodParams;
        try {
            const { data } = await client.query({
                query: GET_BONDING_CURVE_TRADES,
                variables: {
                    bondingCurveId: symbolInfo.ticker,
                    from,
                    to,
                },
            });
            if (!data.trades || data.trades.length === 0) {
                onHistoryCallback([], { noData: true });
                return;
            }
            const bars = data.trades.map((trade) => ({
                time: trade.timestamp * 1000,
                low: Number(trade.avgPrice),
                high: Number(trade.avgPrice),
                open: Number(trade.avgPrice),
                close: Number(trade.avgPrice),
                volume: Number(trade.inAmount),
            }));
            onHistoryCallback(bars, { noData: false });
        } catch (error) {
            console.log('[getBars]: Error', error);
            onErrorCallback(error);
        }
    },

    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
    },

    unsubscribeBars: (subscriberUID) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    },
};
