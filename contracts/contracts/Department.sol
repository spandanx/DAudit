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

    mapping (address => Department) subDepartmentsMap;
    StructLibrary.DepartmentStruct[] subDepartmentsList;

    mapping (address => Employee) employeeMap;
    StructLibrary.EmployeeStruct[] employeeList;

    Bill[] public bills;
    mapping (address => Bill) public billMap;

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
        subDepartmentsMap[address(dep)] = dep;
        // subDepartmentsMap[subDep] = Department(subDep);
    }
    function addEmployee (address empAdr) public {
        Employee emp = Employee(empAdr);
        employeeList.push(emp.getEmployeeStruct());
        employeeMap[address(emp)] = emp;
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
        uint _deadline,
        uint _amount,
        address _fromBill,
        address _fromDepartment,
        address _toDepartment
        ) public returns (Bill){
            Bill bill = new Bill({
            _name: _name,
            _description: _description,
            _threshold: _threshold,
            _imagePath: _imagePath,
            _deadline: _deadline,
            _amount: _amount,
            _fromBill: _fromBill,
            _fromDepartment: _fromDepartment,
            _toDepartment: _toDepartment
            });
            bills.push(bill);
            billMap[address(bill)] = bill;
            return bill;
    }
    // return bill address
    // function pushBills(Bill bill) public {
    //     bills.push(bill);
    // }
    function getBillByAddress(uint index) public view returns (Bill){
        return bills[index];
    }
    // function getBills(uint pageSize, uint pageNumber) public view returns(StructLibrary.BillStruct[] memory){
    //     StructLibrary.BillStruct[] memory result;
    //     uint offset = pageSize * pageNumber;
    //     if (pageSize<=0 || pageNumber<0 || offset>=bills.length){
    //         return result;
    //     }
    //     result = new StructLibrary.BillStruct[](_min(pageSize, bills.length-offset));
    //     for (uint i = offset; i<offset+result.length; i++){
    //         result[i-offset] = bills[i].getBillStruct();
    //     }
    //     return result;
    // }
    function getBills(uint pageSize, uint pageNumber) public view returns(StructLibrary.BillStruct[] memory) {
        uint offset = pageNumber * pageSize;
        uint length = bills.length;
        StructLibrary.BillStruct[] memory toReturn;
        if (pageSize<=0 || pageNumber<0 || offset>=length){
            return toReturn;
        }
        uint endIndex = length;
        if (length>=offset){
            endIndex = length - offset;
        }
        uint startIndex = 0;
        if (endIndex>=pageSize){
            startIndex = endIndex - pageSize;
        }
        toReturn = new StructLibrary.BillStruct[](endIndex - startIndex);
        for (uint i = 0; i<toReturn.length; i++){
            toReturn[i] = bills[endIndex-i-1].getBillStruct();
        }
        return toReturn;
    }
    function getSubDepartmentsPaginate(uint pageSize, uint pageNumber) public view returns(StructLibrary.DepartmentStruct[] memory){
        StructLibrary.DepartmentStruct[] memory result;
        uint offset = pageSize * pageNumber;
        if (pageSize<=0 || pageNumber<0 || offset>=subDepartmentsList.length){
            return result;
        }
        result = new StructLibrary.DepartmentStruct[](_min(pageSize, subDepartmentsList.length-offset));
        for (uint i = offset; i<offset+result.length; i++){
            result[i-offset] = subDepartmentsList[i];
        }
        return result;
    }
    function getEmployeesPaginate(uint pageSize, uint pageNumber) public view returns(StructLibrary.EmployeeStruct[] memory){
        StructLibrary.EmployeeStruct[] memory result;
        uint offset = pageSize * pageNumber;
        if (pageSize<=0 || pageNumber<0 || offset>=employeeList.length){
            return result;
        }
        result = new StructLibrary.EmployeeStruct[](_min(pageSize, employeeList.length-offset));
        for (uint i = offset; i<offset+result.length; i++){
            result[i-offset] = employeeList[i];
        }
        return result;
    }
    function _min(uint a, uint b) internal pure returns (uint){
        return a<b? a : b;
    }
    // function validateAddress(uint index) public view validateIndexModifier(index){
        // require(bills.length<=index, "Index is out of range");
        // require(bills[index].getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
    // }
    // modifier validateIndexModifier(uint index) {
    //     require(bills.length<=index, "Index is out of range");
    //     require(bills[index].getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
    //     _;
    // }
    modifier validateAddressModifier(address addr) {
        require(address(billMap[addr])!=address(0), "Index is out of range");
        require(billMap[addr].getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
        _;
    }
    function handleApproval(address billAddress) public validateAddressModifier(billAddress){
        require(employeeList.length!=0, "There should be at least one approver");
        if ((billMap[billAddress].getBillStruct().partiesAccepted/employeeList.length)*100>billMap[billAddress].getBillStruct().threshold)
            billMap[billAddress].setStatus(StructLibrary.Status.ACCEPTED);
        if ((billMap[billAddress].getBillStruct().partiesRejected/employeeList.length)*100>100-billMap[billAddress].getBillStruct().threshold)
            billMap[billAddress].setStatus(StructLibrary.Status.REJECTED);
    }
    // function getApprovalByIndex(uint index) public view validateAddressModifier(index) returns(Bill){
    //     return bills[index];
    // }
    function vote(address billAddress, StructLibrary.Action opinion) public validateAddressModifier(billAddress) {
        require(address(employeeMap[msg.sender])!=address(0), "Employee is not eligible to vote");
        //should be msg.sender
        // dep.validateIndex(index);
        if (opinion==StructLibrary.Action.APPROVE){
            billMap[billAddress].incrementPartiesAccepted();
        }
        if (opinion==StructLibrary.Action.REJECT){
            billMap[billAddress].incrementPartiesRejected();
        }
        handleApproval(billAddress);
    }
}