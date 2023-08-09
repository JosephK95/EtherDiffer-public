T_SyncObj = {
    is_T: true,
    name: "SyncObj",
    props_T: { startingBlock: T_Number,
	       currentBlock: T_Number,
	       highestBlock: T_Number,
	       knownStates: T_Number,
	       pulledStates: T_Number }
}

T_FeeObj = {
    is_T: true,
    name: "FeeObj",
    props_T: { oldestBlock: T_Number,
	       baseFeePerGas: T_Array(T_NumberString),
	       gasUsedRatio: T_Array(T_Number),
	       reward: T_Array(T_Array(T_NumberString)) }
}

T_LogObj = {
    is_T: true,
    name: "LogObj",
    props_T: { address: T_Address,
	       data: T_Hex,
	       topics: T_Array(T_Hex),
	       logIndex: T_Number,
	       transactionIndex: T_Number,
	       transactionHash: T_Hex32,
	       blockHash: T_Hex32,
	       blockNumber: T_Number }
}

T_FilterObj = {
    is_T: true,
    name: "FilterObj",
    props_T: { fromBlock: T_Or(T_Number, T_String),
	       toBlock: T_Or(T_Number, T_String),
	       address: T_Address,
	       topics: T_Array(T_Null) }
}

T_ProofObj = {
    is_T: true,
    name: "ProofObj",
    props_T: { key: T_String,
	       value: T_String }
}   

T_AccObj = {
    is_T: true,
    name: "AccObj",
    props_T: { address: T_Address,
	       balance: T_NumberString,
	       codeHash: T_Hex32,
	       nonce: T_NumberString,
	       storageHash: T_Hex32,
	       accountProof: T_Array(T_Hex),
	       storageProof: T_Array(T_ProofObj) }
}

T_TxObj = {
    is_T: true,
    name: "TxObj",
    props_T: { hash: T_Hex32,
	       nonce: T_Number,
	       blockHash: T_Or(T_Hex32, T_Null),
	       blockNumber: T_Or(T_Number, T_Null),
	       transactionIndex: T_Or(T_Number, T_Null),
	       from: T_Address,
	       to: T_Or(T_Address, T_Null),
	       value: T_NumberString,
	       gasPrice: T_NumberString,
	       gas: T_Number,
	       input: T_Or(T_Hex, T_Null) }
}

T_BlockObj = {
    is_T: true,
    name: "BlockObj",
    props_T: { number: T_Or(T_Number, T_Null),
	       hash: T_Or(T_Hex32, T_Null),
	       parentHash: T_Hex32,
	       baseFeePerGas: T_Number,
	       nonce: T_Or(T_Hex8, T_Null),
	       sha3Uncles: T_Hex32,
	       logsBloom: T_Or(T_Hex256, T_Null),
	       transactionsRoot: T_Hex32,
	       stateRoot: T_Hex32,
	       miner: T_Address,
               difficulty: T_NumberString,
	       totalDifficulty: T_NumberString,
	       extraData: T_Hex,
	       size: T_Number,
	       gasLimit: T_Number,
	       gasUsed: T_Number,
	       timestamp: T_Number,
	       transactions: T_Or(T_Array(T_TxObj), T_Array(T_Hex32)),
	       uncles: T_Array(T_Hex32) }
}

T_TxRlpObj = {
    is_T: true,
    name: "TxRlpObj",
    props_T: { raw: T_Hex,
	       "tx.nonce": T_Hex,
	       "tx.gasPrice": T_Hex,
	       "tx.gas": T_Hex,
	       "tx.to": T_Address,
	       "tx.value": T_Hex,
	       "tx.input": T_Or(T_Hex, T_Null),
	       "tx.v": T_Hex,
	       "tx.r": T_Hex32,
	       "tx.s": T_Hex32,
	       "tx.hash": T_Hex32 }
}

T_TxSendObj = {
    is_T: true,
    name: "TxSendObj",
    props_T: { from: T_Address,
	       to: T_Address,
	       value: T_NumberString,
	       gas: T_Number,
	       gasPrice: T_NumberString,
	       type: T_NumberString,
	       nonce: T_Number },
    opt_props: [ "value", "nonce" ]
}

T_TxSendObj1559 = {
    is_T: true,
    name: "TxSendObj1559",
    props_T: { from: T_Address,
	       to: T_Address,
	       value: T_NumberString,
	       gas: T_Number,
	       type: T_NumberString,
	       maxFeePerGas: T_NumberString,
	       maxPriorityFeePerGas: T_NumberString,
	       nonce: T_Number },
    opt_props: [ "value", "nonce" ]
}

T_TxRecObj = {
    is_T: true,
    name: "TxRecObj",
    props_T: { "status": T_Boolean,
	       blockHash: T_Hex32,
	       blockNumber: T_Number,
	       transactionHash: T_Hex32,
	       transactionIndex: T_Number,
	       from: T_Address,
	       to: T_Or(T_Address, T_Null),
	       contractAddress: T_Or(T_Address, T_Null),
	       cumulativeGasUsed: T_Number,
	       gasUsed: T_Number,
               logs: T_Array(T_LogObj),
	       effectiveGasPrice: T_Number }
}

T_McSendObj = {
    is_T: true,
    name: "McSendObj",
    props_T: { from: T_Address,
	       gas: T_Number,
	       gasPrice: T_NumberString,
	       value: T_NumberString,
	       nonce: T_Number },
    opt_props: [ "gasPrice", "nonce" ]
}

T_McCallObj = {
    is_T: true,
    name: "McCallObj",
    props_T: { from: T_Address,
	       gas: T_Number,
	       gasPrice: T_NumberString },
    opt_props: [ "gasPrice", "gas" ]
}
    
T_McEstGasObj = {
    is_T: true,
    name: "McEstGasObj",
    props_T: { from: T_Address,
	       gas: T_Number,
    	       value: T_NumberString },
    opt_props: [ "gas" ]
}

function isValid(obj) {
    return obj_isValid(this, obj);
}
function unroll_value(obj) {
    return obj_unroll_value(this, obj);
}

T_SyncObj["isValid"] = isValid;
T_FeeObj["isValid"] = isValid;
T_LogObj["isValid"] = isValid;

T_ProofObj["isValid"] = isValid;
T_AccObj["isValid"] = isValid;

T_TxObj["isValid"] = isValid;
T_BlockObj["isValid"] = isValid;
T_TxRlpObj["isValid"] = isValid;
T_TxRecObj["isValid"] = isValid;

T_SyncObj["unroll_value"] = unroll_value;
T_FeeObj["unroll_value"] = unroll_value;
T_LogObj["unroll_value"] = unroll_value;

T_ProofObj["unroll_value"] = unroll_value;
T_AccObj["unroll_value"] = unroll_value;

T_TxObj["unroll_value"] = unroll_value;
T_BlockObj["unroll_value"] = unroll_value;
T_TxRlpObj["unroll_value"] = unroll_value;
T_TxRecObj["unroll_value"] = unroll_value;
