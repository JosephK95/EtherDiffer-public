const { gen_arg, gen_args, gen_tx_args } = require("../gen_args");

sendTransaction = {
    in_TP: or(_(T_TxSendObj, P_TxSendObjProp), _(T_TxSendObj1559, P_TxSendObj1559Prop)),
    out_T: T_TxRecObj,
    name: "sendTransaction",
    is_send: true,
    generate: async function(stmts) {
        let in_TP = handle_or(this.in_TP);
	let { n_stmts, args } = await gen_tx_args(stmts, in_TP);

	n_stmts.push("await web3.eth.sendTransaction(" + obj_to_str(args) + ")");
	return n_stmts;
    }
}

sendSignedTransaction = {
    in_TP: _(T_Hex, P_TxSigned),
    out_T: T_TxRecObj,
    name: "sendSignedTransaction",
    is_send: true,
    generate: async function(stmts) {
        let { n_stmts, arg } = await gen_arg(stmts, this.in_TP);
	
	n_stmts.push("await web3.eth.sendSignedTransaction(" + arg + ")");
	return n_stmts; 
    }
}

sign = {
    in_TPs: [_(T_String, P_Message),
	     _(T_Address, P_EOA)],
    out_T: T_String,
    name: "sign",
    generate: async function(stmts) {
        let { n_stmts, args } = await gen_args(stmts, this.in_TPs);

        n_stmts.push("await web3.eth.sign(" + args.join(", ") + ")");
	return n_stmts;
    }
}   

signTransaction = {
    in_TPs: [or(_(T_TxSendObj, P_TxSendObjProp), _(T_TxSendObj1559, P_TxSendObj1559Prop)),
	     _(T_Address, WILL_BE("<Const(param#1.from)>"))],
    name: "signTransaction",
    generate: async function(stmts) {
        let in_TP = handle_or(this.in_TPs[0]);
	let { n_stmts, args } = await gen_tx_args(stmts, in_TP);

	let stmt = n_stmts[Number(args.from.substring(2))];
	let addr = stmt.split(" ")[3];

	let idx = accounts.findIndex((acc) => addr.match(acc));
	n_stmts.push("await web3.eth.accounts.wallet[" + 
			    idx.toString() + "].signTransaction(" + obj_to_str(args) + ")");
	return n_stmts;
    }
}

call = {
    in_TPs: [or(_(T_TxSendObj, P_TxSendObjProp), _(T_TxSendObj1559, P_TxSendObj1559Prop)),
	     _opt(T_Or(T_Number, T_String), P_BlockNumber)],
    out_T: T_String,
    name: "call",
    generate: async function(stmts) {
        let in_TP = handle_or(this.in_TPs[0]);
	let { n_stmts, args } = await gen_tx_args(stmts, in_TP);

	let opt_TP = handle_opt([this.in_TPs[1]]);
	if (opt_TP.length == 0) {
	    n_stmts.push("await web3.eth.call(" + obj_to_str(args) + ")");
	    return n_stmts;
	} else {
	    let res = await gen_arg(n_stmts, opt_TP[0]);
	    n_stmts = res.n_stmts;

	    n_stmts.push("await web3.eth.call(" + obj_to_str(args) + ", " + res.arg + ")");
	    return n_stmts;
	}
    }
}

estimateGas = { 
    in_TP: or(_(T_TxSendObj, P_TxSendObjProp), _(T_TxSendObj1559, P_TxSendObj1559Prop)),
    out_T: T_Number,
    name: "estimateGas",
    generate: async function(stmts) {
        let in_TP = handle_or(this.in_TP);
        let { n_stmts, args } = await gen_tx_args(stmts, in_TP);

        n_stmts.push("await web3.eth.estimateGas(" + obj_to_str(args) + ")");
        return n_stmts;
    }
}
