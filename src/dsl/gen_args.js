const { validate } = require("../tc_gen");

async function check_out_T(stmts, out_T) {
    let tc = validate(stmts);
    let res = await eval(tc);
    let val = (Array.isArray(res) ? res[0] : res);

    if ((typeof val == "string" && val.includes("[ERROR]"))
	    			|| !out_T.isValid(val)) {
	return false;
    }
    return res;
}

async function gen_arg(stmts, in_TP) {
    let T = in_TP.T;
    let P = in_TP.P;

    if (P.is_Or) {
        if (random()) {
	    return gen_arg(stmts, _(T, P.P1));
	} else {
	    return gen_arg(stmts, _(T, P.P2));
	}
    } else if ((P.is_Static && !P.is_Dyn) || (P.is_Static && random())) {
        let arg = "aa" + stmts.length.toString();
	stmts.push("let " + arg + " = " + P.generate());

	return { "n_stmts": stmts, arg };
    } else {
	let backup_index_maps = index_maps.slice();

	while (true) { 
	    if (P.verified_values !== undefined &&
	        P.verified_values.size > 0 && random()) {

	        let arg = "aa" + stmts.length.toString();
		let verified_value = (P.name.includes("BlockNumber") ? 
				     random_select(Array.from(P.verified_values)) :
				     _dq(random_select(Array.from(P.verified_values))));

	        stmts.push("let " + arg + " = " + verified_value);
 	        return { "n_stmts": stmts, arg };
	    }
            let selected_api = random_select(Object.keys(P.mappings));
	    let post_fix = random_select(P.mappings[selected_api].post_fixes);

	    selected_api = eval(selected_api);
	    let n_stmts = await selected_api.generate(stmts.slice());

	    if (post_fix !== undefined) {
	        n_stmts.push("(" + n_stmts.pop() + ")" + post_fix);
            }
	    let res = await check_out_T(n_stmts, T);

	    if ((typeof res == "boolean") && !res) {
		index_maps = backup_index_maps.slice();
	        continue;
	    }
	    if (P.verified_values !== undefined) {
	        P.verified_values.add((Array.isArray(res) ? res[0] : res));
	    }
	    let arg = "aa" + (n_stmts.length - 1).toString();
	    n_stmts.push("let " + arg + " = " + n_stmts.pop());
		    
	    if (post_fix !== undefined && post_fix.includes("sample()")) {
	        index_maps[n_stmts.length - 1] = res[1];
	    }
	    return { n_stmts, arg };
        }
    }
}

async function gen_args(stmts, in_TPs) {
    let n_stmts = stmts;
    let args = [];

    for (const in_TP of in_TPs) {
        let res = await gen_arg(n_stmts, in_TP);

	n_stmts = res.n_stmts;
	args.push(res.arg);
    }
    return { n_stmts, args };
}

async function gen_with_pre_args(stmts, in_TP) {
    let T = in_TP.T;
    let P = in_TP.P;
    
    let api = Object.keys(P.mappings)[0];
    
    let pre_args = P.mappings[api].pre_args;
    let post_fix = P.mappings[api].post_fixes;

    api = eval(api);
    let n_stmts = api.generate_with_args(stmts.slice(), pre_args);

    if (post_fix !== undefined) {
        n_stmts.push("(" + n_stmts.pop() + ")" + post_fix[0]);
    }
    let res = await check_out_T(n_stmts, T);     
    if (typeof res != "boolean" || res) {
        let arg = "aa" + (n_stmts.length - 1).toString();
	n_stmts.push("let " + arg + " = " + n_stmts.pop());
	    
	if (post_fix !== undefined && post_fix[0].includes("index()")) {
	    index_maps[n_stmts.length - 1] = res;
	}	
	return { n_stmts, arg };
    }
    return false;
}

async function gen_tx_args(stmts, in_TP) {
    let tx_TPs = unpack(in_TP);
    let n_stmts, arg, res;
    do {
        res = await gen_arg(stmts.slice(), tx_TPs.from);
	arg = res.arg;

        res = await gen_with_pre_args(res.n_stmts, _(T_Number, P_Nonce(arg)));
    } while (!res)

    n_stmts = res.n_stmts;
    let args = { "from": arg, "nonce": res.arg };

    delete tx_TPs.from;
    delete tx_TPs.nonce;

    for (const [prop, tx_TP] of Object.entries(tx_TPs)) {
        res = await gen_arg(n_stmts, tx_TP);
        
	n_stmts = res.n_stmts;
        args[prop] = res.arg;
    }
    return { n_stmts, args };
}

async function gen_nonce_or_idx(stmts, TP) {
    let res, n_stmts, arg;

    if (TP.P.name.includes("Nonce")) {
        res = await gen_with_pre_args(stmts, _(T_Number, P_Nonce(_dq(random_select(accounts)))));
        return res;
    }
    let orig_index_maps = index_maps.slice();
    do {
	index_maps = orig_index_maps.slice();

	n_stmts = stmts.slice();
	arg = "aa" + stmts.length.toString();

	n_stmts.push("let " + arg + " = " + P_BlockNumber.generate());

        if (TP.P.name.includes("UncleIdx")) {
            res = await gen_with_pre_args(n_stmts, _(T_Number, P_UncleIdx(arg)));
        } else {
            res = await gen_with_pre_args(n_stmts, _(T_Number, P_TxIdx(arg)));
        }
    } while (!res)

    return res;
}

module.exports = { gen_arg, gen_args, gen_with_pre_args, 
		   gen_tx_args, gen_nonce_or_idx };
