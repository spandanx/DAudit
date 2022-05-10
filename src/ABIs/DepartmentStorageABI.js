const departmentStorageABI = 
[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "approvalList",
		"outputs": [
			{
				"internalType": "enum StructLibrary.AccountType",
				"name": "accountType",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "accountAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "parentDepartmentAddress",
				"type": "address"
			},
			{
				"internalType": "enum StructLibrary.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "index",
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
		"name": "auditorList",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bills",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "employeeList",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "funds",
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
				"internalType": "uint256",
				"name": "pageSize",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pageNumber",
				"type": "uint256"
			}
		],
		"name": "getApprovals",
		"outputs": [
			{
				"components": [
					{
						"internalType": "enum StructLibrary.AccountType",
						"name": "accountType",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "accountAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "parentDepartmentAddress",
						"type": "address"
					},
					{
						"internalType": "enum StructLibrary.Status",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					}
				],
				"internalType": "struct StructLibrary.ApprovalStruct[]",
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
				"internalType": "enum StructLibrary.DepartmentArrayType",
				"name": "arrayType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "reverse",
				"type": "bool"
			}
		],
		"name": "getArray",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
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
		"name": "subDepartmentsList",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export default departmentStorageABI;