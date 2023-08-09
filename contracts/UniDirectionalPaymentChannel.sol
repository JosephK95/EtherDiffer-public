// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./lib/ECDSA.sol";

// i, j <- {0, 1, 2, 3, 4}, where i != j
// [DEPLOYMENT ARGUMENTS] from: owner, 
/* [VALID SEQ #1] init <accounts[i], 1 Ether, (accounts[j])>
		  :: getHash <accounts[j], , (1 Ether)>
		  :: getEthSignedHash <accounts[j], , (1 Ether)>
		  :: verify <accounts[j], , (1 Ether, SIG(i))>
		  :: close <accounts[j], , (1 Ether, SIG(i))>
   [VALID SEQ #2] init <accounts[i], 1 Ether, (accounts[j])>
		  :: cancel <accounts[i], , ()>
*/
// [NOTE] 'SIG(n)' is the signature of 'abi.encodePacked(address(this), 1 Ether)',
// 	   signed by accounts[n], where 'address(this)' is the contract address

contract UniDirectionalPaymentChannel {
    using ECDSA for bytes32;

    address payable public sender;
    address payable public receiver;

    // constructor(address payable _receiver) payable {
    function init(address payable _receiver) external payable {
        require(_receiver != address(0), "receiver = zero address");
        sender = payable(msg.sender);
        receiver = _receiver;
    }

    function _getHash(uint _amount) private view returns (bytes32) {
        // NOTE: sign with address of this contract to protect agains
        // replay attack on other contracts
        return keccak256(abi.encodePacked(address(this), _amount));
    }

    function getHash(uint _amount) external view returns (bytes32) {
        return _getHash(_amount);
    }

    function _getEthSignedHash(uint _amount) private view returns (bytes32) {
        return _getHash(_amount).toEthSignedMessageHash();
    }

    function getEthSignedHash(uint _amount) external view returns (bytes32) {
        return _getEthSignedHash(_amount);
    }

    function _verify(uint _amount, bytes memory _sig) private view returns (bool) {
        return _getEthSignedHash(_amount).recover(_sig) == sender;
    }

    function verify(uint _amount, bytes memory _sig) external view returns (bool) {
        return _verify(_amount, _sig);
    }

    function close(uint _amount, bytes memory _sig) external {
        require(msg.sender == receiver, "!receiver");
        require(_verify(_amount, _sig), "invalid sig");

        (bool sent, ) = receiver.call{value: _amount}("");
        require(sent, "Failed to send Ether");
	// selfdestruct(sender);
    }

    function cancel() external {
	require(msg.sender == sender, "!sender");
	// selfdestruct(sender);
    }
}

