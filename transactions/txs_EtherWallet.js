function gen_txs_EtherWallet() {
    this.mc_list.push({ cont: "EtherWallet", func: "receive", 
		    	sender: this.owner, value: ether(0.02), 
		    	args: [] });
    this.mc_list.push({ cont: "EtherWallet", func: "getBalance", 
		    	sender: this.owner,
		    	args: [] });
    this.mc_list.push({ cont: "EtherWallet", func: "withdraw", 
		    	sender: this.owner,
		    	args: [_dq(ether(0.01))] });
}

module.exports = gen_txs_EtherWallet; 
