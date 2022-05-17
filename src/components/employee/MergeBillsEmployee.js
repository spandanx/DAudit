import React, {useState, useEffect} from 'react';
import {StatusReverse, tokenName, DepartmentArrayType, Vote, Action, pageSize} from '../Enums';
import { AiOutlineReload } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
import Pagination from '../Pagination';
import web3 from '../../web3';
import DepartmentArrays from '../../CreatedContracts/DepartmentArrays';
import AccountManagerAudit from '../../CreatedContracts/AccountManagerAudit';
import departmentManagerABI from '../../ABIs/DepartmentManagerABI';
import billABI from '../../ABIs/BillABI';
import VoteManager from '../../CreatedContracts/VoteManager';
import MergeABI from '../../ABIs/MergeABI';

import {toast } from 'react-toastify';

const MergeBillsEmployee = (props) => {
  
    // const pageSize = 1;

    const [bills, setBills] = useState([]);
    const [currentPageBill, setCurrentPageBill] = useState(0);
    const [billLength, setBillLength] = useState(0);
    const [employeeCount, setEmployeeCount] = useState(0); 
    const [showModal, setShowModal] = useState(false);
    const [depContract, setDepContract] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('');


    const [voteMap, setVoteMap] = useState(new Map());
    const [list, setList] = useState([]);
    //create new bill form
    // const [fundAddress, setFundAddress] = useState('');
    // const [subDepAddress, setSubDepAddress] = useState('');
    // const [createFundLength, setCreateFundLength] = useState(0);
    // const [createDepLength, setCreateDepLength] = useState(0);
    // const [createFundPageNumber, setCreateFundPageNumber] = useState(0);
    // const [createDepPageNumber, setCreateDepPageNumber] = useState(0);

    // const [billName, setBillName] = useState('');
    // const [description, setDescription] = useState('');
    // const [threshold, setThreshold] = useState('');
    // const [amount, setAmount] = useState('');

    // const [fundsCreateBill, setFundsCreateBill] = useState([]);
    // const [currentPageFundCreateBill, setCurrentPageFundCreateBill] = useState(0);

    // const [departmentsCreateBill, setDepartmentsCreateBill] = useState([]);
    // const [currentPageDepCreateBill, setCurrentPageDepCreateBill] = useState(0);

    useEffect(()=>{
        generateContract(props.depAddress);
    },[props.depAddress]);
    
    useEffect(()=>{
        fetchEmployeeCount();
        fetchBillCount();
        getBills(currentPageBill);
    },[depContract]);

    useEffect(()=>{
        getBills(currentPageBill);
    },[currentPageBill]);

    useEffect(()=>{
      checkIfVoted(list);
    },[list]);

    const generateContract = async (depAddress) => {
        setDepContract(new web3.eth.Contract(departmentManagerABI, depAddress));
    
          await AccountManagerAudit.methods.tokenAddress().call().then((res)=>{
            setTokenAddress(res);
          }).catch((err)=>{});
          console.log("Token address fetched: "+tokenAddress);
    }
    const fetchEmployeeCount = async() => {
        if (!depContract)
            return;
        await depContract.methods.getLength(DepartmentArrayType.EMPLOYEES).call().then((res)=>{
          setEmployeeCount(res);
          console.log("EMPLOYEE COUNT: "+res);
        }).catch((err)=>{});
    }
    const fetchBillCount = async() => {
        if (!depContract)
            return;
        await depContract.methods.getLength(DepartmentArrayType.MERGE_BILLS).call().then((res)=>{
          setBillLength(res);
          console.log("Bill COUNT: "+res);
        }).catch((err)=>{});
    }
    const refreshBills = async() => {
        console.log("refreshing bills");
        getBills(currentPageBill);
    }
    const checkIfVoted = async(billArray) => {
      let mergeContract;
      let map = voteMap;
      for (let i = 0; i<billArray.length; i++){
        mergeContract = new web3.eth.Contract(MergeABI, billArray[i].billOwnAddress);
        await mergeContract.methods.voteMapping(props.empAddress).call().then((res)=>{
          map.set(billArray[i].billOwnAddress, res);
        }).catch((err)=>{});
      }
      setVoteMap(map);
      setBills(billArray);
    }
    const getBills = async(pageNumber) => {
        let accounts = await web3.eth.getAccounts();
        if (!depContract){
          return;
        }
        fetchEmployeeCount();
        fetchBillCount();
        // await depContract.methods.getBills(pageSize, pageNumber).call({
          await DepartmentArrays.methods.getMergeBills(pageSize, pageNumber, props.depAddress).call({
          from: accounts[0]
        }).then((response)=>{
          console.log("Fetched Bills");
          console.log(response);
          setList(response);
        }).catch(error=>{
          console.log("error: "+error);
        });
    }
    const nestedFuncBill = (pageNumber) => {
        setCurrentPageBill(pageNumber);
        // refreshBills();
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
      const vote= async(mergeAddress, action) => {
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
    
        // await VoteManager.methods.vote(billAddress, action, depAddress, tokenAddress, location.state.empAddress).send({
        await VoteManager.methods.voteMerge(mergeAddress, action, props.depAddress, tokenAddress, props.empAddress).send({
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
            getBills(currentPageBill);
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
      const checkVoteType = (billOwnAddress)=>{
        if (voteMap.has(billOwnAddress)){
          return voteMap.get(billOwnAddress);
        }
        return -1;
      }
return (
    <div class="col-md-12 mx-2">
        {getTopBarBill()}
        {/* {getModal()} */}
        {bills.map((bill)=> (
        <div class="border-1">
            
            <div class="accordion px-2" id="accordionExample">
            <div class="card">
            <div class="card-header collapsed">
                <div class="row"  id={"heading"+bill.billOwnAddress} type="button" data-toggle="collapse" data-target={"#collapse"+bill.billOwnAddress} aria-expanded="true" aria-controls={"collapse"+bill.billOwnAddress}>
                    <h5 class="col-md-9">
                    {bill.name}
                    </h5>
                    <div class="col-md-3">
                    <p class="card-text text-center">Created on: {getTime(bill.createdOn)}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                    <p class="card-text py-1 border border-light rounded-2">Amount: {bill.amount + " "+tokenName}</p>
                    </div>
                    {StatusReverse[bill.billStatus]=="OPEN" && 
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
                    
                  {StatusReverse[bill.billStatus]=="OPEN" && checkVoteType(bill.billOwnAddress)==Vote.DID_NOT_VOTE &&
                  <div class="col-md-3 justify-content-end">
                    <button type="button" class="btn btn-success mx-1" onClick={()=>vote(bill.billOwnAddress, Action.APPROVE)}>Accept</button>
                    <button type="button" class="btn btn-danger mx-1" onClick={()=>vote(bill.billOwnAddress, Action.REJECT)}>Reject</button>
                  </div>
                  }
                  {StatusReverse[bill.billStatus]=="OPEN" && checkVoteType(bill.billOwnAddress)==Vote.ACCEPTED &&
                  <div class="col-md-3 justify-content-end">
                    <button type="button" class="btn btn-success mx-1" disabled>Voted: Accept</button>
                  </div>
                  }
                  {StatusReverse[bill.billStatus]=="OPEN" && checkVoteType(bill.billOwnAddress)==Vote.REJECTED &&
                  <div class="col-md-3 justify-content-end">
                    <button type="button" class="btn btn-danger mx-1" disabled>Voted: Reject</button>
                  </div>
                  }
                  {StatusReverse[bill.billStatus]!="OPEN" && 
                    <div class="col-md-7"></div>
                  }
                  {StatusReverse[bill.billStatus]=="ACCEPTED" && 
                  <div class="col-md-3 justify-content-end">
                    <button type="button" class="btn btn-success mx-1" disabled>Accepted</button>
                  </div>
                  }
                  {StatusReverse[bill.billStatus]=="REJECTED" && 
                  <div class="col-md-3 justify-content-end">
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

export default MergeBillsEmployee;