const fs = require("fs");
const path = require("path");
const { spawn, spawnSync, exec, execSync } = require("child_process");

const { create_config_nethermind } = require("./configs");

async function init_geth(enode_url, print = true) {
    return new Promise((resolve, reject) => {
        spawnSync("geth", ["init", "--datadir", GETH_DIR, GETH_CONFIG_PATH],
                          { env: { "PATH": CLIENT_BIN_PATH } });
        process.stdout.write(print ? "[OK] Geth node is initialized w.r.t " + GETH_CONFIG_PATH + "\n" : "");

        let tmp_process = spawn("geth", ["--datadir", GETH_DIR,
                                         "--port", GETH_P2P_PORT,
					 "--authrpc.port", GETH_AUTHRPC_PORT,
                                         "--http.port", GETH_RPC_PORT].concat(GETH_FLAGS),
                                         { env: { "PATH": CLIENT_BIN_PATH }, shell: true });
        tmp_process.on("spawn", () => {
            process.stdout.write(print ? "[OK] Geth node is executing on ports " + GETH_P2P_PORT + 
		   			 " and " + GETH_RPC_PORT + "\n" : "");
            admin_addPeer("Geth", enode_url, GETH_RPC_PORT, print).then(() => resolve());
        });
    });
}

async function init_geth_miner(is_testing) {
    return new Promise((resolve, reject) => {
	let binary = (is_testing ? "geth_miner" : "geth_delay");
	    
        spawnSync(binary, ["init", "--datadir", GETH_MINER1_DIR, GETH_CONFIG_PATH],
                          { env: { "PATH": CLIENT_BIN_PATH } });

        let tmp_process = spawn(binary, ["--datadir", GETH_MINER1_DIR,
                                         "--port", GETH_MINER1_P2P_PORT,
                                         "--authrpc.port", GETH_MINER1_AUTHRPC_PORT,
                                         "--http.port", GETH_MINER1_RPC_PORT].concat(GETH_MINER1_FLAGS),
                                        { env: { "PATH": CLIENT_BIN_PATH }, shell: true });
        tmp_process.on("spawn", () => {
            const id = setInterval(function() {
                let tmp_process2 = exec("curl --data '{\"method\":\"admin_nodeInfo\",\"params\":[]," +
                                                      "\"id\":1,\"jsonrpc\":\"2.0\"}' " +
                                                      "-H \"Content-Type: application/json\" " +
                                                      "-X POST localhost:8565");
                tmp_process2.stdout.on("data", (data) => {
                    const enode_url = data.substring(data.indexOf("enode://"), data.indexOf(":30323") + 6);

                    clearInterval(id);
                    resolve(enode_url);
                });
            }, 1000);
        });
    });
}

async function admin_addPeer(type, enode_url, rpc_port, print = true) {
    return new Promise((resolve, reject) => {
        const id = setInterval(function() {
            let tmp_process2 = exec("curl --data '{\"method\":\"admin_addPeer\",\"params\":[\"" +
                                                  enode_url + "\"],\"id\":1,\"jsonrpc\":\"2.0\"}' " +
                                                  "-H \"Content-Type: application/json\" " +
                                                  "-X POST localhost:" + rpc_port);
            tmp_process2.stdout.on("data", (data) => {
                if ((JSON.parse(data)).result == true) {
                    process.stdout.write(print ? "[OK] " + type + 
			    			 " node is successfully added as a peer!\n\n" : "");
                    clearInterval(id);
                    resolve();
                }
            });
        }, 1000);
    });
}

async function init_geth_aux(type, enode_url) {
    return new Promise((resolve, reject) => {

        const dir = eval("GETH_" + type.toUpperCase() + "_DIR");
        const p2p_port = eval("GETH_" + type.toUpperCase() + "_P2P_PORT");
        const authrpc_port = eval("GETH_" + type.toUpperCase() + "_AUTHRPC_PORT");
        const rpc_port = eval("GETH_" + type.toUpperCase() + "_RPC_PORT");
        const flags = eval("GETH_" + type.toUpperCase() + "_FLAGS");

	let binary = (type.includes("Miner") ? "geth_delay" : "geth");
	let name = type.includes("Miner") ? "Miner" : type;
	
        spawnSync(binary, ["init", "--datadir", dir, GETH_CONFIG_PATH],
                          { env: { "PATH": CLIENT_BIN_PATH } });
        console.log("[OK] " + name + " node is initialized w.r.t " + GETH_CONFIG_PATH);

        let tmp_process = spawn(binary, ["--datadir", dir,
                                         "--port", p2p_port,
                                         "--authrpc.port", authrpc_port,
                                         "--http.port", rpc_port].concat(flags),
                                         { env: { "PATH": CLIENT_BIN_PATH }, shell: true });
        tmp_process.on("spawn", () => {
            console.log("[OK] " + name + " node is executing on ports " + p2p_port + " and " + rpc_port);
            admin_addPeer(name, enode_url, rpc_port).then(() => resolve());
        });
    });
}

