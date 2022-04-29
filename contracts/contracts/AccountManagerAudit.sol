// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "./AuditStorage.sol";

contract AccountManagerAudit is AuditStorage{
    using StructLibrary for StructLibrary.Action;

    string EMP_EXISTS = "Employee already assigned";
    string DEP_EXISTS = "Departmemt already assigned";

    constructor (string memory rootDepartmentName, uint fund) {
        departments[msg.sender] = new Department(rootDepartmentName);
        departments[msg.sender].createBill({
            _name: "Goverment Fund",
            _description: "This is the parent of all bills",
            _threshold: 0,
            _imagePath: "dummy",
            _deadline: 0,
            _amount: fund,
            _fromBill: address(0),
            _fromDepartment: address(0),
            _toDepartment: address(departments[msg.sender])
        });
    }
    modifier noAccountExists() {
        require(address(employees[msg.sender])==address(0), EMP_EXISTS);
        require(address(departments[msg.sender])==address(0), DEP_EXISTS);
        _;
    }
    function registerEmployee (address parentDepartMent, string memory empName) external 
    noAccountExists
     {
        Department rootDep = Department(parentDepartMent);
        Employee subEmp = new Employee(parentDepartMent, empName);
        rootDep.addEmployee(address(subEmp));
        employees[msg.sender] = subEmp;
    }
    function registerDepartment (address parentDepartMent, string memory depName) external
    noAccountExists
     {
        Department rootDep = Department(parentDepartMent);
        Department subDep = new Department(depName);
        rootDep.addDepartment(address(subDep));
        departments[msg.sender] = subDep;
    }
}
