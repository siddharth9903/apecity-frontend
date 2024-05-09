import Decimal from 'decimal.js';

const MAX_WEIGHT = new Decimal(1000000);
const DEC = new Decimal(1).mul(10 ** 18)

// function calculatePurchaseReturn(supply, connectorBalance, connectorWeight, depositAmount) {
//     const supplyDec = new Decimal(supply);
//     const connectorBalanceDec = new Decimal(connectorBalance);
//     const connectorWeightDec = new Decimal(connectorWeight);
//     const depositAmountDec = new Decimal(depositAmount);

//     if (supplyDec.lte(0) || connectorBalanceDec.lte(0) || connectorWeightDec.lte(0) || connectorWeightDec.gt(MAX_WEIGHT) || depositAmountDec.eq(0)) {
//         return '0';
//     }

//     if (connectorWeightDec.eq(MAX_WEIGHT)) {
//         return supplyDec.mul(depositAmountDec).div(connectorBalanceDec).floor().toString();
//     }

//     const base = depositAmountDec.plus(connectorBalanceDec).div(connectorBalanceDec);
//     const exp = connectorWeightDec.div(MAX_WEIGHT);
//     const result = base.pow(exp);
//     return supplyDec.mul(result).sub(supplyDec).floor().sub(1000).toString();
// }

function calculatePurchaseReturn(supply, connectorBalance, connectorWeight, depositAmount) {
    const supplyDec = new Decimal(supply).mul(DEC);
    const connectorBalanceDec = new Decimal(connectorBalance).mul(DEC);
    const connectorWeightDec = new Decimal(connectorWeight);
    const depositAmountDec = new Decimal(depositAmount).mul(DEC);

    console.log('supplyDec', supplyDec.toString())
    console.log('connectorBalanceDec', connectorBalanceDec.toString())
    console.log('connectorWeightDec', connectorWeightDec.toString())
    console.log('depositAmountDec', depositAmountDec.toString())

    if (supplyDec.lte(0) || connectorBalanceDec.lte(0) || connectorWeightDec.lte(0) || connectorWeightDec.gt(MAX_WEIGHT) || depositAmountDec.eq(0)) {
        return '0';
    }

    if (connectorWeightDec.eq(MAX_WEIGHT)) {
        return supplyDec.mul(depositAmountDec).div(connectorBalanceDec).floor().div(DEC).toString();
    }

    const base = depositAmountDec.plus(connectorBalanceDec).div(connectorBalanceDec);
    const exp = connectorWeightDec.div(MAX_WEIGHT);
    const result = base.pow(exp);
    const purchaseReturn = supplyDec.mul(result).sub(supplyDec).floor().sub(1000);
    console.log("purchaseReturn",purchaseReturn)
    return purchaseReturn.div(DEC).toString()
}

function calculateSaleReturn(supply, connectorBalance, connectorWeight, sellAmount) {
    const supplyDec = new Decimal(supply).mul(DEC);
    const connectorBalanceDec = new Decimal(connectorBalance).mul(DEC);
    const connectorWeightDec = new Decimal(connectorWeight);
    const sellAmountDec = new Decimal(sellAmount).mul(DEC);

    console.log('xsupplyDec', supplyDec.toString())
    console.log('xconnectorBalanceDec', connectorBalanceDec.toString())
    console.log('xconnectorWeightDec', connectorWeightDec.toString())
    console.log('xsellAmountDec', sellAmountDec.toString())

    if (supplyDec.lte(0) || connectorBalanceDec.lte(0) || connectorWeightDec.lte(0) || connectorWeightDec.gt(MAX_WEIGHT) || sellAmountDec.eq(0) || sellAmountDec.gt(supplyDec)) {
        return '0';
    }

    if (sellAmountDec.eq(supplyDec)) {
        return connectorBalanceDec.toString();
    }

    if (connectorWeightDec.eq(MAX_WEIGHT)) {
        return connectorBalanceDec.mul(sellAmountDec).div(supplyDec).floor().div(DEC).toString();
    }

    const base = supplyDec.div(supplyDec.sub(sellAmountDec));
    const exp = MAX_WEIGHT.div(connectorWeightDec);
    const result = base.pow(exp);


    // const temp1 = connectorBalanceDec.mul(result);
    // const temp2 = connectorBalanceDec;
    //     UD60x18 temp2 = ud(_connectorBalance);

    // result = (temp1.sub(temp2)).div(result);
    // result
    const saleReturn = ((connectorBalanceDec.mul(result)).sub(connectorBalanceDec)).div(result).floor();
    console.log('xsaleReturn',saleReturn.toString())
    return saleReturn.div(DEC).toString()

    //     UD60x18 result;
    //     UD60x18 base = ud(_supply).div((ud(_supply).sub(ud(_sellAmount))));
    //     UD60x18 exp = ud(MAX_WEIGHT).div(ud(_connectorWeight));
    // result = base.pow(exp);

    //     UD60x18 temp1 = ud(_connectorBalance).mul(result);
    //     UD60x18 temp2 = ud(_connectorBalance);

    // result = (temp1.sub(temp2)).div(result);
    // return result.unwrap();
}