async function check_peerCount(type, rpc_port, print = true) {
    return new Promise((resolve, reject) => {
        const id = setInterval(function() {
            let tmp_process2 = exec("curl --data '{\"method\":\"net_peerCount\",\"params\":[]," +
                                                  "\"id\":1,\"jsonrpc\":\"2.0\"}' " +
                                                  "-H \"Content-Type: application/json\" " +
                                                  "-X POST localhost:" + rpc_port);
            tmp_process2.stdout.on("data", (data) => {
                if ((JSON.parse(data)).result == "0x1") {
                    process.stdout.write(print ? "[OK] " + type + 
			    			 " node is successfully added as a peer!\n\n" : "");
                    clearInterval(id);
                    resolve();
                }
            });
        }, 1000);
    });
}

async function init_erigon(enode_url, print = true) {
    return new Promise((resolve, reject) => {
        spawnSync("erigon", ["init", "--datadir", ERIGON_DIR, ERIGON_CONFIG_PATH],
                            { env: { "PATH": CLIENT_BIN_PATH } });
        process.stdout.write(print ? "[OK] Erigon node is initialized w.r.t " + ERIGON_CONFIG_PATH + "\n" : "");

        let tmp_process = spawn("erigon", ["--datadir", ERIGON_DIR,
                                           "--http.port", ERIGON_RPC_PORT,
                                           "--port", ERIGON_P2P_PORT,
                                           "--staticpeers", enode_url].concat(ERIGON_FLAGS),
                                           { env: { "PATH": CLIENT_BIN_PATH }, shell: true });
        tmp_process.on("spawn", () => {
            process.stdout.write(print ? "[OK] Erigon node is executing on ports " + ERIGON_P2P_PORT +
                                         " and " + ERIGON_RPC_PORT + "\n" : "");
            check_peerCount("Erigon", ERIGON_RPC_PORT, print).then(() => resolve());
        });
    });
}

async function init_nethermind(enode_url, print = true) {
    return new Promise((resolve, reject) => {
	create_config_nethermind(enode_url);

        let tmp_process = spawn("Nethermind.Runner", ["--config", NETHERMIND_CONFIG_PATH,
                                                      "--log", "TRACE",
                                                      "1>>" + path.join(BASE_LOG_PATH, "nethermind.log")],
                                                      { env: { "PATH": CLIENT_BIN_PATH },
                                                        shell: true });
        tmp_process.on("spawn", () => {
            process.stdout.write(print ? "[OK] Nethermind node is initialized w.r.t " + 
		    			  NETHERMIND_CONFIG_PATH + "\n" : "" );
            process.stdout.write(print ? "[OK] Nethermind node is executing on ports " + 
		    		  	  NETHERMIND_P2P_PORT + " and " + NETHERMIND_RPC_PORT + "\n" : "");
            check_peerCount("Nethermind", NETHERMIND_RPC_PORT, print).then(() => resolve());
        });
    });
}

async function init_besu(enode_url, print = true) {
    return new Promise((resolve, reject) => {
        let tmp_process = spawn("besu", ["--data-path", BESU_DIR,
                                         "--genesis-file", BESU_CONFIG_PATH,
                                         "--p2p-port", BESU_P2P_PORT,
                                         "--rpc-http-port", BESU_RPC_PORT].concat(BESU_FLAGS),
                                         { env: { "PATH": CLIENT_BIN_PATH }, shell: true });
        tmp_process.on("spawn", () => {
            process.stdout.write(print ? "[OK] Besu node is initialized w.r.t " + BESU_CONFIG_PATH + "\n" : "");
            process.stdout.write(print ? "[OK] Besu node is executing on ports " + BESU_P2P_PORT +
                                         " and " + BESU_RPC_PORT + "\n" : "");
            admin_addPeer("Besu", enode_url, BESU_RPC_PORT, print).then(() => resolve());
        });
    });
}

function check_connection(){
    const numPeers = execSync("curl --data '{\"method\":\"net_peerCount\",\"params\":[]," +
                                            "\"id\":1,\"jsonrpc\":\"2.0\"}' " +
                                            "-H \"Content-Type: application/json\" " +
                                            "-X POST localhost:8565",
                                            { stdio: ['pipe', 'pipe', 'ignore'] });
    if ((JSON.parse(numPeers.toString())).result == "0x12") {
        console.log("[OK] ALL NODES ARE INITIALIZED AND ADDED SUCCESSFULLY!\n");
    } else {
        console.error("[ERROR] AN ERROR OCCURRED WHILE INITIALIZATION");
        process.exit(1);
    }
}

module.exports = { init_geth, init_geth_miner, init_geth_aux, init_erigon, 
		   init_nethermind, init_besu, check_connection };
