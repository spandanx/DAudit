// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {StructLibrary} from "./StructLibrary.sol";
import "./Account.sol";

contract AccountManagerAudit {
    using StructLibrary for StructLibrary.Action;
    mapping (address => Account) public accounts;
    mapping (address => Department) public departments;
    mapping (address => Bill) public bills;
    
    Department private rootDepartment;

    constructor (string memory rootDepartmentName) {
        rootDepartment = new Department(rootDepartmentName);
        departments[msg.sender] = rootDepartment;
    }
    function getRootDepartMentAddress() public view returns (address) {
        return address(rootDepartment);
    }
    modifier isAccount() {
        require(address(accounts[msg.sender])!=address(0), "No accounts assigned");
        _;
    }
    modifier isDepartMent() {
        require(address(departments[msg.sender])!=address(0), "No departments assigned");
        _;
    }
    function registerDepartment (address parentDepartMent, string memory depName) public {
        Department rootDep = Department(parentDepartMent);
        Department subDep = new Department(depName);
        rootDep.addDepartment(address(subDep));
        departments[msg.sender] = subDep;
    }
    function registerAccount (address parentDepartMent, string memory accName) public {
        Department rootDep = Department(parentDepartMent);
        Account subAcc = new Account(parentDepartMent, accName);
        rootDep.addAccount(address(subAcc));
        accounts[msg.sender] = subAcc;
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
