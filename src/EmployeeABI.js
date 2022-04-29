const employeeABI = 
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
		"name": "getDepartment",
		"outputs": [
			{
				"internalType": "contract Department",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getEmployeeStruct",
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
						"name": "employeeAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "parentDepartmentAddress",
						"type": "address"
					}
				],
				"internalType": "struct StructLibrary.EmployeeStruct",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default employeeABI;