// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestTransferCoin {

    address public currentAddress = address(this);

    function getBalance(address contractAddress, address sender) public view returns (uint) {
        IERC20 token = IERC20(contractAddress);
        return token.balanceOf(sender);
    }
    function getSelfBalance(address contractAddress) public view returns (uint) {
        IERC20 token = IERC20(contractAddress);
        return token.balanceOf(address(this));
    }
    function transfer(address contractAddress, address to, uint amount) public {
        IERC20 token = IERC20(contractAddress);
        token.transfer(to, amount);
    }
}