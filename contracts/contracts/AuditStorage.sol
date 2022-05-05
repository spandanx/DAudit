// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./Employee.sol";
import "./DepartmentManager.sol";
import "./Auditor.sol";


contract AuditStorage {

    mapping (address => DepartmentManager) public departments;
    mapping (address => Employee) public employees;
    mapping (address => Auditor) public auditors;
    mapping (address => bool) public approvedStatus;
}