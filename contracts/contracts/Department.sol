// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";
import "./Employee.sol";
import "./Bill.sol";

contract Department {

    using StructLibrary for StructLibrary.DepartmentStruct;
    using StructLibrary for StructLibrary.EmployeeStruct;

    // uint balance;
    // string name;
    // address addressPoint;

    StructLibrary.DepartmentStruct departmentStruct;

    // mapping (address => Department) subDepartmentsMap;
    StructLibrary.DepartmentStruct[] subDepartmentsList;

    // mapping (address => Account) accountsMap;
    StructLibrary.EmployeeStruct[] employeeList;

    Bill[] public bills;
    // mapping (address => Bill) billMap;
    constructor (string memory _name) {
        // name = _name;
        // addressPoint = address(this);
        departmentStruct = StructLibrary.DepartmentStruct({
            name : _name,
            departmentAddress: address(this),
            balance : 0
        });
    }
    function getDepartmentStruct() public view returns(StructLibrary.DepartmentStruct memory) {
        return departmentStruct;
    }
    function addDepartment (address subDep) public {
        Department dep = Department(subDep);
        subDepartmentsList.push(dep.getDepartmentStruct());
        // subDepartmentsMap[subDep] = Department(subDep);
    }
    function addEmployee (address subAcc) public {
        Employee acc = Employee(subAcc);
        employeeList.push(acc.getEmployeeStruct());
        // accountsMap[subAcc] = Account(subAcc);
    }
    function getSubDepartments() public view returns (StructLibrary.DepartmentStruct[] memory){
        return subDepartmentsList;
    }
    function getEmployees() public view returns (StructLibrary.EmployeeStruct[] memory) {
        return employeeList;
    }
    function createBill(
        string memory _name,
        string memory _description,
        uint _threshold,
        string memory _imagePath,
        uint _deadline
        ) public {
            Bill bill = new Bill({
            _name: _name,
            _description: _description,
            _threshold: _threshold,
            _imagePath: _imagePath,
            _deadline: _deadline
            });
            bills.push(bill);
    }
    function getBillByIndex(uint index) public view returns (Bill){
        return bills[index];
    }
    function getBills(uint pageSize, uint pageNumber) public view returns(StructLibrary.BillStruct[] memory){
        StructLibrary.BillStruct[] memory result;
        uint offset = pageSize * pageNumber;
        if (pageSize<=0 || pageNumber<0 || offset>=bills.length){
            return result;
        }
        result = new StructLibrary.BillStruct[](_min(pageSize, bills.length-offset));
        for (uint i = offset; i<offset+result.length; i++){
            result[i-offset] = bills[i].getBillStruct();
        }
        return result;
    }
    function _min(uint a, uint b) internal pure returns (uint){
        return a<b? a : b;
    }
    function validateIndex(uint index) public view validateIndexModifier(index){
        // require(bills.length<=index, "Index is out of range");
        // require(bills[index].getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
    }
    modifier validateIndexModifier(uint index) {
        require(bills.length<=index, "Index is out of range");
        require(bills[index].getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
        _;
    }
    function handleApproval(uint index) public validateIndexModifier(index){
        require(employeeList.length!=0, "There should be at least one approver");
        if ((bills[index].getBillStruct().partiesAccepted/employeeList.length)*100>bills[index].getBillStruct().threshold)
            bills[index].setStatus(StructLibrary.Status.ACCEPTED);
        if ((bills[index].getBillStruct().partiesRejected/employeeList.length)*100>100-bills[index].getBillStruct().threshold)
            bills[index].setStatus(StructLibrary.Status.REJECTED);
    }
    function getApprovalByIndex(uint index) public view validateIndexModifier(index) returns(Bill){
        return bills[index];
    }
}