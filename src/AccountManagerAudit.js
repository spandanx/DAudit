import web3 from './web3';
// const { abi, evm } = require('./compile');

const address = "0x41997cC330a7F2C538a7Eb87D8099B72c2CE9393";
//0xd897A787Dad9e0e6B178aB67FE35BFF3419daEaa
//0x7d2EcD7Fe120B278596Be90F60D60FA3AEc3e73e

console.log(address);

const abi = 
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "parentDepartMent",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "depName",
				"type": "string"
			}
		],
		"name": "registerDepartment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "parentDepartMent",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "empName",
				"type": "string"
			}
		],
		"name": "registerEmployee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "rootDepartmentName",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "departments",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "employees",
		"outputs": [
			{
				"internalType": "contract Employee",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDepartmentAddress",
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
		"name": "getEmployeeAddress",
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
		"name": "getRootDepartMentAddress",
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
]

export default new web3.eth.Contract(abi, address);