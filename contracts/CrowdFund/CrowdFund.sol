// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC20 {
    function transfer(address, uint) external returns (bool);

    function transferFrom(
        address,
        address,
        uint
    ) external returns (bool);
}

// i, j, k <- {0, 1, 2, 3, 4}, where i != j AND j != k AND i != k
// [DEPLOYMENT ARGUMENTS] from: owner, arguments: [address(token)]
/* [VALID SEQ #1] mint@token <accounts[j], , (1)> 
		  :: approve@token <accounts[j], , (address(this), 1)>
		  :: mint@token <accounts[k], , (1)> 
		  :: approve@token <accounts[k], , (address(this), 1)>
		  :: launch <accounts[i], , (2)>
		  :: pledge <accounts[j], , (nonce+1, 1)>
		  :: pledge <accounts[k], , (nonce+1, 1)>
		  :: claim <accounts[i], , (nonce+1)>
   [VALID SEQ #2] mint@token <accounts[j], , (1)> 
		  :: approve@token <accounts[j], , (address(this), 1)>
		  :: mint@token <accounts[k], , (1)> 
		  :: approve@token <accounts[k], , (address(this), 1)>
		  :: launch <accounts[i], , (2)>
		  :: pledge <accounts[j], , (nonce+1, 1)>
		  :: pledge <accounts[k], , (nonce+1, 1)>
		  :: unpledge <accounts[j], , (nonce+1, 1)>
		  :: refund <accounts[k], , (nonce+1)>
   [VALID SEQ #3] launch <accounts[i], , (2)>
		  :: cancel <accounts[i], , (nonce+1)>
*/
// [NOTE] An ERC20 contract should have been deployed in advance, 
//	  and 'address(token)' refers to its address
// [NOTE] func_name@nft refers to calling func_name in the deployed ERC721 contract
// [NOTE] 'address(this)' refers to the address of deployed CrowdFund contract
// [NOTE] 'nonce' tracks the number of fulfilled sequences of this application

contract CrowdFund {
    event Launch(
        uint id,
        address indexed creator,
        uint goal
    );
    event Cancel(uint id);
    event Pledge(uint indexed id, address indexed caller, uint amount);
    event Unpledge(uint indexed id, address indexed caller, uint amount);
    event Claim(uint id);
    event Refund(uint id, address indexed caller, uint amount);

    struct Campaign {
        // Creator of campaign
        address creator;
        // Amount of tokens to raise
        uint goal;
        // Total amount pledged
        uint pledged;
        // True if goal was reached and creator has claimed the tokens.
        bool claimed;
    }

    IERC20 public immutable token;
    // Total count of campaigns created.
    // It is also used to generate id for new campaigns.
    uint public count;
    // Mapping from id to Campaign
    mapping(uint => Campaign) public campaigns;
    // Mapping from campaign id => pledger => amount pledged
    mapping(uint => mapping(address => uint)) public pledgedAmount;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function launch(
        uint _goal
    ) external {
        count += 1;
        campaigns[count] = Campaign({
            creator: msg.sender,
            goal: _goal,
            pledged: 0,
            claimed: false
        });

        emit Launch(count, msg.sender, _goal);
    }

    function cancel(uint _id) external {
        Campaign memory campaign = campaigns[_id];
        require(campaign.creator == msg.sender, "not creator");

        delete campaigns[_id];
        emit Cancel(_id);
    }

    function pledge(uint _id, uint _amount) external {
        Campaign storage campaign = campaigns[_id];

        campaign.pledged += _amount;
        pledgedAmount[_id][msg.sender] += _amount;
        token.transferFrom(msg.sender, address(this), _amount);

        emit Pledge(_id, msg.sender, _amount);
    }

    function unpledge(uint _id, uint _amount) external {
        Campaign storage campaign = campaigns[_id];

        campaign.pledged -= _amount;
        pledgedAmount[_id][msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);

        emit Unpledge(_id, msg.sender, _amount);
    }

    function claim(uint _id) external {
        Campaign storage campaign = campaigns[_id];
        require(campaign.creator == msg.sender, "not creator");
        require(campaign.pledged >= campaign.goal, "pledged < goal");
        require(!campaign.claimed, "claimed");

        campaign.claimed = true;
        token.transfer(campaign.creator, campaign.pledged);

        emit Claim(_id);
    }

    function refund(uint _id) external {
        Campaign memory campaign = campaigns[_id];
        require(campaign.pledged < campaign.goal, "pledged >= goal");

        uint bal = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;
        token.transfer(msg.sender, bal);

        emit Refund(_id, msg.sender, bal);
    }
}

