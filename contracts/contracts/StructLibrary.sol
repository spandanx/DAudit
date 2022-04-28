// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./Department.sol";

library StructLibrary {
    enum Status{ OPEN, ACCEPTED, REJECTED }
    
    enum Action{ REJECT, APPROVE }

    struct BillStruct {
        string name;
        string description;
        uint threshold;
        string imagePath;
        uint partiesAccepted;
        uint partiesRejected;
        uint deadline;
        Status status;
    }
    struct EmployeeStruct {
        string name;
        address employeeAddress;
        address parentDepartmentAddress;
    }
    struct DepartmentStruct {
        string name;
        address departmentAddress;
        uint balance;
    }
}