const MergeABI = 
[
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
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_acceptedOrRejectedOn",
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
			},
			{
				"internalType": "address",
				"name": "_toBill",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getMergeStruct",
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
						"internalType": "uint256",
						"name": "createdOn",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "acceptedOrRejectedOn",
						"type": "uint256"
					},
					{
						"internalType": "enum StructLibrary.Status",
						"name": "billStatus",
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
					},
					{
						"internalType": "address",
						"name": "toBill",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "comments",
						"type": "string"
					},
					{
						"internalType": "enum StructLibrary.Status",
						"name": "requestStatus",
						"type": "uint8"
					}
				],
				"internalType": "struct StructLibrary.MergeStruct",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "incrementPartiesAccepted",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "incrementPartiesRejected",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "comment",
				"type": "string"
			}
		],
		"name": "setComments",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum StructLibrary.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "enum StructLibrary.MergeBillType",
				"name": "mergeType",
				"type": "uint8"
			}
		],
		"name": "setStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "employeeAddress",
				"type": "address"
			},
			{
				"internalType": "enum StructLibrary.Vote",
				"name": "action",
				"type": "uint8"
			}
		],
		"name": "setVoteMapping",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "destination",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferToken",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "voteMapping",
		"outputs": [
			{
				"internalType": "enum StructLibrary.Vote",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export default MergeABI;