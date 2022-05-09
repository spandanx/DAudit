const auditorABI = 
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parentDepartmentAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getAuditorStruct",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "auditorAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "parentDepartmentAddress",
						"type": "address"
					}
				],
				"internalType": "struct StructLibrary.AuditorStruct",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export default auditorABI;