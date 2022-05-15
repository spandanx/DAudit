const DepartmentArraysABI = 
[
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
				"name": "depAddress",
				"type": "address"
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
					},
					{
						"internalType": "address",
						"name": "origin",
						"type": "address"
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
				"internalType": "address",
				"name": "depAddress",
				"type": "address"
			}
		],
		"name": "getAuditors",
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
				"internalType": "struct StructLibrary.AuditorStruct[]",
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
				"internalType": "address",
				"name": "depAddress",
				"type": "address"
			}
		],
		"name": "getBills",
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
				"name": "depAddress",
				"type": "address"
			}
		],
		"name": "getEmployees",
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
				"internalType": "struct StructLibrary.EmployeeStruct[]",
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
				"internalType": "address",
				"name": "depAddress",
				"type": "address"
			}
		],
		"name": "getFunds",
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
				"name": "depAddress",
				"type": "address"
			}
		],
		"name": "getMergeBills",
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
				"internalType": "struct StructLibrary.MergeStruct[]",
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
				"internalType": "address",
				"name": "depAddress",
				"type": "address"
			}
		],
		"name": "getMergeRequests",
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
				"internalType": "struct StructLibrary.MergeStruct[]",
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
				"internalType": "address",
				"name": "depAddress",
				"type": "address"
			}
		],
		"name": "getSubDepartments",
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
						"name": "departmentAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					}
				],
				"internalType": "struct StructLibrary.DepartmentStruct[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export default DepartmentArraysABI;