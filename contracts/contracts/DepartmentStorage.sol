// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";
import "./Employee.sol";
import "./Bill.sol";
import "./Auditor.sol";

contract DepartmentStorage{

    using StructLibrary for StructLibrary.DepartmentStruct;
    // using StructLibrary for StructLibrary.EmployeeStruct;

    StructLibrary.DepartmentStruct departmentStruct;

    // mapping (address => DepartmentManager) subDepartmentsMap;
    // StructLibrary.DepartmentStruct[] subDepartmentsList;
    address[] public subDepartmentsList;

    // mapping (address => Employee) public employeeMap;
    // StructLibrary.EmployeeStruct[] employeeList;
    address[] public employeeList;

    // StructLibrary.AuditorStruct[] auditorList;
    // mapping (address => Auditor) auditorMap;
    address[] public auditorList;

    // address department_EmployeeManager;

    // StructLibrary.BillStruct[] bills;
    // mapping (address => Bill) public billMap;
    address[] public bills;

    // StructLibrary.BillStruct[] funds;
    // mapping (address => Bill) fundMap;
    address[] public funds;

    // mapping(address => StructLibrary.Action)

    StructLibrary.ApprovalStruct[] public approvalList;
    mapping (address => StructLibrary.ApprovalStruct) approvalMap;

    function getArray(uint pageSize, uint pageNumber, StructLibrary.DepartmentArrayType arrayType, bool reverse) external view returns(address[] memory){
        if (arrayType==StructLibrary.DepartmentArrayType.BILLS)
            return reverse? StructLibrary.getArrayFromEnd(pageSize, pageNumber, bills): StructLibrary.getArrayFromStart(pageSize, pageNumber, bills);
        else if (arrayType==StructLibrary.DepartmentArrayType.FUNDS)
            return reverse? StructLibrary.getArrayFromEnd(pageSize, pageNumber, funds): StructLibrary.getArrayFromStart(pageSize, pageNumber, funds);
        else if (arrayType==StructLibrary.DepartmentArrayType.SUBDEPARTMENTS)
            return reverse? StructLibrary.getArrayFromEnd(pageSize, pageNumber, subDepartmentsList): StructLibrary.getArrayFromStart(pageSize, pageNumber, subDepartmentsList);
        else if (arrayType==StructLibrary.DepartmentArrayType.EMPLOYEES)
            return reverse? StructLibrary.getArrayFromEnd(pageSize, pageNumber, employeeList): StructLibrary.getArrayFromStart(pageSize, pageNumber, employeeList);
        else if (arrayType==StructLibrary.DepartmentArrayType.AUDITORS)
            return reverse? StructLibrary.getArrayFromEnd(pageSize, pageNumber, auditorList): StructLibrary.getArrayFromStart(pageSize, pageNumber, auditorList);
        else
            return new address[](0);
    }
    function getApprovals(uint pageSize, uint pageNumber) external view returns(StructLibrary.ApprovalStruct[] memory){
        return StructLibrary.getApprovalsPaginate(pageSize, pageNumber, approvalList);
    }
}