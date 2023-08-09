// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint _nftId
    ) external;
}

// i, j <- {0, 1, 2, 3, 4}, where i != j
// [DEPLOYMENT ARGUMENTS] from: owner, arguments: [address(nft)]
/* [VALID SEQ #1] mint@nft <owner, , (accounts[i], nonce)>
		  :: init <accounts[i], , (2 Ether, 0.5 Ether, nonce)>
		  :: setApprovalForAll@nft <accounts[i], , (address(this), true)>
		  :: getPrice <accounts[j], , ()>
		  :: getPrice <accounts[j], , ()>
		  :: buy <accounts[j], 1 Ether, ()>
*/
// [NOTE] An ERC721 contract should have been deployed in advance,
//	  and 'address(nft)' refers to its address
// [NOTE] func_name@nft refers to calling func_name in the deployed ERC721 contract
// [NOTE] 'nonce' tracks the number of fulfilled sequences of this application

contract DutchAuction {
    IERC721 public nft;
    uint public nftId;

    address payable public seller;
    uint public startingPrice;
    uint public discountRate;

    uint timeElapsed;

    constructor(address _nft) {
        nft = IERC721(_nft);
    }

    function init(
        uint _startingPrice,
        uint _discountRate,
        uint _nftId
    ) external {
        seller = payable(msg.sender);
        startingPrice = _startingPrice;
        discountRate = _discountRate;

        nftId = _nftId;
        timeElapsed = 0;
    }

    function getPrice() public returns (uint) {
        timeElapsed++;
        uint discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }

    function buy() external payable {
        uint price = getPrice();
        require(msg.value >= price, "ETH < price");

        nft.transferFrom(seller, msg.sender, nftId);
        uint refund = msg.value - price;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        // selfdestruct(seller);
    }
}

