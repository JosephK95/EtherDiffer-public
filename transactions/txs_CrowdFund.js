function gen_txs_CrowdFund() {
    let [ addr1, addr2, addr3] = this.users.slice().sort(() => 0.5 - Math.random());

    switch (Math.floor(Math.random() * 3)) {
        case 0:
	    this.mc_list.push({ cont: "ERC20_CrowdFund", func: "mint", 
		    		sender: addr2, 
		    	        args: [ "1" ] });
	    this.mc_list.push({ cont: "ERC20_CrowdFund", func: "approve", 
		    		sender: addr2, 
		    	        args: [ _dq(this.options.address), "1" ] });
	    this.mc_list.push({ cont: "ERC20_CrowdFund", func: "mint", 
		    		sender: addr3, 
		    	        args: [ "1" ] });
	    this.mc_list.push({ cont: "ERC20_CrowdFund", func: "approve", 
		    		sender: addr3, 
		    	        args: [ _dq(this.options.address), "1" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "launch", 
		    		sender: addr1, 
		    	        args: [ "2" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "pledge", 
		    		sender: addr2, 
		    	        args: [ this.nonce+1, "1" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "pledge", 
		    		sender: addr3, 
		    	        args: [ this.nonce+1, "1" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "claim", 
		    		sender: addr1, 
		    	        args: [ this.nonce+1 ] });
	    break;
        case 1:
	    this.mc_list.push({ cont: "ERC20_CrowdFund", func: "mint", 
		    		sender: addr2, 
		    	        args: [ "1" ] });
	    this.mc_list.push({ cont: "ERC20_CrowdFund", func: "approve", 
		    		sender: addr2, 
		    	        args: [ _dq(this.options.address), "1" ] });
	    this.mc_list.push({ cont: "ERC20_CrowdFund", func: "mint", 
		    		sender: addr3, 
		    	        args: [ "1" ] });
	    this.mc_list.push({ cont: "ERC20_CrowdFund", func: "approve", 
		    		sender: addr3, 
		    	        args: [ _dq(this.options.address), "1" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "launch", 
		    		sender: addr1, 
		    	        args: [ "2" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "pledge", 
		    		sender: addr2, 
		    	        args: [ this.nonce+1, "1" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "pledge", 
		    		sender: addr3, 
		    	        args: [ this.nonce+1, "1" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "unpledge", 
		    		sender: addr2, 
		    	        args: [ this.nonce+1, "1" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "refund", 
		    		sender: addr3, 
		    	        args: [ this.nonce+1 ] });
	    break;
        case 2:
	    this.mc_list.push({ cont: "CrowdFund", func: "launch", 
		    		sender: addr1, 
		    	        args: [ "2" ] });
	    this.mc_list.push({ cont: "CrowdFund", func: "cancel", 
		    		sender: addr1, 
		    	        args: [ this.nonce+1 ] });
	    break;
    }
    this.nonce++;
}

module.exports = gen_txs_CrowdFund;
    
