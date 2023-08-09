// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// i, j <- {0, 1, 2, 3, 4}, where i != j
// [DEPLOYMENT ARGUMENTS] from: accounts[i]
/* [VALID SEQ #1] queue <accounts[i], , (accounts[j], 1 Ether, "", [])>
		  :: receive <accounts[i], 2 Ether, ()>
		  :: execute <accounts[i], , (accounts[j], 1 Ether, "", [])>
   [VALID SEQ #2] queue <accounts[i], , (accounts[j], 1 Ether, "", [])>
		  :: getTxId <accounts[i], , (accounts[j], 1 Ether, "", [])>
		  :: cancel <accounts[i], , (TXID)> 
*/
// [NOTE] This contract should be deployed per account
// [NOTE] 'TXID' refers to the hash value of (accounts[j], 1 Ether, "", [])

contract TimeLock {
    error NotOwnerError();
    error AlreadyQueuedError(bytes32 txId);
    error NotQueuedError(bytes32 txId);
    error TxFailedError();

    event Queue(
        bytes32 indexed txId,
        address indexed target,
        uint value,
        string func,
        bytes data
    );
    event Execute(
        bytes32 indexed txId,
        address indexed target,
        uint value,
        string func,
        bytes data
    );
    event Cancel(bytes32 indexed txId);

    address public owner;
    // tx id => queued
    mapping(bytes32 => bool) public queued;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwnerError();
        }
        _;
    }

    receive() external payable {}

    function getTxId(
        address _target,
        uint _value,
        string calldata _func,
        bytes calldata _data
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(_target, _value, _func, _data));
    }

    /**
     * @param _target Address of contract or account to call
     * @param _value Amount of ETH to send
     * @param _func Function signature, for example "foo(address,uint256)"
     * @param _data ABI encoded data send.
     */
    function queue(
        address _target,
        uint _value,
        string calldata _func,
        bytes calldata _data
    ) external onlyOwner returns (bytes32 txId) {
        txId = getTxId(_target, _value, _func, _data);
        if (queued[txId]) {
            revert AlreadyQueuedError(txId);
	}
        queued[txId] = true;

        emit Queue(txId, _target, _value, _func, _data);
    }

    function execute(
        address _target,
        uint _value,
        string calldata _func,
        bytes calldata _data
    ) external payable onlyOwner returns (bytes memory) {
        bytes32 txId = getTxId(_target, _value, _func, _data);
        if (!queued[txId]) {
            revert NotQueuedError(txId);
        }
        
	queued[txId] = false;

        // prepare data
        bytes memory data;
        if (bytes(_func).length > 0) {
            // data = func selector + _data
            data = abi.encodePacked(bytes4(keccak256(bytes(_func))), _data);
        } else {
            // call fallback with data
            data = _data;
        }

        // call target
        (bool ok, bytes memory res) = _target.call{value: _value}(data);
        if (!ok) {
            revert TxFailedError();
        }

        emit Execute(txId, _target, _value, _func, _data);

        return res;
    }

    function cancel(bytes32 _txId) external onlyOwner {
        if (!queued[_txId]) {
            revert NotQueuedError(_txId);
        }

        queued[_txId] = false;

        emit Cancel(_txId);
    }
}

