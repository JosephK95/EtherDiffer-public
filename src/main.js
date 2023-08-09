const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const { execSync } = require("child_process");

const utils = require("./utils");
const consts = require("./consts");
const contracts = require("./compile");

const { create_initial_accounts, create_owner_accounts } = require("./accounts");
const { create_configs } = require("./configs");
const { init_geth, init_geth_miner, init_geth_aux, init_erigon, 
	init_nethermind, init_besu, check_connection } = require("./bootnodes");
const { transfer_owner_Ethers, transfer_user_Ethers } = require("./faucet");
const { deploy_contracts } = require("./deploy");
const { setup_contracts } = require("./setup_contracts");
const { start_workers } = require("./workers/start_workers");

const dsl = require("./dsl/dsl");

const { mutate } = require("./mutate");
const { to_tc_all } = require("./tc_gen");
const { error_check, unroll_value, value_check } = require("./post_process");

/* Inter-Modular Global Variables
 *
 * global.owner: Account address for deploying contracts
 * global.geth_{tx1, tx2, tx3}_account: Account addresses for TX submissions
 
 * global.web3_geth: Web3 object to interact with Geth node
 * global.web3_erigon: Web3 object to interact with Erigon node
 * global.web3_nethermind: Web3 object to interact with Nethermind node
 * global.web3_besu: Web3 object to interact with Hyperledger Besu node
 *
 * global.web3_tx_nodes: Array that contains Web3 objects to interact with TX submitting nodes
 * global.web3_miners: Array that contains Web3 objects to interact with mining nodes
 *
 * global.accounts: Shared accounts in the wallet to conduct differential testing
 *
 * global.cont_addrs: Addresses of deployed smart contracts
 * global.{Counter, ERC20_CrowdFund, CrowdFund, ERC721_DutchAuction, ERC721_EngAuction,
 * 	   ERC20, ERC721, MerkleProof, MultiSigWallet, Storage,
 * 	   EtherWallet0, EtherWallet1, EtherWallet2, EtherWallet3, EtherWallet4,
 * 	   TimeLock0, TimeLock1, TimeLock2, TimeLock3, TimeLock4}
 * 	   : Addresses of deployed smart contracts
 */

web3_tx_nodes = [], web3_miners = [], accounts = [], cont_addrs = [], cont_vars = [], workers = [];
chain_height = 300, tc_num = 600, mut_prob = 0.5;

function parse_args() {
    let args = process.argv;

    for (let offset = 2; offset < args.length; offset += 2){
        switch(args[offset]){
	    case "--chain":
	        chain_height = parseInt(args[offset + 1]);
		break;
	    case "--tc":
		tc_num = parseInt(args[offset + 1]);
		break;
	    case "--mut-prob":
	        mut_prob = (parseInt(args[offset + 1]) / 100);
		break;
	    case "--help":
                console.log("NAME:");
                console.log("    EtherDiffer - Differential testing tool for RPC handling of Ethereum nodes\n");
                console.log("USAGE:");
                console.log("    node src/main.js [options]\n");
                console.log("OPTIONS:");
                console.log("    --chain value           (default: 300)");
		console.log("          Height of non-deterministic chain to generate");
                console.log("    --tc value              (default: 600)");
		console.log("          Number of test cases to generate");
                console.log("    --mut-prob value        (default: 50)");
		console.log("          Probability of invalid test case mutation");
	        process.exit(0);
	    default:
                console.log("Invalid options. Terminating EtherDiffer... Done.");
	        process.exit(0);
        }
    }
}

