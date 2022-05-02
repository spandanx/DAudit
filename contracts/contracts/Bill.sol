// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";

contract Bill {
    using StructLibrary for StructLibrary.BillStruct;
    
    StructLibrary.BillStruct billStruct;
    constructor(
        string memory _name,
        string memory _description,
        uint _threshold,
        string memory _imagePath,
        uint _deadline,
        uint _amount,
        address _fromBill,
        address _fromDepartment,
        address _toDepartment
    ) {
        billStruct = StructLibrary.BillStruct({
            name: _name,
            description:_description,
            threshold:_threshold,
            imagePath:_imagePath,
            partiesAccepted:0,
            partiesRejected:0,
            deadline:_deadline,
            status:StructLibrary.Status.OPEN,
            amount: _amount,
            fromBill: _fromBill,
            fromDepartment: _fromDepartment,
            toDepartment: _toDepartment,
            billOwnAddress: address(this)
        });
    }
    function getBillStruct() public view returns (StructLibrary.BillStruct memory){
        return billStruct;
    }
    function setStatus(StructLibrary.Status _status) public {
        billStruct.status = _status;
    }
    function incrementPartiesAccepted() public{
        billStruct.partiesAccepted++;
    }
    function incrementPartiesRejected() public {
        billStruct.partiesRejected++;
    }
}