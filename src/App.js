import logo from './logo.svg';
import './App.css';
import './components/TopNavBar.js';
import TopNavBar from './components/TopNavBar.js';
import Register from './components/Register';
import Department from './components/Department';
import Employee from './components/Employee';
import AccountNotFound from './components/AccountNotFound';
import AccountYetToApprove from './components/AccountYetToApprove';
import AccountRejected from './components/AccountRejected';

import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Link,
  Navigate
} from "react-router-dom";

function App() {
  return (
    <>
    <Router>
      <TopNavBar/>
      <div class="d-flex align-items-start mt-2">
        {/* <LeftNavBar/> */}
          <Routes>
            <Route path="/" element={<Register/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/to-be-approved" element={<AccountYetToApprove/>}/>
            <Route path="/rejected" element={<AccountRejected/>}/>
            <Route path="/department" element={<Department/>}/>
            <Route path="/employee" element={<Employee/>}/>
            <Route path="/not-found" element={<AccountNotFound/>}/>
          </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
