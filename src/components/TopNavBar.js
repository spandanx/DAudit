import React, {useState, useEffect} from 'react'
import web3 from '../web3';
import AccountManagerAudit from '../CreatedContracts/AccountManagerAudit';
import { useNavigate } from "react-router-dom";
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MdAccountCircle, MdContentCopy } from "react-icons/md";
// import departmentABI from '../ABIs/DepartmentABI';
import departmentManagerABI from '../ABIs/DepartmentManagerABI';
import employeeABI from '../ABIs/EmployeeABI';
import {ApprovalStatusReverse} from "./Enums";

import {pointerHover} from './styles/cursor.js';

const TopNavBar = () => {

  const navigate = useNavigate();

  const address0 = "0x0000000000000000000000000000000000000000";
  // const [accountType, setAccountType] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountAddress, setAccountAddress] = useState('');
  // const [errorCount, setErrorCount] = useState(0);

  // const employeeString = "Employee";
  // const departmentString = "Department";

  useEffect(() => {
    console.log("Calling useEffect()");
    checkIfAccountsExists();
  }, []);

  window.ethereum.on('accountsChanged', function (accounts) {
    console.log("Account Changed");
    console.log(accounts);
    // toast.info('Account change detected!', {
    //   position: "bottom-right",
    //   autoClose: 2000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   pauseOnFocusLoss: false,
    //   draggable: true,
    //   progress: undefined,
    //   });
    // getInfoToast("Account change detected!", 2000);
      //navigating to other account.
    // checkIfAccountsExists();
    let timer1 = setTimeout(() => checkIfAccountsExists(), 500);
    return () => {
      clearTimeout(timer1);
    };
  });

  // const getInfoToast = (message, autoClose) => {
  //   return toast.info(message, {
  //     position: "bottom-right",
  //     autoClose: autoClose,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     pauseOnFocusLoss: false,
  //     draggable: true,
  //     progress: undefined,
  //     });
  // }
  const checkAprroval = async(address, path, args) => {
    // let accounts = await web3.eth.getAccounts();
    console.log("Calling checkAprroval()");
    await AccountManagerAudit.methods.approvedStatus(address).call().then((res)=>{
      // console.log("approvedStatus: ");
      // console.log(res);
      // console.log(ApprovalStatusReverse[res]);
      if (ApprovalStatusReverse[res]=="ACCEPTED"){
        navigate(path, args);
        // navigate("/to-be-approved");
      }
      else if (ApprovalStatusReverse[res]=="EXISTS"){
        setAccountName('');
        setAccountAddress('');
        navigate("/to-be-approved");
      }
      else if (ApprovalStatusReverse[res]=="REJECTED"){
        setAccountName('');
        setAccountAddress('');
        navigate("/rejected");
      }
    }).catch((err)=>{

    });
  }

  const checkIfAccountsExists = async() => {
    console.log("Calling checkIfAccountsExists()");
    let accounts = await web3.eth.getAccounts();
    // console.log("ACCOUNTS");
    // console.log(accounts);
    if (accounts.length==0){
      navigate("/not-found");
      return;
    }
    let accountApproved = false;
    let errors = 0;
    // try{
      await AccountManagerAudit.methods.departments(accounts[0]).call().then(async function(response) {
        // setAccountType(employeeString);
        console.log("Department found");
        console.log(response);
        if (response!=address0){
          let depContract = new web3.eth.Contract(departmentManagerABI, response);
          await depContract.methods.getDepartmentStruct().call().then((depstruct)=>{
            setAccountName(depstruct.name);
            setAccountAddress(response);
          });
          await checkAprroval(response, '/department', {state: {depAddress:response}});
          // navigate('/department', {state: {depAddress:response}});
        }
        else{
          errors++;
        }
      }).catch((err) => {
        // console.log("Department not found!");
        // errors++;
      });
      await AccountManagerAudit.methods.employees(accounts[0]).call().then(async function(response) {
        // setAccountType(departmentString);
        // console.log("Employee found!");
        if (response!=address0){
          let empContract = new web3.eth.Contract(employeeABI, response);
          await empContract.methods.getEmployeeStruct().call().then((empStruct)=>{
            setAccountName(empStruct.name);
            setAccountAddress(response);
          });
          await checkAprroval(response, '/employee', {state: {empAddress:response}});
          // navigate('/employee', {state: {empAddress:response}});
        }
        else{
          errors++;
        }
      }).catch((err) => {
        // console.log("Employee not found!");
        // errors++;
      });
      // console.log("accountType: "+accountType);
    // }
    // catch (e) {
      console.log("END");
      console.log("errors: "+errors);
    // }
    
    if (errors == 2){
      setAccountName('');
      setAccountAddress('');
      navigate('/register');
    }
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
  // return (
  //   <div>
  //       {/* <Notification/> */}
  //       {/* <Link to="/login" className="text-decoration-none"> */}
  //         <nav className="navbar navbar-light bg-light">
  //             <div className="container-fluid">
  //                 <a className="navbar-brand">DAudit</a>
  //             </div>
  //         </nav>
  //         <ToastContainer />
  //       {/* </Link> */}
  //     </div>
  // )
  return (
    <ul class="nav justify-content-between">
      <li class="nav-item">
        <a class="nav-link active">DAudit</a>
        <ToastContainer/>
      </li>
      {accountAddress && 
      <li class="nav-item">
        <div class="btn-group">
          <a type="button" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <MdAccountCircle color="blue" size="2em"/>
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item fw-bold">{accountName}</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item">Address: {accountAddress.substring(0, 10)}... <MdContentCopy onClick={() => {copyText(accountAddress)}} style={pointerHover}/></a>
            {/* <a class="dropdown-item">Something else here</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item">Separated link</a> */}
          </div>
        </div>
      </li>
      }
    </ul>
    // <nav class="navbar navbar-expand-lg justify-content-between navbar-dark bg-dark">
    //   <div class="container-fluid">
    //     <a class="navbar-brand" href="#">DAudit</a>
    //   </div>
    //   <div class="container-fluid">
    //     <a class="navbar-brand" href="#"><MdAccountCircle/></a>
    //   </div>
    //   <ToastContainer/>
    // </nav>
  )
}

export default TopNavBar