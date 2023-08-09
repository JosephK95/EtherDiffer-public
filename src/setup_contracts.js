const Web3 = require("web3");
const utils = Web3.utils;

const { create_user_accounts } = require("./accounts");

const gen_txs_BiDirectionalPaymentChannel 
      = require("../transactions/txs_BiDirectionalPaymentChannel");
const gen_txs_CrowdFund = require("../transactions/txs_CrowdFund");
const gen_txs_DutchAuction = require("../transactions/txs_DutchAuction");
const gen_txs_EnglishAuction = require("../transactions/txs_EnglishAuction");
const gen_txs_ERC20 = require("../transactions/txs_ERC20");
const gen_txs_ERC721 = require("../transactions/txs_ERC721");
const gen_txs_EtherWallet = require("../transactions/txs_EtherWallet");
const gen_txs_MerkleProof = require("../transactions/txs_MerkleProof");
const gen_txs_MultiSigWallet = require("../transactions/txs_MultiSigWallet");
const gen_txs_Storage = require("../transactions/txs_Storage");
const gen_txs_TimeLock = require("../transactions/txs_TimeLock");
const gen_txs_UniDirectionalPaymentChannel 
      = require("../transactions/txs_UniDirectionalPaymentChannel");

function setup_contracts() {
    let cont_names = [ "BiDirectionalPaymentChannel", "CrowdFund", 
	    	       "DutchAuction", "EnglishAuction", "ERC20", "ERC721", 
	    	       "EtherWallet", "MerkleProof", "MultiSigWallet", 
	    	       "Storage", "TimeLock", "UniDirectionalPaymentChannel" ];
    let num_users = [ 2, 3, 2, 3, 3, 3, 0, 1, 5, 1, 2, 2 ];

    for (let i = 0; i < cont_names.length; i++) {
	let cont_name = cont_names[i];
        let num_user = num_users[i];

        eval(cont_name + ".name = \"" + cont_name + "\";");
        eval(cont_name + ".mc_list = [];");
        eval(cont_name + ".gen_txs = gen_txs_" + cont_name + ";");
        eval(cont_name + ".is_target = true;");

	eval(cont_name + ".owner = web3_tx_nodes[i].eth.accounts.wallet[0].address;");
        eval(cont_name + ".users = [];")
       
	create_user_accounts(i, cont_name, num_user);

	if (["BiDirectionalPaymentChannel", "CrowdFund", "DutchAuction", "EnglishAuction",
	     "ERC721", "MultiSigWallet", "Storage"].includes(cont_name)) {
            eval(cont_name + ".nonce = 0;");
	}
    }
}

module.exports = { setup_contracts };
