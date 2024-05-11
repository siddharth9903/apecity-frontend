import React from 'react';

const QuickSelect = ({ setValue, name, isToken }) => {
    const amounts = isToken ? ['25', '50', '75', '100'] : ['0.5', '1', '2.5', '5'];

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
                    key={amount}
                    type='button'
                    onClick={() => handleSelect(amount)}
                    className="text-xs py-1 px-2 rounded pfont-400 bg-gray-800 text-gray-300"
                >
                    {isToken ? `${amount}%` : `${amount} ETH`}
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