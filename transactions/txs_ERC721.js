function gen_txs_ERC721() {
    let [ addr1, addr2, addr3 ] = this.users.slice().sort(() => 0.5 - Math.random());

    switch (Math.floor(Math.random() * 7)) {
        case 0:
	    this.mc_list.push({ cont: "ERC721", func: "mint", 
		    		sender: this.owner, 
		    	        args: [ _dq(addr1), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "transferFrom", 
		    		sender: addr1, 
		    	        args: [ _dq(addr1), _dq(addr2), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "balanceOf", 
		    		sender: addr2, 
		    	        args: [ _dq(addr2) ] });
	    this.mc_list.push({ cont: "ERC721", func: "ownerOf", 
		    		sender: addr2,
		    	        args: [ this.nonce ] });
	    break;
        case 1:
	    this.mc_list.push({ cont: "ERC721", func: "mint", 
		    		sender: this.owner, 
		    	        args: [ _dq(addr1), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "approve", 
		    		sender: addr1, 
		    	        args: [ _dq(addr2), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "getApproved", 
		    		sender: addr2, 
		    	        args: [ this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "transferFrom", 
		    		sender: addr2,
		    	        args: [ _dq(addr1), _dq(addr2), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "balanceOf", 
		    		sender: addr2, 
		    	        args: [ _dq(addr2) ] });
	    this.mc_list.push({ cont: "ERC721", func: "ownerOf", 
		    		sender: addr2,
		    	        args: [ this.nonce ] });
	    break;
        case 2:
	    this.mc_list.push({ cont: "ERC721", func: "mint", 
		    		sender: this.owner, 
		    	        args: [ _dq(addr1), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "setApprovalForAll", 
		    		sender: addr1, 
		    	        args: [ _dq(addr2), true ] });
	    this.mc_list.push({ cont: "ERC721", func: "isApprovedForAll", 
		    		sender: addr2, 
		    	        args: [ _dq(addr1), _dq(addr2) ] });
	    this.mc_list.push({ cont: "ERC721", func: "transferFrom", 
		    		sender: addr2,
		    	        args: [ _dq(addr1), _dq(addr3), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "balanceOf", 
		    		sender: addr3, 
		    	        args: [ _dq(addr3) ] });
	    this.mc_list.push({ cont: "ERC721", func: "ownerOf", 
		    		sender: addr3,
		    	        args: [ this.nonce ] });
	    break;	
        case 3:
	    this.mc_list.push({ cont: "ERC721", func: "mint", 
		    		sender: this.owner, 
		    	        args: [ _dq(addr1), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "safeTransferFrom", 
		    		sender: addr1, 
		    	        args: [ _dq(addr1), _dq(addr2), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "balanceOf", 
		    		sender: addr2, 
		    	        args: [ _dq(addr2) ] });
	    this.mc_list.push({ cont: "ERC721", func: "ownerOf", 
		    		sender: addr2,
		    	        args: [ this.nonce ] });
	    break;
        case 4:
	    this.mc_list.push({ cont: "ERC721", func: "mint", 
		    		sender: this.owner, 
		    	        args: [ _dq(addr1), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "approve", 
		    		sender: addr1, 
		    	        args: [ _dq(addr2), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "getApproved", 
		    		sender: addr2, 
		    	   	args: [ this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "safeTransferFrom", 
		    		sender: addr2, 
		    	   	args: [ _dq(addr1), _dq(addr2), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "balanceOf", 
		    		sender: addr2, 
		    	  	args: [ _dq(addr2) ] });
	    this.mc_list.push({ cont: "ERC721", func: "ownerOf", 
		    		sender: addr2,
		    	   	args: [ this.nonce ] });
	    break;
        case 5:
	    this.mc_list.push({ cont: "ERC721", func: "mint", 
		    		sender: this.owner, 
		    	  	args: [ _dq(addr1), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "setApprovalForAll", 
		    		sender: addr1, 
		    	   	args: [ _dq(addr2), true ] });
	    this.mc_list.push({ cont: "ERC721", func: "isApprovedForAll", 
		    		sender: addr2, 
		    	  	args: [ _dq(addr1), _dq(addr2) ] });
	    this.mc_list.push({ cont: "ERC721", func: "safeTransferFrom", 
		    		sender: addr2, 
		    	  	args: [ _dq(addr1), _dq(addr3), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "balanceOf", 
		    		sender: addr3, 
		    	   	args: [ _dq(addr3) ] });
	    this.mc_list.push({ cont: "ERC721", func: "ownerOf", 
		    		sender: addr3,
		    	   	args: [ this.nonce ] });
	    break;
        case 6:
	    this.mc_list.push({ cont: "ERC721", func: "mint", 
		    		sender: this.owner, 
		    	   	args: [ _dq(addr1), this.nonce ] });
	    this.mc_list.push({ cont: "ERC721", func: "burn", 
		    		sender: addr1, 
		    	   	args: [ this.nonce ] });
	    break;
    }
    this.nonce++;
}

module.exports = gen_txs_ERC721;
    
