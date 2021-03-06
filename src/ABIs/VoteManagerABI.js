const VoteManagerABI = 
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "mergeAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "departmentAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "auditStorageAddress",
				"type": "address"
			},
			{
				"internalType": "enum StructLibrary.Action",
				"name": "opinion",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "proof",
				"type": "string"
			}
		],
		"name": "approveRequestMerge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "billAddress",
				"type": "address"
			},
			{
				"internalType": "enum StructLibrary.Action",
				"name": "opinion",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "departmentAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "employeeAddress",
				"type": "address"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "mergeAddress",
				"type": "address"
			},
			{
				"internalType": "enum StructLibrary.Action",
				"name": "opinion",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "departmentAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "employeeAddress",
				"type": "address"
			}
		],
		"name": "voteMerge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
export default VoteManagerABI;