import React, {useState, useEffect} from 'react';
import {StatusReverse, tokenName, DepartmentArrayType} from '../Enums';
import { AiOutlineReload } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
import Pagination from '../Pagination';
import web3 from '../../web3';
import DepartmentArrays from '../../CreatedContracts/DepartmentArrays';
import AccountManagerAudit from '../../CreatedContracts/AccountManagerAudit';
import departmentManagerABI from '../../ABIs/DepartmentManagerABI';
import BillManager from '../../CreatedContracts/BillManager';
import BillABI from '../../ABIs/BillABI';

import {toast } from 'react-toastify';

const MergeBill = (props) => {

    const pageSize = 1;

    const [bills, setBills] = useState([]);
    const [currentPageBill, setCurrentPageBill] = useState(0);
    const [billLength, setBillLength] = useState(0);
    const [employeeCount, setEmployeeCount] = useState(0); 
    const [showModal, setShowModal] = useState(false);
    const [depContract, setDepContract] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('');

    //create new bill form
    const [fundAddress, setFundAddress] = useState('');
    const [rootDepartmentAddress, setRootDepartmentAddress] = useState('');

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

    // const [departmentsCreateBill, setDepartmentsCreateBill] = useState([]);
    // const [currentPageDepCreateBill, setCurrentPageDepCreateBill] = useState(0);

    const [destinationBill, setDestinationBill] = useState([]);
    const [currentPageDepDestination, setCurrentPageDepDestination] = useState(0);

    const [selectedDepAddressFund, setSelectedDepAddressFund] = useState(0);
    //form validation
    const [validAmount, setValidAmount] = useState(false);
    const [validThreshold, setValidThreshold] = useState(false);
    const [validForm, setValidForm] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(()=>{
        generateContract(props.depAddress);
    },[props.depAddress]);
    
    useEffect(()=>{
        fetchEmployeeCount();
        fetchBillCount();
        getBills(currentPageBill);
        getFundsOfCreateBill(currentPageFundCreateBill);
        getDestinationFunds(currentPageFundCreateBill);
        // getSubDeptsOfCreateBill(currentPageDepCreateBill);
    },[depContract]);
    // useEffect(()=>{
    //     getDestinationFunds(currentPageDepDestination);
    // },[selectedDepAddressFund]);

    useEffect(()=>{
        getBills(currentPageBill);
    },[currentPageBill]);

    useEffect(()=>{
      if (!fundAddress || !selectedDepAddressFund || !billName){
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
    const getDestinationFunds = async(pageNumber) => {
        console.log("CALLED getFundsOfCreateBill()");
        // let accounts = await web3.eth.getAccounts();
        // if (!selectedDepAddressFund){
        //   return;
        // }
        // await depContract.methods.getLength(DepartmentArrayType.FUNDS).call().then((res)=>{
        //   setCreateFundLength(res);
        // //   console.log("Fund COUNT: "+res);
        // }).catch((err)=>{});
        await AccountManagerAudit.methods.billAddress().call().then(async(res)=>{
            let billStrct = new web3.eth.Contract(BillABI, res);
            console.log("INSIDE rootBillAddress");
            billStrct.methods.getBillStruct().call().then((res1)=>{
                console.log("INSIDE rootBillAddress billSTRUCT");
                console.log(res1);
                setRootDepartmentAddress(res1.toDepartment);
                setDestinationBill([res1]);
            }).catch((err)=>{console.log(err)});
        }).catch((err)=>{console.log(err)});
        //createFundLength
        // await depContract.methods.getBills(pageSize, pageNumber).call({
        //   await DepartmentArrays.methods.getFunds(pageSize, pageNumber, props.depAddress).call({
        //   from: accounts[0]
        // }).then((response)=>{
        //   console.log("Fetched Funds");
        //   console.log(response);
        //   setFundsCreateBill(response);
        // }).catch(error=>{
        //   console.log("error: "+error);
        // });
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
          await DepartmentArrays.methods.getFunds(pageSize, pageNumber, props.depAddress).call({
          from: accounts[0]
        }).then((response)=>{
          console.log("Fetched Funds");
          console.log(response);
          setFundsCreateBill(response);
        }).catch(error=>{
          console.log("error: "+error);
        });
    }
    const selectDestinationDepartment = (destFundAddress) => {
        console.log("Calling selectDestinationDepartment()");
        console.log("Fund address: "+destFundAddress);
        setSelectedDepAddressFund(destFundAddress);
    }
    // const getSubDeptsOfCreateBill = async(pageNumber) => {
    //     console.log("Called getFundsOfCreateBill()");
    //     let accounts = await web3.eth.getAccounts();
    //     if (!depContract){
    //       return;
    //     }
    //     await depContract.methods.getLength(DepartmentArrayType.SUBDEPARTMENTS).call().then((res)=>{
    //       setCreateDepLength(res);
    //       console.log("departments COUNT: "+res);
    //     }).catch((err)=>{});
    //     //createDepLength
    //     // await depContract.methods.getBills(pageSize, pageNumber).call({
    //       await DepartmentArrays.methods.getSubDepartments(pageSize, pageNumber, props.depAddress).call({
    //       from: accounts[0]
    //     }).then((response)=>{
    //       console.log("Fetched subDepartments");
    //       console.log(response);
    //       setDepartmentsCreateBill(response);
    //     }).catch(error=>{
    //       console.log("error: "+error);
    //     });
    //   }
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
          await DepartmentArrays.methods.getMergeBills(pageSize, pageNumber, props.depAddress).call({
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
        
        // string memory _name,
        // string memory _description,
        // uint _threshold,
        // uint _deadline,
        // uint _acceptedOrRejectedOn,
        // uint _amount,
        // address _fromBill,
        // address _fromDepartment,
        // address _toDepartment,
        // address tokenAddress,
        // address _toBill
        console.log("_name: "+billName);
        console.log("_description: "+description);
        console.log("_threshold: "+threshold);
        console.log("_deadline: "+currentTimestamp);
        console.log("_acceptedOrRejectedOn: "+currentTimestamp);
        console.log("_amount: "+amount);
        console.log("_fromBill: "+fundAddress);
        console.log("_fromDepartment: "+props.depAddress);
        console.log("_toDepartment: "+rootDepartmentAddress);
        console.log("tokenAddress: "+tokenAddress);
        console.log("_toBill: "+selectedDepAddressFund);
        await BillManager.methods.createMergeBill(
          billName,
          description,
          threshold,
          // "Dummy",
          currentTimestamp,
          currentTimestamp,
          amount,
          fundAddress,
          props.depAddress,
          rootDepartmentAddress,
          tokenAddress,
          selectedDepAddressFund
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
              {/* <div class="row">
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
            </div> */}
            <div class="row">
                <div class="col-md-7">
                  <select class="form-select form-select-sm my-2" aria-label=".form-select-sm example" onChange={(event)=>selectDestinationDepartment(event.target.value)}>
                    <option defaultValue>Select destination fund</option>
                    {destinationBill.map((fund)=>(
                      <option value={fund.billOwnAddress}>{fund.name}</option>
                    ))}
                  </select>
                </div>
                <div class="col-md-3 py-1">
                  <Pagination activePage={createFundPageNumber} pageEnd={Math.ceil(createFundLength/pageSize)} pageTabs={3} function={(item)=>nestedFuncCreateFund(item)}/>
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
                    {StatusReverse[bill.billStatus]!="OPEN" &&
                    <div class="col-md-7"></div>
                    }
                    {StatusReverse[bill.billStatus]=="OPEN" && 
                    <div class="col-md-2">
                    <button type="button" class="btn btn-primary mx-1" disabled>Active</button>
                    </div>
                    }
                    {StatusReverse[bill.billStatus]=="ACCEPTED" && 
                    <div class="col-md-2">
                    <button type="button" class="btn btn-success mx-1" disabled>Accepted</button>
                    </div>
                    }
                    {StatusReverse[bill.billStatus]=="REJECTED" && 
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

export default MergeBill