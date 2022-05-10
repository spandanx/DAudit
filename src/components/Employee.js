import React, {useState, useEffect} from 'react';
import web3 from '../web3';
import { useLocation } from "react-router-dom";

import employeeABI from '../ABIs/EmployeeABI';
// import AccountManagerAudit from '../AccountManagerAudit';
import DepartmentArrays from '../CreatedContracts/DepartmentArrays';
import { AiOutlineReload } from "react-icons/ai";
import Pagination from './Pagination';

import VoteManager from '../CreatedContracts/VoteManager';
import AccountManagerAudit from '../CreatedContracts/AccountManagerAudit';
import {Action} from './Enums';
import {StatusReverse} from './Enums';
import {toast } from 'react-toastify';

const Employee = () => {

  // enum abc{ OPEN, ACCEPTED, REJECTED }

  const location = useLocation();
  console.log("location employee");
  console.log(location);
  const [bills, setBills] = useState([]);
  const [depAddress, setDepAddress] = useState('');

  const [pageNumber, setPageNUmber] = useState(0);
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
    getBills(pageNumber);
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
  const nestedFunc = async() => {

  }
  const getTopBarBills = () => {
    return (
      <ul class="nav justify-content-between border-top border-bottom p-2 my-2">
          <li class="nav-item justify-content-between">
            <button class="btn btn-none" onClick={()=>getBills(pageNumber)}>
              <AiOutlineReload/>
            </button>
          </li>
          <li class="nav-item mx-2">
            <Pagination pageEnd={8} pageTabs={3} function={(item)=>nestedFunc(item)}/>
          </li>
      </ul>
    );
  }

  const vote= async(billAddress, action) => {
    let accounts = await web3.eth.getAccounts();

    toast.info("Submitting vote", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
      });
    
      let tokenAddress;
      await AccountManagerAudit.methods.tokenAddress().call().then((res)=>{
        tokenAddress = res;
      }).catch((err)=>{
      });

    await VoteManager.methods.vote(billAddress, action, depAddress, tokenAddress, location.state.empAddress).send({
      from: accounts[0]
    }).then((res)=>{
      toast.success("Submitted vote", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        });
        getBills(pageNumber);
    }).catch((err)=>{
      toast.error("Error while submitting vote", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        });
    });
  }

  return (
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-1">
          <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <button class={"nav-link approval active"} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Bills</button>
          </div>
        </div>
        <div class="col-md-11">
        {getTopBarBills()}
        {bills.map((bill)=> (
          <div class="border-1">
            
            <div class="accordion px-2" id="accordionExample">
              <div class="card">
                <div class="card-header collapsed" id="headingOne" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <div class="row">
                    <h5 class="mb-0">
                      {bill.name}
                    </h5>
                  </div>
                  <div class="row">
                    <div class="col-md-3">
                      {/* <a class="btn btn-primary">{bill.amount}</a> */}
                    </div>
                    <div class="col-md-3 px-5">
                      <p class="card-text text-center py-1 border border-light rounded-2 bg-secondary text-white">Acceptance threshold: {bill.threshold} %</p>
                    </div>
                    <div class="col-md-2 px-2">
                      <p class="card-text text-center py-1 border border-light rounded-2 bg-secondary text-white">Votes in favor: {bill.partiesAccepted}</p>
                    </div>
                    <div class="col-md-2 px-2">
                      <p class="card-text text-center py-1 border border-light rounded-2 bg-secondary text-white">Votes against: {bill.partiesRejected}</p>
                    </div>
                    {StatusReverse[bill.status]=="OPEN" && 
                    <div class="col-md-2">
                      <button type="button" class="btn btn-success mx-1" onClick={()=>vote(bill.billOwnAddress, Action.APPROVE)}>Accept</button>
                      <button type="button" class="btn btn-danger mx-1" onClick={()=>vote(bill.billOwnAddress, Action.REJECT)}>Reject</button>
                    </div>
                    }
                    {StatusReverse[bill.status]=="ACCEPTED" && 
                    <div class="col-md-2">
                      <button type="button" class="btn btn-success mx-1" disabled>Accepted</button>
                    </div>
                    }
                    {StatusReverse[bill.status]=="REJECTED" && 
                    <div class="col-md-2">
                      <button type="button" class="btn btn-danger mx-1">Rejected</button>
                    </div>
                    }
                  </div>
                </div>

                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                  <div class="card-body">
                  {bill.description}
                  </div>
                </div>
              </div>
            </div>

            <div class="card-body">
              
            </div>
          </div>
        ))}
        </div>
      </div>
  </div>
  )
}

export default Employee