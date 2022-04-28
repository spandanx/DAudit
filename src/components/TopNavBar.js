import React, {useState, useEffect} from 'react'
import web3 from '../web3';
import AccountManagerAudit from '../AccountManagerAudit';
import { useNavigate } from "react-router-dom";

const TopNavBar = () => {

  const navigate = useNavigate();
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
    checkIfAccountsExists();
  });

  const checkIfAccountsExists = async() => {
    console.log("Calling checkIfAccountsExists()");
    let accounts = await web3.eth.getAccounts();
    let errors = 0;
    // try{
      await AccountManagerAudit.methods.getDepartmentAddress().call({
        from: accounts[0]
      }).then(function(response) {
        // setAccountType(employeeString);
        // console.log("Department found");
        navigate('/department');
      }).catch((err) => {
        // console.log("Department not found!");
        errors++;
      });
      await AccountManagerAudit.methods.getEmployeeAddress().call({
        from: accounts[0]
      }).then(function(response) {
        // setAccountType(departmentString);
        // console.log("Employee found!");
        navigate('/employee');
      }).catch((err) => {
        // console.log("Employee not found!");
        errors++;
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
  
  return (
    <div>
        {/* <Notification/> */}
        {/* <Link to="/login" className="text-decoration-none"> */}
          <nav className="navbar navbar-light bg-light">
              <div className="container-fluid">
                  <a className="navbar-brand">DAudit</a>
              </div>
          </nav>
        {/* </Link> */}
      </div>
  )
}

export default TopNavBar