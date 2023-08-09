const Web3 = require("web3");
const utils = Web3.utils;

function gen_TimeLock_hash(addr) {
    let encoding = web3_tx_node.eth.abi.encodeParameters(
		       [ "address", "uint", "string", "bytes" ], [ addr, ether(0.01), "", [] ]); 
    return utils.sha3(encoding);
}

function gen_txs_TimeLock() {
    switch (Math.floor(Math.random() * 2)) {
        case 0:
	    this.mc_list.push({ cont: "TimeLock", func: "queue", 
		    		sender: this.owner, 
		    		args: [ _dq(this.owner), _dq(ether(0.01)), _dq(""), "[]" ] });
	    this.mc_list.push({ cont: "TimeLock", func: "receive", 
		    		sender: this.owner, value: ether(0.02),
		    		args: [] });
	    this.mc_list.push({ cont: "TimeLock", func: "execute", 
		    		sender: this.owner,
		    		args: [ _dq(this.owner), _dq(ether(0.01)), _dq(""), "[]" ] });
	    break;
        case 1:
	    let H_lock = gen_TimeLock_hash(this.owner);

	    this.mc_list.push({ cont: "TimeLock", func: "queue", 
		    		sender: this.owner, 
		    		args: [ _dq(this.owner), _dq(ether(0.01)), _dq(""), "[]" ] });
	    this.mc_list.push({ cont: "TimeLock", func: "getTxId", 
		    		sender: this.owner, 
		    		args: [ _dq(this.owner), _dq(ether(0.01)), _dq(""), "[]" ] });
	    this.mc_list.push({ cont: "TimeLock", func: "cancel", 
		    		sender: this.owner,
		    		args: [ _dq(H_lock) ] });
	    break;
    }
}

module.exports = gen_txs_TimeLock; 
