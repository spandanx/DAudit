const { expect } = require("chai");
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
describe("Voting test", () => {
  let govt, dep1;
  let accountManagerAudit, depContract;
  beforeEach(async()=>{
    [govt, dep1, _] = await ethers.getSigners();
    let tster = await ethers.getContractFactory("TestTransferCoin");
    tester1 = await tster.deploy();
    await tester1.deployed();
  });
  it("Should approve vote", async()=>{

  });
});

// describe("approval test", function() {
//   let accountManagerAudit;
//   let library;
//   let admin, employee, auditor, department;
//   const AccountType = { EMPLOYEE:0, DEPARTMENT:1, AUDITOR:2 };
//   const Action = { REJECT:0, APPROVE:1 };

//   beforeEach (async function () {
//     [admin, employee, auditor, department,_] = await ethers.getSigners();
//     // console.log(admin);
//     const Library = await ethers.getContractFactory("StructLibrary");
//     library = await Library.deploy();
//     await library.deployed();

//     const accM = await ethers.getContractFactory("AccountManagerAudit",
//     {
//       libraries: {
//         StructLibrary: library.address,
//       },
//     }
//     );
//     accountManagerAudit = await accM.deploy("Govt");
//     await accountManagerAudit.deployed();
//   });

//   it("Should approve auditor registraction", async function () {
//     let depAddress = await accountManagerAudit.departments(admin.address);
//     await accountManagerAudit.connect(auditor).register(depAddress, "Auditor 1", AccountType.AUDITOR);

//     const depManager = await ethers.getContractFactory("DepartmentManager",
//     {
//       libraries: {
//         StructLibrary: library.address,
//       },
//     });
//     let approvals = await depManager.attach( depAddress ).getApprovals(10, 0);
//     console.log(approvals);
//     expect(approvals.length).to.greaterThan(0);
//     expect(approvals[0].accountType).to.equal(AccountType.AUDITOR);
//     let approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
//     console.log(approvalStatus);
//     expect(approvalStatus).to.be.false;

//     let auditors = await depManager.attach( depAddress ).getAuditors(10, 0);
//     expect(auditors.length).to.equal(0);// before approving employee should not be pushed to the employee array

//     await accountManagerAudit.approve(approvals[0].parentDepartmentAddress, approvals[0].accountAddress, Action.APPROVE);
//     approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
//     console.log(approvalStatus);
//     expect(approvalStatus).to.be.true;

//     auditors = await depManager.attach( depAddress ).getAuditors(10, 0);
//     expect(auditors.length).to.equal(1);// after approving employee should be pushed to the employee array
//   });

//   it("Should approve department registraction", async function () {
//     let depAddress = await accountManagerAudit.departments(admin.address);
//     await accountManagerAudit.connect(department).register(depAddress, "Department1", AccountType.DEPARTMENT);

//     const depManager = await ethers.getContractFactory("DepartmentManager",
//     {
//       libraries: {
//         StructLibrary: library.address,
//       },
//     });
//     let approvals = await depManager.attach( depAddress ).getApprovals(10, 0);
//     console.log(approvals);
//     expect(approvals.length).to.greaterThan(0);// as approval pushed into approvals array
//     expect(approvals[0].accountType).to.equal(AccountType.DEPARTMENT);
//     let approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
//     console.log(approvalStatus);
//     expect(approvalStatus).to.be.false;//Before approving

//     let departments = await depManager.attach( depAddress ).getSubDepartments(10, 0);
//     expect(departments.length).to.equal(0);// before approving department should not be pushed to the department array

//     await accountManagerAudit.approve(approvals[0].parentDepartmentAddress, approvals[0].accountAddress, Action.APPROVE);
//     approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
//     console.log(approvalStatus);
//     expect(approvalStatus).to.be.true;//After approving

//     departments = await depManager.attach( depAddress ).getSubDepartments(10, 0);
//     console.log(departments);
//     expect(departments.length).to.equal(1);// after approving department should be pushed to the department array
//   });

//   it("Should approve employee registraction", async function () {
//     let depAddress = await accountManagerAudit.departments(admin.address);
//     await accountManagerAudit.connect(employee).register(depAddress, "Auditor 1", AccountType.EMPLOYEE);

//     const depManager = await ethers.getContractFactory("DepartmentManager",
//     {
//       libraries: {
//         StructLibrary: library.address,
//       },
//     });
//     let approvals = await depManager.attach( depAddress ).getApprovals(10, 0);
//     console.log(approvals);
//     expect(approvals.length).to.greaterThan(0);
//     expect(approvals[0].accountType).to.equal(AccountType.EMPLOYEE);
//     let approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
//     console.log(approvalStatus);
//     expect(approvalStatus).to.be.false;

//     let employees = await depManager.attach( depAddress ).getEmployees(10, 0);
//     expect(employees.length).to.equal(0);// before approving employee should not be pushed to the employee array

//     await accountManagerAudit.approve(approvals[0].parentDepartmentAddress, approvals[0].accountAddress, Action.APPROVE);
//     approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
//     console.log(approvalStatus);
//     expect(approvalStatus).to.be.true;

//     employees = await depManager.attach( depAddress ).getEmployees(10, 0);
//     expect(employees.length).to.equal(1);// after approving employee should be pushed to the employee array
//   });

//   it("Should reject department registraction", async function () {
//     let depAddress = await accountManagerAudit.departments(admin.address);
//     await accountManagerAudit.connect(department).register(depAddress, "Department1", AccountType.DEPARTMENT);

//     const depManager = await ethers.getContractFactory("DepartmentManager",
//     {
//       libraries: {
//         StructLibrary: library.address,
//       },
//     });
//     let approvals = await depManager.attach( depAddress ).getApprovals(10, 0);
//     console.log(approvals);
//     expect(approvals.length).to.greaterThan(0);// as approval pushed into approvals array
//     expect(approvals[0].accountType).to.equal(AccountType.DEPARTMENT);
//     let approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
//     console.log(approvalStatus);
//     expect(approvalStatus).to.be.false;//Before approving

//     let departments = await depManager.attach( depAddress ).getSubDepartments(10, 0);
//     expect(departments.length).to.equal(0);// before approving department should not be pushed to the department array

//     await accountManagerAudit.approve(approvals[0].parentDepartmentAddress, approvals[0].accountAddress, Action.REJECT);
//     approvalStatus = await accountManagerAudit.approvedStatus(approvals[0].accountAddress);
//     console.log(approvalStatus);
//     expect(approvalStatus).to.be.false;//After rejecting

//     departments = await depManager.attach( depAddress ).getSubDepartments(10, 0);
//     expect(departments.length).to.equal(0);// after rejecting department should not be pushed to the department array
//   });
// });
