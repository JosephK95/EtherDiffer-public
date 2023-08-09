const { Worker } = require("worker_threads");

function start_workers() {
    let worker;
    let cont_objs = [ { "BiDirectionalPaymentChannel": BiDirectionalPaymentChannel },
	              { "ERC20_CrowdFund": ERC20_CrowdFund, "CrowdFund": CrowdFund }, 
	              { "ERC721_DutchAuction": ERC721_DutchAuction, "DutchAuction": DutchAuction },
	              { "ERC721_EngAuction": ERC721_EngAuction, "EnglishAuction": EnglishAuction },
	              { "ERC20": ERC20 }, { "ERC721": ERC721 }, 
	    	      { "EtherWallet": EtherWallet }, { "MerkleProof": MerkleProof },
	              { "MultiSigWallet": MultiSigWallet }, { "Storage": Storage }, 
	    	      { "TimeLock": TimeLock }, 
	    	      { "UniDirectionalPaymentChannel": UniDirectionalPaymentChannel } ];

    for (let i = 0; i < cont_objs.length; i++) {
        let priv_keys = [];

	for (let j = 0; j < web3_tx_nodes[i].eth.accounts.wallet.length; j++) {
	    priv_keys.push(web3_tx_nodes[i].eth.accounts.wallet[j].privateKey);
	}
        worker = new Worker("./src/workers/worker.js", { 
	    workerData: [ web3_tx_nodes[i]._provider.host,
		   	  priv_keys,
		    	  JSON.stringify(cont_objs[i], null, 4) ]});
	worker.on("error", console.error);
	worker.on("exit", (exitCode) => {
	    console.log("Worker terminated: " + web3_tx_nodes[i]._provider.host);
	});
	worker.status = 0;
	workers.push(worker);
    }
}

module.exports = { start_workers };
