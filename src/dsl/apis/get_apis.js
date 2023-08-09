const { gen_arg, gen_args, gen_with_pre_args } = require("../gen_args");

getProtocolVersion = {
    out_T: T_String,
    name: "getProtocolVersion",
    generate: async function(stmts) {
        stmts.push("await web3.eth.getProtocolVersion()");
	return stmts;
    }
}

isSyncing = {
    out_T: T_Or(T_SyncObj, T_Boolean),
    name: "isSyncing",
    generate: async function(stmts) {
        stmts.push("await web3.eth.isSyncing()");
	return stmts;
    }
}

isMining = {
    out_T: T_Boolean,
    name: "isMining",
    generate: async function(stmts) {
        stmts.push("await web3.eth.isMining()");
	return stmts;
    }
}

getGasPrice = {
    out_T: T_NumberString,
    name: "getGasPrice",
    generate: async function(stmts) {
        stmts.push("await web3.eth.getGasPrice()");
	return stmts;
    }
}

getFeeHistory = {
    in_TPs: [_(T_Number, P_Range(1, 1024)),
	     _(T_Or(T_Number, T_String), P_BlockNumber),
	     _(T_Array(T_Number), P_Array(P_Range(0, 100)))],
    out_T: T_FeeObj,
    name: "getFeeHistory",
    generate: async function(stmts) {
        let { n_stmts, args } = await gen_args(stmts, this.in_TPs);
	
	n_stmts.push("await web3.eth.getFeeHistory(" + args.join(", ") + ")");
	return n_stmts;
    }
}

getAccounts = {
    out_T: T_Array(T_Address),
    name: "getAccounts",
    generate: async function(stmts) {
        stmts.push("await web3.eth.getAccounts()");
	return stmts;
    }
}

getBlockNumber = {
    out_T: T_Number,
    name: "getBlockNumber",
    generate: async function(stmts) {
        stmts.push("await web3.eth.getBlockNumber()");
	return stmts;
    }
}

getBalance = {
    in_TPs: [_(T_Address, P_Or(P_EOA, P_Contract)),
	     _opt(T_Or(T_Number, T_String), P_BlockNumber)],
    out_T: T_NumberString,
    name: "getBalance",
    generate: async function(stmts) {
        let in_TPs = handle_opt(this.in_TPs);
	let { n_stmts, args } = await gen_args(stmts, in_TPs);

	n_stmts.push("await web3.eth.getBalance(" + args.join(", ") + ")");
	return n_stmts;
    }
}

getStorageAt = {
    in_TPs: [_(T_Address, P_Contract),
	     _(T_Hex32, WILL_BE("<StorageIdx@(param#1)>")),
	     _opt(T_Or(T_Number, T_String), P_BlockNumber)],
    out_T: T_String,
    name: "getStorageAt",
    generate: async function(stmts) {
	let cont;
	do {
	    cont = random_select(cont_vars);
	} while(cont.slots.length == 0)

        let arg = "aa" + stmts.length.toString();
        stmts.push("let " + arg + " = " + _dq(cont.options.address));
       
	let in_TPs = handle_opt([_(T_Hex32, P_StorageIdx(cont)), this.in_TPs[2]]);
	let { n_stmts, args } = await gen_args(stmts, in_TPs);

        args.unshift(arg);

        n_stmts.push("await web3.eth.getStorageAt(" + args.join(", ") + ")");
	return n_stmts;
    }
}

getCode = {
    in_TPs: [_(T_Address, P_Contract),
	     _opt(T_Or(T_Number, T_String), P_BlockNumber)],
    out_T: T_String,
    name: "getCode",
    generate: async function(stmts) {
        let in_TPs = handle_opt(this.in_TPs);
	let { n_stmts, args } = await gen_args(stmts, in_TPs);

        n_stmts.push("await web3.eth.getCode(" + args.join(", ") + ")");
	return n_stmts;
    }
}

