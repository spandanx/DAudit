// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./Employee.sol";
import "./Bill.sol";


contract AuditStorage {

    mapping (address => Department) public departments;
    mapping (address => Employee) public employees;
}