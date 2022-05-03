import React, {useState, useEffect} from 'react';
import web3 from '../web3';
import { useLocation } from "react-router-dom";

import departmentABI from '../DepartmentABI';
import DepartmentHierarchy from './DepartmentHierarchy';
// import AccountManagerAudit from '../AccountManagerAudit';
import { AiOutlineReload } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
// import {pointerHover} from './styles/cursor.js';
import { Modal, Button } from "react-bootstrap";
import Pagination from './Pagination';

const Department = () => {

  const location = useLocation();
  console.log("location department");
  console.log(location);
  const [bills, setBills] = useState([]);
  // const [depAddress, setDepAddress] = useState('');
  const [depContract, setDepContract] = useState('');
  const [selectedTab, setSelectedTab] = useState('bills');
  // const [bill1, setBill1] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const pageSize = 10;

  const [currentPage, setCurrentPage] = useState(0);

  let gdata = {
    name: 'Parent',
    children: [{
      name: 'Child One'
    }, {
      name: 'Child Two'
    }]
  };

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
    getBills(currentPage);
  },[depContract]);

  const generateContract = async (depAddress) => {
    setDepContract(new web3.eth.Contract(departmentABI, depAddress));
  }
  const getBills = async(pageNumber) => {
    let accounts = await web3.eth.getAccounts();
    if (!depContract){
      return;
    }
    await depContract.methods.getBills(pageSize, pageNumber).call({
      from: accounts[0]
    }).then((response)=>{
      console.log("Fetched Bills");
      console.log(response);
      setBills(response);
    }).catch(error=>{
      console.log("error: "+error);
    });
  }

  const refreshBills = async() => {
    console.log("refreshing");
    getBills(currentPage);
  }

  const getTopBar = () => {
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

  const nestedFunc = (num) => {
    console.log("Calling nestedFunc()");
    console.log(num);
  }
  
  const getModal = () => {
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="row">
            <div class="col-md-7">
              <select class="form-select form-select-sm my-2" aria-label=".form-select-sm example">
                <option selected>Select fund</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div class="col-md-3 py-1">
              <Pagination pageEnd={8} pageTabs={3} function={(item)=>nestedFunc(item)}/>
            </div>
          </div>
          <div class="row">
            <div class="col-md-7">
              <select class="form-select form-select-sm my-2" aria-label=".form-select-sm example">
                <option selected>Select Department</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
              </div>
              <div class="col-md-3 py-1">
                <Pagination pageEnd={8} pageTabs={3} function={(item)=>nestedFunc(item)}/>
              </div>
            </div>
          <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Department name" tabIndex="-1"
                      // value={dep_accountName} 
                      // onChange={(event) => setDep_accountName(event.target.value)}
                  />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Create Bill
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  const billList = () => {
    return (
      <div class="col-md-11">
        {getTopBar()}
        {getModal()}
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
    );
  }

  const approvalList = () => {
    return (<></>);
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
        {selectedTab=="bills"? billList() : selectedTab=="approvals"? approvalList() : selectedTab=="hierarchy"? getHierarchy() : <></>}
      </div>
  </div>
  )
}

export default Department