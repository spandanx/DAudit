import React, {useState, useEffect} from 'react';
import web3 from '../web3';
import { useLocation } from "react-router-dom";

// import departmentABI from '../ABIs/DepartmentABI';
import departmentManagerABI from '../ABIs/DepartmentManagerABI';
import BLTABI from '../ABIs/BLTABI';
import DepartmentHierarchy from './Charts/DepartmentHierarchy';
// import AccountManagerAudit from '../AccountManagerAudit';
import { AiOutlineReload } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
import { MdRefresh } from "react-icons/md";
import {pointerHover} from './styles/cursor.js';
import { Modal, Button } from "react-bootstrap";
import Pagination from './Pagination';
import DepartmentArrays from '../CreatedContracts/DepartmentArrays';
import MergeBill from './department/MergeBill';
import MergeRequest from './department/MergeRequest';

import Status from './Enums';
import accountType from './Enums';
import {Action} from './Enums';
import {AccountTypeReverse} from './Enums';
import {StatusReverse} from './Enums';
import {DepartmentArrayType} from './Enums';
import {tokenName} from './Enums';
// import {ActionReverse} from './Enums';
import AccountManagerAudit from '../CreatedContracts/AccountManagerAudit';
import BillManager from '../CreatedContracts/BillManager';

import {toast } from 'react-toastify';


