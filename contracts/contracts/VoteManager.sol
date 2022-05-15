// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./AuditStorage.sol";
import "hardhat/console.sol";
import {StructLibrary} from "./StructLibrary.sol";
import "./Merge.sol";

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
    function voteMerge(address mergeAddress, StructLibrary.Action opinion, address departmentAddress, address tokenAddress, address employeeAddress) public {
        // validateAddressModifier(billAddress);
        //mark employee who have already voted
        console.log("vote() called");
        DepartmentManager dep = DepartmentManager(departmentAddress);
        console.log("Dep instance created");
        Employee emp = Employee(employeeAddress);//employee should call this
        console.log("emp instance created");
        Merge merge = Merge(mergeAddress);
        console.log("bill instance created");
        
        // require(address(bills[billAddress])!=address(0), "No bill at the address");
        require(merge.getMergeStruct().fromDepartment==departmentAddress, "Department does not have the bill");
        require(merge.getMergeStruct().billStatus == StructLibrary.Status.OPEN, "Bill is closed");
        // require(address(employeeMap[msg.sender])!=address(0), "Employee is not eligible to vote");
        require(emp.getEmployeeStruct().parentDepartmentAddress==departmentAddress, "Employee is not part of the department");
        require(dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES)>0, "There should be at least one approver");
        require(merge.voteMapping(employeeAddress)==StructLibrary.Vote.DID_NOT_VOTE, "Already voted");
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
            merge.incrementPartiesAccepted();
            merge.setVoteMapping(employeeAddress, StructLibrary.Vote.ACCEPTED);
            if ((merge.getMergeStruct().partiesAccepted/dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES))*100>merge.getMergeStruct().threshold){
                // transferBill(billMap[billAddress]);
                address toDepAddress = merge.getMergeStruct().toDepartment;
                DepartmentManager destinationDep = DepartmentManager(toDepAddress);
                // bill.transferToken(bill.getBillStruct().toDepartment, tokenAddress);
                destinationDep.pushMergeRequest(mergeAddress);
                merge.setStatus(StructLibrary.Status.ACCEPTED, StructLibrary.MergeBillType.BILL);
            }
        }
        if (opinion==StructLibrary.Action.REJECT){
            merge.incrementPartiesRejected();
            merge.setVoteMapping(employeeAddress, StructLibrary.Vote.REJECTED);
            if ((merge.getMergeStruct().partiesRejected/dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES))*100>100-merge.getMergeStruct().threshold){
                merge.transferToken(merge.getMergeStruct().fromBill, tokenAddress, merge.getMergeStruct().amount);
                merge.setStatus(StructLibrary.Status.REJECTED, StructLibrary.MergeBillType.BILL);
            }
        }
        // handleApproval(billAddress);
    }
    function approveRequestMerge(address mergeAddress, address departmentAddress, address auditStorageAddress, StructLibrary.Action opinion, address tokenAddress, string memory proof) public {
        Merge merge = Merge(mergeAddress);
        AuditStorage auditStorage = AuditStorage(auditStorageAddress);
        require(merge.getMergeStruct().toDepartment==departmentAddress, "Department does not have the bill");
        // require(emp.getEmployeeStruct().parentDepartmentAddress==departmentAddress, "Employee is not part of the department");
        
        if (opinion==StructLibrary.Action.APPROVE){
            merge.transferToken(merge.getMergeStruct().toBill, tokenAddress, merge.getMergeStruct().amount);
            merge.setStatus(StructLibrary.Status.ACCEPTED, StructLibrary.MergeBillType.REQUEST);
            merge.setComments(proof);
        }
        if (opinion==StructLibrary.Action.REJECT){
            // BillManager billManager = BillManager(billManagerAddress);
            // require(address(auditStorage.departments(msg.sender))!=address(0), "Departmemt does not exist");
            // require(_threshold>=0 && _threshold<=100, "Threshold should be between 0 to 100");
            DepartmentManager parentDep = DepartmentManager(merge.getMergeStruct().fromDepartment);
            Merge parentMerge = Merge(merge.getMergeStruct().billOwnAddress);

            Bill bill = new Bill({
                _name: merge.getMergeStruct().name,
                _description: merge.getMergeStruct().description,
                _threshold: merge.getMergeStruct().threshold,
                _imagePath: "",
                _deadline: merge.getMergeStruct().deadline,
                _acceptedOrRejectedOn: merge.getMergeStruct().acceptedOrRejectedOn,
                _amount: merge.getMergeStruct().amount,
                _fromBill: merge.getMergeStruct().fromBill,
                _fromDepartment: merge.getMergeStruct().fromDepartment,
                _toDepartment: merge.getMergeStruct().fromDepartment
            });
            parentMerge.transferToken(address(bill), tokenAddress, merge.getMergeStruct().amount);
            parentDep.pushFund(bill);
            auditStorage.pushBillMap(merge.getMergeStruct().fromBill, bill);
            auditStorage.addBill(bill);
            
            merge.setComments(proof);
            merge.setStatus(StructLibrary.Status.REJECTED, StructLibrary.MergeBillType.REQUEST);
        }
    }
}