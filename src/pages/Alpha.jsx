import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine, ReferenceDot } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
} from "../components/ui/select";

import Decimal from 'decimal.js';
import { formatSmallNumber } from '../utils/formats';

const TokenomicsCalculator = {
    MAX_WEIGHT: 1000000,
    DEC: new Decimal('1e18'),
    HALF_DEC: new Decimal('1e9'),
    MAX_DECIMAL_PLACES: 14,

    format_decimal: (value) => {
        return new Decimal(value)?.toFixed(TokenomicsCalculator.MAX_DECIMAL_PLACES);
    },

    to_wei: (value) => {
        return new Decimal(value).mul(TokenomicsCalculator.DEC).floor();
    },

    from_wei: (value) => {
        return new Decimal(value).div(TokenomicsCalculator.DEC);
    },
};

const APECalculator = {
    calculate_tokens_out_for_exact_eth_in: (eth_amount_in, reserve_ratio, slope) => {
        const deposit_amount_dec = TokenomicsCalculator.to_wei(eth_amount_in);
        const reserve_ratio_dec = new Decimal(reserve_ratio);
        const slope_dec = new Decimal(slope);
        const purchase_return_dec = (deposit_amount_dec.div(reserve_ratio_dec.mul(slope_dec))).pow(reserve_ratio_dec);
        return TokenomicsCalculator.format_decimal(TokenomicsCalculator.from_wei(purchase_return_dec));
    },

    calculate_eth_in_for_exact_tokens_out: (token_amount_out, reserve_ratio, slope) => {
        const token_amount_out_dec = TokenomicsCalculator.to_wei(token_amount_out);
        const reserve_ratio_dec = new Decimal(reserve_ratio);
        const slope_dec = new Decimal(slope);
        const estimated_eth_in_dec = reserve_ratio_dec.mul(slope_dec).mul(token_amount_out_dec.pow(new Decimal(1).div(reserve_ratio_dec)));
        return TokenomicsCalculator.format_decimal(TokenomicsCalculator.from_wei(estimated_eth_in_dec));
    },

    calculate_price: (supply, reserve_ratio, slope) => {
        const supply_dec = TokenomicsCalculator.to_wei(supply);
        const reserve_ratio_dec = new Decimal(reserve_ratio);
        const slope_dec = new Decimal(slope);
        const exp = (new Decimal(1).div(reserve_ratio_dec)).minus(new Decimal(1))
        const price_dec = slope_dec.mul(supply_dec.pow(exp)) //price of 1 wei of token in wei
        const priceOfToken = price_dec.mul(TokenomicsCalculator.DEC) //price of 1 full token in wei

        return TokenomicsCalculator.from_wei(priceOfToken) // price of 1 full token in eth
    },

    calculate_marketcap: (supply, reserve_ratio, slope, total_supply) => {
        const price_in_eth_dec = APECalculator.calculate_price(supply, reserve_ratio, slope)
        const total_supply_in_eth_dec = new Decimal(total_supply)
        const market_cap = price_in_eth_dec.mul(total_supply_in_eth_dec)
        return market_cap
    }
};

