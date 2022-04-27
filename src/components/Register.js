import React, {useState} from 'react';
import { TiTick } from "react-icons/ti";
import { BsExclamation } from "react-icons/bs";

const Register = () => {

    // let activeForm = 0;
    const [activeForm, setActiveForm] = useState(0);
    const [acc_depAddress, setAcc_depAddress] = useState('');
    const [acc_accountName, setAcc_accountName] = useState('');
    const [acc_ValidForm, setAcc_ValidForm] = useState(false);
    const [acc_DepAddressError, setAcc_DepAddressError] = useState('');

    const [dep_depAddress, setDep_depAddress] = useState('');
    const [dep_accountName, setDep_accountName] = useState('');
    const [dep_ValidForm, setDep_ValidForm] = useState(false);
    const [dep_AddressError, setDep_AddressError] = useState('');

    const getAccountForm = () => {
        return (
        <form class="form-horizontal container" role="form">
        <div class="form-group row my-3">
          <div class="col-sm-11">
            <input type="text" class="form-control select2-offscreen" id="parentAdddress" placeholder="Parent department address" tabIndex="-1"
                value={acc_depAddress} 
                onChange={(event) => setAcc_depAddress(event.target.value)}
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
                <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Account name" tabIndex="-1"
                    value={acc_accountName} 
                    onChange={(event) => setAcc_accountName(event.target.value)}
                />
            </div>
            <div class="col-sm-1">
              </div>
        </div>
        <div class="form-group row my-3 justify-content-center">
            {/* <div class="col-sm-9"></div> */}
            <div class="col-sm-12">
                <button disabled={!acc_ValidForm} class="btn btn-success mx-1" onClick={() => register()}>Register</button>
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
                  {!acc_DepAddressError && 
                    <div title={"Valid"} data-toggle="popover" data-trigger="hover" data-content="Some content"><TiTick color='green'/></div>
                  }
                  {acc_DepAddressError && 
                    <div title={acc_DepAddressError} data-toggle="popover" data-trigger="hover" data-content="Some content"><BsExclamation color='red'/></div>
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
                <button disabled={!dep_ValidForm} class="btn btn-success mx-1" onClick={() => register()}>Register</button>
            </div>
        </div>
      </form>
        );
    }

    const register = () => {

    }


  return (
    <div class="form-horizontal container" role="form">
          {/* <p>Reference: {refernceMail}</p> */}
        <p class="text-center">You are not registered.</p>
        <p class="text-center">Register yourself as : 
            <span>
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => setActiveForm(1)}/>
                <label class="form-check-label" for="flexRadioDefault1">
                    Account 
                </label>
            </span>
            <span>
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => setActiveForm(2)}/>
                <label class="form-check-label" for="flexRadioDefault1">
                    Department 
                </label>
            </span>
        </p>
        {activeForm==1 ? getAccountForm(): activeForm==2 ? getDepartmentForm(): <></>}
      </div>
  )
}

export default Register