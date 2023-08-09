const { gen_arg, gen_with_pre_args } = require("../gen_args");

methodCallSend = {
    in_TP: _(T_McSendObj, P_McSendObjProp),
    out_T: T_TxRecObj,
    name: "methodCallSend",
    is_send: true,
    generate: async function(stmts) {
        let chosen_worker = random_select(workers.filter(worker => worker.status === 0));

        chosen_worker.status = "[SEND]";
	chosen_worker.postMessage("[GET]");
	
	let mc = await (async() => {
            return new Promise((resolve, reject) => {
	        chosen_worker.once("message", (message) => {
		    resolve(message);
		});
	    });
	})();

        let in_TPs = unpack(this.in_TP);
	in_TPs.from.P = P_McSender(mc);
	
	if (mc.value === undefined) {
	    delete in_TPs.value;
	} else {
	    in_TPs.value.P = P_McValue(mc);
	}
	let n_stmts, arg, res;
	do {
	    res = await gen_arg(stmts.slice(), in_TPs.from);
	    arg = res.arg;

 	    res = await gen_with_pre_args(res.n_stmts, _(T_Number, P_Nonce(arg)));
	} while (!res);

	n_stmts = res.n_stmts;
	let args = { "from": arg, "nonce": res.arg };

	delete in_TPs.from;
    	delete in_TPs.nonce;

	for (const [prop, TP] of Object.entries(in_TPs)) {
	    res = await gen_arg(n_stmts, TP);
	    	    	
	    n_stmts = res.n_stmts;
	    args[prop] = res.arg;
	}
	if (mc.func == "receive") {
	    args.to = _dq(eval(mc.cont).options.address);
	    n_stmts.push("await web3.eth.sendTransaction(" + obj_to_str(args) + ")");
	} else {
	    n_stmts.push("await " + mc.cont + ".methods." + mc.func + "(" + 
			  	    mc.args.join(", ") + ").send(" + obj_to_str(args) + ")");
	}
	return n_stmts;
    }
}

methodCallCall = {
    in_TP: _(T_McCallObj, P_McCallObjProp),
    out_T: T_Any,
    name: "methodCallCall",
    is_send: true,
    generate: async function(stmts) {
        let chosen_worker = random_select(workers.filter(worker => worker.status === 0));
        chosen_worker.status = "[CALL]";
	chosen_worker.postMessage("[GET]");

	let mc = await (async() => {
	    return new Promise((resolve, reject) => {
	        chosen_worker.once("message", (message) => {
		    resolve(message);
		});
	    }); 
	})();

        let in_TPs = unpack(this.in_TP);	
	in_TPs.from.P = P_McSender(mc);

	let n_stmts = stmts;
	let args = [];

	for (const [prop, TP] of Object.entries(in_TPs)) {
            let res = await gen_arg(n_stmts, TP);
		
	    n_stmts = res.n_stmts;
	    args[prop] = res.arg;
	}
	if (mc.func == "receive") {
            args.to = _dq(eval(mc.cont).options.address);
	    n_stmts.push("await web3.eth.call(" + obj_to_str(args) + ")");
	} else {
	    n_stmts.push("await " + mc.cont + ".methods." + mc.func + "(" + 
			            mc.args.join(", ") + ").call(" + obj_to_str(args) + ")");
	}
	return n_stmts;
    }
}
    
methodCallEstGas = {
    in_TP: _(T_McEstGasObj, P_McEstGasObjProp),
    out_T: T_Number,
    name: "methodCallEstGas",
    is_send: true,
    generate: async function(stmts) {
        let chosen_worker = random_select(workers.filter(worker => worker.status === 0));

        chosen_worker.status = "[ESTGAS]";
	chosen_worker.postMessage("[GET]");
	
	let mc = await (async() => {
	    return new Promise((resolve, reject) => {
	        chosen_worker.once("message", (message) => {
		    resolve(message);
		});
	    });
	})();

        let in_TPs = unpack(this.in_TP);	
	in_TPs.from.P = P_McSender(mc);
	
	if (mc.value === undefined) {
	    delete in_TPs.value;
	} else {
	    in_TPs.value.P = P_McValue(mc);
        }
	let n_stmts = stmts;
	let args = [];

	for (const [prop, TP] of Object.entries(in_TPs)) {
	    let res = await gen_arg(n_stmts, TP);

	    n_stmts = res.n_stmts;
	    args[prop] = res.arg;
	}
	if (mc.func == "receive") {
	    args.to = _dq(eval(mc.cont).options.address);
	    n_stmts.push("await web3.eth.estimateGas(" + obj_to_str(args) + ")");
	} else {
	    n_stmts.push("await " + mc.cont + ".methods." + mc.func + "(" + 
		    		    mc.args.join(", ") + ").estimateGas(" + 
		    		    obj_to_str(args) + ")");
	}
	return n_stmts;
    }
}