const UniswapCalculator = {
    calculate_purchase_return: (eth_in, eth_reserve, token_reserve) => {
        if (new Decimal(eth_in).isZero() || new Decimal(eth_reserve).isZero() || new Decimal(token_reserve).isZero()) {
            return '0';
        }
        const eth_in_wei = TokenomicsCalculator.to_wei(eth_in);
        const eth_reserve_wei = TokenomicsCalculator.to_wei(eth_reserve);
        const token_reserve_wei = TokenomicsCalculator.to_wei(token_reserve);
        const token_out = token_reserve_wei.mul(eth_in_wei).div(eth_reserve_wei.plus(eth_in_wei));
        return TokenomicsCalculator.format_decimal(TokenomicsCalculator.from_wei(token_out));
    },

    estimate_eth_in_for_exact_tokens_out: (tokens_out, eth_reserve, token_reserve) => {
        if (new Decimal(tokens_out).isZero() || new Decimal(eth_reserve).isZero() || new Decimal(token_reserve).isZero()) {
            return '0';
        }
        const tokens_out_wei = TokenomicsCalculator.to_wei(tokens_out);
        const eth_reserve_wei = TokenomicsCalculator.to_wei(eth_reserve);
        const token_reserve_wei = TokenomicsCalculator.to_wei(token_reserve);
        const eth_in = eth_reserve_wei.mul(tokens_out_wei).div(token_reserve_wei.minus(tokens_out_wei)).plus(1);
        return TokenomicsCalculator.format_decimal(TokenomicsCalculator.from_wei(eth_in));
    },

    calculate_price: (supply, eth_reserve, token_reserve) => {
        const eth_reserve_wei = TokenomicsCalculator.to_wei(eth_reserve);
        const token_reserve_wei = TokenomicsCalculator.to_wei(token_reserve);
        let supply_wei = TokenomicsCalculator.to_wei(supply);
        supply_wei = token_reserve_wei.minus(supply_wei);

        const price_dec = eth_reserve_wei.mul(token_reserve_wei).div(supply_wei.pow(2)) //price of 1 wei of token in wei
        const priceOfToken = price_dec.mul(TokenomicsCalculator.DEC) //price of 1 full token in wei

        return TokenomicsCalculator.from_wei(priceOfToken)
    },

    calculate_marketcap: (supply, eth_reserve, token_reserve, total_supply_in_eth) => {
        const price_in_eth_dec = UniswapCalculator.calculate_price(supply, eth_reserve, token_reserve)
        const total_supply_in_eth_dec = new Decimal(total_supply_in_eth)
        const market_cap = price_in_eth_dec.mul(total_supply_in_eth_dec)
        return market_cap
    }
};

const InputWithPresets = ({ value, setValue, label, presets, unit }) => (
    <div className="space-y-2">
        <Label htmlFor={label}>{label}</Label>
        <div className="space-x-2">
            <Input
                id={label}
                type="number"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                className="w-full"
            />
            {/* <Select value={value.toString()} onValueChange={(value) => setValue(parseFloat(value))}>
                <SelectTrigger className="w-[80px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {presets.map((preset) => (
                        <SelectItem key={preset} value={preset.toString()}>{preset} {unit}</SelectItem>
                    ))}
                </SelectContent>
            </Select> */}
            <div className="flex space-x-1 mt-1">
                {presets.map((preset, index) => (
                    <Button key={index} variant="outline" size="sm" onClick={() => setValue(preset)}>
                        {preset} {unit}
                    </Button>
                ))}
            </div>
        </div>
    </div>
);

