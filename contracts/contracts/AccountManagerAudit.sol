// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "./AuditStorage.sol";
import "./DepartmentManager.sol";
import {StructLibrary} from "./StructLibrary.sol";

import "hardhat/console.sol";

contract AccountManagerAudit is AuditStorage{
    using StructLibrary for StructLibrary.Action;
    using StructLibrary for StructLibrary.ApprovalStruct;

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
    function register (address parentDepartMent, string memory name, StructLibrary.AccountType accType) external 
    noAccountExists
     {
        console.log("Calling Register()");
        console.log("AccType:");
        // console.log(accType);
        DepartmentManager rootDep = DepartmentManager(parentDepartMent);
        address addr;
        if (accType==StructLibrary.AccountType.EMPLOYEE){
            employees[msg.sender] = new Employee(parentDepartMent, name);
            addr = address(employees[msg.sender]);
        }
        else if (accType==StructLibrary.AccountType.DEPARTMENT){
            departments[msg.sender] = new DepartmentManager(name);
            addr = address(departments[msg.sender]);
        }
        else if (accType==StructLibrary.AccountType.AUDITOR) {
            auditors[msg.sender] = new Auditor(parentDepartMent, name);
            addr = address(auditors[msg.sender]);
        }
        else{
            revert("Wrong account type!");
        }
        StructLibrary.ApprovalStruct memory apr = StructLibrary.ApprovalStruct({
            accountType : accType,
            accountAddress: addr,
            parentDepartmentAddress: parentDepartMent,
            status: StructLibrary.Status.OPEN
        });
        // rootDep.addEmployee(address(subEmp));
        rootDep.addApproval(apr);
        approvedStatus[addr] = false;
        // employees[msg.sender] = subEmp;
    }
    function approve(address departmentAddress, address approvalAddress, StructLibrary.Action action) external {
        DepartmentManager parentDep = DepartmentManager(departmentAddress);
        parentDep.approve(approvalAddress, action);
        if (action==StructLibrary.Action.APPROVE){
            approvedStatus[approvalAddress] = true;
        }
        // if (apr.accountType==StructLibrary.AccountType.EMPLOYEE){
        //     Employee emp = Employee(apr.accountAddress);
        //     parentDep.employeeList.push(emp.getEmployeeStruct());
        //     parentDep.depemployeeMap[address(emp)] = emp;
        // }
        // else if (apr.accountType==StructLibrary.AccountType.DEPARTMENT){
        //     DepartmentManager dep = DepartmentManager(apr.accountAddress);
        //     parentDep.subDepartmentsList.push(dep.getDepartmentStruct());
        //     parentDep.subDepartmentsMap[address(dep)] = dep;
        // }
        // else if (apr.accountType==StructLibrary.AccountType.AUDITOR) {
        //     Auditor aud = Auditor(apr.accountAddress);
        //     parentDep.auditorList.push(aud.getAuditorStruct());
        //     parentDep.auditorMap[address(aud)] = aud;
        // }
        // else{
        //     revert("Wrong account type!");
        // }
        // apr.status = StructLibrary.Status.ACCEPTED;
    }
    // function registerDepartment (address parentDepartMent, string memory depName) external
    // noAccountExists
    //  {
    //     DepartmentManager rootDep = DepartmentManager(parentDepartMent);
    //     DepartmentManager subDep = new DepartmentManager(depName);
    //     rootDep.addDepartment(address(subDep));
    //     departments[msg.sender] = subDep;
    // }

    // function registerAuditor (address parentDepartMent, string memory audName) external
    // noAccountExists
    //  {
    //     DepartmentManager rootDep = DepartmentManager(parentDepartMent);
    //     Auditor aud = new Auditor(parentDepartMent, audName);
    //     rootDep.addAuditor(address(aud));
    //     auditors[msg.sender] = aud;
    // }
}