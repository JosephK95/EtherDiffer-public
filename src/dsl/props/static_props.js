P_Null = { 
    is_P: true,
    is_Static: true,
    name: "<Null>",
    generate: function() {
        return "null";
    }
}

P_Rand = {
    is_P: true,
    is_Static: true,
    name: "<Rand>",
    generate: function() {
        if (random()) {
            return "true";
        } else {
	    return "false";
	}
    }
}

P_Const = function(val) {
    return { is_P: true,
	     is_Static: true,
             name: "<Const " + val + ">",
             generate: function() {
                 return val;
             } }
}

P_Range = function(min, max) {
    return { is_P: true, 
	     is_Static: true,
	     name: "<Range(" + min + "," + max + ")>",
             generate: function() { 
		 let num = Math.floor(Math.random() * (max - min + 1) + min);
	         return num.toString() + "; // " + this.name;
	     } }
}

P_Message = {
    is_P: true,
    is_Static: true,
    name: "<Message>",
    generate: function() {
        return _dq("Hello world");
    }
}

P_EOA = {
    is_P: true,
    is_Static: true,
    name: "<EOA>",
    generate: function() {
        return _dq(random_select(accounts));
    }
}

P_Contract = {
    is_P: true,
    is_Static: true,
    name: "<Contract>",
    generate: function() {
        return _dq(random_select(cont_addrs));
    }
}

P_Gas = {
    is_P: true,
    is_Static: true,
    name: "<Gas>",
    generate: function() {
        return random_select(["314159", "3141592", "0x3d0900", "1000000", "5000000", "1500000"]);
    }
}
        
P_GasPrice = {
    is_P: true,
    is_Static: true,
    name: "<GasPrice>",
    generate: function() {
        return _dq(random_select(["20000000000", "0x4a817c800"]));
    }
}

P_Value = {
    is_P: true,
    is_Static: true,
    name: "<Value>",
    generate: function() {
        return _dq(random_select(["123450000000000000", "1000000000000000", "0x00", 
				  "1000000000000000000", "0xde0b6b3a7640000"]));
    }
}

P_StorageIdx = function(cont) {
    return { is_P: true,
	     is_Static: true,
	     name: "<StorageIdx>",
	     generate: function() {
                 return _dq("0x" + random_select(cont.slots).padStart(64, "0"));
	     } }
}

P_McSender = function(mc) {
    return { is_P: true,
             is_Static: true,
             name: "<(mc).sender>",
    	     generate: function() {
	         return _dq(mc.sender);
	     } }
}
    
P_McValue = function(mc) {
    return { is_P: true,
             is_Static: true,
             name: "<(mc).value>",
    	     generate: function() {
	         return _dq(mc.value);
	     } }
}

P_BlockNumber = {
    is_P: true,
    is_Static: true,
    is_Dyn: true,
    name: "<BlockNumber>",
    blockNum: 0,
    generate: function () {
	if (random()) {
            let args = [ "genesis", "earliest", "latest" ];
	    return _dq(random_select(args));
	} else {
	    return _dq(Math.floor(Math.random() * this.blockNum));
	}
    },
    verified_values: new Set(),
    mappings: { getBlock: { post_fixes: [".number"] },
	        getUncle: { post_fixes: [".number"] },
		isSyncing: { post_fixes: [".startingBlock", ".currentBlock", ".highestBlock" ] },
	        getPastLogs: { post_fixes: [".sample().blockNumber"] },
	        getTransaction: { post_fixes: [".blockNumber"] },
	        getBlockNumber: {},
	        getTransactionReceipt: { post_fixes: [".blockNumber", 
						      ".logs.sample().blockNumber"] },
	        getPendingTransactions: { post_fixes: [".sample().blockNumber"] },
	        getTransactionFromBlock: { post_fixes: [".blockNumber"] } 
              }
}
