// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./lib/IERC20.sol";

// i, j, k <- {0, 1, 2, 3, 4}, where i != j AND j != k AND i != k
// [DEPLOYMENT ARGUMENTS] from: owner
/* [VALID SEQ #1] mint <accounts[i], , (10)> :: transfer <accounts[i], , (accounts[j], 10)> 
   [VALID SEQ #2] mint <accounts[i], , (10)> 
		  :: approve <accounts[i], , (accounts[j], 10)>
		  :: transferFrom <accounts[j], , (accounts[i], accounts[k], 10)>
   [VALID SEQ #3] mint <accounts[i], , (10)> :: burn <accounts[i], , (10)> 
*/

contract ERC20 is IERC20 {
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    string public name = "Solidity by Example";
    string public symbol = "SOLBYEX";
    uint8 public decimals = 18;

    function transfer(address recipient, uint amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(uint amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}

