// import { formatNumber } from "./utils/formats";

import {
    calculatePurchaseReturn,
    calculateSaleReturn,
    estimateEthInForExactTokensOut,
    estimateTokenInForExactEthOut
 } from "./utils/apeFormula.js";
import { formatNumber } from "./utils/formats.js";

// console.log(formatNumber(1.1576321840861268));
// console.log(formatNumber(1234567890));
// console.log(formatNumber(123456789)); 
// console.log(formatNumber(123456)); 
// console.log(formatNumber(1234)); 
// console.log(formatNumber(123)); 
// console.log(formatNumber(12.3));
// console.log(formatNumber(0.1236));
// console.log(formatNumber(0.0002345)); 
// console.log(formatNumber(0.000002376));
// console.log(formatNumber(0.00234)); 
// console.log(formatNumber(-0.0001264567));
// console.log(formatNumber(-1234567));
// console.log(formatNumber(0.000000006332381977220412207553821564149082)); 

// calculatePurchaseReturn()

// Example usage
const supply = '1000000';
const connectorBalance = '100000';
const connectorWeight = '500000';
const depositAmount = '10000';
const sellAmount = '50000';
const tokenAmountOut = '25000';
const ethOut = '5000';

console.log('calculatePurchaseReturn:', calculatePurchaseReturn(supply, connectorBalance, connectorWeight, depositAmount));
console.log('calculateSaleReturn:', calculateSaleReturn(supply, connectorBalance, connectorWeight, sellAmount));
console.log('estimateEthInForExactTokensOut:', estimateEthInForExactTokensOut(supply, connectorBalance, connectorWeight, tokenAmountOut));
console.log('estimateTokenInForExactEthOut:', estimateTokenInForExactEthOut(supply, connectorBalance, connectorWeight, ethOut));


/*


ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:5001", "http://localhost:3000", "http://127.0.0.1:5001", "https://webui.ipfs.io"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'
ipfs shutdown
ipfs daemon &

*/

// 
/*
[Unit]
Description=IPFS Daemon
After=network.target

[Service]
User=ubuntu
Group=ubuntu
Type=simple
ExecStart=/usr/local/bin/ipfs daemon --migrate=true --enable-gc=true --enable-pubsub-experiment=true
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target

*/