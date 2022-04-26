// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";
import "./Department.sol";

contract Account {
    using StructLibrary for StructLibrary.Action;
    using StructLibrary for StructLibrary.AccountStruct;

    StructLibrary.AccountStruct accountStruct;
    // Department department;
    string name;
    constructor (address _parentDepartmentAddress, string memory _name) {
        // Department dep = Department(addr);
        // name = _name;
        accountStruct = StructLibrary.AccountStruct({
            name: _name,
            accountAddress: address(this),
            parentDepartmentAddress: _parentDepartmentAddress
        });
    }
    function getAccountStruct() public view returns(StructLibrary.AccountStruct memory){
        return accountStruct;
    }
    function getDepartment() public view returns(Department){
        return Department(accountStruct.parentDepartmentAddress);
    }
    function vote(uint index, StructLibrary.Action opinion) public {
        Department dep = Department(accountStruct.parentDepartmentAddress);
        dep.validateIndex(index);
        if (opinion==StructLibrary.Action.APPROVE){
            dep.getBillByIndex(index).incrementPartiesAccepted();
        }
        if (opinion==StructLibrary.Action.REJECT){
            dep.getBillByIndex(index).incrementPartiesRejected();
        }
        dep.handleApproval(index);
    }
}