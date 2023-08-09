function gen_txs_DutchAuction() {
    let [ addr1, addr2 ] = this.users.slice().sort(() => 0.5 - Math.random());

    this.mc_list.push({ cont: "ERC721_DutchAuction", func: "mint", 
		    	sender: this.owner, 
		 	args: [ _dq(addr1), this.nonce ] });
    this.mc_list.push({ cont: "DutchAuction", func: "init", 
		    	sender: addr1, 
		    	args: [ _dq(ether(0.02)), _dq(ether(0.005)), this.nonce ] });
    this.mc_list.push({ cont: "ERC721_DutchAuction", func: "setApprovalForAll", 
		    	sender: addr1, 
		    	args: [ _dq(this.options.address), "true" ] });
    this.mc_list.push({ cont: "DutchAuction", func: "getPrice", 
		    	sender: addr2, 
		    	args: [] });
    this.mc_list.push({ cont: "DutchAuction", func: "getPrice", 
		    	sender: addr2, 
		    	args: [] });
    this.mc_list.push({ cont: "DutchAuction", func: "buy", 
		    	sender: addr2, value: ether(0.01),
		    	args: [] });
    this.nonce++;
}

module.exports = gen_txs_DutchAuction;
