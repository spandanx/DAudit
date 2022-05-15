import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Pagination from './Pagination';
import TrackBills from './Charts/TrackBills';
import DepartmentHierarchy from './Charts/DepartmentHierarchy';

import {toast } from 'react-toastify';

import { MdRefresh, MdContentCopy } from "react-icons/md";
import { IoCaretForwardOutline } from "react-icons/io5";
import { AiOutlineReload } from "react-icons/ai";

import {pointerHover} from './styles/cursor.js';
import {tokenName, DepartmentArrayType, StatusReverse} from './Enums';
import DepartmentArrays from '../CreatedContracts/DepartmentArrays';
import auditorABI from '../ABIs/AuditorABI';
import departmentManagerABI from '../ABIs/DepartmentManagerABI';
import AccountManagerAudit from '../CreatedContracts/AccountManagerAudit';
import BLTABI from '../ABIs/BLTABI';
import web3 from '../web3';

const Auditor = () => {

    // const navigate = useNavigate();

    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState("bills");
    const [audContract, setAudContract] = useState('');
    const [depContract, setDepContract] = useState('');
    const [depAddress, setDepAddress] = useState('');

    const [bills, setBills] = useState([]);
    const [funds, setFunds] = useState([]);
    const [billLength, setBillLength] = useState(0);
    const [fundLength, setFundLength] = useState(0);

    const [employeeCount, setEmployeeCount] = useState(0);
    const [currentPageFund, setCurrentPageFund] = useState(0);
    const [currentPageBill, setCurrentPageBill] = useState(0);

    const [fundBalanceMap, setFundBalanceMap] = useState(new Map());
    const [tokenContract, setTokenContract] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');

    const [navigateBillAddress, setNavigateBillAddress] = useState('');

    const pageSize = 1;

    useEffect(()=>{
      console.log("ADDRESS CHANGED, GENERATING NEW CONTRACT");
      setAudContract(new web3.eth.Contract(auditorABI, location.state.audAddress));
    },[location.state.audAddress]);
    useEffect(()=>{
      generateContracts();
    },[audContract]);

    useEffect(()=>{
      console.log("FETCHING BILLS");
      getBills(currentPageBill);
      getFunds(currentPageFund);
      // getApprovals(currentPageApproval);
      // getFundsOfCreateBill(currentPageFundCreateBill);
      // getSubDeptsOfCreateBill(currentPageDepCreateBill);
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

    const generateContracts = async (emp) => {
      if (!audContract)
        return;
      await audContract.methods.getAuditorStruct().call().then((res)=>{
        setDepAddress(res.parentDepartmentAddress);
        setDepContract(new web3.eth.Contract(departmentManagerABI, res.parentDepartmentAddress));
      }).catch((err)=>{});

      await AccountManagerAudit.methods.tokenAddress().call().then((res)=>{
        setTokenAddress(res);
      }).catch((err)=>{});
      console.log("Token address fetched: "+tokenAddress);
    }
    const nestedFuncBill = (pageNumber) => {
      setCurrentPageBill(pageNumber);
      // refreshBills();
    }
    const nestedFuncFund = (pageNumber) => {
      setCurrentPageFund(pageNumber);
      // refreshFunds();
    }
    const getParcentage = (num) => {
        if (employeeCount==0)
          return "N/A";
        return (num*100/employeeCount).toFixed(2);
      }
    const getTopBarBill = () => {
        return (
          <ul class="nav justify-content-between border-top border-bottom p-2 my-2">
              <li class="nav-item justify-content-between">
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
      const getTime = (timestamp) => {
    
        if (timestamp.length==10){
          timestamp += "000";
        }
        let d = new Date(parseInt(timestamp));
        // console.log("Date: "+timestamp);
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
          console.log("Bill COUNT: "+res);
        }).catch((err)=>{});
      }
      const getBills = async(pageNumber) => {
        let accounts = await web3.eth.getAccounts();
        if (!depContract){
          return;
        }
        fetchBillCount();
        fetchEmployeeCount();
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
      const getFunds = async(pageNumber) => {
        let accounts = await web3.eth.getAccounts();
        if (!depContract){
          return;
        }
        fetchFundCount();
        // await depContract.methods.getBills(pageSize, pageNumber).call({
          await DepartmentArrays.methods.getFunds(pageSize, pageNumber, depAddress).call({
          from: accounts[0]
        }).then((response)=>{
          console.log("Fetched Funds");
          console.log(response);
          setFunds(response);
        }).catch(error=>{
          console.log("error: "+error);
        });
      }
      const refreshFunds = async() => {
        console.log("refreshing funds");
        getFunds(currentPageFund);
      }
      const refreshBills = async() => {
        console.log("refreshing bills");
        getBills(currentPageBill);
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
      const copyText = (text) => {
        console.log("Copied");
        navigator.clipboard.writeText(text);
        toast.info('Address Copied', {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
          });
      }
      const navigateToTrack = (billAddress) => {
        setNavigateBillAddress(billAddress);
        setSelectedTab('track');
        // navigate('/auditor/track', {state: {billAddress :billAddress}});
      }
      const billList = () => {
        return (
          <div class="col-md-11">
            {getTopBarBill()}
            {bills.map((bill)=> (
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
                      <div class="row my-2">
                        <span>
                          <a class="col-md-3 text-decoration-none">Address: {bill.billOwnAddress.substring(0, 10)}... <MdContentCopy onClick={() => copyText(bill.billOwnAddress)} style={pointerHover}/></a>
                          <a style={pointerHover} onClick={()=>navigateToTrack(bill.billOwnAddress)} class="text-decoration-none text-primary col-md-1 mx-2">Track<IoCaretForwardOutline/></a>
                        </span>
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

      const fundList = () => {
        return (
          <div class="col-md-11">
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
                      <div class="row my-2">
                        <span>
                          <a class="col-md-3 text-decoration-none">Address: {bill.billOwnAddress.substring(0, 10)}... <MdContentCopy onClick={() => copyText(bill.billOwnAddress)} style={pointerHover}/></a>
                          <a style={pointerHover} onClick={()=>navigateToTrack(bill.billOwnAddress)} class="text-decoration-none text-primary col-md-1 mx-2">Track<IoCaretForwardOutline/></a>
                        </span>
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
            <button class={"nav-link" + (selectedTab=='funds'? " active" : "")} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true" onClick={()=>setSelectedTab('funds')}>Funds</button>
            <button class={"nav-link" + (selectedTab=='bills'? " active" : "")} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true" onClick={()=>setSelectedTab('bills')}>Bills</button>
            <button class={"nav-link" + (selectedTab=='track'? " active" : "")} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true" onClick={()=>setSelectedTab('track')}>Track</button>
            <button class={"nav-link" + (selectedTab=='view'? " active" : "")} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true" onClick={()=>setSelectedTab('view')}>View Department</button>
          </div>
        </div>
        <div class="col-md-11">
          {selectedTab=="bills"? billList() : selectedTab=="funds"? fundList() : selectedTab=="track"? <TrackBills billAddress={navigateBillAddress}/> : selectedTab=="view"? <DepartmentHierarchy depAddress = {depAddress}/> : <></>}
        </div>
      </div>
  </div>
  )
}

export default Auditor