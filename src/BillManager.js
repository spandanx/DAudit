import web3 from './web3';
// const { abi, evm } = require('./compile');

const address = "0x2522d8A843057A4835f6F81b25EF509AE538d88B";
//0x43F43B8206566D873856852FBf940E3b19766f1e

console.log(address);

const abi = 
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "auditStorageAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_threshold",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_imagePath",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_fromBill",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_fromDepartment",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_toDepartment",
				"type": "address"
			}
		],
		"name": "createBill",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pageSize",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pageNumber",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "billAddress",
				"type": "address"
			}
		],
		"name": "getBillFromMap",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "threshold",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "imagePath",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "partiesAccepted",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "partiesRejected",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					},
					{
						"internalType": "enum StructLibrary.Status",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "fromBill",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "fromDepartment",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "toDepartment",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "billOwnAddress",
						"type": "address"
					}
				],
				"internalType": "struct StructLibrary.BillStruct[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "parentBillAddress",
				"type": "address"
			},
			{
				"internalType": "contract Bill",
				"name": "bill",
				"type": "address"
			}
		],
		"name": "pushBillMap",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

export default new web3.eth.Contract(abi, address);