async function create_dirs() {
    const dir_names = ["data-geth", "data-erigon", "data-nethermind", "data-besu",
                       "data-tx-1", "data-tx-2", "data-tx-3", "data-tx-4", 
	    	       "data-tx-5", "data-tx-6", "data-tx-7", "data-tx-8", 
	    	       "data-tx-9", "data-tx-10", "data-tx-11", "data-tx-12",
                       "data-mining", "data-mining-2", "data-mining-3",
                       "out", "out/data", "out/logs", 
	    	       "out/configs", "out/testcases", "out/reports"];

    for (const dir_name of dir_names) {
        let dir_path = path.join(__dirname, "..", dir_name);
        await fs.mkdirSync(dir_path);

        if (dir_name == "out/reports") {
            fs.writeFileSync(dir_path + "/error_report",
                             "=============== [ ERROR MISMATCH REPORTS ] ===============\n\n");
            fs.writeFileSync(dir_path + "/value_report",
                             "=============== [ VALUE MISMATCH REPORTS ] ===============\n\n");
        }
    }
}

async function main() {
    parse_args();
    
    console.log("==============================================================");
    console.log("==============================================================");
    console.log("||                                                          ||");
    console.log("||  Differential Testing on RPC Handling of Ethereum Nodes  ||");
    console.log("||                                                          ||"); 
    console.log("==============================================================");
    console.log("==============================================================\n\n");

    await create_dirs();
    console.log("--------------- [CREATING NETWORK CONFIGURATIONS..] ---------------\n");
    
    await create_initial_accounts();
    create_configs();
    console.log("DONE.\n");
    
    console.log("--------------- [INITIALIZING GETH..] ---------------\n");
    let enode_url = await init_geth_miner(false);
    await init_geth(enode_url);
    console.log("DONE.\n");
    
    console.log("--------------- [INITIALIZING TX(SENDER) NODES..] ---------------\n");
    await init_geth_aux("TX1", enode_url);
    await init_geth_aux("TX2", enode_url);
    await init_geth_aux("TX3", enode_url);
    await init_geth_aux("TX4", enode_url);
    await init_geth_aux("TX5", enode_url);
    await init_geth_aux("TX6", enode_url);
    await init_geth_aux("TX7", enode_url);
    await init_geth_aux("TX8", enode_url);
    await init_geth_aux("TX9", enode_url);
    await init_geth_aux("TX10", enode_url);
    await init_geth_aux("TX11", enode_url);
    await init_geth_aux("TX12", enode_url);
    console.log("DONE.\n");
    
    console.log("--------------- [INITIALIZING ERIGON..] ---------------\n");
    await init_erigon(enode_url);
    console.log("DONE.\n");

    console.log("--------------- [INITIALIZING NETHERMIND..] ---------------\n");
    await init_nethermind(enode_url);
    console.log("DONE.\n");

    console.log("--------------- [INITIALIZING BESU..] ---------------\n");
    await init_besu(enode_url);
    console.log("DONE.\n");
    
    console.log("--------------- [INITIALIZING MINING NODES..] ---------------\n");
    await init_geth_aux("Miner2", enode_url);
    await init_geth_aux("Miner3", enode_url);
    console.log("DONE.\n");
    
    check_connection();

    web3_geth = new Web3("http://localhost:" + GETH_RPC_PORT);
    web3_erigon = new Web3("http://localhost:" + ERIGON_RPC_PORT);
    web3_nethermind = new Web3("http://localhost:" + NETHERMIND_RPC_PORT);
    web3_besu = new Web3("http://localhost:" + BESU_RPC_PORT);

    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX1_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX2_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX3_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX4_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX5_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX6_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX7_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX8_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX9_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX10_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX11_RPC_PORT));
    web3_tx_nodes.push(new Web3("http://localhost:" + GETH_TX12_RPC_PORT));

    web3_miners.push(new Web3("http://localhost:" + GETH_MINER1_RPC_PORT));
    web3_miners.push(new Web3("http://localhost:" + GETH_MINER2_RPC_PORT));
    web3_miners.push(new Web3("http://localhost:" + GETH_MINER3_RPC_PORT));
   
    create_owner_accounts();
    await transfer_owner_Ethers();	
    await delay(6000);
    await deploy_contracts();
   
    setup_contracts();
    await transfer_user_Ethers();
    
    start_workers();
    await delay(5000);

    let tc_count = 0, exp_count = 0, exec_count = 0, err_count = 0, val_count = 0;

    while (true) {
        console.log("\n--------------- [ CHAIN GENERATION PHASE BEGINS..] ---------------\n");

	let blockNum = await web3_geth.eth.getBlockNumber();
	P_BlockNumber.blockNum = blockNum + chain_height;

        process.stdout.write("[INFO] Sending multi-concurrent transactions to the network... ");
	
	await begin_transactions(blockNum + chain_height);
        await stop_mining();
	console.log("DONE.");

	let sync_status = true;
        process.stdout.write("[INFO] Syncing nodes... ");
	
	while (sync_status) {
	    await delay(8000);
	    sync_status = !!await web3_geth.eth.isSyncing();
	    sync_status = (!!await web3_erigon.eth.isSyncing() || sync_status);
	    sync_status = (!!await web3_nethermind.eth.isSyncing() || sync_status);
	    sync_status = (!!await web3_besu.eth.isSyncing() || sync_status);

	    for (let i = 0; i < web3_tx_nodes.length; i++) {
	        sync_status = (!!await web3_tx_nodes[i].eth.isSyncing() || sync_status); 
            } 
	    for (let i = 0; i < web3_miners.length; i++) {
	        sync_status = (!!await web3_miners[i].eth.isSyncing() || sync_status); 
	    }
	}
	console.log("DONE.\n");
	
	execSync("cp -r data-geth out/data/data-geth");
	execSync("cp -r data-erigon out/data/data-erigon");
	execSync("cp -r data-nethermind out/data/data-nethermind");
	execSync("cp -r data-besu out/data/data-besu");
        execSync("cp -r data-mining out/data/data-mining");
    
	console.log("\n------------- LET'S GO!! [ DIFFERENTIAL TESTING BEGINS ] -------------\n");
	await delay(2000);

	for (let iter = 0; iter < Math.round(tc_num * 0.9); iter++) { 
	    let api = random_select(api_pool);

	    if (api.is_send) {
	        iter--;
		continue;
	    }
	    index_maps = Array.apply(null, Array(20)).map(function () {});
	    
	    let stmts = await api.generate([]);
	    let is_mut = (Math.random() < mut_prob);

	    if (is_mut) {
   	        let mutate_try_count = 0;
	   	mutated = false;
		do {
	            stmts = await mutate(api, stmts);
		    mutate_try_count++;
	        } while (!mutated && mutate_try_count < 10)

		if (mutate_try_count === 10) {
	            iter--;
		    clear_workers();
		    continue;
	    	}
	    }
	    let tc_obj = to_tc_all(stmts);
	    console.log(tc_obj.tc);
	    console.log("--------------------------------------------------------------");
	
    	    tc_count++;
	  
	    let exec_prom = eval(tc_obj.tc);
	    let timeout = new Promise((resolve) => setTimeout(resolve, 10000, "[ERROR] [Node Error] Timeout"));
	   
	    let results = await Promise.any([exec_prom, timeout]);

	    if (results === "[ERROR] [Node Error] Timeout") {
		exp_count++;
	        console.log(">> TIMEOUT!\n");

                let tc_results = ("[" + tc_obj.id + "]\n-------------------\n" + tc_obj.tc
		    		      + "\n--------------------------------------------------------------\n>> " 
		    		      + JSON.stringify(results, null, 4) + "\n\n\n");
	        fs.writeFileSync("out/exec-results", tc_results, { flag: "a" });
		
		iter--;
		clear_workers();
	   	continue;
	    }
            
	    exec_count++;
	    console.log(">> " + JSON.stringify(results, null, 4) + "\n");
        
            let tc_results = ("[" + tc_obj.id + "]\n-------------------\n" + tc_obj.tc
		    		  + "\n--------------------------------------------------------------\n>> " 
		    		  + JSON.stringify(results, null, 4) + "\n\n\n");
	    fs.writeFileSync("out/exec-results", tc_results, { flag: "a" });
	    
	    let [ node_val_obj, has_report ] = error_check(tc_obj, results);
	    if (has_report) {
	        err_count++;
	    }  
	    node_val_obj = unroll_value(node_val_obj, api.out_T);
	    
	    has_report = value_check(tc_obj, node_val_obj);
	    if (has_report) {
	        val_count++;
	    }
	    if (tc_count % 20 === 0) {
                console.log("--------------------------------------------------------------");
                console.log("         Current Status of the Differential Testing           ");
    	        console.log("--------------------------------------------------------------");
    	        console.log("         > # of Generated Test Cases: " + tc_count.toString()); 
    	        console.log("         > # of Successfully Executed Test Cases: " + 
		    					            exec_count.toString()); 
       	        console.log("         > # of Timeout Expirations: " + exp_count.toString()); 
    	        console.log("--------------------------------------------------------------");
     	        console.log("         > # of Error Occurrences Found: " + err_count.toString()); 
   	        console.log("         > # of Value Mismatches Found: " + val_count.toString()); 
    	        console.log("--------------------------------------------------------------\n");
	    }
	    clear_workers();
	    await delay(2000); 
	}

	execSync("kill -9 `pidof geth`");
	execSync("kill -9 `pidof geth_delay`");
	execSync("kill -9 `pidof erigon`");
	execSync("kill -9 `pidof Nethermind.Runner`");
	execSync("kill -9 `pidof java`");
	
	let cont_names = ["BiDirectionalPaymentChannel", "ERC20_CrowdFund", 
			  "CrowdFund", "ERC721_DutchAuction", "DutchAuction",
			  "ERC721_EngAuction", "EnglishAuction", "ERC20", "ERC721",
			  "EtherWallet", "MerkleProof", "MultiSigWallet", "Storage",
			  "TimeLock", "UniDirectionalPaymentChannel"];
	
	for (let iter = 0; iter < Math.round(tc_num * 0.1); iter++) { 
	    execSync("rm -rf data-mining");
	    execSync("cp -r out/data/data-mining data-mining");
            await init_geth_miner(true);	   
	            
	    sync_status = true;
	    while (sync_status) {
		await delay(2000);
	        sync_status = !!await web3_miners[0].eth.isSyncing();
	    }
	    let api = random_select([ sendTransaction, sendSignedTransaction, methodCallSend, 
				      methodCallCall, methodCallEstGas ]);
	    index_maps = Array.apply(null, Array(20)).map(function () {});
	    
	    let stmts = await api.generate([]);
	    let is_mut = (Math.random() < mut_prob);

	    if (is_mut) {
   	        let mutate_try_count = 0;
	   	mutated = false;
		do {
	            stmts = await mutate(api, stmts);
		    mutate_try_count++;
	        } while (!mutated && mutate_try_count < 10)

		if (mutate_try_count === 10) {
		    execSync("kill -9 `pidof geth_miner`");
	            
		    iter--;
		    clear_workers(); 
		    continue;
	    	}
	    } 
	    let tc_obj = to_tc_all(stmts);
	    console.log(tc_obj.tc);
	    console.log("--------------------------------------------------------------");
	
    	    tc_count++;
 	    execSync("kill -9 `pidof geth_miner`");

            let node_names = ["geth", "erigon", "nethermind", "besu"];
	    let ports = ["8545", "8547", "8548", "8549"];

	    let stmt = "Promise.all([geth(), erigon(), nethermind(), besu()]);";
	    let results = [];

	    for (let i = 0; i < node_names.length; i++) {
	        execSync("rm -rf data-mining");
	        execSync("rm -rf data-" + node_names[i]);
	        execSync("cp -r out/data/data-mining data-mining");
	        execSync("cp -r out/data/data-" + node_names[i] + " data-" + node_names[i]);
		    
		enode_url = await init_geth_miner(true);
	  	await delay(2000);
		await eval("init_" + node_names[i] + "(enode_url, false)");

	        sync_status = true;
		while (true) {
	            await delay(2000);
		    let target_num = await eval("web3_" + node_names[i] + ".eth.getBlockNumber()");
		    let cur_num = await web3_miners[0].eth.getBlockNumber();

		    if (target_num === cur_num) {
			break;
		    }
		}
		if (api.name.includes("method")) {
         	    for (let j = 0; j < cont_names.length; j++) {
	    	        eval(cont_names[j] + ".currentProvider.host = \"http://localhost:" + ports[i] + "\"");
	    		eval(cont_names[j] + "._requestManager.provider.host = \"http://localhost:" + ports[i] + "\"");
	    		eval(cont_names[j] + "._provider.host = \"http://localhost:" + ports[i] + "\"");
		    }
		}
		let exec_prom = eval(tc_obj.tc.replace(stmt, node_names[i] + "();"));
	    	let timeout = new Promise((resolve) => setTimeout(resolve, 10000, "[ERROR] [Node Error] Timeout"));
	    	
		results.push(await Promise.any([exec_prom, timeout]));
		     
	    	execSync("kill -9 `pidof " + (i === 2 ? "Nethermind.Runner" : (i === 3 ? "java" : node_names[i])) + "`");
		execSync("kill -9 `pidof geth_miner`");
       		         
		clear_workers();
	    }
	    if ((results[0] === "[ERROR] [Node Error] Timeout") && (results[0] === results[1]) &&
		(results[0] === results[2]) && (results[0] === results[3])) {
	        exp_count++;
	    } else {
	        exec_count++;
	    }
	    console.log(">> " + JSON.stringify(results, null, 4) + "\n");
        
            let tc_results = ("[" + tc_obj.id + "]\n-------------------\n" + tc_obj.tc
		    		  + "\n--------------------------------------------------------------\n>> " 
		    		  + JSON.stringify(results, null, 4) + "\n\n\n");
	    fs.writeFileSync("out/exec-results", tc_results, { flag: "a" });
	    
	    let [ node_val_obj, has_report ] = error_check(tc_obj, results);
	    if (has_report) {
	        err_count++;
	    }
	    node_val_obj = unroll_value(node_val_obj, api.out_T);
	    
	    has_report = value_check(tc_obj, node_val_obj);
	    if (has_report) {
	        val_count++;
	    }
	    if (tc_count % 20 === 0) {
                console.log("--------------------------------------------------------------");
                console.log("         Current Status of the Differential Testing           ");
    	        console.log("--------------------------------------------------------------");
    	        console.log("         > # of Generated Test Cases: " + tc_count.toString()); 
    	        console.log("         > # of Successfully Executed Test Cases: " + 
		    					            exec_count.toString()); 
       	        console.log("         > # of Timeout Expirations: " + exp_count.toString()); 
    	        console.log("--------------------------------------------------------------");
     	        console.log("         > # of Error Occurrences Found: " + err_count.toString()); 
   	        console.log("         > # of Value Mismatches Found: " + val_count.toString()); 
    	        console.log("--------------------------------------------------------------\n");
	    }
	}

	let stats = ("--------------------------------------------------------------\n"
               	    + "         Current Status of the Differential Testing           \n"
    	            + "--------------------------------------------------------------\n"
    	            + "         > # of Generated Test Cases: " + tc_count.toString() + "\n"
    	            + "         > # of Successfully Executed Test Cases: " + exec_count.toString() + "\n"
       	            + "         > # of Timeout Expirations: " + exp_count.toString() + "\n"
    	            + "--------------------------------------------------------------\n"
     	            + "         > # of Error Occurrences Found: " + err_count.toString() + "\n"
   	            + "         > # of Value Mismatches Found: " + val_count.toString() + "\n"
    	            + "--------------------------------------------------------------\n");

	fs.writeFileSync("out/exec-results", stats, { flag: "a" });
        execSync("rm -rf data-*");
	 
	console.log("EtherDiffer Generation and Testing Completed Successfully!");
	process.exit(0);
    }
}

main();
