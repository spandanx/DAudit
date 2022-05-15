// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./AuditStorage.sol";
import "./Bill.sol";
import "./Merge.sol";
// import "./Department.sol";
// import "hardhat/console.sol";

contract BillManager {

    AuditStorage auditStorage;

    constructor (address auditStorageAddress){
        auditStorage = AuditStorage(auditStorageAddress);
    }

    function createBill(
        string memory _name,
        string memory _description,
        uint _threshold,
        string memory _imagePath,
        uint _deadline,
        uint _acceptedOrRejectedOn,
        uint _amount,
        address _fromBill,
        address _fromDepartment,
        address _toDepartment,
        address tokenAddress
    ) 
    public 
    {
        // console.log("CreateBill() called");
        require(address(auditStorage.departments(msg.sender))!=address(0), "Departmemt does not exist");
        require(_threshold>=0 && _threshold<=100, "Threshold should be between 0 to 100");
        DepartmentManager parentDep = DepartmentManager(_fromDepartment);
        Bill parentBill = Bill(_fromBill);

        Bill bill = new Bill({
            _name: _name,
            _description: _description,
            _threshold: _threshold,
            _imagePath: _imagePath,
            _deadline: _deadline,
            _acceptedOrRejectedOn:_acceptedOrRejectedOn,
            _amount: _amount,
            _fromBill: _fromBill,
            _fromDepartment: _fromDepartment,
            _toDepartment: _toDepartment
        });
        parentBill.transferToken(address(bill), tokenAddress, _amount);
        parentDep.createBill(bill);
        auditStorage.pushBillMap(_fromBill, bill);
        auditStorage.addBill(bill);
    }
    function createMergeBill(
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
        address tokenAddress,
        address _toBill
    ) 
    public 
    {
        // console.log("CreateBill() called");
        // require(address(auditStorage.departments(msg.sender))!=address(0), "Departmemt does not exists");
        require(_threshold>=0 && _threshold<=100, "Threshold should be between 0 to 100");
        DepartmentManager senderDep = DepartmentManager(_fromDepartment);
        DepartmentManager recieverDep = DepartmentManager(_toDepartment);
        Bill parentBill = Bill(_fromBill);
        Merge merge = new Merge({
            _name: _name,
            _description: _description,
            _threshold: _threshold,
            // _imagePath: _imagePath,
            _deadline: _deadline,
            _acceptedOrRejectedOn:_acceptedOrRejectedOn,
            _amount: _amount,
            _fromBill: _fromBill,
            _fromDepartment: _fromDepartment,
            _toDepartment: _toDepartment,
            _toBill: _toBill
        });
        parentBill.transferToken(address(merge), tokenAddress, _amount);
        senderDep.pushMergeBill(address(merge));
        // auditStorage.pushBillMap(_fromBill, bill);
        // auditStorage.addMerge(merge);
    }
    // function _min(uint a, uint b) internal pure returns (uint){
    //     return a<b? a : b;
    // }
    function getBillsFromMap(uint pageSize, uint pageNumber, address billAddress) public view returns(StructLibrary.BillStruct[] memory){
        StructLibrary.BillStruct[] memory result;
        uint offset = pageSize * pageNumber;
        if (pageSize<=0 || pageNumber<0 || offset>=auditStorage.getBillLength(billAddress)){
            return result;
        }
        result = new StructLibrary.BillStruct[](pageSize<(auditStorage.getBillLength(billAddress)-offset)? pageSize : (auditStorage.getBillLength(billAddress)-offset));
        for (uint i = offset; i<offset+result.length; i++){
            result[i-offset] = auditStorage.getBillByIndex(billAddress, i).getBillStruct();
        }
        return result;
    }
}