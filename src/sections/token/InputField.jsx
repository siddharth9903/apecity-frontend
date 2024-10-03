// InputField.js
import React from 'react';
import { createIpfsUrlFromContentHash } from '../../utils/formats';

const InputField = ({ register, name, nativeCurrency, tokenSymbol, isToken, tokenImage, chainId }) => {
    return (
        <div className="flex items-center rounded-md relative">
            <input
                {...register(name)}
                className="flex h-10 rounded-md border pfont-400 border-slate-200 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 bg-transparent text-white outline-none w-full pl-3"
                placeholder="0.0"
                step="0.00000000000001"
                type="number"
            />
            <div className="flex items-center ml-2 absolute right-2">
                <span className="text-white pfont-400 mr-2">{isToken ? tokenSymbol : nativeCurrency?.symbol}</span>
                <img
                    className="w-7 h-7 rounded-full"
                    src={isToken ? createIpfsUrlFromContentHash(tokenImage) : nativeCurrency?.currencyLogo}
                    alt={isToken ? tokenSymbol : nativeCurrency?.symbol}
                />
            </div>
        </div>
    );
};

export default InputField;