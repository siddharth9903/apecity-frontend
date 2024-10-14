import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
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

const TokenomicsCalculator = {
    MAX_WEIGHT: 1000000,
    DEC: new Decimal('1e18'),
    MAX_DECIMAL_PLACES: 14,

    format_decimal: (value) => {
        return new Decimal(value).toFixed(TokenomicsCalculator.MAX_DECIMAL_PLACES);
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
};
const InputWithPresets = ({ value, setValue, label, presets, unit }) => (
    <div className="space-y-2">
        <Label htmlFor={label}>{label}</Label>
        <Input
            id={label}
            type="number"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
        />
        <div className="flex space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setValue(0)}>Reset</Button>
            {presets.map((preset, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setValue(preset)}>
                    {preset} {unit}
                </Button>
            ))}
        </div>
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
            ethIn: `${ethIn.toFixed(2)} ETH (${((ethIn / targetedPoolBalance) * 100).toFixed(0)}%)`,
            apeReturn: parseFloat(APECalculator.calculate_tokens_out_for_exact_eth_in(ethIn, reserveRatio, newSlope)),
            uniswapReturn: parseFloat(UniswapCalculator.calculate_purchase_return(ethIn, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve)),
        }));

        const tokenAmounts = Array.from({ length: 10 }, (_, i) => actualTargetedTokenSupply * (i + 1) * 0.1);
        const newEthEstimateData = tokenAmounts.map(amount => ({
            tokenAmount: `${(amount / 1e6).toFixed(0)}M (${((amount / actualTargetedTokenSupply) * 100).toFixed(0)}%)`,
            apeEstimate: parseFloat(APECalculator.calculate_eth_in_for_exact_tokens_out(amount, reserveRatio, newSlope)),
            uniswapEstimate: parseFloat(UniswapCalculator.estimate_eth_in_for_exact_tokens_out(amount, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve)),
        }));

        return {
            slope: newSlope,
            uniswapVirtualTokenReserve: newUniswapVirtualTokenReserve,
            uniswapVirtualEthReserve: newUniswapVirtualEthReserve,
            purchaseReturnData: newPurchaseReturnData,
            specificReturnData: newSpecificReturnData,
            ethEstimateData: newEthEstimateData
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

    const formatMillions = (value) => `${(value / 1000000).toFixed(0)}M`;


    const renderInputCard = () => (
        <Card className="h-full">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Input Parameters</CardTitle>
                <Button onClick={resetToDefault}>Reset</Button>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    <InputWithPresets
                        value={totalTokenSupply}
                        setValue={setTotalTokenSupply}
                        label="Total Token Supply (in millions)"
                        presets={[500, 1000, 1500, 2000]}
                        unit="M"
                    />
                    <InputWithPresets
                        value={targetedPoolBalance}
                        setValue={setTargetedPoolBalance}
                        label="Targeted Pool Balance (in ETH)"
                        presets={[4, 4.5, 5, 6]}
                        unit="ETH"
                    />
                    <InputWithPresets
                        value={targetedTokenSupply}
                        setValue={setTargetedTokenSupply}
                        label="Targeted Token Supply (% of Total Supply)"
                        presets={[60, 70, 80, 90]}
                        unit="%"
                    />
                    <div>
                        <Label htmlFor="reserveRatio">Reserve Ratio</Label>
                        <Slider
                            id="reserveRatio"
                            min={1}
                            max={999}
                            step={1}
                            value={[reserveRatio * 1000]}
                            onValueChange={(value) => setReserveRatio(value[0] / 1000)}
                        />
                        <span>{reserveRatio.toFixed(3)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

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
                tickFormatter={(value) => `${value.toFixed(2)} (${((value / targetedPoolBalance) * 100).toFixed(0)}%)`}
            />
            <YAxis tickFormatter={formatMillions} />
            <Tooltip
                formatter={(value, name) => [formatMillions(value), name]}
                labelFormatter={(value) => `${value.toFixed(2)} ETH (${((value / targetedPoolBalance) * 100).toFixed(0)}%)`}
            />
            <Legend />
            <Line type="monotone" dataKey="apeReturn" stroke="#8884d8" name="APE Formula" />
            <Line type="monotone" dataKey="uniswapReturn" stroke="#82ca9d" name="Uniswap Formula" />
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
                formatter={(value, name) => [`${value.toFixed(4)} ETH`, name]}
                labelFormatter={(value) => `${value}`}
            />
            <Legend />
            <Bar dataKey="apeEstimate" fill="#8884d8" name="APE Formula" />
            <Bar dataKey="uniswapEstimate" fill="#82ca9d" name="Uniswap Formula" />
        </BarChart>
    );


    const layouts = {
        '1': (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2 lg:col-span-1">
                    {renderInputCard()}
                </div>
                <div className="md:col-span-2 lg:col-span-2">
                    {renderChart("Purchase Return Comparison", purchaseReturnChart)}
                </div>
                <div className="md:col-span-1">
                    {renderChart("Specific ETH Input Comparison", specificReturnChart)}
                </div>
                <div className="md:col-span-1">
                    {renderChart("Estimated ETH Input for Token Output", ethEstimateChart)}
                </div>
            </div>
        ),
        '2': (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                    {renderInputCard()}
                </div>
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        <div>{renderChart("Purchase Return Comparison", purchaseReturnChart)}</div>
                        <div>{renderChart("Specific ETH Input Comparison", specificReturnChart)}</div>
                        <div className="md:col-span-2">
                            {renderChart("Estimated ETH Input for Token Output", ethEstimateChart)}
                        </div>
                    </div>
                </div>
            </div>
        ),
        '3': (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-screen">
                <div className="xl:col-span-1 overflow-auto">
                    {renderInputCard()}
                </div>
                <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="md:col-span-2 xl:col-span-3">
                        {renderChart("Purchase Return Comparison", purchaseReturnChart)}
                    </div>
                    <div>
                        {renderChart("Specific ETH Input Comparison", specificReturnChart)}
                    </div>
                    <div>
                        {renderChart("Estimated ETH Input for Token Output", ethEstimateChart)}
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <div className="container-fluid p-4 pt-[80px] bg-black text-white min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Tokenomics Calculator</h1>
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
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Slider } from "../components/ui/slider";
// import { Label } from "../components/ui/label";
// import { Button } from "../components/ui/button";

// import Decimal from 'decimal.js';

// const TokenomicsCalculator = {
//     MAX_WEIGHT: 1000000,
//     DEC: new Decimal('1e18'),
//     MAX_DECIMAL_PLACES: 14,

//     format_decimal: (value) => {
//         return new Decimal(value).toFixed(TokenomicsCalculator.MAX_DECIMAL_PLACES);
//     },

//     to_wei: (value) => {
//         return new Decimal(value).mul(TokenomicsCalculator.DEC).floor();
//     },

//     from_wei: (value) => {
//         return new Decimal(value).div(TokenomicsCalculator.DEC);
//     },
// };

// const APECalculator = {
//     calculate_tokens_out_for_exact_eth_in: (eth_amount_in, reserve_ratio, slope) => {
//         const deposit_amount_dec = TokenomicsCalculator.to_wei(eth_amount_in);
//         const reserve_ratio_dec = new Decimal(reserve_ratio);
//         const slope_dec = new Decimal(slope);
//         const purchase_return_dec = (deposit_amount_dec.div(reserve_ratio_dec.mul(slope_dec))).pow(reserve_ratio_dec);
//         return TokenomicsCalculator.format_decimal(TokenomicsCalculator.from_wei(purchase_return_dec));
//     },

//     calculate_eth_in_for_exact_tokens_out: (token_amount_out, reserve_ratio, slope) => {
//         const token_amount_out_dec = TokenomicsCalculator.to_wei(token_amount_out);
//         const reserve_ratio_dec = new Decimal(reserve_ratio);
//         const slope_dec = new Decimal(slope);
//         const estimated_eth_in_dec = reserve_ratio_dec.mul(slope_dec).mul(token_amount_out_dec.pow(new Decimal(1).div(reserve_ratio_dec)));
//         return TokenomicsCalculator.format_decimal(TokenomicsCalculator.from_wei(estimated_eth_in_dec));
//     },
// };

// const UniswapCalculator = {
//     calculate_purchase_return: (eth_in, eth_reserve, token_reserve) => {
//         if (new Decimal(eth_in).isZero() || new Decimal(eth_reserve).isZero() || new Decimal(token_reserve).isZero()) {
//             return '0';
//         }
//         const eth_in_wei = TokenomicsCalculator.to_wei(eth_in);
//         const eth_reserve_wei = TokenomicsCalculator.to_wei(eth_reserve);
//         const token_reserve_wei = TokenomicsCalculator.to_wei(token_reserve);
//         const token_out = token_reserve_wei.mul(eth_in_wei).div(eth_reserve_wei.plus(eth_in_wei));
//         return TokenomicsCalculator.format_decimal(TokenomicsCalculator.from_wei(token_out));
//     },

//     estimate_eth_in_for_exact_tokens_out: (tokens_out, eth_reserve, token_reserve) => {
//         if (new Decimal(tokens_out).isZero() || new Decimal(eth_reserve).isZero() || new Decimal(token_reserve).isZero()) {
//             return '0';
//         }
//         const tokens_out_wei = TokenomicsCalculator.to_wei(tokens_out);
//         const eth_reserve_wei = TokenomicsCalculator.to_wei(eth_reserve);
//         const token_reserve_wei = TokenomicsCalculator.to_wei(token_reserve);
//         const eth_in = eth_reserve_wei.mul(tokens_out_wei).div(token_reserve_wei.minus(tokens_out_wei)).plus(1);
//         return TokenomicsCalculator.format_decimal(TokenomicsCalculator.from_wei(eth_in));
//     },
// };
// const InputWithPresets = ({ value, setValue, label, presets, unit }) => (
//     <div className="space-y-2">
//         <Label htmlFor={label}>{label}</Label>
//         <Input
//             id={label}
//             type="number"
//             value={value}
//             onChange={(e) => setValue(parseFloat(e.target.value))}
//         />
//         <div className="flex space-x-2 mt-2">
//             <Button variant="outline" size="sm" onClick={() => setValue(0)}>Reset</Button>
//             {presets.map((preset, index) => (
//                 <Button key={index} variant="outline" size="sm" onClick={() => setValue(preset)}>
//                     {preset} {unit}
//                 </Button>
//             ))}
//         </div>
//     </div>
// );

// const Alpha = () => {
//     const [totalTokenSupply, setTotalTokenSupply] = useState(1000);
//     const [targetedPoolBalance, setTargetedPoolBalance] = useState(4.2);
//     const [targetedTokenSupply, setTargetedTokenSupply] = useState(70);
//     const [reserveRatio, setReserveRatio] = useState(0.5);

//     const [derivedValues, setDerivedValues] = useState({
//         slope: 0,
//         uniswapVirtualTokenReserve: 0,
//         uniswapVirtualEthReserve: 0,
//         purchaseReturnData: [],
//         specificReturnData: [],
//         ethEstimateData: []
//     });

//     const calculateAllValues = useMemo(() => () => {
//         const actualTotalTokenSupply = totalTokenSupply * 1e6;
//         const actualTargetedTokenSupply = (targetedTokenSupply / 100) * actualTotalTokenSupply;

//         const targetedPoolBalanceDec = TokenomicsCalculator.to_wei(targetedPoolBalance);
//         const reserveRatioDec = new Decimal(reserveRatio);
//         const actualTargetedTokenSupplyDec = TokenomicsCalculator.to_wei(actualTargetedTokenSupply);

//         const newSlope = targetedPoolBalanceDec.div(
//             reserveRatioDec.mul(
//                 actualTargetedTokenSupplyDec.pow(new Decimal(1).div(reserveRatioDec))
//             )
//         );
//         const newUniswapVirtualTokenReserve = actualTotalTokenSupply;
//         const uniswapVirtualTokenReserveDec = TokenomicsCalculator.to_wei(newUniswapVirtualTokenReserve);
//         const remainingTokenSupplyCurveAtMigrationDec = uniswapVirtualTokenReserveDec.minus(actualTargetedTokenSupplyDec);
//         const newUniswapVirtualEthReserveDec = (remainingTokenSupplyCurveAtMigrationDec.mul(targetedPoolBalanceDec))
//             .div(uniswapVirtualTokenReserveDec.minus(remainingTokenSupplyCurveAtMigrationDec));
//         const newUniswapVirtualEthReserve = TokenomicsCalculator.from_wei(newUniswapVirtualEthReserveDec);

//         const ethInRange = Array.from({ length: 100 }, (_, i) => targetedPoolBalance * (i + 1) / 100);
//         const newPurchaseReturnData = ethInRange.map(ethIn => ({
//             ethIn,
//             apeReturn: parseFloat(APECalculator.calculate_tokens_out_for_exact_eth_in(ethIn, reserveRatio, newSlope)),
//             uniswapReturn: parseFloat(UniswapCalculator.calculate_purchase_return(ethIn, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve)),
//         }));

//         const specificEthInputs = Array.from({ length: 5 }, (_, i) => targetedPoolBalance * (i + 1) * 0.2);
//         const newSpecificReturnData = specificEthInputs.map(ethIn => ({
//             ethIn: `${ethIn.toFixed(2)} ETH (${((ethIn / targetedPoolBalance) * 100).toFixed(0)}%)`,
//             apeReturn: parseFloat(APECalculator.calculate_tokens_out_for_exact_eth_in(ethIn, reserveRatio, newSlope)),
//             uniswapReturn: parseFloat(UniswapCalculator.calculate_purchase_return(ethIn, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve)),
//         }));

//         const tokenAmounts = Array.from({ length: 10 }, (_, i) => actualTargetedTokenSupply * (i + 1) * 0.1);
//         const newEthEstimateData = tokenAmounts.map(amount => ({
//             tokenAmount: `${(amount / 1e6).toFixed(0)}M (${((amount / actualTargetedTokenSupply) * 100).toFixed(0)}%)`,
//             apeEstimate: parseFloat(APECalculator.calculate_eth_in_for_exact_tokens_out(amount, reserveRatio, newSlope)),
//             uniswapEstimate: parseFloat(UniswapCalculator.estimate_eth_in_for_exact_tokens_out(amount, newUniswapVirtualEthReserve, newUniswapVirtualTokenReserve)),
//         }));

//         return {
//             slope: newSlope,
//             uniswapVirtualTokenReserve: newUniswapVirtualTokenReserve,
//             uniswapVirtualEthReserve: newUniswapVirtualEthReserve,
//             purchaseReturnData: newPurchaseReturnData,
//             specificReturnData: newSpecificReturnData,
//             ethEstimateData: newEthEstimateData
//         };
//     }, [totalTokenSupply, targetedPoolBalance, targetedTokenSupply, reserveRatio]);

//     useEffect(() => {
//         const newValues = calculateAllValues();
//         setDerivedValues(newValues);
//     }, [calculateAllValues]);

//     const formatMillions = (value) => `${(value / 1000000).toFixed(0)}M`;

//     return (
//         <div className="container-fluid pt-[70px] bg-black text-white">
//             <h1 className="text-3xl font-bold mb-4">Tokenomics Calculator</h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Input Parameters</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="space-y-4">
//                             <InputWithPresets
//                                 value={totalTokenSupply}
//                                 setValue={setTotalTokenSupply}
//                                 label="Total Token Supply (in millions)"
//                                 presets={[500, 1000, 1500, 2000]}
//                                 unit="M"
//                             />
//                             <InputWithPresets
//                                 value={targetedPoolBalance}
//                                 setValue={setTargetedPoolBalance}
//                                 label="Targeted Pool Balance (in ETH)"
//                                 presets={[4, 4.5, 5, 6]}
//                                 unit="ETH"
//                             />
//                             <InputWithPresets
//                                 value={targetedTokenSupply}
//                                 setValue={setTargetedTokenSupply}
//                                 label="Targeted Token Supply (% of Total Supply)"
//                                 presets={[60, 70, 80, 90]}
//                                 unit="%"
//                             />
//                             <div>
//                                 <Label htmlFor="reserveRatio">Reserve Ratio</Label>
//                                 <Slider
//                                     id="reserveRatio"
//                                     min={1}
//                                     max={999}
//                                     step={1}
//                                     value={[reserveRatio * 1000]}
//                                     onValueChange={(value) => setReserveRatio(value[0] / 1000)}
//                                 />
//                                 <span>{reserveRatio.toFixed(3)}</span>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>


//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Derived Values</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         {/* <p><strong>Slope:</strong> {Decimal(slope).toExponential(6)}</p> */}

//                         {/* <div className="space-y-2">
//                             <p><strong>Slope:</strong> {Decimal(slope).toExponential(6)}</p>
//                             <p><strong>Uniswap Virtual Token Reserve:</strong> {formatMillions(uniswapVirtualTokenReserve)}</p>
//                             <p><strong>Uniswap Virtual ETH Reserve:</strong> {uniswapVirtualEthReserve.toFixed(6)} ETH</p>
//                         </div> */}
//                     </CardContent>
//                 </Card>
//             </div>

//             <div className="space-y-8">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Purchase Return Comparison</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <ResponsiveContainer width="100%" height={400}>
//                             <LineChart data={derivedValues.purchaseReturnData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis
//                                     dataKey="ethIn"
//                                     tickFormatter={(value) => `${value.toFixed(2)} (${((value / targetedPoolBalance) * 100).toFixed(0)}%)`}
//                                 />
//                                 <YAxis tickFormatter={formatMillions} />
//                                 <Tooltip
//                                     formatter={(value, name) => [formatMillions(value), name]}
//                                     labelFormatter={(value) => `${value.toFixed(2)} ETH (${((value / targetedPoolBalance) * 100).toFixed(0)}%)`}
//                                 />
//                                 <Legend />
//                                 <Line type="monotone" dataKey="apeReturn" stroke="#8884d8" name="APE Formula" />
//                                 <Line type="monotone" dataKey="uniswapReturn" stroke="#82ca9d" name="Uniswap Formula" />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Specific ETH Input Comparison</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <ResponsiveContainer width="100%" height={400}>
//                             <BarChart data={derivedValues.specificReturnData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="ethIn" />
//                                 <YAxis tickFormatter={formatMillions} />
//                                 <Tooltip formatter={(value) => formatMillions(value)} />
//                                 <Legend />
//                                 <Bar dataKey="apeReturn" fill="#8884d8" name="APE Formula" />
//                                 <Bar dataKey="uniswapReturn" fill="#82ca9d" name="Uniswap Formula" />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Estimated ETH Input for Token Output</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <ResponsiveContainer width="100%" height={400}>
//                             <BarChart data={derivedValues.ethEstimateData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="tokenAmount" />
//                                 <YAxis />
//                                 <Tooltip
//                                     formatter={(value, name) => [`${value.toFixed(4)} ETH`, name]}
//                                     labelFormatter={(value) => `${value}`}
//                                 />
//                                 <Legend />
//                                 <Bar dataKey="apeEstimate" fill="#8884d8" name="APE Formula" />
//                                 <Bar dataKey="uniswapEstimate" fill="#82ca9d" name="Uniswap Formula" />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </CardContent>
//                 </Card>


//             </div>
//         </div>
//     )
// }

// export default Alpha;