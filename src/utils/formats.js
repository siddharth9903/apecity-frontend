function formatNumber(number) {
    if (number === 0) {
        return '0';
    }

    const absNumber = Math.abs(number);
    const sign = number < 0 ? '-' : '';

    if (absNumber >= 1e9) {
        // Billions
        return sign + (absNumber / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B';
    } else if (absNumber >= 1e6) {
        // Millions
        return sign + (absNumber / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
    } else if (absNumber >= 1e3) {
        // Thousands
        return sign + (absNumber / 1e3).toFixed(2).replace(/\.?0+$/, '') + 'K';
    } else if (absNumber < 1) {
        // Less than 1
        // const decimals = absNumber.toString().split('.')[1] || '';
        // const nonZeroIndex = decimals.search(/[1-9]/);

        // if (nonZeroIndex !== -1) {
        //     const formattedNumber = absNumber.toFixed(nonZeroIndex + 2).replace(/0+$/, '');
        //     return sign + formattedNumber;
        // } else {
        //     return sign + absNumber.toString();
        // }
        // Less than 1
        const decimals = absNumber.toExponential().split('e-')[1];
        const formattedNumber = absNumber.toFixed(Number(decimals) + 2).replace(/0+$/, '');
        return sign + formattedNumber;
    } else {
        // Between 1 and 1000
        return sign + absNumber.toFixed(2).replace(/\.?0+$/, '');
    }
}

function createIpfsUrlFromContentHash(contentHash) {
    if (!contentHash) {
        return ''
    }
    return import.meta.env.VITE_IPFS_ENDPOINT + contentHash
}


//   function formatSmallNumber(number) {
//     // Convert to number if it's a string
//     const num = typeof number === 'string' ? parseFloat(number) : number;

//     // Check if it's a valid number
//     if (isNaN(num) || typeof num !== 'number') {
//       console.error('Invalid input: not a number');
//       return 'Invalid input';
//     }

//     if (num >= 0.0001) return num.toString();

//     // Handle zero separately
//     if (num === 0) return '0';

//     try {
//       const parts = num.toExponential().split('e-');
//       const mantissa = parts[0];
//       const exponent = parseInt(parts[1], 10);

//       const formattedMantissa = mantissa.replace('.', '');
//       const leadingZeros = exponent - 1;

//       // Convert number to subscript
//       const subscript = leadingZeros.toString().split('').map(digit => 
//         String.fromCharCode(8320 + parseInt(digit))).join('');

//       return `0.0${subscript}${formattedMantissa}`;
//     } catch (error) {
//       console.error('Error formatting number:', error);
//       return 'Error formatting number';
//     }
//   }
function formatSmallNumber(number) {
    if (typeof number === 'string') number = parseFloat(number);
    if (isNaN(number) || typeof number !== 'number') return 'Invalid input';
    if (number >= 0.001) return number.toString();
    if (number === 0) return '0';

    const parts = number.toExponential().split('e-');
    const mantissa = parseFloat(parts[0]);
    const exponent = parseInt(parts[1], 10);

    // Round to 4 significant digits
    const roundedMantissa = Math.round(mantissa * 1000) / 1000;

    let formattedMantissa = roundedMantissa.toString().replace('.', '');
    // Pad with zeros if necessary
    while (formattedMantissa.length < 4) {
        formattedMantissa += '0';
    }

    const leadingZeros = exponent - 1;

    // Convert number to subscript
    const subscript = leadingZeros.toString().split('').map(digit =>
        String.fromCharCode(8320 + parseInt(digit))).join('');

    return `0.0${subscript}${formattedMantissa}`;
}


export { formatNumber, formatSmallNumber, createIpfsUrlFromContentHash };