const Department = () => {

  const location = useLocation();
  console.log("location department");
  console.log(location);
  const [bills, setBills] = useState([]);
  const [funds, setFunds] = useState([]);
  const [approvals, setApprovals] = useState([]);
  //BALANCE MAPS
  const [fundBalanceMap, setFundBalanceMap] = useState(new Map());

  // const [depAddress, setDepAddress] = useState('');
  const [depContract, setDepContract] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenContract, setTokenContract] = useState('');
  const [employeeCount, setEmployeeCount] = useState(0);

  const [selectedTab, setSelectedTab] = useState('bills');
  // const [bill1, setBill1] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const pageSize = 1;

  const [currentPageBill, setCurrentPageBill] = useState(0);
  const [currentPageFund, setCurrentPageFund] = useState(0);
  const [currentPageApproval, setCurrentPageApproval] = useState(0);

  const [billLength, setBillLength] = useState(0);
  const [fundLength, setFundLength] = useState(0);
  const [approvalLength, setApprovalLength] = useState(0);

  //create new bill form
  const [fundAddress, setFundAddress] = useState('');
  const [subDepAddress, setSubDepAddress] = useState('');
  const [createFundLength, setCreateFundLength] = useState(0);
  const [createDepLength, setCreateDepLength] = useState(0);
  const [createFundPageNumber, setCreateFundPageNumber] = useState(0);
  const [createDepPageNumber, setCreateDepPageNumber] = useState(0);

  const [billName, setBillName] = useState('');
  const [description, setDescription] = useState('');
  const [threshold, setThreshold] = useState('');
  const [amount, setAmount] = useState('');

  const [fundsCreateBill, setFundsCreateBill] = useState([]);
  const [currentPageFundCreateBill, setCurrentPageFundCreateBill] = useState(0);

  const [departmentsCreateBill, setDepartmentsCreateBill] = useState([]);
  const [currentPageDepCreateBill, setCurrentPageDepCreateBill] = useState(0);

  // billName, description, amount, threshold
  const [validAmount, setValidAmount] = useState(false);
  const [validThreshold, setValidThreshold] = useState(false);
  const [validForm, setValidForm] = useState(false);
  // const [toAddress, setToAddress] = useState('');

  // let gdata = {
  //   name: 'Parent',
  //   children: [{
  //     name: 'Child One'
  //   }, {
  //     name: 'Child Two'
  //   }]
  // };

  // useEffect(()=>{
  //   console.log("DEPARTMENT RELOADED");
  //   fetchDepartmentAddress();
  // },[]);

  useEffect(()=>{
    console.log("ADDRESS CHANGED, GENERATING NEW CONTRACT");
    generateContract(location.state.depAddress);
  },[location.state.depAddress]);
  useEffect(()=>{
    console.log("FETCHING BILLS");
    getBills(currentPageBill);
    getFunds(currentPageFund);
    getApprovals(currentPageApproval);
    getFundsOfCreateBill(currentPageFundCreateBill);
    getSubDeptsOfCreateBill(currentPageDepCreateBill);
  },[depContract]);

  useEffect(()=>{
    setTokenContract(new web3.eth.Contract(BLTABI, tokenAddress));
    console.log("Token CONTRACT created");
  },[tokenAddress]);

  useEffect(()=>{
    refreshBills();
  },[currentPageBill]);

  useEffect(()=>{
    refreshFunds();
  },[currentPageFund]);

  useEffect(()=>{
    refreshApprovals();
  },[currentPageApproval]);

  useEffect(()=>{
    getFundsOfCreateBill(createFundPageNumber);
  },[createFundPageNumber]);

  useEffect(()=>{
    getSubDeptsOfCreateBill(createDepPageNumber);
  },[createDepPageNumber]);
  
  useEffect(()=>{
    if (!fundAddress || !subDepAddress || !billName){
      setValidForm(false);
      return;
    }
    checkAmountValidity();
    checkThresholdValidity();
    if (!validAmount || !validThreshold){
      setValidForm(false);
      return;
    }
    setValidForm(true);
  },[fundAddress, subDepAddress, billName, description, amount, threshold, validAmount, validThreshold]);

  const checkAmountValidity = () => {
    if (isNumeric(amount)){
      setValidAmount(true);
    }
    else{
      setValidAmount(false);
    }
  }
  const checkThresholdValidity = () =>{
    if (isValidThreshold(threshold)){
      setValidThreshold(true);
      console.log("setValidThreshold(true)");
    }
    else{
      setValidThreshold(false);
      console.log("setValidThreshold(false)");
    }
  }
  const isNumeric = (num) => {
    let value1 = num.toString();
    let value2 = parseInt(num).toString();
    return (value1 === value2);
  }
  const isValidThreshold = (num) => {
    if (!isNumeric(num))
      return false;
    let val = parseInt(num);
    console.log("Val: "+val);
    console.log("val<0: "+(val<0));
    console.log("val>100: "+(val>100));
    if (val<0 || val>100)
      return false;
    return true;
  }
  const fetchEmployeeCount = async() => {
    await depContract.methods.getLength(DepartmentArrayType.EMPLOYEES).call().then((res)=>{
      setEmployeeCount(res);
      console.log("EMPLOYEE COUNT: "+res);
    }).catch((err)=>{});
  }
  const fetchBillCount = async() => {
    await depContract.methods.getLength(DepartmentArrayType.BILLS).call().then((res)=>{
      setBillLength(res);
      console.log("Bill COUNT: "+res);
    }).catch((err)=>{});
  }
  const fetchFundCount = async() => {
    await depContract.methods.getLength(DepartmentArrayType.FUNDS).call().then((res)=>{
      setFundLength(res);
      console.log("Fund COUNT: "+res);
    }).catch((err)=>{});
  }
  const fetchApprovalCount = async() => {
    await depContract.methods.getLength(DepartmentArrayType.APPROVALS).call().then((res)=>{
      setApprovalLength(res);
      console.log("Approvals COUNT: "+res);
    }).catch((err)=>{});
  }

  const generateContract = async (depAddress) => {
    setDepContract(new web3.eth.Contract(departmentManagerABI, depAddress));

      await AccountManagerAudit.methods.tokenAddress().call().then((res)=>{
        setTokenAddress(res);
      }).catch((err)=>{});
      console.log("Token address fetched: "+tokenAddress);
  }
  const getBills = async(pageNumber) => {
    let accounts = await web3.eth.getAccounts();
    if (!depContract){
      return;
    }
    fetchEmployeeCount();
    fetchBillCount();
    // await depContract.methods.getBills(pageSize, pageNumber).call({
      await DepartmentArrays.methods.getBills(pageSize, pageNumber, location.state.depAddress).call({
      from: accounts[0]
    }).then((response)=>{
      console.log("Fetched Bills");
      console.log(response);
      setBills(response);
    }).catch(error=>{
      console.log("error: "+error);
    });
  }
  const getFunds = async(pageNumber) => {
    let accounts = await web3.eth.getAccounts();
    if (!depContract){
      return;
    }
    fetchFundCount();
    // await depContract.methods.getBills(pageSize, pageNumber).call({
      await DepartmentArrays.methods.getFunds(pageSize, pageNumber, location.state.depAddress).call({
      from: accounts[0]
    }).then((response)=>{
      console.log("Fetched Funds");
      console.log(response);
      setFunds(response);
    }).catch(error=>{
      console.log("error: "+error);
    });
  }
  const getApprovals = async(pageNumber) => {
    let accounts = await web3.eth.getAccounts();
    if (!depContract){
      return;
    }
    fetchApprovalCount();
    // await depContract.methods.getBills(pageSize, pageNumber).call({
      await DepartmentArrays.methods.getApprovals(pageSize, pageNumber, location.state.depAddress).call({
      from: accounts[0]
    }).then((response)=>{
      console.log("Fetched Approvals");
      console.log(response);
      setApprovals(response);
    }).catch(error=>{
      console.log("error: "+error);
    });
  }


  const getFundsOfCreateBill = async(pageNumber) => {
    console.log("Called getFundsOfCreateBill()");
    let accounts = await web3.eth.getAccounts();
    if (!depContract){
      return;
    }
    await depContract.methods.getLength(DepartmentArrayType.FUNDS).call().then((res)=>{
      setCreateFundLength(res);
      console.log("Fund COUNT: "+res);
    }).catch((err)=>{});
    //createFundLength
    // await depContract.methods.getBills(pageSize, pageNumber).call({
      await DepartmentArrays.methods.getFunds(pageSize, pageNumber, location.state.depAddress).call({
      from: accounts[0]
    }).then((response)=>{
      console.log("Fetched Funds");
      console.log(response);
      setFundsCreateBill(response);
    }).catch(error=>{
      console.log("error: "+error);
    });
  }

  const getSubDeptsOfCreateBill = async(pageNumber) => {
    console.log("Called getFundsOfCreateBill()");
    let accounts = await web3.eth.getAccounts();
    if (!depContract){
      return;
    }
    await depContract.methods.getLength(DepartmentArrayType.SUBDEPARTMENTS).call().then((res)=>{
      setCreateDepLength(res);
      console.log("departments COUNT: "+res);
    }).catch((err)=>{});
    //createDepLength
    // await depContract.methods.getBills(pageSize, pageNumber).call({
      await DepartmentArrays.methods.getSubDepartments(pageSize, pageNumber, location.state.depAddress).call({
      from: accounts[0]
    }).then((response)=>{
      console.log("Fetched subDepartments");
      console.log(response);
      setDepartmentsCreateBill(response);
    }).catch(error=>{
      console.log("error: "+error);
    });
  }

  const refreshBills = async() => {
    console.log("refreshing bills");
    getBills(currentPageBill);
  }

  const refreshFunds = async() => {
    console.log("refreshing funds");
    getFunds(currentPageFund);
  }
  const refreshApprovals = async() => {
    console.log("refreshing approvals");
    getApprovals(currentPageApproval);
  }

  const getTopBarBill = () => {
    return (
      <ul class="nav justify-content-between border-top border-bottom p-2 my-2">
          <li class="nav-item justify-content-between">
            <Button variant="none" onClick={handleShow}>
              <BsPlusCircle/>
              {/* style={pointerHover} */}
            </Button>
            <button class="btn btn-none" onClick={()=>refreshBills()}>
              <AiOutlineReload/>
            </button>
          </li>
          <li class="nav-item mx-2">
            <Pagination activePage={currentPageBill} pageEnd={Math.ceil(billLength/pageSize)} pageTabs={3} function={(item)=>nestedFuncBill(item)}/>
          </li>
      </ul>
    );
  }
  const getTopBarFund = () => {
    return (
      <ul class="nav justify-content-between border-top border-bottom p-2 my-2">
          <li class="nav-item justify-content-between">
            <button class="btn btn-none" onClick={()=>refreshFunds()}>
              <AiOutlineReload/>
            </button>
          </li>
          <li class="nav-item mx-2">
            <Pagination activePage={currentPageFund} pageEnd={Math.ceil(fundLength/pageSize)} pageTabs={3} function={(item)=>nestedFuncFund(item)}/>
          </li>
      </ul>
    );
  }
  const getTopBarApprovals = () => {
    return (
      <ul class="nav justify-content-between border-top border-bottom p-2 my-2">
          <li class="nav-item justify-content-between">
            <button class="btn btn-none" onClick={()=>refreshApprovals()}>
              <AiOutlineReload/>
            </button>
          </li>
          <li class="nav-item mx-2">
            <Pagination activePage={currentPageApproval} pageEnd={Math.ceil(approvalLength/pageSize)} pageTabs={3} function={(item)=>nestedFuncApproval(item)}/>
          </li>
      </ul>
    );
  }

  // const nestedFunc = (num) => {
  //   console.log("Calling nestedFunc()");
  //   console.log(num);
  // }
  const nestedFuncCreateFund = (pageNumber) => {
    setCreateFundPageNumber(pageNumber);
    // console.log("Calling nestedFunc()");
    // console.log(num);
  }
  const nestedFuncCreateDep = (pageNumber) => {
    setCreateDepLength(pageNumber);
    // console.log("Calling nestedFunc()");
    // console.log(num);
  }
  const nestedFuncBill = (pageNumber) => {
    setCurrentPageBill(pageNumber);
    // refreshBills();
  }
  const nestedFuncFund = (pageNumber) => {
    setCurrentPageFund(pageNumber);
    // refreshFunds();
  }
  const nestedFuncApproval = (pageNumber) => {
    setCurrentPageApproval(pageNumber);
    // refreshApprovals();
  }

  const createBill = async() => {
    handleClose();

    let accounts = await web3.eth.getAccounts();
    toast.info("Creating bill", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
      });
      // const [fundAddress, setFundAddress] = useState('');
      // const [subDepAddress, setSubDepAddress] = useState('');
      // const [billName, setBillName] = useState('');
      // const [description, setDescription] = useState('');
      // const [amount, setAmount] = useState('');
      // const [toAddress, setToAddress] = useState('');
      let date = (new Date()).getTime();
      let currentTimestamp = date;

      // let tokenAddress;
      // await AccountManagerAudit.methods.tokenAddress().call().then((res)=>{
      //   tokenAddress = res;
      // }).catch((err)=>{

      // });
      console.log("_name: "+billName);
      console.log("_description: "+description);
      console.log("_threshold: "+threshold);
      console.log("_imagePath: ");
      console.log("_deadline: "+currentTimestamp);
      console.log("_acceptedOrRejectedOn: "+currentTimestamp);
      console.log("_amount: "+amount);
      console.log("_fromBill: "+fundAddress);
      console.log("_fromDepartment: "+location.state.depAddress);
      console.log("_toDepartment: "+subDepAddress);
      console.log("tokenAddress: "+tokenAddress);
      await BillManager.methods.createBill(
        billName,
        description,
        threshold,
        "Dummy",
        currentTimestamp,
        currentTimestamp,
        amount,
        fundAddress,
        location.state.depAddress,
        subDepAddress,
        tokenAddress
    ).send({
      from: accounts[0]
    }).then((res)=>{
      toast.success("bill created", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        });
        refreshBills();
    }).catch((err)=>{
      toast.error("could not create bill!", {
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
  
  const getModal = () => {
    // getFundsOfCreateBill(currentPageFundCreateBill);
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create new bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="row">
            <div class="col-md-7">
              <select class="form-select form-select-sm my-2" aria-label=".form-select-sm example" onChange={(event)=>setFundAddress(event.target.value)}>
                <option defaultValue>Select fund</option>
                {fundsCreateBill.map((fund)=>(
                  <option value={fund.billOwnAddress}>{fund.name}</option>
                ))}
              </select>
            </div>
            <div class="col-md-3 py-1">
              <Pagination activePage={createFundPageNumber} pageEnd={Math.ceil(createFundLength/pageSize)} pageTabs={3} function={(item)=>nestedFuncCreateFund(item)}/>
            </div>
          </div>
          <div class="row">
            <div class="col-md-7">
              <select class="form-select form-select-sm my-2" aria-label=".form-select-sm example" onChange={(event)=>setSubDepAddress(event.target.value)}>
                <option defaultValue>Select Department</option>
                {departmentsCreateBill.map((dept)=>(
                  <option value={dept.departmentAddress}>{dept.name}</option>
                ))}
              </select>
              </div>
              <div class="col-md-3 py-1">
                <Pagination activePage={createDepPageNumber}  pageEnd={Math.ceil(createDepLength/pageSize)} pageTabs={3} function={(item)=>nestedFuncCreateDep(item)}/>
              </div>
            </div>
            <div class="row my-3">
                <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Bill name" tabIndex="-1"
                      value={billName} 
                      onChange={(event) => setBillName(event.target.value)}
                />
            </div>
            <div class="row my-3">
                <textarea class="form-control" id="message" name="body" rows="3" placeholder="Description"
                    value={description} 
                    onChange={(event) => setDescription(event.target.value)}
                ></textarea>
            </div>
            <div class="row my-3">
                <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Amount" tabIndex="-1"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                />
            </div>
            <div class="row my-3">
                <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Threshold" tabIndex="-1"
                          value={threshold}
                          onChange={(event) => setThreshold(event.target.value)}
                    />
                {/* <textarea class="form-control" id="message" name="body" rows="3" placeholder="Threshold"
                    value={threshold} 
                    onChange={(event) => setThreshold(event.target.value)}
                ></textarea> */}
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>createBill()} disabled={!validForm}>
            Create Bill
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const getParcentage = (num) => {
    if (employeeCount==0)
      return "N/A";
    return (num*100/employeeCount).toFixed(2);
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
  
  const billList = () => {
    return (
      <div class="col-md-12">
        {getTopBarBill()}
        {getModal()}
        {bills.map((bill)=> (
          <div class="border-1">
            
            <div class="accordion px-2" id="accordionExample">
              <div class="card">
              <div class="card-header collapsed" id={"heading"+bill.billOwnAddress} type="button" data-toggle="collapse" data-target={"#collapse"+bill.billOwnAddress} aria-expanded="true" aria-controls={"collapse"+bill.billOwnAddress}>
                  <div class="row">
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
                      <button type="button" class="btn btn-primary mx-1" disabled>Active</button>
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
    );
  }
  const showBalance = (address) => {
    if (fundBalanceMap.has(address))
      return fundBalanceMap.get(address);
    return 0;
  }
  const fetchBalance = async(address) => {
    console.log("Balance fetched");
    if (!tokenContract)
      return;
    await tokenContract.methods.balanceOf(address).call().then((res)=>{
      fundBalanceMap.set(address, res);
      refreshFunds();
    }).catch((err)=>{

    });
  }

  const fundList = () => {
    return (
      <div class="col-md-12">
        {getTopBarFund()}
        {funds.map((bill)=> (
          <div class="border-1">
            
            <div class="accordion px-2" id="accordionExample">
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
                    <div class="col-md-4">
                    <p><MdRefresh onClick={()=>fetchBalance(bill.billOwnAddress)} style={pointerHover}/>  Current balance: {showBalance(bill.billOwnAddress)+" "+tokenName}</p>
                    </div>
                    <div class="col-md-8">
                      {/* <button type="button" class="btn btn-none mx-1" disabled></button> */}
                    </div>
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

  const approve = async(parentDepartmentAddress, accountAddress, action) => {
    let accounts = await web3.eth.getAccounts();
    let msg = '';
    let successMsg = '';
    let errorMsg = '';
    console.log("action");
    console.log(action);
    if (action==Action.REJECT){
      msg = "Rejecting request";
      successMsg = "Rejected account";
      errorMsg = "Could not reject account";
    }
    else {
      msg = "Accepting request";
      successMsg = "Accepted account";
      errorMsg = "Could not accept account";
    }
    toast.info(msg, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
      });
    await AccountManagerAudit.methods.approve(parentDepartmentAddress, accountAddress, action).send({
      from: accounts[0]
    }).then((response)=>{
      toast.success(successMsg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        });
        refreshApprovals();
    }).catch((error)=>{
      toast.error(errorMsg, {
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
  const approvalList = () => {
    return (
      <div class="col-md-12 ml-5">
        {getTopBarApprovals()}
        {getModal()}
        {approvals.map((appr)=> (
        <div class="border-1">
            
          <div class="accordion px-2" id="accordionExample">
            <div class="card">
            <div class="card-header collapsed">
                <div class="row"  id={"heading"+appr.accountAddress} type="button" data-toggle="collapse" data-target={"#collapse"+appr.accountAddress} aria-expanded="true" aria-controls={"collapse"+appr.accountAddress}>
                    <h5 class="col-md-9">
                      Type: {AccountTypeReverse[appr.accountType]}
                    </h5>
                    {/* <div class="col-md-3">
                    <p class="card-text text-center">Created on: {getTime(bill.createdOn)}</p>
                    </div> */}
                </div>
                <div class="row">
                  <div class="col-md-7">
                    Sender Address: {appr.origin}
                  </div>
                  <div class="col-md-3">
                  </div>
                  {StatusReverse[appr.status]=="OPEN" && 
                    <div class="col-md-2">
                      <button type="button" class="btn btn-primary mx-1" disabled>Active</button>
                    </div>
                  }
                  {StatusReverse[appr.status]=="ACCEPTED" && 
                    <div class="col-md-2">
                      <button type="button" class="btn btn-success mx-1" disabled>Accepted</button>
                    </div>
                  }
                  {StatusReverse[appr.status]=="REJECTED" && 
                    <div class="col-md-2">
                      <button type="button" class="btn btn-danger mx-1" disabled>Rejected</button>
                    </div>
                  }
                </div>
                </div>

                <div id={"collapse"+appr.accountAddress} class="collapse" aria-labelledby={"heading"+appr.accountAddress} data-parent={"#example"+appr.accountAddress}>
                <div class="card-body">
                    Contract address: {appr.accountAddress}
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
  const getHierarchy = () => {
    return (<DepartmentHierarchy depAddress = {location.state.depAddress}/>);
  }

  return (
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-1">
          <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <button onClick={()=>setSelectedTab("approvals")} class={'nav-link'+ (selectedTab=="approvals"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Approvals</button>
            <button onClick={()=>setSelectedTab("mergeRequests")} class={'nav-link'+ (selectedTab=="mergeRequests"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Merge Requests</button>
            <button onClick={()=>setSelectedTab("funds")} class={'nav-link'+ (selectedTab=="funds"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Funds</button>
            <button onClick={()=>setSelectedTab("bills")} class={'nav-link'+ (selectedTab=="bills"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Bills</button>
            <button onClick={()=>setSelectedTab("hierarchy")} class={'nav-link'+ (selectedTab=="hierarchy"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Hierarchy</button>
            <button onClick={()=>setSelectedTab("mergeBills")} class={'nav-link'+ (selectedTab=="mergeBills"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Encashments</button>
          </div>
        </div>
        <div class="col-md-11 px-4">
        {selectedTab=="bills"? billList() : selectedTab=="funds"? fundList() 
        : selectedTab=="approvals"? approvalList() 
        : selectedTab=="hierarchy"? <DepartmentHierarchy depAddress={location.state.depAddress}/>
        : selectedTab=="mergeBills"? <MergeBill depAddress = {location.state.depAddress}/>
        : selectedTab=="mergeRequests"? <MergeRequest depAddress = {location.state.depAddress}/> : <></>}
        </div>
      </div>
  </div>
  )
}

export default Department