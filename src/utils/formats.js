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
function convertIpfsUrl(originalUrl) {
    // Replace the beginning of the URL with the new domain
    const newUrl = originalUrl?.replace('https://ipfs.io', import.meta.env.VITE_IPFS_ENDPOINT);
    return newUrl;
}

export { formatNumber, convertIpfsUrl };

