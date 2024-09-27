import React from 'react';

const QuickSelect = ({ setValue, name, isToken, tokenAmountsOptions, nativeCurrency }) => {
    let nativeCurrencySymbol = nativeCurrency?.symbol

    const ethAmountsOptions = [
        {
            key: `0.2 ${nativeCurrencySymbol}`,
            value: '0.2'
        },
        {
            key: `0.5 ${nativeCurrencySymbol}`,
            value: '0.5'
        },
        {
            key: `1 ${nativeCurrencySymbol}`,
            value: '1'
        },
        {
            key: `1.4 ${nativeCurrencySymbol}`,
            value: '1.4'
        }
    ]
    const amounts = isToken ? tokenAmountsOptions : ethAmountsOptions;

    const handleSelect = (amount) => {
        setValue(name, amount);
    };

    return (
        <div className="flex flex-wrap gap-3 mt-2 py-1 rounded-lg">
            <button
                type='button'
                onClick={() => handleSelect('')}
                className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
            >
                Reset
            </button>
            {amounts.map((amount) => (
                <button
                    key={amount.key}
                    type='button'
                    onClick={() => handleSelect(amount.value)}
                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                >
                    {amount?.key}
                </button>
            ))}
        </div>
    );
};

export default QuickSelect;