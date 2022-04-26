import logo from './logo.svg';
import './App.css';
import './components/TopNavBar.js';
import TopNavBar from './components/TopNavBar.js';
import SignupComponent from './components/SignupComponent';

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
      <SignupComponent/>
      <Routes>
        <Route path="/login" element={<></>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
