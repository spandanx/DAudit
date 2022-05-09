const BillManagerABI = 
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
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
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
		"name": "getBillsFromMap",
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
	}
];
export default BillManagerABI;