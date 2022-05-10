import React, {useState, useEffect} from 'react';
import web3 from '../web3';
import { useLocation } from "react-router-dom";

// import departmentABI from '../ABIs/DepartmentABI';
import departmentManagerABI from '../ABIs/DepartmentManagerABI';
import DepartmentHierarchy from './DepartmentHierarchy';
// import AccountManagerAudit from '../AccountManagerAudit';
import { AiOutlineReload } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
// import {pointerHover} from './styles/cursor.js';
import { Modal, Button } from "react-bootstrap";
import Pagination from './Pagination';
import DepartmentArrays from '../CreatedContracts/DepartmentArrays';
import Status from './Enums';
import accountType from './Enums';
import {Action} from './Enums';
import {AccountTypeReverse} from './Enums';
import {StatusReverse} from './Enums';
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
  // const [depAddress, setDepAddress] = useState('');
  const [depContract, setDepContract] = useState('');
  const [selectedTab, setSelectedTab] = useState('bills');
  // const [bill1, setBill1] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const pageSize = 10;

  const [currentPageBill, setCurrentPageBill] = useState(0);
  const [currentPageFund, setCurrentPageBillFund] = useState(0);
  const [currentPageApproval, setCurrentPageBillapproval] = useState(0);

  const [fundsCreateBill, setFundsCreateBill] = useState([]);
  const [currentPageFundCreateBill, setCurrentPageFundCreateBill] = useState(0);

  const [departmentsCreateBill, setDepartmentsCreateBill] = useState([]);
  const [currentPageDepCreateBill, setCurrentPageDepCreateBill] = useState(0);

  //create new bill form
  const [fundAddress, setFundAddress] = useState('');
  const [subDepAddress, setSubDepAddress] = useState('');
  const [billName, setBillName] = useState('');
  const [description, setDescription] = useState('');
  const [threshold, setThreshold] = useState('');
  const [amount, setAmount] = useState('');
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

  const generateContract = async (depAddress) => {
    setDepContract(new web3.eth.Contract(departmentManagerABI, depAddress));
  }
  const getBills = async(pageNumber) => {
    let accounts = await web3.eth.getAccounts();
    if (!depContract){
      return;
    }
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
            <Pagination pageEnd={8} pageTabs={3} function={(item)=>nestedFunc(item)}/>
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
            <Pagination pageEnd={8} pageTabs={3} function={(item)=>nestedFunc(item)}/>
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
            <Pagination pageEnd={8} pageTabs={3} function={(item)=>nestedFunc(item)}/>
          </li>
      </ul>
    );
  }

  const nestedFunc = (num) => {
    console.log("Calling nestedFunc()");
    console.log(num);
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

      let tokenAddress;
      await AccountManagerAudit.methods.tokenAddress().call().then((res)=>{
        tokenAddress = res;
      }).catch((err)=>{

      });
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
              <Pagination pageEnd={8} pageTabs={3} function={(item)=>nestedFunc(item)}/>
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
                <Pagination pageEnd={8} pageTabs={3} function={(item)=>nestedFunc(item)}/>
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
          <Button variant="primary" onClick={()=>createBill()}>
            Create Bill
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  const billList = () => {
    return (
      <div class="col-md-11">
        {getTopBarBill()}
        {getModal()}
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
                      <button type="button" class="btn btn-primary mx-1" disabled>Open</button>
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
    );
  }

  const fundList = () => {
    return (
      <div class="col-md-11">
        {getTopBarFund()}
        {getModal()}
        {funds.map((fund)=> (
          <div>
            <h5 class="card-header">{fund.name}</h5>
            <div class="card-body">
              <h5 class="card-title">{fund.description}</h5>
              <p class="card-text">{fund.imagePath}</p>
              <a href="#" class="btn btn-primary">{fund.amount}</a>
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
      <div class="col-md-11">
        {getTopBarApprovals()}
        {getModal()}
        {approvals.map((appr)=> (
          <div>
            <h5 class="card-header">{AccountTypeReverse[appr.accountType]}</h5>
            <div class="card-body">
              <h5 class="card-title">Address: {appr.accountAddress}</h5>
              {StatusReverse[appr.status]=="OPEN" &&  
              <>
                <button type="button" class="btn btn-success mx-1" onClick={()=>approve(appr.parentDepartmentAddress, appr.accountAddress, Action.APPROVE)}>Accept</button>
                <button type="button" class="btn btn-danger mx-1" onClick={()=>approve(appr.parentDepartmentAddress, appr.accountAddress, Action.REJECT)}>Reject</button>
              </>
              }
              {StatusReverse[appr.status]=="ACCEPTED" &&  
              <>
                <button type="button" class="btn btn-success mx-1" disabled>Accepted</button>
              </>}
              {StatusReverse[appr.status]=="REJECTED" &&  
              <>
                <button type="button" class="btn btn-danger mx-1" disabled>Rejected</button>
              </>}
              {/* <a href="#" class="btn btn-primary">{fund.amount}</a> */}
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
        <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <button onClick={()=>setSelectedTab("approvals")} class={'nav-link'+ (selectedTab=="approvals"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Approvals</button>
          <button onClick={()=>setSelectedTab("funds")} class={'nav-link'+ (selectedTab=="funds"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Funds</button>
          <button onClick={()=>setSelectedTab("bills")} class={'nav-link'+ (selectedTab=="bills"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Bills</button>
          <button onClick={()=>setSelectedTab("hierarchy")} class={'nav-link'+ (selectedTab=="hierarchy"? ' active':'')} id="v-pills-Inbox-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Inbox" type="button" role="tab" aria-controls="v-pills-Inbox" aria-selected="true">Hierarchy</button>
        </div>
          {/* <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" onClick={()=>setSelectedTab("approvals")}>Approvals</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" onClick={()=>setSelectedTab("bills")}>Bills</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" onClick={()=>setSelectedTab("hierarchy")}>Hierarchy</a>
            </li>
          </ul> */}
        </div>

        {selectedTab=="bills"? billList() : selectedTab=="funds"? fundList() : selectedTab=="approvals"? approvalList() : selectedTab=="hierarchy"? getHierarchy() : <></>}
      </div>
  </div>
  )
}

export default Department