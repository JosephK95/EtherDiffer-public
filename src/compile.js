const fs = require("fs");
const path = require("path");
const solc = require("solc");

const contract_dir = path.join(__dirname, ".." , "contracts");

function get_all_files(prefix, dir_path) {
    let array_of_files = [];
    let files = fs.readdirSync(dir_path);

    files.forEach(function(file) {
        if (!fs.statSync(dir_path + "/" + file).isDirectory()) {
	    array_of_files.push(prefix + file);
	}
    });
    return array_of_files;
}

function findImports(path) {
    let content = fs.readFileSync(contract_dir + "/" + path, "utf-8");
    return {contents: content};
}

const files = get_all_files("", contract_dir)
	      .concat(get_all_files("CrowdFund/", contract_dir + "/CrowdFund"))
	      .concat(get_all_files("DutchAuction/", contract_dir + "/DutchAuction"))
	      .concat(get_all_files("EnglishAuction/", contract_dir + "/EnglishAuction"));

let sources_obj = {};
for (let i = 0; i < files.length; i++) {
    sources_obj[files[i].slice(0, -4)] = {"urls": [files[i]]};
}

const input = {
    language: 'Solidity',
    sources: sources_obj,
    settings: {
        outputSelection: {
	    "*": {
	        "*": ["*"],
	    },
	},
    },
};
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

module.exports = output.contracts;
