// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <=0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token_test is ERC20 {

    constructor(address contractAddress, uint256 initialSupply) ERC20("TTPSC Money", "$TTPSC") {
        _mint(contractAddress, initialSupply * (10 ** decimals()));
    }
}
