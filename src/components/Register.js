import React, {useState, useEffect} from 'react';
import { TiTick } from "react-icons/ti";
import { BsExclamation } from "react-icons/bs";
import AccountManagerAudit from '../CreatedContracts/AccountManagerAudit';
import web3 from '../web3';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import departmentABI from '../ABIs/DepartmentABI';
import AccountType from './Enums';

const Register = () => {

    // let activeForm = 0;
    const navigate = useNavigate();

    const address0 = "0x0000000000000000000000000000000000000000";

    const [activeForm, setActiveForm] = useState(0);
    const [emp_depAddress, setEmp_depAddress] = useState('');
    const [emp_accountName, setEmp_accountName] = useState('');
    const [emp_ValidForm, setEmp_ValidForm] = useState(false);
    const [emp_AddressError, setEmp_AddressError] = useState('');

    const [dep_depAddress, setDep_depAddress] = useState('');
    const [dep_accountName, setDep_accountName] = useState('');
    const [dep_ValidForm, setDep_ValidForm] = useState(false);
    const [dep_AddressError, setDep_AddressError] = useState('');

    useEffect(()=>{
      validateDepartmentAddressEmpForm();
    },[emp_depAddress]);

    useEffect(()=> {
      if (!emp_AddressError && emp_accountName){
        setEmp_ValidForm(true);
      }
      else{
        setEmp_ValidForm(false);
      }
    }, [emp_AddressError, emp_accountName]);

    //--------
    useEffect(()=>{
      validateDepartmentAddressDeptForm();
    },[dep_depAddress]);

    useEffect(()=> {
      if (!dep_AddressError && dep_accountName){
        setDep_ValidForm(true);
      }
      else{
        setDep_ValidForm(false);
      }
    }, [dep_AddressError, dep_accountName]);

    const validateDepartmentAddressEmpForm = async() => {
      try{
        let testContract = new web3.eth.Contract(departmentABI, emp_depAddress);
        let testresponse = await testContract.methods.getDepartmentStruct().call();
        //checking if it is the instance of department by calling a function that is only present in department contract.
        console.log("VALID, NO ERROR");
        setEmp_AddressError('');
      }catch(error){
        console.log("INVALID, ERROR");
        setEmp_AddressError(error);
      }
    }
    const validateDepartmentAddressDeptForm = async() => {
      try{
        let testContract = new web3.eth.Contract(departmentABI, dep_depAddress);
        let testresponse = await testContract.methods.getDepartmentStruct().call();
        //checking if it is the instance of department by calling a function that is only present in department contract.
        console.log("VALID, NO ERROR");
        setDep_AddressError('');
      }catch(error){
        console.log("INVALID, ERROR");
        setDep_AddressError(error);
      }
    }

    const getEmployeeForm = () => {
        return (
        <form class="form-horizontal container" role="form">
        <div class="form-group row my-3">
          <div class="col-sm-11">
            <input type="text" class="form-control select2-offscreen" id="parentAdddress" placeholder="Parent department address" tabIndex="-1"
                value={emp_depAddress} 
                onChange={(event) => setEmp_depAddress(event.target.value)}
            />
          </div>
          <div class="col-sm-1">
                  {!emp_AddressError && 
                    <div title={"Valid"} data-toggle="popover" data-trigger="hover" data-content="Some content"><TiTick color='green'/></div>
                  }
                  {emp_AddressError && 
                    <div title={emp_AddressError} data-toggle="popover" data-trigger="hover" data-content="Some content"><BsExclamation color='red'/></div>
                  }
              </div>
        </div>
        <div class="form-group row my-3">
            <div class="col-sm-11">
                <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Employee name" tabIndex="-1"
                    value={emp_accountName} 
                    onChange={(event) => setEmp_accountName(event.target.value)}
                />
            </div>
            <div class="col-sm-1">
              </div>
        </div>
        <div class="form-group row my-3 justify-content-center">
            {/* <div class="col-sm-9"></div> */}
            <div class="col-sm-12">
                <button disabled={!emp_ValidForm} class="btn btn-success mx-1" onClick={registerEmployee}>Register</button>
            </div>
        </div>
      </form>
        );
    }

    const getDepartmentForm = () => {
        return (
        <form class="form-horizontal container" role="form">
        <div class="form-group row my-3">
          <div class="col-sm-11">
            <input type="text" class="form-control select2-offscreen" id="parentAdddress" placeholder="Parent department address" tabIndex="-1"
                value={dep_depAddress} 
                onChange={(event) => setDep_depAddress(event.target.value)}
            />
          </div>
          <div class="col-sm-1">
                  {!dep_AddressError && 
                    <div title={"Valid"} data-toggle="popover" data-trigger="hover" data-content="Some content"><TiTick color='green'/></div>
                  }
                  {dep_AddressError && 
                    <div title={dep_AddressError} data-toggle="popover" data-trigger="hover" data-content="Some content"><BsExclamation color='red'/></div>
                  }
              </div>
        </div>
        <div class="form-group row my-3">
            <div class="col-sm-11">
                <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Department name" tabIndex="-1"
                    value={dep_accountName} 
                    onChange={(event) => setDep_accountName(event.target.value)}
                />
            </div>
            <div class="col-sm-1">
              </div>
        </div>
        <div class="form-group row my-3 justify-content-center">
            {/* <div class="col-sm-9"></div> */}
            <div class="col-sm-12">
                <button disabled={!dep_ValidForm} class="btn btn-success mx-1" onClick={registerDepartment}>Register</button>
            </div>
        </div>
      </form>
        );
    }

    const registerEmployee = async(event) => {
      //emp_depAddress, emp_accountName
      event.preventDefault();
      let accounts = await web3.eth.getAccounts();

      let errorMessage = '';

      toast.info('Registering as employee', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        });
        console.log(accounts);
        try{
      // await AccountManagerAudit.methods.registerEmployee(emp_depAddress, emp_accountName).send({
        await AccountManagerAudit.methods.register(emp_depAddress, emp_accountName, AccountType.EMPLOYEE).send({
        from: accounts[0]
      }).then((response)=>{
        toast.success('Registered as employee!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
          });
          navigate('/');
      }).catch((error)=>{
        console.log("ERROR:");
        console.log(error);
        // errorMessage = error.message;
        toast.error(error.message, {
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
    catch(error) {
      // console.log("error: ");
      // console.log(error);
      // console.log("errormessage: ");
      // console.log(error.message);
      console.log("ERROR: "+error);
        toast.error('Cound not register!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
          });
      }
      //registerEmployee
    }
    const registerDepartment = async(event) => {
      //registerDepartment
      event.preventDefault();
      let accounts = await web3.eth.getAccounts();

      let errorMessage = '';

      toast.info('Registering as department', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        });
        console.log(accounts);
        try{
      // await AccountManagerAudit.methods.registerDepartment(dep_depAddress, dep_accountName).send({
      await AccountManagerAudit.methods.register(dep_depAddress, dep_accountName, AccountType.DEPARTMENT).send({
        from: accounts[0]
      }).then((response)=>{
        toast.success('Registered as departmnet!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
          });
          navigate('/');
      }).catch((error)=>{
        console.log("ERROR:");
        console.log(error);
        // errorMessage = error.message;
        toast.error(error.message, {
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
      // console.log("Outside:---------");
      // console.log(errorMessage);
    }
    catch(error) {
      // console.log("error: ");
      // console.log(error);
      // console.log("errormessage: ");
      // console.log(error.message);
      console.log("ERROR: "+error);
        toast.error('Cound not register!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
          });
      }
    }


  return (
    <div class="form-horizontal container" role="form">
          {/* <p>Reference: {refernceMail}</p> */}
        <p class="text-center">You are not registered.</p>
        <p class="text-center">Register yourself as : 
            <span>
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => setActiveForm(1)}/>
                <label class="form-check-label" for="flexRadioDefault1">
                    Employee 
                </label>
            </span>
            <span>
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => setActiveForm(2)}/>
                <label class="form-check-label" for="flexRadioDefault1">
                    Department 
                </label>
            </span>
        </p>
        {activeForm==1 ? getEmployeeForm(): activeForm==2 ? getDepartmentForm(): <></>}
        {/* <ToastContainer /> */}
      </div>
  )
}

export default Register