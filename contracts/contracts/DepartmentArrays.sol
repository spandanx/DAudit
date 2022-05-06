// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";
import "./DepartmentStorage.sol";
import "./AuditStorage.sol";

contract DepartmentArrays {

    function getFunds(uint pageSize, uint pageNumber, address depAddress, address auditStorage) external view returns(StructLibrary.BillStruct[] memory) {
        DepartmentStorage dep = DepartmentStorage(depAddress);
        AuditStorage aud = AuditStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.FUNDS, true);
        StructLibrary.BillStruct[] memory toReturn = new StructLibrary.BillStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = aud.bills(addr[i]).getBillStruct();
        }
        return toReturn;
    }
    function getApprovals(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.ApprovalStruct[] memory) {
        DepartmentStorage dep = DepartmentStorage(depAddress);
        return dep.getApprovals(pageSize, pageNumber);
    }
    // function getAuditors(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.AuditorStruct[] memory) {
    //     DepartmentStorage dep = DepartmentStorage(depAddress);
    //     address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.FUNDS, true);
    //     StructLibrary.AuditorStruct[] memory toReturn = new StructLibrary.AuditorStruct[](addr.length);
    //     for (uint i = 0; i<addr.length; i++){
    //         toReturn[i] = dep.auditors[addr[i]].getAuditorStruct();
    //     }
    //     return toReturn;
    // }
    function getBills(uint pageSize, uint pageNumber, address depAddress) public view returns(StructLibrary.BillStruct[] memory) {
        DepartmentStorage dep = DepartmentStorage(depAddress);
        AuditStorage aud = AuditStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.BILLS, true);
        StructLibrary.BillStruct[] memory toReturn = new StructLibrary.BillStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = aud.bills(addr[i]).getBillStruct();
        }
        return toReturn;
    }
    function getSubDepartments(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.DepartmentStruct[] memory){
        DepartmentStorage dep = DepartmentStorage(depAddress);
        AuditStorage aud = AuditStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.SUBDEPARTMENTS, true);
        StructLibrary.DepartmentStruct[] memory toReturn = new StructLibrary.DepartmentStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = aud.departments(addr[i]).getDepartmentStruct();
        }
        return toReturn;
    }
    // function getEmployees(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.EmployeeStruct[] memory){
    //     // return StructLibrary.getEmployeesPaginate(pageSize, pageNumber, employeeList);
    // }
}