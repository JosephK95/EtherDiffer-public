// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
pragma experimental ABIEncoderV2;

import "./lib/SafeMath.sol";
import "./lib/ECDSA.sol";

// i, j <- {0, 1, 2, 3, 4}, where i != j
// [DEPLOYMENT ARGUMENTS] from: owner,
/* [VALID SEQ #1] init <accounts[i], 1 Ether, ([accounts[i], accounts[j]], [1 Ether, 0])>
                  :: verify <accounts[j], , ([SIG(i), SIG(j)], address(this), 
					     [accounts[i], accounts[j]], [0, 1 Ether], nonce+1)
		  :: challengeExit <accounts[j], , ([0, 1 Ether], nonce+1, [SIG(i), SIG(j)])>
		  :: withdraw <accounts[j], , ()>
*/
// [NOTE] 'SIG(n)' is the signature of 'abi.encodePacked(address(this), [0, 1 Ether], nonce+1)',
//         signed by accounts[n], where 'address(this)' is the contract address
//         and 'nonce' tracks the number of fulfilled sequences of this application


contract BiDirectionalPaymentChannel {
    using SafeMath for uint;
    using ECDSA for bytes32;

    event ChallengeExit(address indexed sender, uint nonce);
    event Withdraw(address indexed to, uint amount);

    address payable[2] public users;
    mapping(address => bool) public isUser;

    mapping(address => uint) public balances;

    uint public nonce;

    modifier checkBalances(uint[2] memory _balances) {
        require(
            address(this).balance >= _balances[0].add(_balances[1]),
            "balance of contract must be >= to the total balance of users"
        );
        _;
    }

    // NOTE: deposit from multi-sig wallet
    // constructor(
    function init(
        address payable[2] memory _users,
        uint[2] memory _balances
    ) external payable checkBalances(_balances) {
        for (uint i = 0; i < _users.length; i++) {
            address payable user = _users[i];

            // require(!isUser[user], "user must be unique");
            users[i] = user;
            isUser[user] = true;

            balances[user] = _balances[i];
        }
    }

    function verify(
        bytes[2] memory _signatures,
        address _contract,
        address[2] memory _signers,
        uint[2] memory _balances,
        uint _nonce
    ) public pure returns (bool) {
        for (uint i = 0; i < _signatures.length; i++) {
            /*
            NOTE: sign with address of this contract to protect
                  agains replay attack on other contracts
            */
            bool valid = _signers[i] ==
                keccak256(abi.encodePacked(_contract, _balances, _nonce))
                    .toEthSignedMessageHash()
                    .recover(_signatures[i]);

            if (!valid) {
                return false;
            }
        }

        return true;
    }

    modifier checkSignatures(
        bytes[2] memory _signatures,
        uint[2] memory _balances,
        uint _nonce
    ) {
        // Note: copy storage array to memory
        address[2] memory signers;
        for (uint i = 0; i < users.length; i++) {
            signers[i] = users[i];
        }

        require(
            verify(_signatures, address(this), signers, _balances, _nonce),
            "Invalid signature"
        );

        _;
    }

    modifier onlyUser() {
        require(isUser[msg.sender], "Not user");
        _;
    }

    function challengeExit(
        uint[2] memory _balances,
        uint _nonce,
        bytes[2] memory _signatures
    )
        public
        onlyUser
        checkSignatures(_signatures, _balances, _nonce)
        checkBalances(_balances)
    {
        require(_nonce > nonce, "Nonce must be greater than the current nonce");

        for (uint i = 0; i < _balances.length; i++) {
            balances[users[i]] = _balances[i];
        }

        nonce = _nonce;

        emit ChallengeExit(msg.sender, nonce);
    }

    function withdraw() public onlyUser {
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");

        emit Withdraw(msg.sender, amount);
	// selfdestruct(users[0]);
    }
}

