// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";
import "./Department.sol";

contract Employee {
    using StructLibrary for StructLibrary.Action;
    using StructLibrary for StructLibrary.EmployeeStruct;

    StructLibrary.EmployeeStruct employeeStruct;
    // Department department;
    string name;
    constructor (address _parentDepartmentAddress, string memory _name) {
        // Department dep = Department(addr);
        // name = _name;
        employeeStruct = StructLibrary.EmployeeStruct({
            name: _name,
            employeeAddress: address(this),
            parentDepartmentAddress: _parentDepartmentAddress
        });
    }
    function getEmployeeStruct() public view returns(StructLibrary.EmployeeStruct memory){
        return employeeStruct;
    }
    function getDepartment() public view returns(Department){
        return Department(employeeStruct.parentDepartmentAddress);
    }
    function vote(uint index, StructLibrary.Action opinion) public {
        Department dep = Department(employeeStruct.parentDepartmentAddress);
        dep.validateIndex(index);
        if (opinion==StructLibrary.Action.APPROVE){
            dep.getBillByIndex(index).incrementPartiesAccepted();
        }
        if (opinion==StructLibrary.Action.REJECT){
            dep.getBillByIndex(index).incrementPartiesRejected();
        }
        dep.handleApproval(index);
    }
}