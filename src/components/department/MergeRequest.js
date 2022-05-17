import React, {useState, useEffect} from 'react';
import {StatusReverse, tokenName, DepartmentArrayType, Action, pageSize} from '../Enums';
import { AiOutlineReload } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
import Pagination from '../Pagination';
import web3 from '../../web3';
import DepartmentArrays from '../../CreatedContracts/DepartmentArrays';
import AccountManagerAudit from '../../CreatedContracts/AccountManagerAudit';
import departmentManagerABI from '../../ABIs/DepartmentManagerABI';
import VoteManager from '../../CreatedContracts/VoteManager';

import {toast } from 'react-toastify';

const MergeRequest = (props) => {
  
    // const pageSize = 1;

    const [bills, setBills] = useState([]);
    const [currentPageBill, setCurrentPageBill] = useState(0);
    const [billLength, setBillLength] = useState(0);
    const [employeeCount, setEmployeeCount] = useState(0); 
    const [showModal, setShowModal] = useState(false);
    const [depContract, setDepContract] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('');

    //Set attributes before approving
    const [selectedMergeAddress, setSelectedMergeAddress] = useState('');
    const [selectedDepAddress, setSelectedDepAddress] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    //tokenAddress
    //auditStorageAddress
    const [proof, setProof] = useState('');


    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

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
        await depContract.methods.getLength(DepartmentArrayType.MERGE_REQUESTS).call().then((res)=>{
          setBillLength(res);
          console.log("Bill COUNT: "+res);
        }).catch((err)=>{});
    }
    const refreshBills = async() => {
        console.log("refreshing bills");
        getBills(currentPageBill);
    }
    const getBills = async(pageNumber) => {
        let accounts = await web3.eth.getAccounts();
        if (!depContract){
          return;
        }
        fetchEmployeeCount();
        fetchBillCount();
        // await depContract.methods.getBills(pageSize, pageNumber).call({
          await DepartmentArrays.methods.getMergeRequests(pageSize, pageNumber, props.depAddress).call({
          from: accounts[0]
        }).then((response)=>{
          console.log("Fetched Bills");
          console.log(response);
          setBills(response);
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
      const getModal = () => {
        // getFundsOfCreateBill(currentPageFundCreateBill);
        return (
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Submit proof</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div class="row my-3">
                <textarea class="form-control" id="message" name="body" rows="3" placeholder="Description"
                    value={proof} 
                    onChange={(event) => setProof(event.target.value)}
                ></textarea>
            </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" disabled={!proof} onClick={()=>approve()}>
                Create Bill
              </Button>
            </Modal.Footer>
          </Modal>
        );
      }
      const clickOnApprove = (mergeAddress, depAddress, action) => {
        setSelectedMergeAddress(mergeAddress);
        setSelectedDepAddress(depAddress);
        setSelectedAction(action);
        handleShow();
      }
      const approve = async() => {
        handleClose();
        let tokenAddress;
        await AccountManagerAudit.methods.tokenAddress().call().then((res)=>{
          tokenAddress = res;
        }).catch((err)=>{});
        let auditStorageAddress = AccountManagerAudit._address;
        console.log(AccountManagerAudit);
        console.log("auditStorageAddress");
        console.log(auditStorageAddress);
        //auditStorageAddress
        //approve(bill.billOwnAddress, props.depAddress, Action.APPROVE)
        let accounts = await web3.eth.getAccounts();
        let msg = '';
        let successMsg = '';
        let errorMsg = '';
        console.log("action");
        console.log(selectedAction);
        if (selectedAction==Action.REJECT){
          msg = "Rejecting request";
          successMsg = "Rejected request";
          errorMsg = "Could not reject request";
        }
        else {
          msg = "Accepting request";
          successMsg = "Accepted request";
          errorMsg = "Could not accept request";
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
          ////approveRequestMerge(address mergeAddress, address departmentAddress, address auditStorageAddress, StructLibrary.Action opinion, address tokenAddress, string memory proof)
        // await AccountManagerAudit.methods.approve(parentDepartmentAddress, accountAddress, action).send({
        await VoteManager.methods.approveRequestMerge(selectedMergeAddress, selectedDepAddress, auditStorageAddress, selectedAction, tokenAddress, proof).send({
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
            refreshBills();
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
  return (
    <div class="col-md-12">
        {getTopBarBill()}
        {getModal()}
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
                    <div class="col-md-3">
                    <p class="card-text py-1 border border-light rounded-2">Amount: {bill.amount + " "+tokenName}</p>
                    </div>
                    <div class="col-md-7">
                      
                    </div>
                    {StatusReverse[bill.requestStatus]=="OPEN" && 
                    <div class="col-md-2">
                      <button type="button col-md-2" class="btn btn-success mx-1" onClick={()=>clickOnApprove(bill.billOwnAddress, props.depAddress, Action.APPROVE)}>Accept</button>
                      <button type="button col-md-2" class="btn btn-danger mx-1" onClick={()=>clickOnApprove(bill.billOwnAddress, props.depAddress, Action.REJECT)}>Reject</button>
                    </div>
                    }
                    {StatusReverse[bill.requestStatus]=="ACCEPTED" && 
                    <div class="col-md-2">
                      <button type="button" class="btn btn-success mx-1" disabled>Accepted</button>
                    </div>
                    }
                    {StatusReverse[bill.requestStatus]=="REJECTED" && 
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

export default MergeRequest