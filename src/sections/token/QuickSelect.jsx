import React from 'react';

const QuickSelect = ({ setValue, name, isToken, tokenAmountsOptions }) => {
    console.log('tokenAmountsOptions',tokenAmountsOptions)
    const ethAmountsOptions = [
        {
            key: '0.2 ETH',
            value: '0.2'
        },
        {
            key: '0.5 ETH',
            value: '0.5'
        },
        {
            key: '1 ETH',
            value: '1'
        },
        {
            key: '1.4 ETH',
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
                    {/* {isToken ? `${amount}%` : `${amount} ETH`} */}
                    {amount?.key}
                </button>
            ))}
        </div>
    );
};

export default QuickSelect;
// // import React from 'react';

// // const QuickSelect = ({ onSelect, isToken }) => {
// //     const amounts = isToken ? ['25', '50', '75', '100'] : ['0.5', '1', '2.5', '5'];

// //     return (
// //         <div className="flex flex-wrap gap-3 mt-2 py-1 rounded-lg">
// //             <button
// //                 type='button'
// //                 onClick={() => onSelect('')}
// //                 className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
// //             >
// //                 Reset
// //             </button>
// //             {amounts.map((amount) => (
// //                 <button
// //                     key={amount}
// //                     type='button'
// //                     onClick={() => onSelect(amount)}
// //                     className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
// //                 >
// //                     {isToken ? `${amount}%` : `${amount} ETH`}
// //                 </button>
// //             ))}
// //         </div>
// //     );
// // };

// // export default QuickSelect;