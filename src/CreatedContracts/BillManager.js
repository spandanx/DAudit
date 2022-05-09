import web3 from '../web3';
// const { abi, evm } = require('./compile');
import BillManagerABI from '../ABIs/BillManagerABI';

const address = "0xbAfC0a898df46132AB37407F6f5567757E58215A";
//0x2522d8A843057A4835f6F81b25EF509AE538d88B
//0x43F43B8206566D873856852FBf940E3b19766f1e

// console.log(address);

export default new web3.eth.Contract(BillManagerABI, address);