getBlock = {
    in_TPs: [or(_(T_Or(T_Number, T_String), P_BlockNumber), _(T_Hex32, P_BlockHash)),
	     _opt(T_Boolean, P_Rand)],
    out_T: T_BlockObj,
    name: "getBlock",
    generate: async function(stmts) {
        let in_TP = handle_or(this.in_TPs[0]);
	let in_TPs = handle_opt([in_TP, this.in_TPs[1]]);
	
	let { n_stmts, args } = await gen_args(stmts, in_TPs);

	n_stmts.push("await web3.eth.getBlock(" + args.join(", ") + ")");
	return n_stmts;
    },
    generate_with_args: function(stmts, args) {
        stmts.push("await web3.eth.getBlock(" + args.join(", ") + ")");
	return stmts;
    }
}

getBlockTransactionCount = {
    in_TP: or(_(T_Or(T_Number, T_String), P_BlockNumber), _(T_Hex32, P_BlockHash)),
    out_T: T_Number,
    name: "getBlockTransactionCount",
    generate: async function(stmts) {
        let in_TP = handle_or(this.in_TP);
	let { n_stmts, arg } = await gen_arg(stmts, in_TP);

	n_stmts.push("await web3.eth.getBlockTransactionCount(" + arg + ")");
	return n_stmts;
    }
}

getBlockUncleCount = {
    in_TP: or(_(T_Or(T_Number, T_String), P_BlockNumber), _(T_Hex32, P_BlockHash)),
    out_T: T_Number,
    name: "getBlockUncleCount",
    generate: async function(stmts) {
        let in_TP = handle_or(this.in_TP);
	let { n_stmts, arg } = await gen_arg(stmts, in_TP);

	n_stmts.push("await web3.eth.getBlockUncleCount(" + arg + ")");
	return n_stmts;
    }
}

getUncle = {
    in_TPs: [or(_(T_Or(T_Number, T_String), P_BlockNumber), _(T_Hex32, P_BlockHash)),
	     _(T_Number, WILL_BE("<UncleIdx@(param#1)>")),
	     _opt(T_Boolean, P_Rand)],
    out_T: T_BlockObj,
    name: "getUncle",
    generate: async function(stmts) {
	let in_TP, n_stmts, arg, res;
	let orig_index_maps = index_maps.slice();
	do {
	    index_maps = orig_index_maps.slice();
            in_TP = handle_or(this.in_TPs[0]);

	    res = await gen_arg(stmts.slice(), in_TP);
	    arg = res.arg;

	    res = await gen_with_pre_args(res.n_stmts, _(T_Number, P_UncleIdx(arg)));
	} while (!res)
        
	n_stmts = res.n_stmts;
	let args = [arg, res.arg];

	in_TP = handle_opt([this.in_TPs[2]]);

	if (in_TP.length == 0) {
	    n_stmts.push("await web3.eth.getUncle(" + args.join(", ") + ")");
	    return n_stmts;
	} else {
	    res = await gen_arg(n_stmts, in_TP[0]);
	    n_stmts = res.n_stmts;

	    n_stmts.push("await web3.eth.getUncle(" + args.concat([res.arg]).join(", ") + ")");
	    return n_stmts;
        }
    }
}

getTransaction = {
    in_TP: _(T_Hex32, P_TxHash),
    out_T: T_TxObj,
    name: "getTransaction",
    generate: async function(stmts) {
        let { n_stmts, arg } = await gen_arg(stmts, this.in_TP);
	
	n_stmts.push("await web3.eth.getTransaction(" + arg + ")");
	return n_stmts; 
    }
}

getPendingTransactions = {
    out_T: T_Array(T_TxObj),
    name: "getPendingTransactions",
    generate: async function(stmts) {
        stmts.push("await web3.eth.getPendingTransactions()");
	return stmts;
    }
}

