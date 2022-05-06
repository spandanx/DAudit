// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./AuditStorage.sol";
import "./Bill.sol";
// import "./Department.sol";

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
        uint _amount,
        address _fromBill,
        address _fromDepartment,
        address _toDepartment,
        address tokenAddress
    ) 
    public 
    {
        require(address(auditStorage.departments(msg.sender))!=address(0), "Departmemt does not exists");
        // Department dep = auditStorage.departments(msg.sender);
        // Bill bill = Bill(auditStorage.departments(msg.sender).createBill({
        //     _name: _name,
        //     _description: _description,
        //     _threshold: _threshold,
        //     _imagePath: _imagePath,
        //     _deadline: _deadline,
        //     _amount: _amount,
        //     _fromBill: _fromBill,
        //     _fromDepartment: _fromDepartment,
        //     _toDepartment: _toDepartment
        // }));
        DepartmentManager parentDep = DepartmentManager(_fromDepartment);
        Bill bill = new Bill({
            _name: _name,
            _description: _description,
            _threshold: _threshold,
            _imagePath: _imagePath,
            _deadline: _deadline,
            _amount: _amount,
            _fromBill: _fromBill,
            _fromDepartment: _fromDepartment,
            _toDepartment: _toDepartment
        });
        parentDep.createBill(bill, tokenAddress, _amount);
        auditStorage.pushBillMap(_fromBill, bill);
        auditStorage.addBill(bill);
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