// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

contract DappToken {
    
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    string public name = 'DApp Token';
    string public symbol = 'DAPP';
    string public standard = 'DApp Token v1.0';
    
    constructor(uint _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
    
    
}