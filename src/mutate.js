const __ = " ".repeat(4);
const { gen_arg, gen_with_pre_args, gen_nonce_or_idx } = require("./dsl/gen_args");

function extract_TPs(in_TP) {
    if (in_TP.is_Or) {
        return extract_TPs(in_TP.TP1).concat(extract_TPs(in_TP.TP2));
    }
    if (in_TP.T.props_T !== undefined) {
        let TPs = [], T, P;
	let keys = Object.keys(in_TP.T.props_T);

	keys.forEach(key => {
	    T = in_TP.T.props_T[key];
	    P = in_TP.P.props_P[key];

	    if (T !== undefined && P !== undefined) {
		TPs.push(_(T, P));
	    }
	});
	return TPs;
    }     
    return [in_TP];
}

async function instantiate(P) {
    switch(true) {
        case P.name.includes("Const"): 
            return P_Const(_dq(random_select(accounts)));
	case P.name.includes("StorageIdx"):
            let cont;
            do {
                cont = random_select(cont_vars);
            } while(cont.slots.length == 0)

	    return P_StorageIdx(cont);
	case P.name.includes("(mc).sender"):
	case P.name.includes("(mc).value"):
            let chosen_worker = random_select(workers);
            chosen_worker.postMessage("[GET]");
        
	    let mc = await (async() => {
                return new Promise((resolve, reject) => {
                    chosen_worker.once("message", (message) => {
                        resolve(message);
                    });
                });
            })();
	    if (P.name.includes("(mc).sender")) {
	        return P_McSender(mc);
	    } else {
	        return (mc.value !== undefined ? P_McValue(mc) : P_Const(_dq("0")));
	    }
        default: return P;
    }
}

async function mutate_arg(in_TP, stmts) {
    let T, P;
    if (in_TP.is_Or) {
        if (random()) {
	    T = in_TP.TP1.T;
	    P = in_TP.TP1.P;
	} else {
	    T = in_TP.TP2.T;
	    P = in_TP.TP2.P;
	}
    } else {
        T = in_TP.T;
        P = in_TP.P;
    }
    let TPs = [];
    for (const api of api_pool) {
        if (api.in_TP !== undefined) {
	    TPs = TPs.concat(extract_TPs(api.in_TP));
	} else if (api.in_TPs !== undefined) {
	    api.in_TPs.forEach(TP => {
	        TPs = TPs.concat(extract_TPs(TP));
	    });
 	}
    }
    let candidates = [];
    for (const TP of TPs) {
        if (T.mutable(TP.T) && P.name != TP.P.name) {
	    candidates.push(TP);
	}
    }
    let unique_candidates = candidates.filter((cand, index) => {
        const _cand = JSON.stringify(cand);
	return index === candidates.findIndex(obj => {
	    return JSON.stringify(obj) === _cand;
	});
    });
    if (unique_candidates.length === 0) {
        return { "n_stmts": stmts, "arg": null };
    } else {
        let chosen_TP = random_select(unique_candidates);
    	stmts.push(stmts.pop() + ";\n            // Mutation code starts from here");

	if (chosen_TP.P.name.includes("Nonce") || chosen_TP.P.name.includes("TxIdx") ||
	    chosen_TP.P.name.includes("UncleIdx")) {
	    return await gen_nonce_or_idx(stmts, chosen_TP);

	} else if (chosen_TP.P.name.includes("WILL_BE")) {
	    return await gen_arg(stmts, _(chosen_TP.T, await instantiate(chosen_TP.P)));

	} else {
	    return await gen_arg(stmts, chosen_TP);	
	}
    }
}       