function estimateEthInForExactTokensOut(supply, connectorBalance, connectorWeight, tokenAmountOut) {
    const supplyDec = new Decimal(supply).mul(DEC);
    const connectorBalanceDec = new Decimal(connectorBalance).mul(DEC);
    const connectorWeightDec = new Decimal(connectorWeight);
    const tokenAmountOutDec = new Decimal(tokenAmountOut).mul(DEC);

    console.log('supplyDec', supplyDec.toString())
    console.log('connectorBalanceDec', connectorBalanceDec.toString())
    console.log('connectorWeightDec', connectorWeightDec.toString())
    console.log('tokenAmountOutDec', tokenAmountOutDec.toString())

    if (supplyDec.lte(0) || connectorBalanceDec.lte(0) || connectorWeightDec.lte(0) || connectorWeightDec.gt(MAX_WEIGHT) || tokenAmountOutDec.eq(0)) {
        return '0';
    }

    if (connectorWeightDec.eq(MAX_WEIGHT)) {
        return tokenAmountOutDec.mul(connectorBalanceDec).div(supplyDec).floor().div(DEC).toString();
    }

    const base = tokenAmountOutDec.plus(supplyDec).div(supplyDec);
    const exp = MAX_WEIGHT.div(connectorWeightDec);
    const result = base.pow(exp);
    const estimatedEthIn = connectorBalanceDec.mul(result).sub(connectorBalanceDec).floor().plus(1000);
    console.log('estimatedEthIn',estimatedEthIn)
    return estimatedEthIn.div(DEC).toString()
}

function estimateTokenInForExactEthOut(supply, connectorBalance, connectorWeight, ethOut) {
    const supplyDec = new Decimal(supply).mul(DEC);
    const connectorBalanceDec = new Decimal(connectorBalance).mul(DEC);
    const connectorWeightDec = new Decimal(connectorWeight);
    const ethOutDec = new Decimal(ethOut).mul(DEC);

    if (supplyDec.lte(0) || connectorBalanceDec.lte(0) || connectorWeightDec.lte(0) || connectorWeightDec.gt(MAX_WEIGHT) || ethOutDec.eq(0)) {
        return '0';
    }

    const effectiveEthOut = ethOutDec.plus(1000);

    if (connectorWeightDec.eq(MAX_WEIGHT)) {
        return supplyDec.mul(effectiveEthOut).div(connectorBalanceDec).floor().div(DEC).toString();
    }

    const base = connectorBalanceDec.div(connectorBalanceDec.sub(effectiveEthOut));
    const exp = connectorWeightDec.div(MAX_WEIGHT);
    const result = base.pow(exp);
    const estimateTokenIn = supplyDec.mul(result).sub(supplyDec).div(result).floor();
    return estimateTokenIn.div(DEC).toString()
}

export {
    calculatePurchaseReturn,
    calculateSaleReturn,
    estimateEthInForExactTokensOut,
    estimateTokenInForExactEthOut,
};

// import BigNumber from 'bignumber.js';

// const MAX_WEIGHT = new BigNumber(1000000);

// function calculatePurchaseReturn(supply, connectorBalance, connectorWeight, depositAmount) {
//     const supplyBN = new BigNumber(supply);
//     const connectorBalanceBN = new BigNumber(connectorBalance);
//     const connectorWeightBN = new BigNumber(connectorWeight);
//     const depositAmountBN = new BigNumber(depositAmount);

//     if (supplyBN.lte(0) || connectorBalanceBN.lte(0) || connectorWeightBN.lte(0) || connectorWeightBN.gt(MAX_WEIGHT) || depositAmountBN.eq(0)) {
//         return '0';
//     }

//     if (connectorWeightBN.eq(MAX_WEIGHT)) {
//         return supplyBN.times(depositAmountBN).div(connectorBalanceBN).integerValue(BigNumber.ROUND_DOWN).toString();
//     }

