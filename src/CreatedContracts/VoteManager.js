import web3 from '../web3';
import voteManagerABI from '../ABIs/voteManagerABI';

const address = "0x6A31aDf603864e91E67fD42F604a886142Eb8Bc6";

export default new web3.eth.Contract(voteManagerABI, address);