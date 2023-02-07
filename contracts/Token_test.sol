// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <=0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/* zobacz czy potem sie nie przyda 
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
*/

contract Token_test is ERC20 {
    uint256 totalSupplly = 0;
    constructor(uint256 initialSupply) ERC20("TTPSC Money", "$TTPSC") {
        _mint(msg.sender, initialSupply);
        totalSupplly = initialSupply;
    }
}