const SliderWithPresets = ({ value, setValue, label, min, max, step, presets }) => (
    <div className="space-y-2">
        <Label htmlFor={label}>{label}</Label>
        <div className="flex items-center space-x-2">
            <Slider
                id={label}
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={(newValue) => setValue(newValue[0])}
                className="w-full"
            />
            <Select value={value.toString()} onValueChange={(value) => setValue(parseFloat(value))}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {presets.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value.toString()}>{preset.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="text-sm text-gray-500">{value?.toFixed(3)}</div>
    </div>
);

const Alpha = () => {
    const [totalTokenSupply, setTotalTokenSupply] = useState(1000);
    const [targetedPoolBalance, setTargetedPoolBalance] = useState(4.2);
    const [targetedTokenSupply, setTargetedTokenSupply] = useState(70);
    const [reserveRatio, setReserveRatio] = useState(0.5);
    const [layout, setLayout] = useState('1');

    const [derivedValues, setDerivedValues] = useState({
        slope: 0,
        uniswapVirtualTokenReserve: 0,
        uniswapVirtualEthReserve: 0,
        purchaseReturnData: [],
        specificReturnData: [],
        ethEstimateData: []
    });

    const calculateAllValues = useMemo(() => () => {
        const actualTotalTokenSupply = totalTokenSupply * 1e6;
        const actualTargetedTokenSupply = (targetedTokenSupply / 100) * actualTotalTokenSupply;

        const targetedPoolBalanceDec = TokenomicsCalculator.to_wei(targetedPoolBalance);
        const reserveRatioDec = new Decimal(reserveRatio);
        const actualTargetedTokenSupplyDec = TokenomicsCalculator.to_wei(actualTargetedTokenSupply);

        const newSlope = targetedPoolBalanceDec.div(
            reserveRatioDec.mul(
                actualTargetedTokenSupplyDec.pow(new Decimal(1).div(reserveRatioDec))
            )
        );
        const newUniswapVirtualTokenReserve = actualTotalTokenSupply;
        const uniswapVirtualTokenReserveDec = TokenomicsCalculator.to_wei(newUniswapVirtualTokenReserve);
        const remainingTokenSupplyCurveAtMigrationDec = uniswapVirtualTokenReserveDec.minus(actualTargetedTokenSupplyDec);
        const newUniswapVirtualEthReserveDec = (remainingTokenSupplyCurveAtMigrationDec.mul(targetedPoolBalanceDec))
            .div(uniswapVirtualTokenReserveDec.minus(remainingTokenSupplyCurveAtMigrationDec));
        const newUniswapVirtualEthReserve = TokenomicsCalculator.from_wei(newUniswapVirtualEthReserveDec);

        const ethInRange = Array.from({ length: 100 }, (_, i) => targetedPoolBalance * (i + 1) / 100);
        const newPurchaseReturnData = ethInRange.map(ethIn => ({
            ethIn,
            apeReturn: parseFloat(APECalculator.calculate_tokens_out_for_exact_eth_in(ethIn, reserveRatio, newSlope)),
            uniswapReturn: parseFloat(UniswapCalculator.calculate_purchase_return(ethIn, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve)),
        }));

        const specificEthInputs = Array.from({ length: 5 }, (_, i) => targetedPoolBalance * (i + 1) * 0.2);
        const newSpecificReturnData = specificEthInputs.map(ethIn => ({
            ethIn: `${ethIn?.toFixed(2)} ETH (${((ethIn / targetedPoolBalance) * 100)?.toFixed(0)}%)`,
            apeReturn: parseFloat(APECalculator.calculate_tokens_out_for_exact_eth_in(ethIn, reserveRatio, newSlope)),
            uniswapReturn: parseFloat(UniswapCalculator.calculate_purchase_return(ethIn, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve)),
        }));

        const tokenAmounts = Array.from({ length: 10 }, (_, i) => actualTargetedTokenSupply * (i + 1) * 0.1);
        const newEthEstimateData = tokenAmounts.map(amount => ({
            tokenAmount: `${(amount / 1e6)?.toFixed(0)}M (${((amount / actualTargetedTokenSupply) * 100)?.toFixed(0)}%)`,
            apeEstimate: parseFloat(APECalculator.calculate_eth_in_for_exact_tokens_out(amount, reserveRatio, newSlope)),
            uniswapEstimate: parseFloat(UniswapCalculator.estimate_eth_in_for_exact_tokens_out(amount, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve)),
        }));

        const tokenAmountsInHundredsRange = Array.from({ length: 100 }, (_, i) => actualTotalTokenSupply * (i + 1) * 0.01);
        const tokenAmountsBeforeMigrationInHundredsRange = tokenAmountsInHundredsRange.filter(amount => amount <= actualTargetedTokenSupply);

        const newPriceData = tokenAmountsBeforeMigrationInHundredsRange.map(amount => {
            const priceData = {
                supply: amount,
                apePrice: parseFloat(APECalculator.calculate_price(amount, reserveRatio, newSlope)),
                uniswapPrice: parseFloat(UniswapCalculator.calculate_price(amount, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve))
            };

            if (amount == actualTargetedTokenSupply) {
                priceData.afterMigrationPrice = parseFloat(UniswapCalculator.calculate_price(
                    amount - actualTargetedTokenSupply,
                    new Decimal(targetedPoolBalance),
                    actualTotalTokenSupply - actualTargetedTokenSupply
                ));
            }

            return priceData;
        });

        const tokenAmountsAfterMigrationInHundredsRange = tokenAmountsInHundredsRange.filter(amount => amount >= actualTargetedTokenSupply);
        const newPriceAfterMigrationData = tokenAmountsAfterMigrationInHundredsRange.map(amount => {
            if (amount < actualTargetedTokenSupply || amount > 0.92 * actualTotalTokenSupply) {
                return null
            }

            return ({
                supply: amount,
                afterMigrationPrice: parseFloat(UniswapCalculator.calculate_price(
                    amount - actualTargetedTokenSupply,
                    new Decimal(targetedPoolBalance),
                    actualTotalTokenSupply - actualTargetedTokenSupply
                ))
            })
        }).filter(Boolean);

        const lastApePriceBeforeMigration = newPriceData[newPriceData.length - 1]
        const firstPriceAfterMigration = newPriceAfterMigrationData[0]

        const newMarketcapData = tokenAmountsInHundredsRange.map(amount => ({
            supply: amount,
            apeMarketcap: parseFloat(APECalculator.calculate_marketcap(amount, reserveRatio, newSlope, actualTotalTokenSupply)),
            uniswapMarketcap: parseFloat(UniswapCalculator.calculate_marketcap(amount, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve, actualTotalTokenSupply)),
        })
        );

        return {
            slope: newSlope,
            lastApePriceBeforeMigration: lastApePriceBeforeMigration,
            firstPriceAfterMigration: firstPriceAfterMigration,
            actualTargetedTokenSupply: actualTargetedTokenSupply,
            actualTotalTokenSupply: actualTotalTokenSupply,
            uniswapVirtualTokenReserve: newUniswapVirtualTokenReserve,
            uniswapVirtualEthReserve: newUniswapVirtualEthReserve,
            purchaseReturnData: newPurchaseReturnData,
            specificReturnData: newSpecificReturnData,
            ethEstimateData: newEthEstimateData,
            priceData: newPriceData,
            priceAfterMigrationData: newPriceAfterMigrationData,
            marketcapData: newMarketcapData
        };
    }, [totalTokenSupply, targetedPoolBalance, targetedTokenSupply, reserveRatio]);

    const resetToDefault = () => {
        setTotalTokenSupply(1000);
        setTargetedPoolBalance(4.2);
        setTargetedTokenSupply(70);
        setReserveRatio(0.5);
    };
    useEffect(() => {
        const newValues = calculateAllValues();
        setDerivedValues(newValues);
    }, [calculateAllValues]);

    const formatMillions = (value) => `${(value / 1000000)?.toFixed(0)}M`;

    // const formatEthToGwei = (valueInEth) => `${new Decimal(valueInEth).mul(TokenomicsCalculator.HALF_DEC).toString()} Gwei`;
    const formatEthToGwei = (valueInEth) => `${formatSmallNumber(new Decimal(valueInEth).mul(TokenomicsCalculator.HALF_DEC).toString())} Gwei`;
    const formatEth = (valueInEth) => `${formatSmallNumber(new Decimal(valueInEth).toString())} Eth`;

    const renderInputCard = () => (
        <Card className="w-full">
            <div className='flex'>
                <p className='mx-5 my-2 font-medium text-lg'>Input Parameters</p>
                <button className='ml-auto m-1 p-2  border-2 rounded-md' onClick={resetToDefault}>Reset All</button>
            </div>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InputWithPresets
                        value={totalTokenSupply}
                        setValue={setTotalTokenSupply}
                        label="Total Token Supply"
                        presets={[500, 1000, 1500, 2000]}
                        unit="M"
                    />
                    <InputWithPresets
                        value={targetedPoolBalance}
                        setValue={setTargetedPoolBalance}
                        label="Targeted Pool Balance"
                        presets={[4, 4.5, 5, 6]}
                        unit="ETH"
                    />
                    <InputWithPresets
                        value={targetedTokenSupply}
                        setValue={setTargetedTokenSupply}
                        label="Targeted Token Supply"
                        presets={[60, 70, 80, 90]}
                        unit="%"
                    />
                    <SliderWithPresets
                        value={reserveRatio}
                        setValue={setReserveRatio}
                        label="Reserve Ratio"
                        min={0.000}
                        max={1.000}
                        step={0.001}
                        presets={[
                            { label: "Flat", value: 1.000 },
                            { label: "Linear", value: 0.5 }
                        ]}
                    />
                </div>
            </CardContent>
        </Card>
    )

    const renderChart = (title, chartComponent) => (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    {chartComponent}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const purchaseReturnChart = (
        <LineChart data={derivedValues.purchaseReturnData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="ethIn"
                tickFormatter={(value) => `${value?.toFixed(2)} (${((value / targetedPoolBalance) * 100)?.toFixed(0)}%)`}
            />
            <YAxis tickFormatter={formatMillions} />
            <Tooltip
                formatter={(value, name) => [formatMillions(value), name]}
                labelFormatter={(value) => `${value?.toFixed(2)} ETH (${((value / targetedPoolBalance) * 100)?.toFixed(0)}%)`}
            />
            <Legend />
            <Line type="monotone" dataKey="apeReturn" stroke="#8884d8" name="APE Formula" />
            <Line type="monotone" dataKey="uniswapReturn" stroke="#82ca9d" name="Uniswap Formula" />
        </LineChart>
    );

    const priceChart = (
        <LineChart data={derivedValues.priceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="supply"
                tickFormatter={(value) => `${(value / 1e6)?.toFixed(0)}M (${((value / derivedValues.actualTargetedTokenSupply) * 100)?.toFixed(0)}%)`}
            />
            <YAxis tickFormatter={formatEthToGwei} />
            <Tooltip
                formatter={(value, name) => [formatEthToGwei(value), name]}
            />
            <Legend />
            <Line type="monotone" dataKey="apePrice" stroke="#8884d8" name="APE Formula" />
            <Line type="monotone" dataKey="uniswapPrice" stroke="#82ca9d" name="Uniswap Formula" />
            <Line type="monotone" dataKey="afterMigrationPrice" stroke="#ff3333" name="After Migration" />
            <ReferenceLine y={derivedValues?.firstPriceAfterMigration?.afterMigrationPrice} label="Price after migration" stroke="#ff3333" strokeDasharray="3 3" />
            <ReferenceDot
                x={derivedValues?.firstPriceAfterMigration?.supply}
                y={derivedValues?.firstPriceAfterMigration?.afterMigrationPrice}
                r={8}
                fill="#ff3333"
                stroke="#ff3333"
            />
        </LineChart>
    );

    const afterMigrationPriceChart = (
        <LineChart data={derivedValues.priceAfterMigrationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="supply"
                tickFormatter={(value) => `${(value / 1e6)?.toFixed(0)}M (${((value / derivedValues.actualTotalTokenSupply) * 100)?.toFixed(0)}%)`}
            />
            <YAxis tickFormatter={formatEthToGwei} />
            <Tooltip
                formatter={(value, name) => [formatEthToGwei(value), name]}
            />
            <Legend />
            <Line type="monotone" dataKey="afterMigrationPrice" stroke="#ff3333" name="After Migration" />
            <ReferenceLine y={derivedValues?.lastApePriceBeforeMigration?.apePrice} label="Last Ape price" stroke="#8884d8" strokeDasharray="3 3" />
            <ReferenceDot
                x={derivedValues?.lastApePriceBeforeMigration?.supply}
                y={derivedValues?.lastApePriceBeforeMigration?.apePrice}
                // r={8}
                fill="#8884d8"
                stroke="#8884d8"
            />
        </LineChart>
    );
    const marketcapChart = (
        <LineChart data={derivedValues.marketcapData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="supply"
                tickFormatter={(value) => `${(value / 1e6)?.toFixed(0)}M (${((value / derivedValues.actualTargetedTokenSupply) * 100)?.toFixed(0)}%)`}
            />
            <YAxis tickFormatter={formatEth} />
            <Tooltip
                formatter={(value, name) => [formatEth(value), name]}
            />
            <Legend />
            <Line type="monotone" dataKey="apeMarketcap" stroke="#8884d8" name="APE Formula" />
            <Line type="monotone" dataKey="uniswapMarketcap" stroke="#82ca9d" name="Uniswap Formula" />
        </LineChart>
    );

    const specificReturnChart = (
        <BarChart data={derivedValues.specificReturnData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ethIn" />
            <YAxis tickFormatter={formatMillions} />
            <Tooltip formatter={(value) => formatMillions(value)} />
            <Legend />
            <Bar dataKey="apeReturn" fill="#8884d8" name="APE Formula" />
            <Bar dataKey="uniswapReturn" fill="#82ca9d" name="Uniswap Formula" />
        </BarChart>
    );

    const ethEstimateChart = (
        <BarChart data={derivedValues.ethEstimateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tokenAmount" />
            <YAxis />
            <Tooltip
                formatter={(value, name) => [`${value?.toFixed(4)} ETH`, name]}
                labelFormatter={(value) => `${value}`}
            />
            <Legend />
            <Bar dataKey="apeEstimate" fill="#8884d8" name="APE Formula" />
            <Bar dataKey="uniswapEstimate" fill="#82ca9d" name="Uniswap Formula" />
        </BarChart>
    );


    const layouts = {
        '1': (
            <div className="grid grid-cols-1 gap-4">
                <div>{renderInputCard()}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="md:col-span-2 lg:col-span-2">
                        {renderChart("Price chart", priceChart)}
                    </div>
                    <div className="md:col-span-1">
                        {renderChart("Price after migration", afterMigrationPriceChart)}
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        {renderChart("Purchase Return Comparison", purchaseReturnChart)}
                    </div>
                    <div className="md:col-span-1">
                        {renderChart("Marketcap chart", marketcapChart)}
                    </div>
                    <div className="md:col-span-1">
                        {renderChart("Specific ETH Input Comparison", specificReturnChart)}
                    </div>
                    <div className="md:col-span-1">
                        {renderChart("Estimated ETH Input for Token Output", ethEstimateChart)}
                    </div>
                </div>
            </div>
        ),
        '2': (
            <div className="grid grid-cols-1 gap-4">
                <div>{renderInputCard()}</div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-3">
                        {renderChart("Purchase Return Comparison", purchaseReturnChart)}
                    </div>
                    <div className="lg:col-span-1">
                        {renderChart("Specific ETH Input Comparison", specificReturnChart)}
                    </div>
                    <div className="lg:col-span-2">
                        {renderChart("Estimated ETH Input for Token Output", ethEstimateChart)}
                    </div>
                </div>
            </div>
        ),
        '3': (
            <div className="grid grid-cols-1 gap-4">
                <div>{renderInputCard()}</div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="xl:col-span-3">
                        {renderChart("Purchase Return Comparison", purchaseReturnChart)}
                    </div>
                    <div>
                        {renderChart("Specific ETH Input Comparison", specificReturnChart)}
                    </div>
                    <div className="xl:col-span-2">
                        {renderChart("Estimated ETH Input for Token Output", ethEstimateChart)}
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <div className="container-fluid p-4 pt-[80px] bg-black text-white min-h-screen">
            <div className="flex justify-between items-center mb-4">
                {/* <h1 className="text-3xl font-bold">Tokenomics Calculator</h1> */}
                <Select value={layout} onValueChange={setLayout}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Layout 1</SelectItem>
                        <SelectItem value="2">Layout 2</SelectItem>
                        <SelectItem value="3">Layout 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {layouts[layout]}
        </div>
    );
}

export default Alpha;