getTransactionFromBlock = {
    in_TPs: [or(_(T_Or(T_Number, T_String), P_BlockNumber), _(T_Hex32, P_BlockHash)),
	     _(T_Number, WILL_BE("<TxIdx@(param#1)>"))],
    out_T: T_TxObj,
    name: "getTransactionFromBlock",
    generate: async function(stmts) {
	let n_stmts, arg, res;
	let in_TP;
	let orig_index_maps = index_maps.slice();
	do {
	    index_maps = orig_index_maps.slice();
            in_TP = handle_or(this.in_TPs[0]);
	    
	    res = await gen_arg(stmts.slice(), in_TP);
            arg = res.arg;

	    res = await gen_with_pre_args(res.n_stmts, _(T_Number, P_TxIdx(arg)));
	} while (!res)
	
	n_stmts = res.n_stmts;
	let args = [arg, res.arg];

	n_stmts.push("await web3.eth.getTransactionFromBlock(" + args.join(", ") + ")");
	return n_stmts;
    }
}

getTransactionReceipt = {
    in_TP: _(T_Hex32, P_TxHash),
    out_T: T_Or(T_TxRecObj, T_Null),
    name: "getTransactionReceipt",
    generate: async function(stmts) {
        let { n_stmts, arg } = await gen_arg(stmts, this.in_TP);
	
	n_stmts.push("await web3.eth.getTransactionReceipt(" + arg + ")");
	return n_stmts; 
    }
}

getTransactionCount = {
    in_TPs: [_(T_Address, P_EOA),
	     _opt(T_Or(T_Number, T_String), P_BlockNumber)],
    out_T: T_Number,
    name: "getTransactionCount",
    generate: async function(stmts) {
        let in_TPs = handle_opt(this.in_TPs);
	let { n_stmts, args } = await gen_args(stmts, in_TPs);
	
	n_stmts.push("await web3.eth.getTransactionCount(" + args.join(", ") + ")");
	return n_stmts; 
    },
    generate_with_args: function(stmts, args) {
        stmts.push("await web3.eth.getTransactionCount(" + args.join(", ") + ")");
	return stmts;
    }
        
}

getPastLogs = {
    in_TP: _(T_FilterObj, P_FilterObjProp),
    out_T: T_Array(T_LogObj),
    name: "getPastLogs",
    generate: async function(stmts) {
	let n_stmts = stmts, args = {};
        let in_TPs = unpack(this.in_TP);
        
	for (const [prop, TP] of Object.entries(in_TPs)) {
            let res = await gen_arg(n_stmts, TP);

            n_stmts = res.n_stmts;
            args[prop] = res.arg;
        }
        n_stmts.push("await web3.eth.getPastLogs(" + obj_to_str(args) + ")");
        return n_stmts;
    }
}

getChainId = {
    out_T: T_Number,
    name: "getChainId",
    generate: async function(stmts) {
        stmts.push("await web3.eth.getChainId()");
	return stmts;
    }
}

getProof = {
    in_TPs: [_(T_Address, P_Contract),
	     _(T_Array(T_Hex32), P_Array(WILL_BE("<StorageIdx@(param#1)>"))),
	     _(T_Or(T_Number, T_String), P_BlockNumber)],
    out_T: T_AccObj, 
    name: "getProof",
    generate: async function(stmts) {
	let cont;
	do {
	    cont = random_select(cont_vars);
	} while(cont.slots.length == 0)

        let arg = "aa" + stmts.length.toString();
        stmts.push("let " + arg + " = " + _dq(cont.options.address));

	let in_TPs = [_(T_Array(T_Hex32), P_Array(P_StorageIdx(cont))), this.in_TPs[2]];
	let { n_stmts, args } = await gen_args(stmts, in_TPs);

        args.unshift(arg);

        n_stmts.push("await web3.eth.getProof(" + args.join(", ") + ")");
	return n_stmts;
    }
}
