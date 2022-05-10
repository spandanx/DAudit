import web3 from '../web3';
import DepartmentArraysABI from '../ABIs/DepartmentArraysABI';

const address = "0x5139f3CFF5cc975bB84F53818591c01B90749cF7";
//0x84345a92377877732E1Bb935aeDcEFDFe3862D95
//0x4704Ef2CDe2276D389CdA864C8381cdAb5A514d4
//0x881571507b255D2d7a372d5778fB1aB382e428ff

export default new web3.eth.Contract(DepartmentArraysABI, address);