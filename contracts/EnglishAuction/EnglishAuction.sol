// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

// i, j, k <- {0, 1, 2, 3, 4}, where i != j AND j != k AND i != k
// [DEPLOYMENT ARGUMENTS] from: owner, arguments: [address(nft)]
/* [VALID SEQ #1] mint@nft <owner, , (accounts[i], nonce)>
		  :: init <accounts[i], , (nonce, 1 Ether)>
		  :: setApprovalForAll@nft <accounts[i], , (address(this), true)>
		  :: start <accounts[i], , ()>
		  :: bid <accounts[j], 2 Ether, ()>
		  :: bid <accounts[k], 3 Ether, ()>
		  :: end <accounts[i], , ()>
		  :: withdraw <accounts[j], , ()>
*/
// [NOTE] An ERC721 contract should have been deployed in advance, 
//    	  and 'address(nft)' refers to its address
// [NOTE] 'address(this)' refers to the address of deployed EnglishAuction contract
// [NOTE] func_name@nft refers to calling func_name in the deployed ERC721 contract
// [NOTE] 'nonce' tracks the number of fulfilled sequences of this application

contract EnglishAuction {
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);

    IERC721 public nft;
    uint public nftId;

    address payable public seller;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    constructor(address _nft) {
        nft = IERC721(_nft);
    }

    function init(
	uint _nftId,
	uint _startingBid
    ) external payable {
	nftId = _nftId;

        seller = payable(msg.sender);
	highestBid = _startingBid;

	started = false;
	ended = false;
    }

    function start() external {
        require(!started, "started");
        require(msg.sender == seller, "not seller");

        nft.transferFrom(msg.sender, address(this), nftId);
        started = true;

        emit Start();
    }

    function bid() external payable {
        require(started, "not started");
        require(msg.value > highestBid, "value < highest");

        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit Bid(msg.sender, msg.value);
    }

    function withdraw() external {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bal);

        emit Withdraw(msg.sender, bal);
	// selfdestruct(seller);
    }

    function end() external {
        require(started, "not started");
        require(!ended, "ended");

        ended = true;
        if (highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), highestBidder, nftId);
            seller.transfer(highestBid);
        } else {
            nft.safeTransferFrom(address(this), seller, nftId);
        }

        emit End(highestBidder, highestBid);
    }
}

