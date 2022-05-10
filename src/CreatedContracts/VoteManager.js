import web3 from '../web3';
import voteManagerABI from '../ABIs/VoteManagerABI';

const address = "0x9A41fA0a8221e8d5330C96461545ff3BE1e6eeb4";
//0x67C5B903120b4AA260E16D670DA5Bd1eD2EBB3a6
//0x021BBF3F5606460fbfBc0774766C7DbEaC553b08
//0x6A31aDf603864e91E67fD42F604a886142Eb8Bc6

export default new web3.eth.Contract(voteManagerABI, address);