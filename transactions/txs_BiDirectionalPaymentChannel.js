const Web3 = require("web3");
const utils = Web3.utils;

function gen_BiDirectionalPaymentChannel_sig(addr1, addr2, nonce) {
    let idx1 = BiDirectionalPaymentChannel.users.findIndex((acc) => acc == addr1) + 1;
    let idx2 = BiDirectionalPaymentChannel.users.findIndex((acc) => acc == addr2) + 1;

    let H_bi = utils.soliditySha3(BiDirectionalPaymentChannel.options.address, 
		    		  { type: 'uint[2]', value: [0, ether(0.01)] }, nonce+1);
    let sig1 = web3_tx_node.eth.accounts.wallet[idx1].sign(H_bi).signature;
    let sig2 = web3_tx_node.eth.accounts.wallet[idx2].sign(H_bi).signature;

    return { sig1, sig2 };
}

function gen_txs_BiDirectionalPaymentChannel() {
    let [ addr1, addr2 ] = this.users.slice().sort(() => 0.5 - Math.random());
    let { sig1, sig2 } = gen_BiDirectionalPaymentChannel_sig(addr1, addr2, this.nonce);

    this.mc_list.push({ cont: "BiDirectionalPaymentChannel", func: "init", 
		    	sender: addr1, value: ether(0.01), 
		    	args: [ "[" +_dq(addr1) + ", " + _dq(addr2) + "]",
			        "[" + _dq(ether(0.01)) + ", 0]" ] });
    this.mc_list.push({ cont: "BiDirectionalPaymentChannel", func: "verify", 
		    	sender: addr2, 
		    	args: [ "[" +_dq(sig1) + ", " + _dq(sig2) + "]",
				_dq(this.options.address), 
	    			"[" + _dq(addr1) + ", " + _dq(addr2) + "]",
	    			"[0, " + _dq(ether(0.01)) + "]", 
				this.nonce+1 ] });
    this.mc_list.push({ cont: "BiDirectionalPaymentChannel", func: "challengeExit", 
		    	sender: addr2, 
		    	args: [ "[0, " + _dq(ether(0.01)) + "]",
	    			this.nonce+1,
	    			"[" + _dq(sig1) + ", " + _dq(sig2) + "]" ] });
    this.mc_list.push({ cont: "BiDirectionalPaymentChannel", func: "withdraw", 
		    	sender: addr2, 
		    	args: [] });
    this.nonce++;
}

module.exports = gen_txs_BiDirectionalPaymentChannel;
    
