import client from './graphql/client';
import { GET_BONDING_CURVES, GET_BONDING_CURVE_TRADES } from './graphql/queries/chartQueries';

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
            description: curve.token.name,
            exchange: 'DEX',
            type: 'crypto',
            ticker: curve.id,
        }));
        onResultReadyCallback(symbols);
    },

    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        console.log('[resolveSymbol]: Method call', symbolName);
        const { data } = await client.query({
            query: GET_BONDING_CURVES,
        });
        const symbolItem = data.bondingCurves.find((curve) => curve.id === symbolName);
        if (!symbolItem) {
            console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
            onResolveErrorCallback('Cannot resolve symbol');
            return;
        }
        const symbolInfo = {
            ticker: symbolItem.id,
            name: symbolItem.token.name,
            description: symbolItem.token.name,
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            exchange: 'DEX',
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            has_weekly_and_monthly: false,
            supported_resolutions: ['1', '15', '30', '60', '1D', '1W', '1M'],
        };
        console.log('[resolveSymbol]: Symbol resolved', symbolName);
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