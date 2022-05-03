// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "./AuditStorage.sol";
import "./DepartmentManager.sol";

contract AccountManagerAudit is AuditStorage{
    using StructLibrary for StructLibrary.Action;

    string EMP_EXISTS = "Employee already assigned";
    string DEP_EXISTS = "Departmemt already assigned";
    string AUD_EXISTS = "Auditor already assigned";

    constructor (string memory rootDepartmentName) {
        departments[msg.sender] = new DepartmentManager(rootDepartmentName);
        //create the token here
    }
    modifier noAccountExists() {
        require(address(employees[msg.sender])==address(0), EMP_EXISTS);
        require(address(departments[msg.sender])==address(0), DEP_EXISTS);
        require(address(auditors[msg.sender])==address(0), AUD_EXISTS);
        _;
    }
    function registerEmployee (address parentDepartMent, string memory empName) external 
    noAccountExists
     {
        DepartmentManager rootDep = DepartmentManager(parentDepartMent);
        Employee subEmp = new Employee(parentDepartMent, empName);
        rootDep.addEmployee(address(subEmp));
        employees[msg.sender] = subEmp;
    }
    function registerDepartment (address parentDepartMent, string memory depName) external
    noAccountExists
     {
        DepartmentManager rootDep = DepartmentManager(parentDepartMent);
        DepartmentManager subDep = new DepartmentManager(depName);
        rootDep.addDepartment(address(subDep));
        departments[msg.sender] = subDep;
    }

    function registerAuditor (address parentDepartMent, string memory audName) external
    noAccountExists
     {
        DepartmentManager rootDep = DepartmentManager(parentDepartMent);
        Auditor aud = new Auditor(parentDepartMent, audName);
        rootDep.addAuditor(address(aud));
        auditors[msg.sender] = aud;
    }
}