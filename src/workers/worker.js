const { workerData, parentPort } = require("worker_threads");

const Web3 = require("web3");
const utils = require("../utils");

const gen_txs_BiDirectionalPaymentChannel
      = require("../../transactions/txs_BiDirectionalPaymentChannel");
const gen_txs_CrowdFund = require("../../transactions/txs_CrowdFund");
const gen_txs_DutchAuction = require("../../transactions/txs_DutchAuction");
const gen_txs_EnglishAuction = require("../../transactions/txs_EnglishAuction");
const gen_txs_ERC20 = require("../../transactions/txs_ERC20");
const gen_txs_ERC721 = require("../../transactions/txs_ERC721");
const gen_txs_EtherWallet = require("../../transactions/txs_EtherWallet");
const gen_txs_MerkleProof = require("../../transactions/txs_MerkleProof");
const gen_txs_MultiSigWallet = require("../../transactions/txs_MultiSigWallet");
const gen_txs_Storage = require("../../transactions/txs_Storage");
const gen_txs_TimeLock = require("../../transactions/txs_TimeLock");
const gen_txs_UniDirectionalPaymentChannel
      = require("../../transactions/txs_UniDirectionalPaymentChannel");

function gas_generator() {
    return random_select(["314159", "3141592", "0x3d0900", "1000000", "5000000", "1500000"]);
}

function gasPrice_generator() {
    return _dq(random_select(["20000000000", "0x4a817c800"]));
}

submit_count = 0;

web3_tx_node = new Web3(workerData[0]);
web3_tx_node.eth.accounts.wallet.create();

for (let i = 0; i < workerData[1].length; i++) {
    let account = web3_tx_node.eth.accounts.privateKeyToAccount(workerData[1][i]);
    web3_tx_node.eth.accounts.wallet.add(account);
}
let cont_obj = JSON.parse(workerData[2]);
let cont_var_key = Object.keys(cont_obj)[Object.keys(cont_obj).length - 1];

for (const [ name, obj ] of Object.entries(cont_obj)) {
    let json_interface = eval("obj.options.jsonInterface");
    let address = eval("obj.options.address");

    eval(name + " = new web3_tx_node.eth.Contract(json_interface, address);");

    if (name == cont_var_key) {
        eval("cont_var = " + name + ";");
        eval("cont_var.mc_list = [];");
        eval("cont_var.gen_txs = gen_txs_" + name + ";");
        eval("cont_var.owner = obj.owner;");
        eval("cont_var.users = obj.users;");
        eval("cont_var.nonce = 0;");
    }
}

async function submit_tx() {
    let mc = cont_var.mc_list[0];
    
    let args = {}; 
    args.from = _dq(mc.sender);
    args.gas = gas_generator();
    args.gasPrice = gasPrice_generator();
    args.nonce = await web3_tx_node.eth.getTransactionCount(mc.sender, "latest");
   
    if (mc.value !== undefined) {
        args.value = _dq(mc.value);
    }
    if (mc.func == "receive") {
	args.to = _dq(eval(mc.cont).options.address);
        return await eval("(async () => {" + 
			   "try {" + 
			   "return await web3_tx_node.eth.sendTransaction(" + obj_to_str(args) + 
			   ")} catch (error) {" +
			   "return \"[ERROR] \" + error.message;" +
                           "}})();");
    } else {
        return await eval("(async () => {" + 
			   "try {" + 
	                   "return await " + mc.cont + ".methods." + mc.func + "(" +
                                             mc.args.join(", ") + ").send(" + obj_to_str(args) + 
			   ")} catch (error) {" +
			   "return \"[ERROR] \" + error.message;" +
                           "}})();");
    } 
}

async function execute_worker(target_block_num) {
    let result;
    do {
        if (cont_var.mc_list.length == 0) {
            cont_var.gen_txs();
        }
        result = await submit_tx();
	submit_count++;

	if (typeof result != "string" || !result.includes("[ERROR]")) {
	    cont_var.mc_list.shift();
        }
    } while (result.blockNumber < target_block_num)

    parentPort.postMessage(submit_count);
}

parentPort.on("message", (message) => {
    if (message == "[GET]") {
        if (cont_var.mc_list.length == 0) {
            cont_var.gen_txs();
        }
        let mc = cont_var.mc_list[0];
        parentPort.postMessage(mc);
    }
    else execute_worker(message);
});
