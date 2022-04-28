// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {StructLibrary} from "./StructLibrary.sol";
import "./Employee.sol";

contract AccountManagerAudit {
    using StructLibrary for StructLibrary.Action;
    mapping (address => Employee) public employees;
    mapping (address => Department) public departments;
    // mapping (address => Bill) public bills;
    
    Department private rootDepartment;

    constructor (string memory rootDepartmentName) {
        rootDepartment = new Department(rootDepartmentName);
        departments[msg.sender] = rootDepartment;
    }
    function getRootDepartMentAddress() public view returns (address) {
        return address(rootDepartment);
    }
    function getDepartmentAddress() public view isDepartMentAssigned returns (address) {
        return address(departments[msg.sender]);
    }
    function getEmployeeAddress() public view isEmployeeAssigned returns (address) {
        return address(employees[msg.sender]);
    }
    modifier isEmployeeAssigned() {
        require(address(employees[msg.sender])!=address(0), "No employees assigned");
        _;
    }
    modifier isDepartMentAssigned() {
        require(address(departments[msg.sender])!=address(0), "No departments assigned");
        _;
    }
    function registerDepartment (address parentDepartMent, string memory depName) public {
        Department rootDep = Department(parentDepartMent);
        Department subDep = new Department(depName);
        rootDep.addDepartment(address(subDep));
        departments[msg.sender] = subDep;
    }
    function registerEmployee (address parentDepartMent, string memory empName) public {
        Department rootDep = Department(parentDepartMent);
        Employee subEmp = new Employee(parentDepartMent, empName);
        rootDep.addEmployee(address(subEmp));
        employees[msg.sender] = subEmp;
    }
    // function getSubDepartments(address depAddress) public view isDepartMent returns(StructLibrary.DepartmentStruct[] memory){
    //     Department dep = Department(depAddress);
    //     return dep.getSubDepartments();
    // }
    // function getAccounts(address depAddress) public view isDepartMent returns(StructLibrary.AccountStruct[] memory){
    //     Department dep = Department(depAddress);
    //     return dep.getAccounts();
    // }
    // function vote(uint index, StructLibrary.Action opinion) public isAccount {
    //     accounts[tx.origin].vote(index, opinion);
    // }
    // function getBills(uint pageSize, uint pageNumber) public view returns (StructLibrary.BillStruct[] memory){
    //     require (address(accounts[msg.sender])!=address(0) || address(departments[msg.sender])!=address(0), "Account does not exist");
    //     if (address(accounts[msg.sender])!=address(0)){
    //         return accounts[tx.origin].getDepartment().getBills(pageSize, pageNumber);
    //     }
    //     else{
    //         return departments[tx.origin].getBills(pageSize, pageSize);
    //     }
    // }
}
