const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

// describe("token transfer test", () => {
//   let tester1, tester2, billCoin;
//   let sender, reciever1;

//   beforeEach (async function () {
    // [sender, reciever1, _] = await ethers.getSigners();
    // let tster = await ethers.getContractFactory("TestTransferCoin");
    // tester1 = await tster.deploy();
    // await tester1.deployed();
//     //------
//     tester2 = await tster.deploy();
//     await tester2.deployed();
//     //------
//     let blCoin = accountManagerAudit = await ethers.getContractFactory("BLT");
//     billCoin = await blCoin.deploy();
//     await billCoin.deployed();
//   });
//   it("Should get check the transfer of the token", async()=> {
//     console.log("billCoin.address: "+billCoin.address);
//     //0xc0Ddfa9AFFEdf49D15B74434f5271e91538730ff
//     // console.log(sender.address);
//     console.log("BEFORE:------------");
//     let balance = await tester1.getBalance(billCoin.address, sender.address);
//     console.log(balance);
//     let selfBalance = await tester1.getSelfBalance(billCoin.address);
//     console.log(selfBalance);
//     console.log("AFTER:------------");
//     await billCoin.transfer(tester1.address, 20);
//     balance = await tester1.getBalance(billCoin.address, sender.address);
//     console.log(balance);
//     selfBalance = await tester1.getSelfBalance(billCoin.address);
//     console.log(selfBalance);
//     console.log("CONTRACT TO CONTRACT:------------");
//     await tester1.transfer(billCoin.address, tester2.address, 10);
//     balance = await tester1.getBalance(billCoin.address, sender.address);
//     console.log(balance);
//     selfBalance = await tester1.getSelfBalance(billCoin.address);
//     console.log(selfBalance);
//     let selfBalance2 = await tester2.getSelfBalance(billCoin.address);
//     console.log(selfBalance2);
//   });
// });
describe("create bill", () => {
  let govt, dep1, emp1, emp2;
  let accountManagerAudit, billManager, billCoin, library, voteManager, depArraysManager;
  let accType,action,billAddress,rootDepartmentAddress,tokenAddress,initialbalance,department1Address;
  let balanceAfterBill,bill1Address,balanceofBill1,diff,childFund,billSize;
  beforeEach(async()=>{
    [govt, dep1, emp1, emp2, _] = await ethers.getSigners();

    let blCoin = accountManagerAudit = await ethers.getContractFactory("BLT");
    billCoin = await blCoin.deploy();
    await billCoin.deployed();

    const Library = await ethers.getContractFactory("StructLibrary");
    library = await Library.deploy();
    await library.deployed();
    // console.log("TEST1");
    let accM = await ethers.getContractFactory("AccountManagerAudit",
    {
      libraries: {
        StructLibrary: library.address,
      },
    }
    );
    // console.log("TEST2");
    accountManagerAudit = await accM.deploy("Govt");
    await accountManagerAudit.deployed();
    // console.log("TEST3");
    let billM = await ethers.getContractFactory("BillManager");
    billManager = await billM.deploy(accountManagerAudit.address);
    await billManager.deployed();
    // console.log("TEST4");
    let vm = await ethers.getContractFactory("VoteManager");
    voteManager = await vm.deploy();
    await voteManager.deployed();

    let depArrays = await ethers.getContractFactory("DepartmentArrays");
    depArraysManager = await depArrays.deploy();
    await depArraysManager.deployed();

    accType = {EMPLOYEE:0, DEPARTMENT:1, AUDITOR:2 };
    action = {REJECT:0, ACCEPT:1};

    // console.log("TEST");
    billAddress = await accountManagerAudit.billAddress();
    // console.log(billAddress); 
    rootDepartmentAddress = await accountManagerAudit.departments(govt.address);
    // console.log("TEST2");
    tokenAddress = await accountManagerAudit.tokenAddress();

    // let blCoin = await ethers.getContractFactory("BLT");
    initialbalance = await blCoin.attach( tokenAddress ).balanceOf(billAddress);

    await accountManagerAudit.connect(dep1).register(
      rootDepartmentAddress,
      "Department1",
      accType.DEPARTMENT
    );
    // console.log("TEST3");
    department1Address = await accountManagerAudit.departments(dep1.address);
    // console.log(accountManagerAudit.billAddress());
    // console.log("TEST4");
    // console.log(billManager);
    billSize = await depArraysManager.getBills(10,0,rootDepartmentAddress);
    console.log("BillSize: "+billSize);
    expect(billSize.length).to.equal(0);
    let transferTokenAmount = 200;
    await billManager.createBill(
      "Bill1",
      "Bill description",
      70,
      "Dummy",
      1651895311,
      transferTokenAmount,
      billAddress,
      rootDepartmentAddress,
      department1Address,
      tokenAddress
    );
    billSize = await depArraysManager.getBills(10,0,rootDepartmentAddress);
    expect(billSize.length).to.equal(1);
    // console.log("TEST5");
    console.log("Initial balance of govt Bill: "+initialbalance);
    balanceAfterBill  = await blCoin.attach( tokenAddress ).balanceOf(billAddress);
    console.log("balance of govt BIll after bill creation: "+balanceAfterBill);
    bill1Address = await accountManagerAudit.getBillByIndex(billAddress, 0);
    balanceofBill1  = await blCoin.attach( tokenAddress ).balanceOf(bill1Address);
    console.log("balance of bill1: "+balanceofBill1);
    // console.log("This");
    // console.log(initialbalance);
    // console.log("- this");
    // console.log(ethers.BigNumber.toNumber(balanceAfterBill));
    // console.log("should be equal to");
    // console.log(initialbalance.sub(balanceAfterBill));
    // console.log("should be true");
    diff = initialbalance.sub(balanceAfterBill);
    // console.log(diff.eq(balanceofBill1));
    expect(diff.eq(balanceofBill1)).to.be.true;
    childFund = await depArraysManager.getFunds(10, 0, department1Address);
    // console.log("childFunds");
    // console.log(childFund);
    expect(childFund.length).to.equal(0);
    //Registering and approving employee
    await accountManagerAudit.connect(emp1).register(
      rootDepartmentAddress,
      "Employee1",
      accType.EMPLOYEE
    );
  });
  it("Should approve vote", async()=>{
    let employeeAddress = await accountManagerAudit.employees(emp1.address);
    await accountManagerAudit.approve(rootDepartmentAddress, employeeAddress, action.ACCEPT);

    await voteManager.vote(bill1Address, action.ACCEPT, rootDepartmentAddress, tokenAddress, employeeAddress);
    childFund = await depArraysManager.getFunds(10, 0, department1Address);
    console.log("childFunds");
    console.log(childFund);
    expect(childFund.length).to.equal(1);
  });
  it("Should reject vote with one employee", async()=>{
    let employeeAddress = await accountManagerAudit.employees(emp1.address);
    await accountManagerAudit.approve(rootDepartmentAddress, employeeAddress, action.ACCEPT);

    await voteManager.vote(bill1Address, action.REJECT, rootDepartmentAddress, tokenAddress, employeeAddress);
    childFund = await depArraysManager.getFunds(10, 0, department1Address);
    console.log("childFunds");
    console.log(childFund);
    expect(childFund.length).to.equal(0);
  });
  it("Should not accept vote with two employee and one employee accepting", async()=>{
    await accountManagerAudit.connect(emp2).register(
      rootDepartmentAddress,
      "Employee1",
      accType.EMPLOYEE
    );
    let employeeAddress = await accountManagerAudit.employees(emp1.address);
    let employeeAddress2 = await accountManagerAudit.employees(emp2.address);
    await accountManagerAudit.approve(rootDepartmentAddress, employeeAddress, action.ACCEPT);
    await accountManagerAudit.approve(rootDepartmentAddress, employeeAddress2, action.ACCEPT);

    await voteManager.vote(bill1Address, action.ACCEPT, rootDepartmentAddress, tokenAddress, employeeAddress);
    childFund = await depArraysManager.getFunds(10, 0, department1Address);
    console.log("childFunds");
    console.log(childFund);
    expect(childFund.length).to.equal(0);
  });
  it("Same voter cannot vote again", async()=>{
    await accountManagerAudit.connect(emp2).register(
      rootDepartmentAddress,
      "Employee1",
      accType.EMPLOYEE
    );
    let employeeAddress = await accountManagerAudit.employees(emp1.address);
    let employeeAddress2 = await accountManagerAudit.employees(emp2.address);
    await accountManagerAudit.approve(rootDepartmentAddress, employeeAddress, action.ACCEPT);
    await accountManagerAudit.approve(rootDepartmentAddress, employeeAddress2, action.ACCEPT);

    await voteManager.vote(bill1Address, action.ACCEPT, rootDepartmentAddress, tokenAddress, employeeAddress);
    await expect(voteManager.vote(bill1Address, action.ACCEPT, rootDepartmentAddress, tokenAddress, employeeAddress)).to.be.revertedWith("Already voted");
  });
});

