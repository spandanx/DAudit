const AccountType = { EMPLOYEE:0, DEPARTMENT:1, AUDITOR:2 };

const AccountTypeReverse = {0:"EMPLOYEE", 1:"DEPARTMENT", 2:"AUDITOR" };

const Status = { OPEN:0, ACCEPTED:1, REJECTED:2 };
const StatusReverse = { 0:"OPEN", 1:"ACCEPTED", 2:"REJECTED" };
const Action = { REJECT:0, APPROVE:1 };
// const ActionReverse = { 0:"REJECT", 1:"APPROVE" };
const ApprovalStatusReverse = {0:"DOES_NOT_EXISTS", 1:"EXISTS", 2:"ACCEPTED", 3:"REJECTED"};

// BILLS, FUNDS, SUBDEPARTMENTS, EMPLOYEES, AUDITORS, APPROVALS, MERGE_REQUESTS, MERGE_BILLS
const DepartmentArrayType = { BILLS:0, FUNDS:1, SUBDEPARTMENTS:2, EMPLOYEES:3, AUDITORS:4,APPROVALS:5, MERGE_REQUESTS:6, MERGE_BILLS:7 };

const VoteReverse = { 0:"DID_NOT_VOTE", 1:"REJECTED", 2:"ACCEPTED" };
const Vote = { DID_NOT_VOTE:0, REJECTED:1, ACCEPTED:2 };

const tokenName = "BLT";
const DEPARTMENT_VERSION = "11";

const pageSize = 5;

export {pageSize, VoteReverse, Vote, AccountType, Status, AccountTypeReverse, StatusReverse, Action, ApprovalStatusReverse, DepartmentArrayType, tokenName, DEPARTMENT_VERSION};