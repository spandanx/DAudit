# DECENTRALISED AUDIT APPLICATION

This application is to track the transfer of funds(or bills) between different departments for different projects.

## Technologies used

1. Smart Contracts
2. Solidity
3. Metamask
4. Rinkeby test network
5. React.js

## Steps to run locally

1. Clone the repository
2. Install required softwares
3. Deploy required contracts
4. Start the react application

### Step 1. Clone the repository

`git clone https://github.com/spandanx/DAudit.git`


### Step 2. Install required softwares

`Node.js`
`Metamask chrome extension`

### Step 3. Deploy required contracts

`1. AccountManagerAudit.sol`
`2. BillManager.sol`
`3. DepartmentArrays.sol`
`4. VoteManager.sol`


## 1. AccountManagerAudit.sol

`Open AccountManagerAudit.sol file in remix IDE`

![AccountManagerAuditFile](https://user-images.githubusercontent.com/56664469/169008436-9935639b-4fad-4214-87ae-4d1b8151aec6.PNG)

`Deploy the file in rinkeby test network using metamask`

![AccountManagerAuditFileDeploy](https://user-images.githubusercontent.com/56664469/169008506-00b2a205-8ad8-4bda-b1b7-2c08d381c8d3.PNG)

`copy the address`

![AccountManagerAuditCopyAddress](https://user-images.githubusercontent.com/56664469/169008669-57661904-775b-48d3-b7bd-921a16e43251.PNG)

`replace the address in the AccountManagerAudit.js file under CreatedContracts folder`

![AccountManagerAuditGitLocation](https://user-images.githubusercontent.com/56664469/169008761-0120276e-b239-456f-ba27-11e012671a64.PNG)

![AccountManagerAuditReplaceAddress](https://user-images.githubusercontent.com/56664469/169008832-7752e9d2-b04f-4427-9cb5-0cd2a5519a3c.PNG)

## 2. BillManager.sol

`Open BillManager.sol file in remix IDE`

`Deploy the contract in the rinkeby network providing the address of the AccountManagerAudit Contract`
![BillManagerCreateContract](https://user-images.githubusercontent.com/56664469/169010950-b4e60765-2df8-49a5-b6b5-2add0259b030.PNG)

`Similarly replace the contract address in the BillManager.js file under the CreatedContracts folder`
![BillManagerReplaceAddress](https://user-images.githubusercontent.com/56664469/169011134-5635babd-68aa-4e4d-94c6-ede6996c4055.PNG)

## 3. DepartmentArrays.sol
`Similarly create contract, this contract can be created with no parameters`

`replace the address`

## 4. VoteManager.sol
`Similarly create this contract and replace address`

### Step 4. Start the react application

`go to directory`

`npm install`

`npm start run`

### ER Diagram

![AuditDepartmentStructure (2)](https://user-images.githubusercontent.com/56664469/168956124-86166b7c-d9c4-4db5-a894-f8d3f766a6a3.jpg)

### Sample Department Hierarchy

![DepartmentHierarchy](https://user-images.githubusercontent.com/56664469/168852488-264b83a2-df68-4c55-ae9b-0eee02b79144.PNG)

### Flow of funds diagram

![FundCycle (1)](https://user-images.githubusercontent.com/56664469/169005436-03a9fdc9-f15e-4fdb-bedc-efb1d10861c2.jpg)
