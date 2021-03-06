// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import {StructLibrary} from "./StructLibrary.sol";
import "./DepartmentManager.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bill {
    using StructLibrary for StructLibrary.BillStruct;
    
    StructLibrary.BillStruct billStruct;
    mapping(address=>StructLibrary.Vote) public voteMapping;

    constructor(
        string memory _name,
        string memory _description,
        uint _threshold,
        string memory _imagePath,
        uint _deadline,
        uint _acceptedOrRejectedOn,
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
            createdOn:block.timestamp,
            acceptedOrRejectedOn:_acceptedOrRejectedOn,
            status:StructLibrary.Status.OPEN,
            amount: _amount,
            fromBill: _fromBill,
            fromDepartment: _fromDepartment,
            toDepartment: _toDepartment,
            billOwnAddress: address(this)
        });
    }
    function setVoteMapping(address employeeAddress, StructLibrary.Vote action) public {
        voteMapping[employeeAddress] = action;
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
    function transferToken(address destination, address tokenAddress, uint amount) external{
        IERC20 token = IERC20(tokenAddress);
        token.transfer(destination, amount);
    }
    // function vote(StructLibrary.Action opinion) public {
    //     require(billStruct.status == StructLibrary.Status.OPEN, "Bill is closed");
    //     DepartmentManager parentDepartment = DepartmentManager(billStruct.fromDepartment);
    //     DepartmentManager childDepartment = DepartmentManager(billStruct.toDepartment);
    //     require(address(parentDepartment.employeeMap(msg.sender))!=address(0), "Employee is not eligible to vote");
    //     require(parentDepartment.getFundLength(2)!=0, "There should be at least one approver");
    //     //should be msg.sender
    //     // dep.validateIndex(index);
    //     if (opinion==StructLibrary.Action.APPROVE){
    //         // parentBill.billMap(address(this)).incrementPartiesAccepted();
    //         incrementPartiesAccepted();
    //         // if ((parentBill.billMap(address(this)).getBillStruct().partiesAccepted/parentBill.getFundLength(2))*100>parentBill.billMap(address(this)).getBillStruct().threshold){
    //             if ((billStruct.partiesAccepted/parentDepartment.getFundLength(2))*100>billStruct.threshold){
    //             // transferBill(billMap[billAddress]);
    //             // address toDepAddress = parentBill.billMap(address(this)).getBillStruct().toDepartment;
    //             // DepartmentManager dep = DepartmentManager(toDepAddress);
    //             childDepartment.pushFund(this);
    //             //
    //             parentDepartment.billMap(address(this)).setStatus(StructLibrary.Status.ACCEPTED);
    //         }
    //     }
    //     if (opinion==StructLibrary.Action.REJECT){
    //         // parentBill.billMap(address(this)).incrementPartiesRejected();
    //         incrementPartiesRejected();
    //         // if ((parentBill.billMap(address(this)).getBillStruct().partiesRejected/parentBill.getFundLength(2))*100>100-parentBill.billMap(address(this)).getBillStruct().threshold)
    //         //     parentBill.billMap(address(this)).setStatus(StructLibrary.Status.REJECTED);
    //         if ((billStruct.partiesRejected/parentDepartment.getFundLength(2))*100>100-billStruct.threshold)
    //             billStruct.status = StructLibrary.Status.REJECTED;
    //     }
    //     // handleApproval(billAddress);
    // }
}