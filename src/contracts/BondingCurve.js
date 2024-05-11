export const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_reserveRatio",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_initialSupply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_initialPoolBalance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ethAmountToLP",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_feeAmountAtCurveComplete",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_uniswapRouter",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "y",
                "type": "uint256"
            }
        ],
        "name": "PRBMath_MulDiv18_Overflow",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "y",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "denominator",
                "type": "uint256"
            }
        ],
        "name": "PRBMath_MulDiv_Overflow",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "UD60x18",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "PRBMath_UD60x18_Exp2_InputTooBig",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "UD60x18",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "PRBMath_UD60x18_Log_InputTooSmall",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "liquidityPoolAddress",
                "type": "address"
            }
        ],
        "name": "BondingCurveComplete",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "amountBought",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "totalCost",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "LogBuy",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "amountSell",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "reward",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            }
        ],
        "name": "LogSell",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "active",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "amountToCompleteBondingCurve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buy",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_supply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_connectorBalance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_connectorWeight",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_depositAmount",
                "type": "uint256"
            }
        ],
        "name": "calculatePurchaseReturn",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_supply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_connectorBalance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_connectorWeight",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_sellAmount",
                "type": "uint256"
            }
        ],
        "name": "calculateSaleReturn",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_supply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_connectorBalance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_connectorWeight",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_tokenAmountOut",
                "type": "uint256"
            }
        ],
        "name": "estimateEthInForExactTokensOut",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_supply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_connectorBalance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_connectorWeight",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ethOut",
                "type": "uint256"
            }
        ],
        "name": "estimateTokenInForExactEthOut",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "factory",
        "outputs": [
            {
                "internalType": "contract IApeFactory",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCirculatingSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reserveRatio",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "sellAmount",
                "type": "uint256"
            }
        ],
        "name": "sell",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "uniswapV2Router",
        "outputs": [
            {
                "internalType": "contract IUniswapV2Router02",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]