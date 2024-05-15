//base-sepolia
// export const deployedContractAddress = '0x7722b77e691cea11047f030f1b128432a1a6ffca'; // Replace with the actual ApeFactory contract address
//hardhat
// export const deployedContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with the actual ApeFactory contract address
//base and base-tenderly
// export const deployedContractAddress = '0xDeca67A17195Db554BBa847AD8b5AcBb18e2C8a3'; // Replace with the actual ApeFactory contract address
//localhost
// export const deployedContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // Replace with the actual ApeFactory contract address
//base and baseIdTenderly
// export const deployedContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with the actual ApeFactory contract address
// export const deployedContractAddress = '0x43bbaC1E810E19C1608a26626FCc04D45f5918f5'; // Replace with the actual ApeFactory contract address
export const deployedContractAddress = "0xb4FBc25204d26C4a937F4CBa67087F70B21bb6c5"; // Replace with the actual ApeFactory contract address

export const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_feeToSetter",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_feeTo",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_liquidityFeeTo",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_totalTokenSupply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_initialTokenSupply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_initialPoolBalance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_standardReserveRatio",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_lpTransferEthAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_lpTransferFeeAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_uniswapV2RouterAddress",
                "type": "address"
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
        "inputs": [],
        "name": "FEE_DENOMINATOR",
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
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allTokens",
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
        "name": "feeTo",
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
        "name": "feeToSetter",
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
        "name": "getBondingCurve",
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
        "inputs": [],
        "name": "liquidityFeeTo",
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
                "name": "_totalTokenSupply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_initialTokenSupply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_initialPoolBalance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_standardReserveRatio",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_lpTransferEthAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_lpTransferFeeAmount",
                "type": "uint256"
            }
        ],
        "name": "setBondingCurveCurveVariables",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_feeTo",
                "type": "address"
            }
        ],
        "name": "setFeeTo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_feeToSetter",
                "type": "address"
            }
        ],
        "name": "setFeeToSetter",
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
        "name": "setLPRouterAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_liquidityFeeTo",
                "type": "address"
            }
        ],
        "name": "setLiquidityFeeTo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_feeDenominator",
                "type": "uint256"
            }
        ],
        "name": "setfeeDenominator",
        "outputs": [],
        "stateMutability": "nonpayable",
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