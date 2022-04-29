// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";
import "./Department.sol";

contract Employee {
    using StructLibrary for StructLibrary.Action;
    using StructLibrary for StructLibrary.EmployeeStruct;

    StructLibrary.EmployeeStruct employeeStruct;
    
    string name;
    constructor (address _parentDepartmentAddress, string memory _name) {
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
}