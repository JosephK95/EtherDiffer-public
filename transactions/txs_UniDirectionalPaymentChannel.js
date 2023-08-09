const Web3 = require("web3");
const utils = Web3.utils;

function gen_UniDirectionalPayment_sig(addr1) {
    let idx = UniDirectionalPaymentChannel.users.findIndex((acc) => acc == addr1) + 1;
    let H_uni = utils.soliditySha3(UniDirectionalPaymentChannel.options.address, ether(0.01));

    return web3_tx_node.eth.accounts.wallet[idx].sign(H_uni).signature;
}

function gen_txs_UniDirectionalPaymentChannel() {
    let [ addr1, addr2 ] = this.users.slice().sort(() => 0.5 - Math.random());
    let sig = gen_UniDirectionalPayment_sig(addr1);

    switch (Math.floor(Math.random() * 2)) {
        case 0:
	    this.mc_list.push({ cont: "UniDirectionalPaymentChannel", func: "init", 
		    		sender: addr1, value: ether(0.01), 
		    	        args: [ _dq(addr2) ] });
	    this.mc_list.push({ cont: "UniDirectionalPaymentChannel", func: "getHash", 
		    		sender: addr2,
		    	        args: [ _dq(ether(0.01)) ] });
	    this.mc_list.push({ cont: "UniDirectionalPaymentChannel", func: "getEthSignedHash", 
		    		sender: addr2,
		    	        args: [ _dq(ether(0.01)) ] });
	    this.mc_list.push({ cont: "UniDirectionalPaymentChannel", func: "verify", 
		    		sender: addr2,
		    	        args: [ _dq(ether(0.01)), _dq(sig) ] });
	    this.mc_list.push({ cont: "UniDirectionalPaymentChannel", func: "close", 
		    		sender: addr2,
		    	        args: [ _dq(ether(0.01)), _dq(sig) ] });
	    break;
        case 1:
	    this.mc_list.push({ cont: "UniDirectionalPaymentChannel", func: "init", 
		    		sender: addr1, value: ether(0.01), 
		    	        args: [ _dq(addr2) ] });
	    this.mc_list.push({ cont: "UniDirectionalPaymentChannel", func: "cancel", 
		    		sender: addr1,
		    	        args: [] });
            break;
    }
}

module.exports = gen_txs_UniDirectionalPaymentChannel;
