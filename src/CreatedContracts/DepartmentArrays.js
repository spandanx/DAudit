import web3 from '../web3';
import DepartmentArraysABI from '../ABIs/DepartmentArraysABI';

const address = "0x881571507b255D2d7a372d5778fB1aB382e428ff";

export default new web3.eth.Contract(DepartmentArraysABI, address);