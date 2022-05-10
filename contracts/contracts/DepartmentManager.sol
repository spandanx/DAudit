// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
// import {StructLibrary} from "./StructLibrary.sol";
// import "./Employee.sol";
// import "./Bill.sol";
// import "./Auditor.sol";
import "./DepartmentStorage.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract DepartmentManager is DepartmentStorage{

    constructor (string memory _name) {
        // name = _name;
        // addressPoint = address(this);
        departmentStruct = StructLibrary.DepartmentStruct({
            name : _name,
            departmentAddress: address(this),
            balance : 0
        });
        // department_EmployeeManager = address(new Department_EmployeeManager());
    }
    function addApproval(StructLibrary.ApprovalStruct memory approval) external {
        approval.index = approvalList.length;
        approvalList.push(approval);
        approvalMap[approval.accountAddress] = approval;
    }
    // function approve(address approvalAddress, StructLibrary.Action action) external {
    //     StructLibrary.ApprovalStruct memory apr = approvalMap[approvalAddress];
    //     if (action==StructLibrary.Action.REJECT){
    //         apr.status = StructLibrary.Status.REJECTED;
    //         return;
    //     }
    //     if (apr.accountType==StructLibrary.AccountType.EMPLOYEE){
    //         Employee emp = Employee(apr.accountAddress);
    //         employeeList.push(emp.getEmployeeStruct());
    //         employeeMap[address(emp)] = emp;
    //     }
    //     else if (apr.accountType==StructLibrary.AccountType.DEPARTMENT){
    //         DepartmentManager dep = DepartmentManager(apr.accountAddress);
    //         subDepartmentsList.push(dep.getDepartmentStruct());
    //         subDepartmentsMap[address(dep)] = dep;
    //     }
    //     else if (apr.accountType==StructLibrary.AccountType.AUDITOR) {
    //         Auditor aud = Auditor(apr.accountAddress);
    //         auditorList.push(aud.getAuditorStruct());
    //         auditorMap[address(aud)] = aud;
    //     }
    //     else{
    //         revert("Wrong account type!");
    //     }
    //     apr.status = StructLibrary.Status.ACCEPTED;
    // }
    function approve(address approvalAddress, StructLibrary.Action action) external {
        console.log("Called approve()");
        console.log("action: ");
        StructLibrary.ApprovalStruct memory apr = approvalMap[approvalAddress];
        if (action==StructLibrary.Action.REJECT){
            console.log("Rejecting");
            approvalList[apr.index].status = StructLibrary.Status.REJECTED;
            // apr.status = StructLibrary.Status.REJECTED;
            return;
        }
        console.log("Accepting");
        if (apr.accountType==StructLibrary.AccountType.EMPLOYEE){
            // Employee emp = Employee(apr.accountAddress);
            employeeList.push(approvalAddress);
        }
        else if (apr.accountType==StructLibrary.AccountType.DEPARTMENT){
            // DepartmentManager dep = DepartmentManager(apr.accountAddress);
            subDepartmentsList.push(approvalAddress);
            // subDepartmentsMap[address(dep)] = dep;
        }
        else if (apr.accountType==StructLibrary.AccountType.AUDITOR) {
            // Auditor aud = Auditor(apr.accountAddress);
            auditorList.push(approvalAddress);
            // auditorMap[address(aud)] = aud;
        }
        else{
            revert("Wrong account type!");
        }
        approvalList[apr.index].status = StructLibrary.Status.ACCEPTED;
        // apr.status = StructLibrary.Status.ACCEPTED;
    }
    function getDepartmentStruct() public view returns(StructLibrary.DepartmentStruct memory) {
        return departmentStruct;
    }
    // function addDepartment (address subDep) public {
    //     DepartmentManager dep = DepartmentManager(subDep);
    //     subDepartmentsList.push(dep.getDepartmentStruct());
    //     subDepartmentsMap[address(dep)] = dep;
    //     // subDepartmentsMap[subDep] = Department(subDep);
    // }
    // function addEmployee (address empAdr) public {
    //     Employee emp = Employee(empAdr);
    //     employeeList.push(emp.getEmployeeStruct());
    //     employeeMap[address(emp)] = emp;
    //     // accountsMap[subAcc] = Account(subAcc);
    // }
    // function addAuditor (address audAdr) public {
    //     Auditor aud = Auditor(audAdr);
    //     auditorList.push(aud.getAuditorStruct());
    //     auditorMap[address(aud)] = aud;
    //     // accountsMap[subAcc] = Account(subAcc);
    // }
    // function getSubDepartments() public view returns (StructLibrary.DepartmentStruct[] memory){
    //     return subDepartmentsList;
    // }
    // function getEmployees() public view returns (StructLibrary.EmployeeStruct[] memory) {
    //     return employeeList;
    // }
    function createBill(Bill bill) external {
        // IERC20 token = IERC20(tokenAddress);
        // token.transfer(address(bill), amount);
        bills.push(address(bill));
    }
    // function createBill(
    //     string memory _name,
    //     string memory _description,
    //     uint _threshold,
    //     string memory _imagePath,
    //     uint _deadline,
    //     uint _amount,
    //     address _fromBill,
    //     address _fromDepartment,
    //     address _toDepartment
    //     ) public returns (address){
    //         Bill bill = new Bill({
    //         _name: _name,
    //         _description: _description,
    //         _threshold: _threshold,
    //         _imagePath: _imagePath,
    //         _deadline: _deadline,
    //         _amount: _amount,
    //         _fromBill: _fromBill,
    //         _fromDepartment: _fromDepartment,
    //         _toDepartment: _toDepartment
    //         });
    //         bills.push(bill.getBillStruct());
    //         billMap[address(bill)] = bill;
    //         return address(bill);
    // }
    // return bill address
    // function pushBills(Bill bill) public {
    //     bills.push(bill.getBillStruct());
    // }
    // function getBillByAddress(uint index) public view returns (Bill){
    //     return Bill(bills[index].billOwnAddress);
    // }
    function getLength(StructLibrary.DepartmentArrayType arrayType) public view returns(uint) {
        //0=bill, 1=funds, 2=subDepartments
        if (arrayType==StructLibrary.DepartmentArrayType.BILLS)
            return bills.length;
        else if (arrayType==StructLibrary.DepartmentArrayType.FUNDS)
            return funds.length;
        else if (arrayType==StructLibrary.DepartmentArrayType.SUBDEPARTMENTS)
            return subDepartmentsList.length;
        else if (arrayType==StructLibrary.DepartmentArrayType.EMPLOYEES)
            return employeeList.length;
        else if (arrayType==StructLibrary.DepartmentArrayType.AUDITORS)
            return auditorList.length;
        else
            return 0;
        // return funds.length;
    }
    // function pushFund(Bill bill) public {
    //     funds.push(bill.getBillStruct());
    //     fundMap[address(bill)] = bill;
    // }
    function pushFund(Bill bill) public {
        funds.push(address(bill));
        // fundMap[address(bill)] = bill;
    }
    // function getFunds(uint pageSize, uint pageNumber) external view returns(StructLibrary.BillStruct[] memory) {
    //     return StructLibrary.getFunds(pageSize, pageNumber, funds);
    // }
    // function getApprovals(uint pageSize, uint pageNumber) external view returns(StructLibrary.ApprovalStruct[] memory) {
    //     return StructLibrary.getApprovalsPaginate(pageSize, pageNumber, approvals);
    // }
    // function getAuditors(uint pageSize, uint pageNumber) external view returns(StructLibrary.AuditorStruct[] memory) {
    //     return StructLibrary.getAuditorsPaginate(pageSize, pageNumber, auditorList);
    // }
    // function getBills(uint pageSize, uint pageNumber) public view returns(StructLibrary.BillStruct[] memory) {
    //     return StructLibrary.getFunds(pageSize, pageNumber, bills);
    // }
    // function getSubDepartments(uint pageSize, uint pageNumber) external view returns(StructLibrary.DepartmentStruct[] memory){
    //     return StructLibrary.getSubDepartmentsPaginate(pageSize, pageNumber, subDepartmentsList);
    // }
    // function getEmployees(uint pageSize, uint pageNumber) external view returns(StructLibrary.EmployeeStruct[] memory){
    //     return StructLibrary.getEmployeesPaginate(pageSize, pageNumber, employeeList);
    // }
    // function _min(uint a, uint b) internal pure returns (uint){
    //     return a<b? a : b;
    // }
    // function validateAddress(uint index) public view validateIndexModifier(index){
        // require(bills.length<=index, "Index is out of range");
        // require(bills[index].getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
    // }
    // modifier validateIndexModifier(uint index) {
    //     require(bills.length<=index, "Index is out of range");
    //     require(bills[index].getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
    //     _;
    // }
    // function validateAddressModifier(address addr) internal view {
    //     require(address(billMap[addr])!=address(0), "No bill at the address");
    //     require(billMap[addr].getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
    //     // _;
    // }
    // function transferBill(Bill bill) internal {
        // address toDepAddress = bill.getBillStruct().toDepartment;
        // Department dep = Department(toDepAddress);
        // dep.pushFund(bill);
    // }
    // function handleApproval(address billAddress) public {
        // validateAddressModifier(billAddress);
        // require(employeeList.length!=0, "There should be at least one approver");
        // if ((billMap[billAddress].getBillStruct().partiesRejected/employeeList.length)*100>100-billMap[billAddress].getBillStruct().threshold)
        //     billMap[billAddress].setStatus(StructLibrary.Status.REJECTED);
        // if ((billMap[billAddress].getBillStruct().partiesAccepted/employeeList.length)*100>billMap[billAddress].getBillStruct().threshold){
        //     transferBill(billMap[billAddress]);
        //     billMap[billAddress].setStatus(StructLibrary.Status.ACCEPTED);
        // }
    // }
    // function getApprovalByIndex(uint index) public view validateAddressModifier(index) returns(Bill){
    //     return bills[index];
    // }
    // function vote(address billAddress, StructLibrary.Action opinion) public {
    //     validateAddressModifier(billAddress);
    //     require(address(employeeMap[msg.sender])!=address(0), "Employee is not eligible to vote");
    //     require(employeeList.length!=0, "There should be at least one approver");
    //     //should be msg.sender
    //     // dep.validateIndex(index);
    //     if (opinion==StructLibrary.Action.APPROVE){
    //         billMap[billAddress].incrementPartiesAccepted();
    //         if ((billMap[billAddress].getBillStruct().partiesAccepted/employeeList.length)*100>billMap[billAddress].getBillStruct().threshold){
    //             // transferBill(billMap[billAddress]);
    //             address toDepAddress = billMap[billAddress].getBillStruct().toDepartment;
    //             DepartmentManager dep = DepartmentManager(toDepAddress);
    //             dep.pushFund(billMap[billAddress]);
    //             //
    //             billMap[billAddress].setStatus(StructLibrary.Status.ACCEPTED);
    //         }
    //     }
    //     if (opinion==StructLibrary.Action.REJECT){
    //         billMap[billAddress].incrementPartiesRejected();
    //         if ((billMap[billAddress].getBillStruct().partiesRejected/employeeList.length)*100>100-billMap[billAddress].getBillStruct().threshold)
    //             billMap[billAddress].setStatus(StructLibrary.Status.REJECTED);
    //     }
    //     // handleApproval(billAddress);
    // }
}