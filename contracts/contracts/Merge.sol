// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";
import "./DepartmentManager.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Merge {
    using StructLibrary for StructLibrary.MergeStruct;
    
    StructLibrary.MergeStruct mergeStruct;
    mapping(address=>StructLibrary.Vote) public voteMapping;

    constructor(
        string memory _name,
        string memory _description,
        uint _threshold,
        // string memory _imagePath,
        uint _deadline,
        uint _acceptedOrRejectedOn,
        uint _amount,
        address _fromBill,
        address _fromDepartment,
        address _toDepartment,
        address _toBill
    ) {
        mergeStruct = StructLibrary.MergeStruct({
            name: _name,
            description:_description,
            threshold:_threshold,
            // imagePath:_imagePath,
            partiesAccepted:0,
            partiesRejected:0,
            deadline:_deadline,
            createdOn:block.timestamp,
            acceptedOrRejectedOn:_acceptedOrRejectedOn,
            billStatus:StructLibrary.Status.OPEN,
            amount: _amount,
            fromBill: _fromBill,
            fromDepartment: _fromDepartment,
            toDepartment: _toDepartment,
            billOwnAddress: address(this),
            toBill: _toBill,
            // proofImagePath:"",
            comments:"",
            requestStatus: StructLibrary.Status.OPEN
        });
    }
    // function setProofImagePath(string memory path) public {
    //     mergeStruct.proofImagePath = path;
    // }
    function setComments(string memory comment) public {
        mergeStruct.comments = comment;
    }
    function setVoteMapping(address employeeAddress, StructLibrary.Vote action) public {
        voteMapping[employeeAddress] = action;
    }
    function getMergeStruct() public view returns (StructLibrary.MergeStruct memory){
        return mergeStruct;
    }
    function setStatus(StructLibrary.Status status, StructLibrary.MergeBillType mergeType) public {
        if (mergeType==StructLibrary.MergeBillType.BILL){
            mergeStruct.billStatus = status;
        }
        if (mergeType==StructLibrary.MergeBillType.REQUEST){
            mergeStruct.requestStatus = status;
        }
    }
    // function setRequestStatus(StuctLibrary.Status status) external {
    //     mergeStruct.requestStatus = status;
    // }
    function incrementPartiesAccepted() public{
        mergeStruct.partiesAccepted++;
    }
    function incrementPartiesRejected() public {
        mergeStruct.partiesRejected++;
    }
    function transferToken(address destination, address tokenAddress, uint amount) external{
        IERC20 token = IERC20(tokenAddress);
        token.transfer(destination, amount);
    }
}