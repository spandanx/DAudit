import logo from './logo.svg';
import './App.css';
import './components/TopNavBar.js';
import TopNavBar from './components/TopNavBar.js';
import LeftNavBar from './components/LeftNavBar';
import Register from './components/Register';

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
        <LeftNavBar/>
          <Routes>
          <Route path="/" element={<Register/>}/>
            <Route path="/register" element={<Register/>}/>
          </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
