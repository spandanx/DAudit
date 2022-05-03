// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./AuditStorage.sol";
import "./Bill.sol";
// import "./Department.sol";

contract BillManager {

    AuditStorage auditStorage;

    mapping (address => Bill[]) billMap;

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
        address _toDepartment
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
        pushBillMap(_fromBill, bill);
    }
    function pushBillMap(address parentBillAddress, Bill bill) public {
        if (billMap[parentBillAddress].length==0){
            billMap[parentBillAddress] = [bill];
        }
        else{
            billMap[parentBillAddress].push(bill);
        }
    }
    function _min(uint a, uint b) internal pure returns (uint){
        return a<b? a : b;
    }
    function getBillFromMap(uint pageSize, uint pageNumber, address billAddress) public view returns(StructLibrary.BillStruct[] memory){
        StructLibrary.BillStruct[] memory result;
        uint offset = pageSize * pageNumber;
        if (pageSize<=0 || pageNumber<0 || offset>=billMap[billAddress].length){
            return result;
        }
        result = new StructLibrary.BillStruct[](_min(pageSize, billMap[billAddress].length-offset));
        for (uint i = offset; i<offset+result.length; i++){
            result[i-offset] = billMap[billAddress][i].getBillStruct();
        }
        return result;
    }
}