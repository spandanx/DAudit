import React, {useState, useEffect} from 'react';
import web3 from '../web3';
import { useLocation } from "react-router-dom";

import employeeABI from '../ABIs/EmployeeABI';
import BLTABI from '../ABIs/BLTABI';
import billABI from '../ABIs/BillABI';
import {pointerHover} from './styles/cursor.js';
// import AccountManagerAudit from '../AccountManagerAudit';
import DepartmentArrays from '../CreatedContracts/DepartmentArrays';
import { AiOutlineReload } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import Pagination from './Pagination';
import MergeBillsEmployee from './employee/MergeBillsEmployee';

import VoteManager from '../CreatedContracts/VoteManager';
import AccountManagerAudit from '../CreatedContracts/AccountManagerAudit';
import departmentManagerABI from '../ABIs/DepartmentManagerABI';
import {Action, VoteReverse, Vote, StatusReverse, DepartmentArrayType, tokenName, pageSize} from './Enums';

import {toast } from 'react-toastify';

const Employee = () => {

  // enum abc{ OPEN, ACCEPTED, REJECTED }

  const location = useLocation();
  console.log("location employee");
  console.log(location);
  const [bills, setBills] = useState([]);
  const [list, setList] = useState([]);
  const [depAddress, setDepAddress] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const [billCount, setBillCount] = useState('');
  const [employeeCount, setEmployeeCount] = useState(0);
  const [depContract, setDepContract] = useState('');

  
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenContract, setTokenContract] = useState('');
  // const [bill1, setBill1] = useState([]);
  const [fundBalanceMap, setFundBalanceMap] = useState(new Map());
  const [activeTab, setActiveTab] = useState('bills');
  const [voteMap, setVoteMap] = useState(new Map());

  // const pageSize = 1;

  // useEffect(()=>{
  //   console.log("DEPARTMENT RELOADED");
  //   fetchDepartmentAddress();
  // },[]);

  useEffect(()=>{
    console.log("ADDRESS CHANGED, GENERATING NEW CONTRACT");
    // console.log("given emp address");
    // console.log("given emp address");
    setVoteMap(new Map());
    getTokenContract();
    generateContract(location.state.empAddress);
  },[location.state.empAddress]);
  useEffect(()=>{
    console.log("FETCHING BILLS");
    setDepContract(new web3.eth.Contract(departmentManagerABI, depAddress));
  },[depAddress, location.state.empAddress]);
  useEffect(()=>{
    console.log("FETCHING BILLS");
    getBills(pageNumber);
  },[depContract, location.state.empAddress]);

  useEffect(()=>{
    checkIfVoted(list);
  },[list]);

  useEffect(()=>{
    getBills(pageNumber);
  },[pageNumber]);

  // const setBillArray = async()=>{

  // }
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
  const checkIfVoted = async(billArray) => {
    let billContract;
    let map = voteMap;
    for (let i = 0; i<billArray.length; i++){
      billContract = new web3.eth.Contract(billABI, billArray[i].billOwnAddress);
      await billContract.methods.voteMapping(location.state.empAddress).call().then((res)=>{
        map.set(billArray[i].billOwnAddress, res);
      }).catch((err)=>{});
    }
    // billArray.map(async(b)=>{
    //   billContract = new web3.eth.Contract(billABI, b.billOwnAddress);
    //   await billContract.methods.voteMapping(location.state.empAddress).call().then((res)=>{
    //     map.set(b.billOwnAddress, res);
    //   }).catch((err)=>{});
    // });
    setVoteMap(map);
    setBills(billArray);
  }
  const checkVoteType = (billOwnAddress)=>{
    if (voteMap.has(billOwnAddress)){
      return voteMap.get(billOwnAddress);
    }
    return -1;
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

    await depContract.methods.getLength(DepartmentArrayType.BILLS).call().then((res)=>{
      setBillCount(res);
      console.log("Bill count: "+res);
    }).catch((err)=>{});

    await DepartmentArrays.methods.getBills(pageSize, pageNumber, depAddress).call({
      from: accounts[0]
    }).then(async(response)=>{
      console.log("Fetched Bills");
      console.log(response);
      setList(response);
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
  const nestedFunc = async(page) => {
    // getBills(pageNumber);
    setPageNumber(page);
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
            <Pagination activePage={pageNumber} pageEnd={Math.ceil(billCount/pageSize)} pageTabs={3} function={(item)=>nestedFunc(item)}/>
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

  const BillList = () => {
    return(
      <div class="col-md-12">
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
                  {StatusReverse[bill.status]=="OPEN" && checkVoteType(bill.billOwnAddress)==Vote.DID_NOT_VOTE &&
                  <div class="col-md-2">
                    <button type="button" class="btn btn-success mx-1" onClick={()=>vote(bill.billOwnAddress, Action.APPROVE)}>Accept</button>
                    <button type="button" class="btn btn-danger mx-1" onClick={()=>vote(bill.billOwnAddress, Action.REJECT)}>Reject</button>
                  </div>
                  }
                  {StatusReverse[bill.status]=="OPEN" && checkVoteType(bill.billOwnAddress)==Vote.ACCEPTED &&
                  <div class="col-md-2">
                    <button type="button" class="btn btn-success mx-1" disabled>Voted: Accept</button>
                  </div>
                  }
                  {StatusReverse[bill.status]=="OPEN" && checkVoteType(bill.billOwnAddress)==Vote.REJECTED &&
                  <div class="col-md-2">
                    <button type="button" class="btn btn-danger mx-1" disabled>Voted: Reject</button>
                  </div>
                  }
                  {StatusReverse[bill.status]=="ACCEPTED" && 
                  <div class="col-md-2">
                    <button type="button" class="btn btn-success mx-1" disabled>Accepted</button>
                  </div>
                  }
                  {StatusReverse[bill.status]=="REJECTED" && 
                  <div class="col-md-2">
                    <button type="button" class="btn btn-danger mx-1" disabled>Rejected</button>
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
    );
  }

  return (
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-1">
          <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <button onClick={()=>setActiveTab('bills')} class={"nav-link"+(activeTab=='bills'? " active": "")} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Bills</button>
            <button onClick={()=>setActiveTab('mergeBills')} class={"nav-link"+(activeTab=='mergeBills'? " active": "")} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Encashments</button>
          </div>
        </div>
        <div class="col-md-11 px-4">
          {activeTab=='bills'? BillList(): activeTab=='mergeBills'? <MergeBillsEmployee depAddress={depAddress} empAddress={location.state.empAddress}/> : <></>}
        </div>
      </div>
  </div>
  )
}

export default Employee