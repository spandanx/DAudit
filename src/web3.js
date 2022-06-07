import Web3 from "web3";
var web3;

if (window.ethereum && window.ethereum.isMetaMask){
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
}
else{
    alert("Please install MetaMask");
}

export default web3;