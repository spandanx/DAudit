import React, {useState, useEffect} from 'react';
import web3 from '../web3';
import { useLocation } from "react-router-dom";

import employeeABI from '../ABIs/EmployeeABI';
import BLTABI from '../ABIs/BLTABI';
import {pointerHover} from './styles/cursor.js';
// import AccountManagerAudit from '../AccountManagerAudit';
import DepartmentArrays from '../CreatedContracts/DepartmentArrays';
import { AiOutlineReload } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import Pagination from './Pagination';

import VoteManager from '../CreatedContracts/VoteManager';
import AccountManagerAudit from '../CreatedContracts/AccountManagerAudit';
import departmentManagerABI from '../ABIs/DepartmentManagerABI';
import {Action} from './Enums';
import {StatusReverse} from './Enums';
import {DepartmentArrayType} from './Enums';
import {tokenName} from './Enums';

import {toast } from 'react-toastify';

const Employee = () => {

  // enum abc{ OPEN, ACCEPTED, REJECTED }

  const location = useLocation();
  console.log("location employee");
  console.log(location);
  const [bills, setBills] = useState([]);
  const [depAddress, setDepAddress] = useState('');

  const [pageNumber, setPageNUmber] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [depContract, setDepContract] = useState('');
  
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenContract, setTokenContract] = useState('');
  // const [bill1, setBill1] = useState([]);
  const [fundBalanceMap, setFundBalanceMap] = useState(new Map());

  const pageSize = 10;

  // useEffect(()=>{
  //   console.log("DEPARTMENT RELOADED");
  //   fetchDepartmentAddress();
  // },[]);

  useEffect(()=>{
    console.log("ADDRESS CHANGED, GENERATING NEW CONTRACT");
    // console.log("given emp address");
    // console.log("given emp address");
    getTokenContract();
    generateContract(location.state.empAddress);
  },[location.state.empAddress]);
  useEffect(()=>{
    console.log("FETCHING BILLS");
    setDepContract(new web3.eth.Contract(departmentManagerABI, depAddress));
  },[depAddress]);
  useEffect(()=>{
    console.log("FETCHING BILLS");
    getBills(pageNumber);
  },[depContract]);

  const getTokenContract = async() => {
      await AccountManagerAudit.methods.tokenAddress().call().then((res)=>{
        setTokenAddress(res);
        setTokenContract(new web3.eth.Contract(BLTABI, res));
      }).catch((err)=>{
      });
  }
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
    await depContract.methods.getLength(DepartmentArrayType.EMPLOYEES).call().then((res)=>{
      setEmployeeCount(res);
      console.log("EMPLOYEE COUNT: "+res);
    }).catch((err)=>{});

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
  const getParcentage = (num) => {
    if (employeeCount==0)
      return "N/A";
    return (num*100/employeeCount).toFixed(2);
  }
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
  const getTime = (timestamp) => {

    if (timestamp.length==10){
      timestamp += "000";
    }
    let d = new Date(parseInt(timestamp));
    console.log("Date: "+timestamp);
    let datestring = "";
    let hour = ""+d.getHours();
    let minute = ""+d.getMinutes();
    if (hour.length==1){
        hour = "0"+hour;
    }
    if (minute.length==1){
        minute = "0"+minute;
    }
    datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
        hour + ":" + minute;
    //.toString().substring(2)
    // 16-5-2015 9:50
    return datestring;
  }

  // const fetchBalance = async(address) => {
  //   console.log("Balance fetching");
  //   if (!tokenContract)
  //     return;
  //   await tokenContract.methods.balanceOf(address).call().then((res)=>{
  //     fundBalanceMap.set(address, res);
  //     getBills(pageNumber);
  //   }).catch((err)=>{

  //   });
  // }
  // const showBalance = (address) => {
  //   if (fundBalanceMap.has(address))
  //     return fundBalanceMap.get(address);
  //   return 0;
  // }

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
            
            <div class="accordion px-2" id={"example"+bill.billOwnAddress}>
              <div class="card">
                <div class="card-header collapsed">
                  <div class="row" id={"heading"+bill.billOwnAddress} type="button" data-toggle="collapse" data-target={"#collapse"+bill.billOwnAddress} aria-expanded="true" aria-controls={"collapse"+bill.billOwnAddress}>
                  <h5 class="col-md-9">
                      {bill.name}
                    </h5>
                    <div class="col-md-3">
                      <p class="card-text text-center">Created on: {getTime(bill.createdOn)}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-3">
                      <p class="card-text py-1 border border-light rounded-2">Amount: {bill.amount + " "+tokenName}</p>
                    </div>
                    {StatusReverse[bill.status]=="OPEN" && 
                      <>
                        <div class="col-md-3 px-5">
                          <p class="card-text text-center py-1 border border-light rounded-2 bg-white">Acceptance threshold: <span class="text-primary">{bill.threshold} %</span></p>
                        </div>
                        <br/>
                        <div class="col-md-2 px-2">
                          <p class="card-text text-center py-1 border border-light rounded-2 bg-white">Votes in favor: <span class="text-success">{getParcentage(bill.partiesAccepted)} %</span></p>
                        </div>
                        <div class="col-md-2 px-2">
                          <p class="card-text text-center py-1 border border-light rounded-2 bg-white">Votes against: <span class="text-danger">{getParcentage(bill.partiesRejected)} %</span></p>
                        </div>
                      </>
                    }
                    {StatusReverse[bill.status]!="OPEN" && 
                    <div class="col-md-7"></div>
                    }
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

                <div id={"collapse"+bill.billOwnAddress} class="collapse" aria-labelledby={"heading"+bill.billOwnAddress} data-parent={"#example"+bill.billOwnAddress}>
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