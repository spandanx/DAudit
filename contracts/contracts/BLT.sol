// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BLT is ERC20 {
    constructor () ERC20("Bill Token", "BLT") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}