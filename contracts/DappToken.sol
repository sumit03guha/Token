// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

contract DappToken {
    
    uint public totalSupply;
    string public name = 'DApp Token';
    string public symbol = 'DAPP';
    string public standard = 'DApp Token v1.0';
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint indexed _value
        );
    
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint indexed _value
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
    
    function approve(address _spender, uint _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
   
   function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
       require(_value <= allowance[_from][msg.sender]);
       require(_value <= balanceOf[_from]);
       
       balanceOf[_from] -= _value;
       balanceOf[_to] += _value;
       
       allowance[_from][msg.sender] -= _value;
       
       emit Transfer(_from , _to , _value);
       return true;
   }
       
}