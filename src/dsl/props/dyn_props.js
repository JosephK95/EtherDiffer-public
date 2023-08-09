P_Nonce = function(addr) {
    return { is_P: true,
             is_Dyn: true,
             name: "<Nonce>", 
             mappings: { getTransactionCount: { pre_args: [addr, _dq("latest")] } }
    	   }
}

P_TxIdx = function(block) {
    return { is_P: true,
	     is_Dyn: true,
	     name: "<TxIdx>",
             mappings: { getBlock: { pre_args: [block, "false"],
	     			     post_fixes: [".transactions.index()"] } } 
	   }
}

P_TxHash = {
    is_P: true,
    is_Dyn: true,
    name: "<TxHash>",
    verified_values: new Set(),
    mappings: { getBlock: { post_fixes: [".transactions.sample()"] },
	        getUncle: { post_fixes: [".transactions.sample()"] }, 
	        getPastLogs: { post_fixes: [".sample().transactionHash"] },
	        getTransaction: { post_fixes: [".hash"] },
	        getTransactionReceipt: { post_fixes: [".transactionHash", 
						      ".logs.sample().transactionHash"] },
	        getPendingTransactions: { post_fixes: [".sample().hash"] },
	        getTransactionFromBlock: { post_fixes: [".hash"] }
              }
}

P_TxSigned = {
    is_P: true,
    is_Dyn: true,
    name: "<TxSigned>",
    mappings: { signTransaction: { post_fixes: [".rawTransaction"] } }
}

P_BlockHash = {
    is_P: true,
    is_Dyn: true,
    name: "<BlockHash>",
    verified_values: new Set(),
    mappings: { getBlock: { post_fixes: [".hash", ".parentHash", ".uncles.sample()"] },
	        getUncle: { post_fixes: [".hash", ".parentHash", ".uncles.sample()"] }, 
	        getPastLogs: { post_fixes: [".sample().blockHash"] },
	        getTransaction: { post_fixes: [".blockHash"] },
	        getTransactionReceipt: { post_fixes: [".blockHash", 
						      ".logs.sample().blockHash"] },
	        getPendingTransactions: { post_fixes: [".sample().blockHash"] },
	        getTransactionFromBlock: { post_fixes: [".blockHash"] } 
	      }
}

P_UncleIdx = function(block) {
    return { is_P: true,
	     is_Dyn: true,
	     name: "<UncleIdx>",
             mappings: { getBlock: { pre_args: [block, "false"],
	     			     post_fixes: [".uncles.index()"] } } 
	   }
}
