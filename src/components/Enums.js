const AccountType = { EMPLOYEE:0, DEPARTMENT:1, AUDITOR:2 };

const AccountTypeReverse = {0:"EMPLOYEE", 1:"DEPARTMENT", 2:"AUDITOR" };

const Status = { OPEN:0, ACCEPTED:1, REJECTED:2 };
const StatusReverse = { 0:"OPEN", 1:"ACCEPTED", 2:"REJECTED" };
const Action = { REJECT:0, APPROVE:1 };
// const ActionReverse = { 0:"REJECT", 1:"APPROVE" };
const ApprovalStatusReverse = {0:"DOES_NOT_EXISTS", 1:"EXISTS", 2:"ACCEPTED", 3:"REJECTED"}

export {AccountType, Status};
export {AccountTypeReverse};
export {StatusReverse};
export {Action};
export {ApprovalStatusReverse};