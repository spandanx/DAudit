import React, {useState} from 'react';

const Department = () => {

  const billArr = [
    {
      name: "BillName",
      description:"Some desc",
      threshold:"70",
      imagePath:"imagePath",
      partiesAccepted:0,
      partiesRejected:0,
      deadline:110022,
      status:"OPEN",
      amount: 20
    },
    {
      name: "BillName",
      description:"Some desc",
      threshold:"70",
      imagePath:"imagePath",
      partiesAccepted:0,
      partiesRejected:0,
      deadline:110022,
      status:"OPEN",
      amount: 20
    },
    {
      name: "BillName",
      description:"Some desc",
      threshold:"70",
      imagePath:"imagePath",
      partiesAccepted:0,
      partiesRejected:0,
      deadline:110022,
      status:"OPEN",
      amount: 20
    }
  ];

  const [bills, setBills] = useState(billArr);

  return (
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-1">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" href="#">Approvals</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Bills</a>
            </li>
          </ul>
        </div>
        <div class="col-md-11">
        {billArr.map((bill)=> (
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
      </div>
  </div>
  )
}

export default Department