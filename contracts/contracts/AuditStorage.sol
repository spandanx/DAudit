// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./Employee.sol";
import "./DepartmentManager.sol";
import "./Auditor.sol";


contract AuditStorage {

    mapping (address => DepartmentManager) public departments;
    mapping (address => Employee) public employees;
    mapping (address => Auditor) auditors;
    mapping (address => StructLibrary.ApprovalStatus) public approvedStatus;
    mapping (address => Bill) public bills;
    mapping (address => Bill[]) billMap;
    
    function addBill(Bill bill) external {
        bills[address(bill)] = bill;
    }
    // function getDepartmentsByAddress(address depAddress) view external returns(DepartmentManager){
    //     return departments[depAddress];
    // }
    function pushBillMap(address parentBillAddress, Bill bill) external {
        if (billMap[parentBillAddress].length==0){
            billMap[parentBillAddress] = [bill];
        }
        else{
            billMap[parentBillAddress].push(bill);
        }
    }
    function getBillLength(address billAddress) external view returns (uint){
        return billMap[billAddress].length;
    }
    function getBillByIndex(address billAddress, uint index) external view returns (Bill){
        return billMap[billAddress][index];
    }
}