describe("approval test", function() {
  let accountManagerAudit;
  let library;
  let admin, employee, auditor, department, depArraysManager;
  // let depManagerContract;
  const AccountType = { EMPLOYEE:0, DEPARTMENT:1, AUDITOR:2 };
  const Action = { REJECT:0, APPROVE:1 };

  beforeEach (async function () {
    [admin, employee, auditor, department,_] = await ethers.getSigners();
    // console.log("HERE1");
    const Library = await ethers.getContractFactory("StructLibrary");
    library = await Library.deploy();
    await library.deployed();
    // console.log("HERE2");
    const accM = await ethers.getContractFactory("AccountManagerAudit",
    {
      libraries: {
        StructLibrary: library.address,
      },
    }
    );
    // console.log("HERE3");
    accountManagerAudit = await accM.deploy("Govt");
    await accountManagerAudit.deployed();
    // console.log("HERE4");

    const depArrays = await ethers.getContractFactory("DepartmentArrays");
    // console.log("HERE5");
    depArraysManager = await depArrays.deploy();
    await depArraysManager.deployed();
    // console.log("HERE6");

    // const depManager = await ethers.getContractFactory("DepartmentManager",
    // {
    //     libraries: {
    //       StructLibrary: library.address,
    //     },
    //   }
    // );
  });

  it("Should approve auditor registraction", async function () {
    let depAddress = await accountManagerAudit.departments(admin.address);
    await accountManagerAudit.connect(auditor).register(depAddress, "Auditor 1", AccountType.AUDITOR);
    // console.log("ALPHA1");
    // const depArraysManager = await ethers.getContractFactory("DepartmentArrays",
    // {
    //   libraries: {
    //     StructLibrary: library.address,
    //   },
    // });
    // console.log("ALPHA2");
    let approvals = await depArraysManager.getApprovals(10, 0, depAddress);
    // console.log(approvals);
    expect(approvals.length).to.greaterThan(0);
    expect(approvals[0].accountType).to.equal(AccountType.AUDITOR);
    let approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
    // console.log(approvalStatus);
    expect(approvalStatus).to.be.false;
    // console.log("ALPHA3");

    // let auditors = await depManager.attach( depAddress ).getAuditors(10, 0);
    let auditors = await depArraysManager.getAuditors(10, 0, depAddress);
    
    expect(auditors.length).to.equal(0);// before approving employee should not be pushed to the employee array
    // console.log("ALPHA4");
    await accountManagerAudit.approve(approvals[0].parentDepartmentAddress, approvals[0].accountAddress, Action.APPROVE);
    approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
    // console.log(approvalStatus);
    expect(approvalStatus).to.be.true;
    // console.log("ALPHA5");
    auditors = await depArraysManager.getAuditors(10, 0, depAddress);
    expect(auditors.length).to.equal(1);// after approving employee should be pushed to the employee array
  });

  it("Should approve department registraction", async function () {
    let depAddress = await accountManagerAudit.departments(admin.address);
    await accountManagerAudit.connect(department).register(depAddress, "Department1", AccountType.DEPARTMENT);
    // console.log("ALPHA1");

    let approvals = await depArraysManager.getApprovals(10, 0, depAddress);
    // console.log("ALPHA2");
    // console.log(approvals);
    expect(approvals.length).to.greaterThan(0);// as approval pushed into approvals array
    expect(approvals[0].accountType).to.equal(AccountType.DEPARTMENT);
    let approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
    // console.log(approvalStatus);
    expect(approvalStatus).to.be.false;//Before approving
    // console.log("ALPHA3");
    // let departments = await depManager.attach( depAddress ).getSubDepartments(10, 0);
    let departments = await depArraysManager.getSubDepartments(10, 0, depAddress);
    expect(departments.length).to.equal(0);// before approving department should not be pushed to the department array

    await accountManagerAudit.approve(approvals[0].parentDepartmentAddress, approvals[0].accountAddress, Action.APPROVE);
    approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
    console.log(approvalStatus);
    expect(approvalStatus).to.be.true;//After approving
    // console.log("ALPHA4");
    // console.log(depManager);
    departments = await depArraysManager.getSubDepartments(10, 0, depAddress);
    // console.log(departments);
    // console.log("ALPHA5");
    expect(departments.length).to.equal(1);// after approving department should be pushed to the department array
    // let depStrct = await depManager.attach(departments[0]).getDepartmentStruct();
    // console.log(depStrct);
  });

  it("Should approve employee registraction", async function () {
    let depAddress = await accountManagerAudit.departments(admin.address);
    await accountManagerAudit.connect(employee).register(depAddress, "Auditor 1", AccountType.EMPLOYEE);

    let approvals = await depArraysManager.getApprovals(10, 0, depAddress);
    // console.log(approvals);
    expect(approvals.length).to.greaterThan(0);
    expect(approvals[0].accountType).to.equal(AccountType.EMPLOYEE);
    let approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
    // console.log(approvalStatus);
    expect(approvalStatus).to.be.false;

    let employees = await depArraysManager.getEmployees(10, 0, depAddress);
    expect(employees.length).to.equal(0);// before approving employee should not be pushed to the employee array

    await accountManagerAudit.approve(approvals[0].parentDepartmentAddress, approvals[0].accountAddress, Action.APPROVE);
    approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
    // console.log(approvalStatus);
    expect(approvalStatus).to.be.true;

    employees = await depArraysManager.getEmployees(10, 0, depAddress);
    expect(employees.length).to.equal(1);// after approving employee should be pushed to the employee array
  });

  it("Should reject department registraction", async function () {
    let depAddress = await accountManagerAudit.departments(admin.address);
    await accountManagerAudit.connect(department).register(depAddress, "Department1", AccountType.DEPARTMENT);
    // console.log("ALPHA1");

    let approvals = await depArraysManager.getApprovals(10, 0, depAddress);
    // console.log("ALPHA2");
    // console.log(approvals);
    expect(approvals.length).to.greaterThan(0);// as approval pushed into approvals array
    expect(approvals[0].accountType).to.equal(AccountType.DEPARTMENT);
    let approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
    // console.log(approvalStatus);
    expect(approvalStatus).to.be.false;//Before approving
    // console.log("ALPHA3");
    // let departments = await depManager.attach( depAddress ).getSubDepartments(10, 0);
    let departments = await depArraysManager.getSubDepartments(10, 0, depAddress);
    expect(departments.length).to.equal(0);// before approving department should not be pushed to the department array

    await accountManagerAudit.approve(approvals[0].parentDepartmentAddress, approvals[0].accountAddress, Action.REJECT);
    approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
    // console.log(approvalStatus);
    expect(approvalStatus).to.be.false;//After rejecting
    // console.log("ALPHA4");
    // console.log(depManager);
    departments = await depArraysManager.getSubDepartments(10, 0, depAddress);
    // console.log(departments);
    // console.log("ALPHA5");
    expect(departments.length).to.equal(0);// after rejecting department should not be pushed to the department array
  });
});
