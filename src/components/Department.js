import React, {useState, useEffect} from 'react';
import web3 from '../web3';
import { useLocation } from "react-router-dom";

import departmentABI from '../DepartmentABI';
// import AccountManagerAudit from '../AccountManagerAudit';

const Department = () => {

  const location = useLocation();
  console.log("location department");
  console.log(location);
  const [bills, setBills] = useState([]);
  // const [depAddress, setDepAddress] = useState('');
  const [depContract, setDepContract] = useState('');
  const [selectedTab, setSelectedTab] = useState('');
  // const [bill1, setBill1] = useState([]);

  const pageSize = 10;

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
    getBills(0);
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
  
  const billList = () => {
    return (
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
    );
  }

  const approvalList = () => {
    return (<></>);
  }
  const getHierarchy = () => {
    return (<></>);
  }

  return (
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-1">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" onClick={()=>setSelectedTab("approvals")}>Approvals</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" onClick={()=>setSelectedTab("bills")}>Bills</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" onClick={()=>setSelectedTab("hierarchy")}>Hierarchy</a>
            </li>
          </ul>
        </div>
        {selectedTab=="bills"? billList() : selectedTab=="approvals"? approvalList() : selectedTab=="hierarchy"? getHierarchy() : <></>}
      </div>
  </div>
  )
}

export default Department