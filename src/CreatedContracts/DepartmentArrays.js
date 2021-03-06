import web3 from '../web3';
import DepartmentArraysABI from '../ABIs/DepartmentArraysABI';

const address = "0xE6Bb3b0f27f73E2E40301f90c06D7A36916f6FA3";
//0x77776C47A2Af9D638B9a34d658497ee18c761DB1
//0xFae84D4a83b19bD845ea5A4327b76b463e339EF2
//0x5139f3CFF5cc975bB84F53818591c01B90749cF7
//0x84345a92377877732E1Bb935aeDcEFDFe3862D95
//0x4704Ef2CDe2276D389CdA864C8381cdAb5A514d4
//0x881571507b255D2d7a372d5778fB1aB382e428ff

export default new web3.eth.Contract(DepartmentArraysABI, address);