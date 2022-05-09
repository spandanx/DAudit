const structLibraryABI = 
[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_fromDepartment",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_toDepartment",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_bill",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "BillApproved",
		"type": "event"
	}
];
export default structLibraryABI;