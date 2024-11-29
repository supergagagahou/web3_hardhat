// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract TYX is ERC20, ERC20Permit {
    constructor(address recipient) ERC20("TYX", "TYX") ERC20Permit("TYX") {
        uint256 initialSupply = 150000 * 10 ** decimals();
        uint256 allocatedToRecipient = 10000 * 10 ** decimals();
        
        // Mint full supply to deployer's address
        _mint(msg.sender, initialSupply - allocatedToRecipient);
        
        // Allocate specific amount to the recipient address
        _mint(recipient, allocatedToRecipient);
    }
}
