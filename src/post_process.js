const fs = require("fs");
const path = require("path");

let keys = ["Geth", "Erigon", "Nethermind", "Besu"];
let error_report_path = path.join(__dirname, "../out/reports/error_report");
let value_report_path = path.join(__dirname, "../out/reports/value_report");

function error_check(tc_obj, results) {
    let infos = "", err_found = false;

    let ret_obj = results.reduce((obj, result, index) => {
        if (typeof result == "string" && result.includes("ERROR")) {
            infos += ("[INFO] " + keys[index] + ": " + result + "\n");
        } else {
	    obj[keys[index]] = result;
        }
	return obj;
    }, {});

    let error_count = (infos.match(/ERROR/g) || []).length;

    if (infos != "" && error_count < 4) {
        let report = "[REPORT] Error occurrence in " + tc_obj.id + "\n";
        fs.appendFileSync(error_report_path, report + tc_obj.tc + "\n" + infos + "\n");

	err_found = true;
    }
    return [ ret_obj, err_found ];
}   

function unroll_value(node_val_obj, out_T) {
    let ret_obj = Object.entries(node_val_obj).reduce((obj, [node, val]) => {
	obj[node] = out_T.unroll_value(val);

	return obj;
    }, {});
    return ret_obj;
}

function is_equal(target_val, val) {
    if (target_val === undefined || val === undefined || 
	target_val === null || val === null) {
	return target_val === val;
    }
    if (Array.isArray(target_val)) {
        if (Array.isArray(val) && (target_val.length == val.length)) {
	    return val.every((elem, index) => is_equal(target_val[index], elem));
	} else {
	    return false;
	}
    }
    if (typeof target_val == "object") {
        if (typeof val == "object" && is_equal(Object.keys(target_val), Object.keys(val))) {
	    return Object.entries(val).every(([prop, value]) => {
		return is_equal(target_val[prop], value);
	    });
        } else {
	    return false; 
	}
    }
    return target_val === val;
}

function all_equals(vals) {
    let target_val = vals[0];

    return vals.every(val => {
        if (is_equal(target_val, val)) {
            return true;
	} else {
	    return false;
	}
    });
}

function value_check(tc_obj, node_val_obj) {
    let infos = "", val_found = false;

    let prop_arr = Object.entries(node_val_obj).reduce((arr, [node, val]) => {
        return arr.concat(Object.keys(val));
    }, []);
    let prop_set = new Set(prop_arr);

    let node_names = [];

    prop_set.forEach(prop => {
        let vals = Object.entries(node_val_obj).reduce((arr, [node, val]) => {
	    node_names.push(node);

	    if (val.hasOwnProperty(prop)) {
	        arr.push(val[prop]);
	    } else {
	        arr.push(undefined);
	    }
	    return arr;
	}, []);

	if (!all_equals(vals)) {
            let info = vals.reduce((str, val, index) => {
	        str += (node_names[index] + ": " + JSON.stringify(val, null, 4) + " | ");
		return str;
            }, "[INFO] \"" + prop + "\" ~> ");

	    infos += (info.slice(0, -3) + "\n");
	}
    });
    if (infos != "") {
        let report = "[REPORT] Value mismatch in " + tc_obj.id + "\n";
        fs.appendFileSync(value_report_path, report + tc_obj.tc + "\n" + infos + "\n");

	val_found = true;
    }
    return val_found;
}

module.exports = { error_check, unroll_value, value_check } 
