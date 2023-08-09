function gen_txs_ERC20() {
    let [ addr1, addr2, addr3 ] = this.users.slice().sort(() => 0.5 - Math.random());

    switch (Math.floor(Math.random() * 3)) {
        case 0:
	    this.mc_list.push({ cont: "ERC20", func: "mint", 
		    		sender: addr1, 
		    		args: [ "10" ] });
	    this.mc_list.push({ cont: "ERC20", func: "transfer", 
		    		sender: addr1, 
		    	        args: [ _dq(addr2), "10" ] });
	    break;
        case 1:
	    this.mc_list.push({ cont: "ERC20", func: "mint", 
		    		sender: addr1, 
		    	        args: [ "10" ] });
	    this.mc_list.push({ cont: "ERC20", func: "approve", 
		    		sender: addr1, 
		    	        args: [ _dq(addr2), "10"] });
	    this.mc_list.push({ cont: "ERC20", func: "transferFrom", 
		    		sender: addr2, 
		    	        args: [ _dq(addr1), _dq(addr3), "10" ] });
	    break;
        case 2:
	    this.mc_list.push({ cont: "ERC20", func: "mint", 
		    		sender: addr1, 
		    	        args: [ "10" ] });
	    this.mc_list.push({ cont: "ERC20", func: "burn", 
		    		sender: addr1, 
		  		args: [ "10" ] });
	    break;	
    }
}

module.exports = gen_txs_ERC20;
    