//     const base = depositAmountBN.plus(connectorBalanceBN).div(connectorBalanceBN);
//     const exp = connectorWeightBN.div(MAX_WEIGHT);
//     const result = base.exponentiatedBy(exp);
//     return supplyBN.times(result).minus(supplyBN).integerValue(BigNumber.ROUND_DOWN).minus(1000).toString();
// }

// function calculateSaleReturn(supply, connectorBalance, connectorWeight, sellAmount) {
//     const supplyBN = new BigNumber(supply);
//     const connectorBalanceBN = new BigNumber(connectorBalance);
//     const connectorWeightBN = new BigNumber(connectorWeight);
//     const sellAmountBN = new BigNumber(sellAmount);

//     if (supplyBN.lte(0) || connectorBalanceBN.lte(0) || connectorWeightBN.lte(0) || connectorWeightBN.gt(MAX_WEIGHT) || sellAmountBN.eq(0) || sellAmountBN.gt(supplyBN)) {
//         return '0';
//     }

//     if (sellAmountBN.eq(supplyBN)) {
//         return connectorBalanceBN.toString();
//     }

//     if (connectorWeightBN.eq(MAX_WEIGHT)) {
//         return connectorBalanceBN.times(sellAmountBN).div(supplyBN).integerValue(BigNumber.ROUND_DOWN).toString();
//     }

//     const base = supplyBN.div(supplyBN.minus(sellAmountBN));
//     const exp = MAX_WEIGHT.div(connectorWeightBN);
//     const result = base.exponentiatedBy(exp);
//     return connectorBalanceBN.times(result).minus(connectorBalanceBN).div(result).integerValue(BigNumber.ROUND_DOWN).toString();
// }

// function estimateEthInForExactTokensOut(supply, connectorBalance, connectorWeight, tokenAmountOut) {
//     const supplyBN = new BigNumber(supply);
//     const connectorBalanceBN = new BigNumber(connectorBalance);
//     const connectorWeightBN = new BigNumber(connectorWeight);
//     const tokenAmountOutBN = new BigNumber(tokenAmountOut);

//     if (supplyBN.lte(0) || connectorBalanceBN.lte(0) || connectorWeightBN.lte(0) || connectorWeightBN.gt(MAX_WEIGHT) || tokenAmountOutBN.eq(0)) {
//         return '0';
//     }

//     if (connectorWeightBN.eq(MAX_WEIGHT)) {
//         return tokenAmountOutBN.times(connectorBalanceBN).div(supplyBN).integerValue(BigNumber.ROUND_DOWN).toString();
//     }

//     const base = tokenAmountOutBN.plus(supplyBN).div(supplyBN);
//     const exp = MAX_WEIGHT.div(connectorWeightBN);
//     const result = base.exponentiatedBy(exp);
//     return connectorBalanceBN.times(result).minus(connectorBalanceBN).integerValue(BigNumber.ROUND_DOWN).plus(1000).toString();
// }

// function estimateTokenInForExactEthOut(supply, connectorBalance, connectorWeight, ethOut) {
//     const supplyBN = new BigNumber(supply);
//     const connectorBalanceBN = new BigNumber(connectorBalance);
//     const connectorWeightBN = new BigNumber(connectorWeight);
//     const ethOutBN = new BigNumber(ethOut);

//     if (supplyBN.lte(0) || connectorBalanceBN.lte(0) || connectorWeightBN.lte(0) || connectorWeightBN.gt(MAX_WEIGHT) || ethOutBN.eq(0)) {
//         return '0';
//     }

//     const effectiveEthOut = ethOutBN.plus(1000);

//     if (connectorWeightBN.eq(MAX_WEIGHT)) {
//         return supplyBN.times(effectiveEthOut).div(connectorBalanceBN).integerValue(BigNumber.ROUND_DOWN).toString();
//     }

//     const base = connectorBalanceBN.div(connectorBalanceBN.minus(effectiveEthOut));
//     const exp = connectorWeightBN.div(MAX_WEIGHT);
//     const result = base.exponentiatedBy(exp);
//     return supplyBN.times(result).minus(supplyBN).div(result).integerValue(BigNumber.ROUND_DOWN).toString();
// }

// export {
//     calculatePurchaseReturn,
//     calculateSaleReturn,
//     estimateEthInForExactTokensOut,
//     estimateTokenInForExactEthOut,
// };