import web3 from '../web3';
// const { abi, evm } = require('./compile');
import AccountManagerABI from '../ABIs/AccountManagerAuditABI';

const address = "0xa14Cb225a946891D855E14DBaFb7f526eF11763C";
//0x796bf25B412313A4bA6075A54015e4d05488369c
//0x7064e334Ee4653318Cd5Bb039930F25977CAb151
//0x41997cC330a7F2C538a7Eb87D8099B72c2CE9393
//0xd897A787Dad9e0e6B178aB67FE35BFF3419daEaa
//0x7d2EcD7Fe120B278596Be90F60D60FA3AEc3e73e

// console.log(address);

export default new web3.eth.Contract(AccountManagerABI, address);