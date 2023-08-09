function gen_txs_MultiSigWallet() {
    let [ addr1, addr2, addr3, addr4, addr5 ] = this.users.slice().sort(() => 0.5 - Math.random());

    if (this.nonce == 0) {
        this.mc_list.push({ cont: "MultiSigWallet", func: "init", 
	    		    sender: this.owner, 
	    		    args: [ "[" + _dq(addr1) + ", " + 
				          _dq(addr2) + ", " +
				          _dq(addr3) + ", " + 
				          _dq(addr4) + ", " + 
				          _dq(addr5) + "]", "3" ] });
    }
    this.mc_list.push({ cont: "MultiSigWallet", func: "getOwners", 
	    		sender: addr1, 
	    		args: [] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "getTransactionCount", 
	    		sender: addr1, 
	    		args: [] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "submitTransaction", 
	    		sender: addr1,
	    		args: [ _dq(addr2), _dq(ether(0.01)), "[]" ] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "getTransaction", 
	    		sender: addr1, 
	    		args: [ this.nonce ] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "receive", 
	    		sender: addr1, value: ether(0.02), 
	    		args: [] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "confirmTransaction", 
	    		sender: addr2, 
	    		args: [ this.nonce ] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "confirmTransaction", 
	    		sender: addr3, 
	    		args: [ this.nonce ] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "confirmTransaction", 
	    		sender: addr4, 
	    		args: [ this.nonce ] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "revokeConfirmation", 
	    		sender: addr4, 
	    		args: [ this.nonce ] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "confirmTransaction", 
	    		sender: addr5, 
	    		args: [ this.nonce ] });
    this.mc_list.push({ cont: "MultiSigWallet", func: "executeTransaction", 
	    		sender: addr1, 
	    		args: [ this.nonce ] });
    
    this.nonce++;
}

module.exports = gen_txs_MultiSigWallet; 
