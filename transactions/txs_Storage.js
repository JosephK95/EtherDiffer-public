function gen_txs_Storage() {
    let addr1 = this.users[0];

    switch (Math.floor(Math.random() * 3)) {
        case 0:
	    this.mc_list.push({ cont: "Storage", func: "set", 
		    		sender: addr1, 
		    		args: [ "0", this.nonce ] });
	    this.mc_list.push({ cont: "Storage", func: "get", 
		    		sender: addr1, 
		    		args: [ "0" ] });
	    break;
        case 1:
	    this.mc_list.push({ cont: "Storage", func: "set", 
		    		sender: addr1, 
		    		args: [ "1", this.nonce ] });
	    this.mc_list.push({ cont: "Storage", func: "get", 
		    		sender: addr1, 
		    		args: [ "1" ] });
	    break;
        case 2:
	    this.mc_list.push({ cont: "Storage", func: "set", 
		    		sender: addr1, 
		    		args: [ "2", this.nonce ] });
	    this.mc_list.push({ cont: "Storage", func: "get", 
		    		sender: addr1, 
		    		args: [ "2" ] });
	    break;
    }
    this.nonce++;
}

module.exports = gen_txs_Storage; 
