// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import "./DappToken.sol";

contract DappTokenSale {
    
    address admin;
    DappToken public tokenContract;
    uint public tokenPrice;
    
    constructor(DappToken _tokenContract, uint _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

}