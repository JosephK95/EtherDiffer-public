const Web3 = require("web3");
const utils = Web3.utils;
const { exec } = require("child_process");

_ = function(_T, _P) {
    if (!_T.is_T) {
        console.error("[ERROR] The given type \"" + _T + "\" is not valid");
    }
    if (!_P.is_P) {
        console.error("[ERROR] The given property \"" + _P + "\" is not valid");
    }
    return { T: _T,
             P: _P,
	     name: _T.name + _P.name }
}

_opt = function(_T, _P) {
    if (!_T.is_T) {
        console.error("[ERROR] The given type \"" + _T + "\" is not valid");
    }
    if (!_P.is_P) {
        console.error("[ERROR] The given property \"" + _P + "\" is not valid");
    }
    return { is_Opt: true,
	     T: _T,
             P: _P,
	     name: _T.name + _P.name }
}

or = function(_TP1, _TP2) {
    if (!_TP1.T.is_T || !_TP1.P.is_P) { 
        console.error("[ERROR] The given input \"" + _TP1 + "\" is not valid");
    }
    if (!_TP2.T.is_T || !_TP2.P.is_P) { 
        console.error("[ERROR] The given input \"" + _TP2 + "\" is not valid");
    }
    return { is_Or: true,
	     TP1: _TP1,
	     TP2: _TP2,
	     name: "(" + _TP1.name + " or " + _TP2.name + ")" }
}

handle_opt = function(TPs) {
    return TPs.filter(TP => (!TP.is_Opt || random()));
}

handle_or = function(TPs) {
    if (!TPs.is_Or) {
        console.error("[ERROR] The given input \"" + TPs + "\" is not valid");
    }
    if (random()) {
        return TPs.TP1;
    } else { 
        return TPs.TP2;
    }
}

_dq = function(val) { return "\"" + val + "\""; }

ether = function(val) { return utils.toWei(val.toString(), "ether"); }

delay = function(time) { return new Promise(resolve => setTimeout(resolve, time)); }

unpack = function(TP) {
    if (TP.is_Or) {
        if (random()) {
            return unpack(TP.TP1);
        } else {
            return unpack(TP.TP2);
        }
    }
    let T = TP.T;
    let P = TP.P;

    let ret_map = Object.entries(T.props_T).reduce((map, [prop, prop_T]) => {
        if (T.opt_props === undefined || !T.opt_props.includes(prop) || random()) {
            let prop_P = P.props_P[prop];
            map[prop] = { "T": prop_T, "P": prop_P };
        }
        return map;
    }, {});
    return ret_map;
}

isEmpty = function(obj) { return Object.keys(obj).length == 0; }

random = function() { return Math.round(Math.random()); }

random_select = function(arr) {
    if (arr === undefined) {
        return undefined;
    }
    return arr[Math.floor(Math.random() * arr.length)];
}

obj_to_str = function(args) {
    let ret_str = Object.entries(args).reduce((str, [key, value]) => {
        return (str + key + ": " + value + ", ");
    }, "{ ").slice(0, -2) + " }";

    return ret_str;
}

prim_unroll_value = function(T, val) {
    return { "rv": val };
}

obj_isValid = function(T, obj) {
    return (typeof obj == "object" && obj !== null &&
            Object.entries(T.props_T).every(([prop, prop_T]) => {
                return prop_T.isValid(eval("obj." + prop));
            }));
}

obj_unroll_value = function(T, obj) {
    if (typeof obj != "object" || obj === null) {
        return { "rv": obj };
    } else {
        let prop_val_maps = {}; 
	prop_val_maps["rv"] = obj;

        Object.entries(T.props_T).forEach(([prop, prop_T]) => {
            prop_val_maps["rv." + prop] = eval("obj." + prop);
        });
        return prop_val_maps;
    }
}

wait = async function(worker, index) {
    return new Promise((resolve, _) => {
        worker.once("message", (count) => {
            resolve();
        });
    });
}

begin_transactions = async function(target_block_num) {
    const txs = workers.map((worker, index) => {
        worker.postMessage(target_block_num);
        return wait(worker, index);
    });

    await Promise.all(txs);
}

change_worker_status = function() {
    workers.forEach(worker => {
	if (worker.status == "[SEND]") {
            worker.status = "[SEND: ERROR]";
        }
    });
}

clear_workers = function() {
    workers.forEach(worker => {
        worker.status = 0;
    });
}

apply_mode = async function(command) {
    return new Promise((resolve, _) => {
        const process = exec(command);

        process.stdout.once("data", (data) => {
            if ((JSON.parse(data)).result !== undefined) {
                resolve();
            }
        });
    });
}

stop_mining = async function() {
    const miners = web3_miners.map(miner => {
        return apply_mode(MINE_STOP + miner._provider.host);
    });
    await Promise.all(miners);
}

WILL_BE = function(_name) {
    return { is_P: true, name: "(WILL_BE: " + _name + ")" };
}
