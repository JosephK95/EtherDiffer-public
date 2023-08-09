// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// i <- {0, 1, 2, 3, 4}
/* [DEPLOYMENT ARGUMENTS] from: accounts[i], arguments: []
   [VALID SEQ #1] receive <accounts[i], 2 Ether, ()> 
	          :: getBalance <accounts[i], , ()>  
		  :: withdraw <accounts[i], , (1 Ether)> 
*/
// [NOTE] This contract should be deployed per account

contract EtherWallet {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    function withdraw(uint _amount) external {
        require(msg.sender == owner, "caller is not owner");
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}

