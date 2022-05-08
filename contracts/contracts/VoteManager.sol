// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./AuditStorage.sol";

contract VoteManager {

    AuditStorage auditStorage;

    constructor (address auditStorageAddress){
        auditStorage = AuditStorage(auditStorageAddress);
    }
    // function setAuditStorage(address auditStorageAddress) external{
    //     auditStorage = AuditStorage(auditStorageAddress);
    // }

    function vote(address billAddress, StructLibrary.Action opinion, address departmentAddress, address employeeAddress, address tokenAddress) public {
        // validateAddressModifier(billAddress);
        //mark employee who have already voted
        DepartmentManager dep = DepartmentManager(departmentAddress);
        Employee emp = Employee(employeeAddress);
        Bill bill = Bill(billAddress);
        
        // require(address(bills[billAddress])!=address(0), "No bill at the address");
        require(bill.getBillStruct().fromDepartment==departmentAddress, "Department does not have the bill");
        require(bill.getBillStruct().status == StructLibrary.Status.OPEN, "Bill is closed");
        // require(address(employeeMap[msg.sender])!=address(0), "Employee is not eligible to vote");
        require(emp.getEmployeeStruct().parentDepartmentAddress==departmentAddress, "Employee is not part of the department");
        require(dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES)>0, "There should be at least one approver");
        // require(address(bills[billAddress])!=address(0), "No bill at the address");
        // require(bill.getBillStruct().fromDepartment==departmentAddress);
        // require(bill.getBillStruct().status == StructLibrary.Status.OPEN);
        // // require(address(employeeMap[msg.sender])!=address(0), "Employee is not eligible to vote");
        // require(emp.getEmployeeStruct().parentDepartmentAddress==departmentAddress);
        // require(dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES)>0);
        //should be msg.sender
        // dep.validateIndex(index);
        if (opinion==StructLibrary.Action.APPROVE){
            bill.incrementPartiesAccepted();
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
            if ((bill.getBillStruct().partiesRejected/dep.getLength(StructLibrary.DepartmentArrayType.EMPLOYEES))*100>100-bill.getBillStruct().threshold){
                bill.transferToken(bill.getBillStruct().fromBill, tokenAddress, bill.getBillStruct().amount);
                bill.setStatus(StructLibrary.Status.REJECTED);
            }
        }
        // handleApproval(billAddress);
    }
}