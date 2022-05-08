// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./AuditStorage.sol";
import "hardhat/console.sol";
import {StructLibrary} from "./StructLibrary.sol";

contract VoteManager {

    AuditStorage auditStorage;

    // constructor (address auditStorageAddress){
    //     auditStorage = AuditStorage(auditStorageAddress);
    // }
    // function setAuditStorage(address auditStorageAddress) external{
    //     auditStorage = AuditStorage(auditStorageAddress);
    // }

    function vote(address billAddress, StructLibrary.Action opinion, address departmentAddress, address tokenAddress, address employeeAddress) public {
        // validateAddressModifier(billAddress);
        //mark employee who have already voted
        console.log("vote() called");
        DepartmentManager dep = DepartmentManager(departmentAddress);
        console.log("Dep instance created");
        Employee emp = Employee(employeeAddress);//employee should call this
        console.log("emp instance created");
        Bill bill = Bill(billAddress);
        console.log("bill instance created");
        
        // require(address(bills[billAddress])!=address(0), "No bill at the address");
        require(bill.getBillStruct().fromDepartment==departmentAddress, "Department does not have the bill");
        require(bill.getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
        // require(address(employeeMap[msg.sender])!=address(0), "Employee is not eligible to vote");
        require(emp.getEmployeeStruct().parentDepartmentAddress==departmentAddress, "Employee is not part of the department");
        require(dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES)>0, "There should be at least one approver");
        require(bill.voteMapping(employeeAddress)==StructLibrary.Vote.DID_NOT_VOTE, "Already voted");
        // require(address(bills[billAddress])!=address(0), "No bill at the address");
        // require(bill.getBillStruct().fromDepartment==departmentAddress);
        // require(bill.getBillStruct().status == StructLibrary.Status.OPEN);
        // // require(address(employeeMap[msg.sender])!=address(0), "Employee is not eligible to vote");
        // require(emp.getEmployeeStruct().parentDepartmentAddress==departmentAddress);
        // require(dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES)>0);
        //should be msg.sender
        // dep.validateIndex(index);
        console.log("require statements fulfilled");
        if (opinion==StructLibrary.Action.APPROVE){
            console.log("inside approve");
            bill.incrementPartiesAccepted();
            bill.setVoteMapping(employeeAddress, StructLibrary.Vote.ACCEPTED);
            if ((bill.getBillStruct().partiesAccepted/dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES))*100>bill.getBillStruct().threshold){
                // transferBill(billMap[billAddress]);
                address toDepAddress = bill.getBillStruct().toDepartment;
                DepartmentManager childDep = DepartmentManager(toDepAddress);
                // bill.transferToken(bill.getBillStruct().toDepartment, tokenAddress);
                childDep.pushFund(bill);
                bill.setStatus(StructLibrary.Status.ACCEPTED);
            }
        }
        if (opinion==StructLibrary.Action.REJECT){
            bill.incrementPartiesRejected();
            bill.setVoteMapping(employeeAddress, StructLibrary.Vote.REJECTED);
            if ((bill.getBillStruct().partiesRejected/dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES))*100>100-bill.getBillStruct().threshold){
                bill.transferToken(bill.getBillStruct().fromBill, tokenAddress, bill.getBillStruct().amount);
                bill.setStatus(StructLibrary.Status.REJECTED);
            }
        }
        // handleApproval(billAddress);
    }
}