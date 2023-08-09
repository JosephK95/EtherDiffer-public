function gen_txs_EnglishAuction() {
    let [ addr1, addr2, addr3 ] = this.users.slice().sort(() => 0.5 - Math.random());

    this.mc_list.push({ cont: "ERC721_EngAuction", func: "mint", 
		    	sender: this.owner, 
		    	args: [ _dq(addr1), this.nonce ] });
    this.mc_list.push({ cont: "EnglishAuction", func: "init", 
		    	sender: addr1, value: ether(0.01), 
		    	args: [ this.nonce, _dq(ether(0.01))] });
    this.mc_list.push({ cont: "ERC721_EngAuction", func: "setApprovalForAll", 
		    	sender: addr1, 
		    	args: [ _dq(this.options.address), "true" ] });
    this.mc_list.push({ cont: "EnglishAuction", func: "start", 
		    	sender: addr1, 
		    	args: [] });
    this.mc_list.push({ cont: "EnglishAuction", func: "bid", 
		    	sender: addr2, value: ether(0.02), 
		    	args: [] });
    this.mc_list.push({ cont: "EnglishAuction", func: "bid", 
		    	sender: addr3, value: ether(0.03), 
		    	args: [] });
    this.mc_list.push({ cont: "EnglishAuction", func: "end", 
		    	sender: addr1, 
		    	args: [] });
    this.mc_list.push({ cont: "EnglishAuction", func: "withdraw", 
		    	sender: addr2, 
		    	args: [] });
    this.nonce++;
}

module.exports = gen_txs_EnglishAuction;
    
