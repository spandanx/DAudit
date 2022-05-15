// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";
import "./DepartmentStorage.sol";
import "./AuditStorage.sol";
import "./Merge.sol";

import "hardhat/console.sol";


contract DepartmentArrays {
    function getFunds(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.BillStruct[] memory) {
        DepartmentStorage dep = DepartmentStorage(depAddress);
        // AuditStorage aud = AuditStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.FUNDS, true);
        StructLibrary.BillStruct[] memory toReturn = new StructLibrary.BillStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = Bill(addr[i]).getBillStruct();
        }
        return toReturn;
    }
    function getApprovals(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.ApprovalStruct[] memory) {
        DepartmentStorage dep = DepartmentStorage(depAddress);
        return dep.getApprovals(pageSize, pageNumber);
    }
    function getAuditors(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.AuditorStruct[] memory) {
        DepartmentStorage dep = DepartmentStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.AUDITORS, true);
        StructLibrary.AuditorStruct[] memory toReturn = new StructLibrary.AuditorStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = Auditor(addr[i]).getAuditorStruct();
        }
        return toReturn;
    }
    function getBills(uint pageSize, uint pageNumber, address depAddress) public view returns(StructLibrary.BillStruct[] memory) {
        DepartmentStorage dep = DepartmentStorage(depAddress);
        // AuditStorage aud = AuditStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.BILLS, true);
        StructLibrary.BillStruct[] memory toReturn = new StructLibrary.BillStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = Bill(addr[i]).getBillStruct();
        }
        return toReturn;
    }
    function getSubDepartments(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.DepartmentStruct[] memory){
        DepartmentStorage dep = DepartmentStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.SUBDEPARTMENTS, true);
        StructLibrary.DepartmentStruct[] memory toReturn = new StructLibrary.DepartmentStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = DepartmentManager(addr[i]).getDepartmentStruct();
        }
        return toReturn;
    }
    function getEmployees(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.EmployeeStruct[] memory){
        DepartmentStorage dep = DepartmentStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.EMPLOYEES, true);
        StructLibrary.EmployeeStruct[] memory toReturn = new StructLibrary.EmployeeStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = Employee(addr[i]).getEmployeeStruct();
        }
        return toReturn;
    }
    function getMergeRequests(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.MergeStruct[] memory){
        DepartmentStorage dep = DepartmentStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.MERGE_REQUESTS, true);
        StructLibrary.MergeStruct[] memory toReturn = new StructLibrary.MergeStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = Merge(addr[i]).getMergeStruct();
        }
        return toReturn;
    }
    function getMergeBills(uint pageSize, uint pageNumber, address depAddress) external view returns(StructLibrary.MergeStruct[] memory){
        DepartmentStorage dep = DepartmentStorage(depAddress);
        address[] memory addr = dep.getArray(pageSize, pageNumber, StructLibrary.DepartmentArrayType.MERGE_BILLS, true);
        StructLibrary.MergeStruct[] memory toReturn = new StructLibrary.MergeStruct[](addr.length);
        for (uint i = 0; i<addr.length; i++){
            toReturn[i] = Merge(addr[i]).getMergeStruct();
        }
        return toReturn;
    }
}