async function mutate_obj(api, stmts) {
    let last_stmt = stmts[stmts.length - 1];

    let start_idx, end_idx, end_idx2;
    let args = [], types = [], props = [];

    let props_T = { "fromBlock": T_Or(T_Number, T_String),
	    	    "toBlock": T_Or(T_Number, T_String),
	   	    "address": T_Address,
	    	    "topics": T_Array(T_Null),
	    	    "to": T_Address,
	    	    "value": T_NumberString,
	    	    "gas": T_Number,
	    	    "gasPrice": T_NumberString,
	    	    "type": T_NumberString,
	    	    "nonce": T_Number,
	    	    "maxFeePerGas": T_NumberString,
	            "maxPriorityFeePerGas": T_NumberString };

    let props_P = { "fromBlock": P_BlockNumber,
	    	    "toBlock": P_BlockNumber,
	   	    "address": P_Contract,
	    	    "topics": P_Array(P_Null),
	    	    "to": P_EOA,
	    	    "value": P_Value,
	    	    "gas": P_Gas,
	    	    "gasPrice": P_GasPrice,
	    	    "type": (random() === 0 ? P_Const(_dq("0x0")) : P_Const(_dq("0x2"))),
	    	    "nonce": WILL_BE("<Nonce@(param#1.from)>"),
	    	    "maxFeePerGas": P_GasPrice,
	            "maxPriorityFeePerGas": P_GasPrice };

    if (api.name == "methodCallSend" || api.name == "methodCallEstGas") {
        delete props_T.value;
    } 
    Object.entries(props_T).forEach(([prop, prop_T]) => {
        if (last_stmt.includes(prop)) {

	    start_idx = last_stmt.indexOf(":", last_stmt.indexOf(prop));
	    if (last_stmt.substring(last_stmt.indexOf(prop), start_idx) !== prop) {
	        return;
	    } 
	    end_idx = last_stmt.indexOf(",", start_idx);
	    end_idx2 = last_stmt.indexOf("}") - 1;

	    if (end_idx < 0 || (end_idx2 > 0 && end_idx2 < end_idx)) {
	        end_idx = end_idx2;
	    }
	    let arg = last_stmt.substring(start_idx + 2, end_idx);
	    if (arg.substring(0, 2) == "aa") {
	        args.push(arg);
		    
	        types.push(prop_T);
	        props.push(props_P[prop]);
	    }
	}
    });
    start_idx = last_stmt.indexOf(",", last_stmt.indexOf("}"));
    if (start_idx > 0) {
	end_idx = last_stmt.indexOf(")", start_idx);

	args.push(last_stmt.substring(start_idx + 2, end_idx))

	types.push(T_Or(T_Number, T_String));
	props.push(P_BlockNumber);
    }
    if (args.length === 0) {
        return stmts; 
    }
    let mut_arg_idx = Math.floor(Math.random() * args.length);

    let arg = args[mut_arg_idx];
    let res = await mutate_arg(_(types[mut_arg_idx], props[mut_arg_idx]), 
	    	                 stmts.slice(0, stmts.length - 1));
    if (res.arg === null) {
	res.n_stmts.push(last_stmt);
    } else {
	mutated = true;
	res.n_stmts.push(last_stmt.replace(arg, res.arg)); 
    }    
    return res.n_stmts;
}

async function mutate(api, stmts) {
    if (api.in_TP === undefined && api.in_TPs === undefined) {
        return stmts;
    }
    if (["getPastLogs", "sendTransaction", "call", "estimateGas",
	 "methodCallSend", "methodCallCall", "methodCallEstGas"].includes(api.name)) {
        return await mutate_obj(api, stmts);
    }
    let last_stmt = stmts[stmts.length - 1];

    let start_idx = last_stmt.indexOf("(") + 1;
    let end_idx = last_stmt.indexOf(")");

    let arg, res;

    if (api.in_TP !== undefined) {
        arg = last_stmt.substring(start_idx, end_idx);
        res = await mutate_arg(api.in_TP, stmts.slice(0, stmts.length - 1));
    } else {
        let args = last_stmt.substring(start_idx, end_idx).split(", ");
        let mut_arg_idx = Math.floor(Math.random() * args.length);
       
	arg = args[mut_arg_idx];
	res = await mutate_arg(api.in_TPs[mut_arg_idx], stmts.slice(0, stmts.length - 1)); 
    }    
    if (res.arg === null) {
	res.n_stmts.push(last_stmt);
    } else {
	mutated = true;
	res.n_stmts.push(last_stmt.replace(arg, res.arg)); 
    }    
    return res.n_stmts;
}

module.exports = { mutate };
