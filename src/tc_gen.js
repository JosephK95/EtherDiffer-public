const fs = require("fs");
const path = require("path");

const tc_dir = path.join(__dirname, "..", "out/testcases");

const indent = " ".repeat(4);
const indent12 = " ".repeat(12);

const range_func = "function range(min, max) {\n" +
		   indent + "return Math.floor(Math.random() * (max - min + 1) + min);\n" +
	           "};\n";
const err_expr = indent + "if (this.length === 0) {\n" +
  		 "\tthrow new Error(\"property generation failure\");\n" +
		 indent + "}\n";
const sample_func = function(prop_flag) {
    return "Array.prototype.sample = function() {\n" +
	   (prop_flag ? err_expr : "") +
	   indent + "if (idx !== undefined) {\n" + 
	   "\tidx = Math.floor(Math.random() * this.length);\n" + 
	   "\treturn this[idx];\n" +
           indent + "} else { \n" +
	   "\treturn this[Math.floor(Math.random() * this.length)];\n" +
	   indent + "}\n};\n";
	   "};\n";
}
const index_func = function(prop_flag) {
    return "Array.prototype.index = function() {\n" +
	   (prop_flag ? err_expr : "") +
	   indent + "return Math.floor(Math.random() * this.length);\n" + 
	   "};\n";
}
const aux_funcs_with_errs = sample_func(true) + index_func(true);
const aux_funcs = sample_func(false) + index_func(false);

const _async = "(async () => {\n";

const try_geth = indent + "try {\n";
const try_all = "\ttry {\n";

const catch_geth = indent + "} catch (error) {\n\treturn \"[ERROR] \" + error.message;\n" + 
		   indent + "}\n";
const catch_all = "\t} catch (error) {\n" + indent12 + "return \"[ERROR] \" + error.message;\n" +
		   "\t}\n" + indent + "}\n";

const promise_geth = indent + "return await Promise.all([geth()]);\n";
const promise_all = indent + "return await Promise.all([geth(), erigon(), " +
			     			       "nethermind(), besu()]);\n";
const end = "})();";

function validate(stmts) {
    let tc = aux_funcs_with_errs + _async + try_geth;

    stmts.forEach((stmt, index) => {
        if (index != (stmts.length - 1)) {
	    let code = stmt.replace("web3", "web3_miners[0]");

            if (stmt.includes(".index()") && index_maps[index] !== undefined) {
	        tc += ("\t" + code.substring(0, code.indexOf("=") + 2) + 
		       index_maps[index].toString() + ";\n\t// " + code + "\n");
	    }
	    else if (stmt.includes(".sample()") && index_maps[index] !== undefined) {
                tc += ("\t" + code.replace(".sample()", "[" + 
		       index_maps[index].toString() + "]") + ";\n\t// " + code + "\n");
	    } else {
                tc += ("\t" + code + ";\n");
            }
	} 
    });
    if (stmts[stmts.length - 1].includes("sample()")) {
        tc += ("\tidx = -1;\n");
        tc += ("\treturn [" + stmts[stmts.length - 1].replace("web3", "web3_miners[0]") + ", idx];\n");
        tc += (catch_geth + end);
    }
    else {
        tc += ("\treturn " + stmts[stmts.length - 1].replace("web3", "web3_miners[0]") + ";\n");
        tc += (catch_geth + end);
    }
    return tc;
}

function to_tc_all(stmts) {
    let id = "TC_" + Math.floor(new Date() / 1000).toString() + ".js";
    let tc = _async;

    console.log("[OK] A new testcase is generated with ID: " + id + "\n");

    let func_names = ["async function geth()", "async function erigon()", 
	              "async function nethermind()", "async function besu()"];
    let node_vars = ["web3_geth", "web3_erigon",
                     "web3_nethermind", "web3_besu"];

    for (let i = 0; i < node_vars.length; i++) {
        let header = indent + func_names[i] + " {\n" + try_all;
        tc += header;

        stmts.forEach((stmt, index) => {
            if (index != (stmts.length - 1)) {
		if (stmt.includes("let")) {
		    let code;
		    if (stmt.includes("signTransaction")) {
		        code = stmt.replace("web3", "web3_miners[0]");
		    } else {
		        code = stmt.replace("web3", node_vars[i]);
		    }
		    if (stmt.includes(".index()") && index_maps[index] !== undefined) {
		        tc += (indent12 + code.substring(0, code.indexOf("=") + 2) + 
			       index_maps[index].toString() + ";\n" +
			       indent12 + "// " + code + "\n");
		    }
		    else if (stmt.includes(".sample()") && index_maps[index] !== undefined) {
		        tc += (indent12 + code.replace(".sample()", "[" + 
			       index_maps[index].toString() + "]") + ";\n" +
			       indent12 + "// " + code + "\n");
		    } else {
                        tc += (indent12 + code + ";\n");
		    }
		} else {
		    tc += (indent12 + stmt + "\n");
		}
            }
        });
        tc += (indent12 + "return " + stmts[stmts.length - 1].replace("web3", node_vars[i]) + ";\n");
	tc += catch_all;
    }
    tc += (promise_all + end);

    fs.writeFileSync(path.join(tc_dir, id), tc);
    return { id, tc };
}

module.exports = { validate, to_tc_all };
