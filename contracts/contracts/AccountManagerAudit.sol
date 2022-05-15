// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "./AuditStorage.sol";
import "./DepartmentManager.sol";
import {StructLibrary} from "./StructLibrary.sol";
import "./BLT.sol";

// import "hardhat/console.sol";

contract AccountManagerAudit is AuditStorage{
    
    using StructLibrary for StructLibrary.Action;
    using StructLibrary for StructLibrary.ApprovalStruct;

    address public tokenAddress;
    address public billAddress;

    // string EMP_EXISTS = "Employee already assigned";
    // string DEP_EXISTS = "Departmemt already assigned";
    // string AUD_EXISTS = "Auditor already assigned";

    constructor (string memory rootDepartmentName) {
        departments[msg.sender] = new DepartmentManager(rootDepartmentName);
        BLT token = new BLT();
        tokenAddress = address(token);
        uint amount = token.totalSupply();
        Bill bill = new Bill({
            _name: "Goverment Fund",
            _description:"Root fund",
            _threshold:70,
            _imagePath:"dummy",
            _deadline:block.timestamp,
            _acceptedOrRejectedOn:block.timestamp,
            _amount: amount,
            _fromBill: address(0),
            _fromDepartment: address(0),
            _toDepartment: address(departments[msg.sender])
        });
        bill.setStatus(StructLibrary.Status.ACCEPTED);
        approvedStatus[address(departments[msg.sender])] = StructLibrary.ApprovalStatus.ACCEPTED;
        token.transfer(address(bill), amount);
        billAddress = address(bill);
        departments[msg.sender].pushFund(bill);
        bills[address(bill)] = bill;
    }
    // modifier noAccountExists() {
    //     require(address(employees[msg.sender])==address(0), EMP_EXISTS);
    //     require(address(departments[msg.sender])==address(0), DEP_EXISTS);
    //     require(address(auditors[msg.sender])==address(0), AUD_EXISTS);
    //     _;
    // }
    function register (address parentDepartMent, string memory name, StructLibrary.AccountType accType) external 
     {
        // string memory mssg = "address already assigned";
        // require(address(employees[msg.sender])==address(0), mssg);
        // require(address(departments[msg.sender])==address(0), mssg);
        // require(address(auditors[msg.sender])==address(0), mssg);
        require(address(employees[msg.sender])==address(0));
        require(address(departments[msg.sender])==address(0));
        require(address(auditors[msg.sender])==address(0));
        // console.log("Calling Register()");
        // console.log("AccType:");
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
            // revert();
        }
        StructLibrary.ApprovalStruct memory apr = StructLibrary.ApprovalStruct({
            accountType : accType,
            accountAddress: addr,
            parentDepartmentAddress: parentDepartMent,
            status: StructLibrary.Status.OPEN,
            index: 0,
            origin: msg.sender
        });
        // rootDep.addEmployee(address(subEmp));
        rootDep.addApproval(apr);
        approvedStatus[addr] = StructLibrary.ApprovalStatus.EXISTS;
        // employees[msg.sender] = subEmp;
    }
    function approve(address departmentAddress, address approvalAddress, StructLibrary.Action action) external {
        DepartmentManager parentDep = DepartmentManager(departmentAddress);
        parentDep.approve(approvalAddress, action);
        if (action==StructLibrary.Action.APPROVE){
            approvedStatus[approvalAddress] = StructLibrary.ApprovalStatus.ACCEPTED;
        }
        else if (action==StructLibrary.Action.REJECT){
            approvedStatus[approvalAddress] = StructLibrary.ApprovalStatus.REJECTED;
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
    // function vote(address billAddress, StructLibrary.Action opinion, address departmentAddress, address employeeAddress, address tokenAddress) public {
    //     // validateAddressModifier(billAddress);
    //     //mark employee who have already voted
    //     DepartmentManager dep = DepartmentManager(departmentAddress);
    //     Employee emp = Employee(employeeAddress);
    //     Bill bill = Bill(billAddress);
        
    //     // // require(address(bills[billAddress])!=address(0), "No bill at the address");
    //     // require(bill.getBillStruct().fromDepartment==departmentAddress, "Department does not have the bill");
    //     // require(bill.getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
    //     // // require(address(employeeMap[msg.sender])!=address(0), "Employee is not eligible to vote");
    //     // require(emp.getEmployeeStruct().parentDepartmentAddress==departmentAddress, "Employee is not part of the department");
    //     // require(dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES)>0, "There should be at least one approver");
    //     // require(address(bills[billAddress])!=address(0), "No bill at the address");
    //     require(bill.getBillStruct().fromDepartment==departmentAddress);
    //     require(bill.getBillStruct().status == StructLibrary.Status.OPEN);
    //     // require(address(employeeMap[msg.sender])!=address(0), "Employee is not eligible to vote");
    //     require(emp.getEmployeeStruct().parentDepartmentAddress==departmentAddress);
    //     require(dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES)>0);
    //     //should be msg.sender
    //     // dep.validateIndex(index);
    //     if (opinion==StructLibrary.Action.APPROVE){
    //         bill.incrementPartiesAccepted();
    //         if ((bill.getBillStruct().partiesAccepted/dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES))*100>bill.getBillStruct().threshold){
    //             // transferBill(billMap[billAddress]);
    //             address toDepAddress = bill.getBillStruct().toDepartment;
    //             DepartmentManager dep = DepartmentManager(toDepAddress);
    //             bill.transferToken(bill.getBillStruct().toDepartment, tokenAddress);
    //             dep.pushFund(bill);
    //             bill.setStatus(StructLibrary.Status.ACCEPTED);
    //         }
    //     }
    //     if (opinion==StructLibrary.Action.REJECT){
    //         bill.incrementPartiesRejected();
    //         if ((bill.getBillStruct().partiesRejected/dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES))*100>100-bill.getBillStruct().threshold){
    //             bill.transferToken(bill.getBillStruct().fromDepartment, tokenAddress);
    //             bill.setStatus(StructLibrary.Status.REJECTED);
    //         }
    //     }
    //     // handleApproval(billAddress);
    // }
}