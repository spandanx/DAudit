import React, {useState, useEffect} from 'react'
import web3 from '../web3';
import AccountManagerAudit from '../AccountManagerAudit';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TopNavBar = () => {

  const navigate = useNavigate();

  const address0 = "0x0000000000000000000000000000000000000000";
  // const [accountType, setAccountType] = useState('');

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

  const checkIfAccountsExists = async() => {
    console.log("Calling checkIfAccountsExists()");
    let accounts = await web3.eth.getAccounts();
    // console.log("ACCOUNTS");
    // console.log(accounts);
    if (accounts.length==0){
      navigate("/not-found");
      return;
    }
    let errors = 0;
    // try{
      await AccountManagerAudit.methods.departments(accounts[0]).call().then(function(response) {
        // setAccountType(employeeString);
        console.log("Department found");
        console.log(response);
        if (response!=address0)
          navigate('/department', {state: {depAddress:response}});
        else
          errors++;
      }).catch((err) => {
        // console.log("Department not found!");
        // errors++;
      });
      await AccountManagerAudit.methods.employees(accounts[0]).call().then(function(response) {
        // setAccountType(departmentString);
        // console.log("Employee found!");
        if (response!=address0)
          navigate('/employee', {state: {empAddress:response}});
        else
          errors++;
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
      navigate('/register');
    }
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
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
      </div>
    </nav>
  )
}

export default TopNavBar