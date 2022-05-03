// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";

contract Auditor {
    using StructLibrary for StructLibrary.AuditorStruct;

    StructLibrary.AuditorStruct auditorStruct;

    constructor (address _parentDepartmentAddress, string memory _name) {
        auditorStruct = StructLibrary.AuditorStruct({
            name: _name,
            auditorAddress: address(this),
            parentDepartmentAddress: _parentDepartmentAddress
        });
    }
    function getAuditorStruct() public view returns(StructLibrary.AuditorStruct memory){
        return auditorStruct;
    }
}