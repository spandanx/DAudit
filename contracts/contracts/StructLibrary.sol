// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
// import "./Department.sol";

library StructLibrary {

    event BillApproved(address indexed _fromDepartment, address indexed _toDepartment, address indexed _bill, uint _value);

    enum Status{ OPEN, ACCEPTED, REJECTED }
    
    enum Action{ REJECT, APPROVE }

    enum AccountType{ EMPLOYEE, DEPARTMENT, AUDITOR }

    struct BillStruct {
        string name;
        string description;
        uint threshold;
        string imagePath;
        uint partiesAccepted;
        uint partiesRejected;
        uint deadline;
        Status status;
        uint amount;
        address fromBill;
        address fromDepartment;
        address toDepartment;
        address billOwnAddress;
    }
    struct EmployeeStruct {
        string name;
        address employeeAddress;
        address parentDepartmentAddress;
    }
    struct ApprovalStruct {
        AccountType accountType;
        address accountAddress;
        address parentDepartmentAddress;
        Status status;
    }
    struct AuditorStruct {
        string name;
        address auditorAddress;
        address parentDepartmentAddress;
    }
    struct DepartmentStruct {
        string name;
        address departmentAddress;
        uint balance;
    }
    function getFunds(uint pageSize, uint pageNumber, StructLibrary.BillStruct[] storage funds) external view returns(StructLibrary.BillStruct[] memory) {
        uint offset = pageNumber * pageSize;
        uint length = funds.length;
        StructLibrary.BillStruct[] memory toReturn;
        if (pageSize<=0 || pageNumber<0 || offset>=length){
            return toReturn;
        }
        uint endIndex = length;
        if (length>=offset){
            endIndex = length - offset;
        }
        uint startIndex = 0;
        if (endIndex>=pageSize){
            startIndex = endIndex - pageSize;
        }
        toReturn = new StructLibrary.BillStruct[](endIndex - startIndex);
        for (uint i = 0; i<toReturn.length; i++){
            toReturn[i] = funds[endIndex-i-1];
        }
        return toReturn;
    }
    function getSubDepartmentsPaginate(uint pageSize, uint pageNumber, StructLibrary.DepartmentStruct[] storage subDepartmentsList) external view returns(StructLibrary.DepartmentStruct[] memory){
        StructLibrary.DepartmentStruct[] memory result;
        uint offset = pageSize * pageNumber;
        if (pageSize<=0 || pageNumber<0 || offset>=subDepartmentsList.length){
            return result;
        }
        result = new StructLibrary.DepartmentStruct[](pageSize<(subDepartmentsList.length-offset)? pageSize: (subDepartmentsList.length-offset));
        for (uint i = offset; i<offset+result.length; i++){
            result[i-offset] = subDepartmentsList[i];
        }
        return result;
    }
    function getEmployeesPaginate(uint pageSize, uint pageNumber, StructLibrary.EmployeeStruct[] storage employeeList) external view returns(StructLibrary.EmployeeStruct[] memory){
        StructLibrary.EmployeeStruct[] memory result;
        uint offset = pageSize * pageNumber;
        if (pageSize<=0 || pageNumber<0 || offset>=employeeList.length){
            return result;
        }
        result = new StructLibrary.EmployeeStruct[](pageSize<(employeeList.length-offset)? pageSize: (employeeList.length-offset));
        for (uint i = offset; i<offset+result.length; i++){
            result[i-offset] = employeeList[i];
        }
        return result;
    }
}