import React, {useState, useEffect} from 'react';
import web3 from '../web3';
import { useLocation } from "react-router-dom";

import employeeABI from '../ABIs/EmployeeABI';
// import AccountManagerAudit from '../AccountManagerAudit';
import DepartmentArrays from '../CreatedContracts/DepartmentArrays';

const Employee = () => {

  // enum abc{ OPEN, ACCEPTED, REJECTED }

  const location = useLocation();
  console.log("location employee");
  console.log(location);
  const [bills, setBills] = useState([]);
  const [depAddress, setDepAddress] = useState('');
  // const [depContract, setDepContract] = useState('');
  // const [depContract, setDepContract] = useState('');
  // const [bill1, setBill1] = useState([]);

  const pageSize = 10;

  // useEffect(()=>{
  //   console.log("DEPARTMENT RELOADED");
  //   fetchDepartmentAddress();
  // },[]);

  useEffect(()=>{
    console.log("ADDRESS CHANGED, GENERATING NEW CONTRACT");
    // console.log("given emp address");
    // console.log("given emp address");
    generateContract(location.state.empAddress);
  },[location.state.empAddress]);
  useEffect(()=>{
    console.log("FETCHING BILLS");
    getBills(0);
  },[depAddress]);

  const generateContract = async (empAddress) => {
    // console.log("EMP ADDRESS");
    // console.log(empAddress);
    let empContract = new web3.eth.Contract(employeeABI, empAddress);
    let dAddress = '';
    await empContract.methods.getEmployeeStruct().call().then((item)=>{
      dAddress = item['parentDepartmentAddress'];
      console.log("EMPLOYEE STRUCT: ");
      console.log(item);
    });
    console.log("EXTRACTED EMP STRUCT:");
    console.log(dAddress);
    setDepAddress(dAddress);
    // setDepContract(new web3.eth.Contract(departmentABI, depAddress));
  }
  const getBills = async(pageNumber) => {
    let accounts = await web3.eth.getAccounts();
    console.log("Called getBills()");
    //DepartmentArrays
    if (!depAddress)
      return;
    // await depContract.methods.getBills(pageSize, pageNumber).call({
    await DepartmentArrays.methods.getBills(pageSize, pageNumber, depAddress).call({
      from: accounts[0]
    }).then((response)=>{
      console.log("Fetched Bills");
      console.log(response);
      setBills(response);
    }).catch(error=>{
      console.log("error: "+error);
    });
  }
  // const fetchDepartmentAddress = async() => {
  //   let accounts = await web3.eth.getAccounts();
  //   await AccountManagerAudit.methods.departments(accounts[0]).call().then(function(response) {
  //     // setAccountType(employeeString);
  //     console.log("Department address found");
  //     console.log(response);
  //     setDepAddress(response);
      
  //   }).catch((err) => {
  //     console.log("Error occured: "+err);
  //   });
  // }

  return (
    <div class="col-md-12">
      <div class="row">
        {/* <div class="col-md-1">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" href="#">Approvals</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Bills</a>
            </li>
          </ul>
        </div> */}
        <div class="col-md-11">
        {bills.map((bill)=> (
          <div>
            <h5 class="card-header">{bill.name}</h5>
            <div class="card-body">
              <h5 class="card-title">{bill.description}</h5>
              <p class="card-text">{bill.imagePath}</p>
              <a href="#" class="btn btn-primary">{bill.amount}</a>
            </div>
          </div>
        ))}
        </div>
      </div>
  </div>
  )
}

export default Employee