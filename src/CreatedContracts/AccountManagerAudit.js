import web3 from '../web3';
// const { abi, evm } = require('./compile');
import AccountManagerABI from '../ABIs/AccountManagerAuditABI';

const address = "0x3038c429995Ac71112d3048E199c1BCB6f85DEdf";
//0x9C5d1bb3F269CEe1ff6709d9A989532f9834Ca6f
//0xB3D2CfA8A3917faAe4fc0E04697E06dCc4820842
//0xb13f8cc24594DA29B69aE7816E7380E537FD5FB0
//0x54CfB44BD55ACB28A22807D723807b2D8271B945
//0x27eb60cF896CC54962f5A74eDEC5a2765aBFe9dE
//0x623264917967fA8Fe2Cacb41402c10dCFE9502C6
//0xf2D71d48c3851703d36165D7aB562D940a45AE5B
//0xa14Cb225a946891D855E14DBaFb7f526eF11763C
//0x796bf25B412313A4bA6075A54015e4d05488369c
//0x7064e334Ee4653318Cd5Bb039930F25977CAb151
//0x41997cC330a7F2C538a7Eb87D8099B72c2CE9393
//0xd897A787Dad9e0e6B178aB67FE35BFF3419daEaa
//0x7d2EcD7Fe120B278596Be90F60D60FA3AEc3e73e

// console.log(address);

export default new web3.eth.Contract(AccountManagerABI, address);