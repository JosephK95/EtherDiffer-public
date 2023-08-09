P_Or = function(_P1, _P2) {
    if (!_P1.is_P) {
        console.error("[ERROR] The given property \"" + _P1 + "\" is not valid");
    }
    if (!_P2.is_P) {
        console.error("[ERROR] The given property \"" + _P2 + "\" is not valid");
    }
    return { is_P: true,
             is_Or: true,
             name: "(" + _P1.name + "\\/" + _P2.name + ")",
	     P1: _P1,
	     P2: _P2
	   }
}

P_Array = function(P) {
    return { is_P: true,
	     is_Static: true,
 	     name: "<[" + P.name.substring(1, P.name.length-1) + "]>",
	     generate: function() {
	         if (P.name.includes("Range")) {
		     let sub_P = P.generate();
		     return "[" + sub_P.substring(0, sub_P.indexOf(";")) + "]; // " + this.name;
		 }
	         return "[" + P.generate() + "]";
	     } }
}

P_FilterObjProp = {
    is_P: true,
    name: "<FilterObjProp>",
    props_P: { fromBlock: P_BlockNumber,
	       toBlock: P_BlockNumber,
	       address: P_Contract,
    	       topics: P_Array(P_Null) }
}

P_TxSendObjProp = {
    is_P: true,
    name: "<TxSendObjProp>",
    props_P: { from: P_EOA,
	       to: P_EOA,
	       value: P_Value,
	       gas: P_Gas,
	       gasPrice: P_GasPrice,
	       type: P_Const(_dq("0x0")),
	       nonce: WILL_BE("<Nonce@(param#1.from)>") }
}

P_TxSendObj1559Prop = {
    is_P: true,
    name: "<TxSendObj1559Prop>",
    props_P: { from: P_EOA,
	       to: P_EOA,
	       value: P_Value,
	       gas: P_Gas,
	       type: P_Const(_dq("0x2")),
	       maxFeePerGas: P_GasPrice,
	       maxPriorityFeePerGas: P_GasPrice,
	       nonce: WILL_BE("<Nonce@(param#1.from)>") }
}

P_McSendObjProp = {
    is_P: true,
    name: "<McSendObjProp>",
    props_P: { from: WILL_BE("<(mc).sender>"),
	       gasPrice: P_GasPrice,
	       gas: P_Gas,
	       value: WILL_BE("<(mc).value>"),
	       nonce: WILL_BE("<Nonce@(param#1.from)>") }
}

P_McCallObjProp = {
    is_P: true,
    name: "<McCallObjProp>",
    props_P: { from: WILL_BE("<(mc).sender>"),
	       gasPrice: P_GasPrice,
	       gas: P_Gas }
}

P_McEstGasObjProp = {
    is_P: true,
    name: "<McEstGasObjProp>",
    props_P: { from: WILL_BE("<(mc).sender>"),
	       gas: P_Gas,
	       value: WILL_BE("<(mc).value>") }
}
