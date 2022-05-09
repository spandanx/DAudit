const voteManagerABI = 
[
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
	}
];
export default voteManagerABI;