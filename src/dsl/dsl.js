const prim_types = require("./types/prim_types");
const comp_types = require("./types/comp_types");
const obj_types = require("./types/obj_types");

const static_props = require("./props/static_props");
const dyn_props = require("./props/dyn_props");
const comp_props = require("./props/comp_props");

const get_apis = require("./apis/get_apis");
const send_apis = require("./apis/send_apis");
const mc_apis = require("./apis/mc_apis");

const api_set_1 = [ getProtocolVersion, isSyncing, isMining, getGasPrice, getFeeHistory,
                    getAccounts, getBlockNumber, getBalance, getCode, getStorageAt,
                    getBlock, getBlockTransactionCount, getBlockUncleCount, getUncle,
                    getTransaction, getTransactionFromBlock, getPendingTransactions,
                    getTransactionReceipt, getTransactionCount, getProof,
                    getChainId, getPastLogs ];
const api_set_2 = [ sendTransaction, sign, call, estimateGas, sendSignedTransaction ];
const api_set_3 = [ methodCallSend, methodCallCall, methodCallEstGas ];

api_pool = api_set_1.concat(api_set_2).concat(api_set_3);
