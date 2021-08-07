// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import "./DappToken.sol";

contract DappTokenSale {
    
    address admin;
    DappToken public tokenContract;
    uint public tokenPrice;
    uint public tokensSold;
    
    event Sell (
        address _buyer,
        uint _amount
        );
    
    constructor(DappToken _tokenContract, uint _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
    
    modifier _onlyAdmin {
        require(msg.sender == admin);
        _;
    }
    
    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
    
    function buyToken(uint _numberOfTokens) public payable {
        require(msg.value == mul(_numberOfTokens , tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;
        
        emit Sell(msg.sender, _numberOfTokens);
    }
    
    function endSale() public _onlyAdmin {
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        selfdestruct(payable(address(admin)));
    }

}