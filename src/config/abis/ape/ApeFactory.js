const abi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenTotalSupply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_swapFeePercentage",
                "type": "uint256"
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
                "name": "_uniswapV2RouterAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_feeRecipient",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_feeRecipientSetter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_standardReserveRatio",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newPercentage",
                "type": "uint256"
            }
        ],
        "name": "SwapFeePercentageUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "bondingCurve",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "reserveRatio",
                "type": "uint256"
            }
        ],
        "name": "TokenCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allTokenAddresses",
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
        "name": "allTokensLength",
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
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            }
        ],
        "name": "createToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "feeRecipient",
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
        "name": "feeRecipientSetter",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "getReserveRatio",
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
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "getTokenBondingCurve",
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
        "name": "owner",
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
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenTotalSupply",
                "type": "uint256"
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
                "internalType": "uint256",
                "name": "_standardReserveRatio",
                "type": "uint256"
            }
        ],
        "name": "setBondingCurveVariables",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_feeRecipient",
                "type": "address"
            }
        ],
        "name": "setFeeRecipient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_feeRecipientSetter",
                "type": "address"
            }
        ],
        "name": "setFeeRecipientSetter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_uniswapV2RouterAddress",
                "type": "address"
            }
        ],
        "name": "setUniswapRouterAddress",
        "outputs": [],
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
        "name": "tokenTotalSupply",
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
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

export default abi 