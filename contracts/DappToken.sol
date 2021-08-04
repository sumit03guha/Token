// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

contract DappToken {
    
    uint public totalSupply;
    string public name = 'DApp Token';
    string public symbol = 'DAPP';
    string public standard = 'DApp Token v1.0';
    mapping(address => uint) public balanceOf;
    
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
        );
    
    constructor(uint _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
    
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender , _to , _value);
        return true;
    }
    
}