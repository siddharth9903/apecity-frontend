const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenDeveloper",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_tokenAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_virtualTokenReserve",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_virtualEthReserve",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_swapFeePercentage",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ethAmountForLiquidity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ethAmountForLiquidityFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ethAmountForDevReward",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_uniswapRouter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_reserveRatio",
                "type": "uint256"
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
        "name": "ETH_AMOUNT_FOR_DEV_REWARD",
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
        "name": "ETH_AMOUNT_FOR_LIQUIDITY",
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
        "name": "ETH_AMOUNT_FOR_LIQUIDITY_FEE",
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
        "name": "TOKEN_DEV",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "TOKEN_DEVELOPER",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "TOTAL_ETH_TO_COMPLETE_CURVE",
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
        "name": "VIRTUAL_ETH_RESERVE",
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
        "name": "VIRTUAL_TOKEN_RESERVE",
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
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
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
        "inputs": [],
        "name": "ethReserve",
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
        "name": "factoryContract",
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
        "name": "isActive",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "poolBalances",
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
        "name": "remainingEthToCompleteCurve",
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
                "name": "tokenAmount",
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
        "name": "swapFeePercentage",
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
        "name": "tokenContract",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "uniswapRouter",
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

export default abi 