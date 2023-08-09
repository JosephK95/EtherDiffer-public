const { spawn } = require("child_process");

async function create_initial_account(geth_dir) {
    return new Promise((resolve, reject) => {
        let tmp_string = "";
        let tmp_process = spawn("geth", ["account new", "--datadir", geth_dir],
                                        { env: { "PATH": CLIENT_BIN_PATH }, shell: true });

        tmp_process.stdout.on("data", (data) => {
            tmp_string += data.toString();
            tmp_process.stdin.write("1234\n");
        });

        tmp_process.on("close", (code) => {
            tmp_process.stdin.end();

            if (code == 0) {
                const address = tmp_string.substr(tmp_string.indexOf('0x'), 42);
                console.log("[OK] A new account is generated for " + geth_dir);
                console.log("[INFO] Created account address: " + address + "\n");
                resolve(address);
            }
            else {
                console.error("[ERROR] A new account generation is failed for " + geth_dir + "\n");    
            }
        });
    });
}

async function create_initial_accounts() {
    faucet = await create_initial_account(GETH_MINER1_DIR);
}

function create_owner_accounts() {
    console.log("\n-------------------- [CREATING OWNER ACCOUNTS..] --------------------\n");
    process.stdout.write("Creating wallets for each node.....");

    web3_geth.eth.accounts.wallet.create();
    web3_erigon.eth.accounts.wallet.create();
    web3_nethermind.eth.accounts.wallet.create();
    web3_besu.eth.accounts.wallet.create();

    for (let i = 0; i < web3_tx_nodes.length; i++) {
        web3_tx_nodes[i].eth.accounts.wallet.create();
    }
    web3_miners[0].eth.accounts.wallet.create();
    console.log("DONE.\n");
 
    for (let i = 0; i < web3_tx_nodes.length; i++) {
        let owner = web3_geth.eth.accounts.create();
        accounts.push(owner.address);
        
	console.log("[INFO] A new owner account created: " + owner.address);

        web3_geth.eth.accounts.wallet.add(owner);
        web3_erigon.eth.accounts.wallet.add(owner);
        web3_nethermind.eth.accounts.wallet.add(owner);
        web3_besu.eth.accounts.wallet.add(owner);

        web3_tx_nodes[i].eth.accounts.wallet.add(owner);
        web3_miners[0].eth.accounts.wallet.add(owner);

        console.log("[INFO] Successfully added to each wallet\n");
    }
}

function create_user_accounts(node_index, cont_name, num_user) {
    if (node_index == 0) {
        console.log("\n-------------------- [CREATING USER ACCOUNTS..] --------------------\n");
    }
    for (let i = 0; i < num_user; i++) {
        let account = web3_geth.eth.accounts.create();
        accounts.push(account.address);
        
	console.log("[INFO] A new user account created: " + account.address);

        web3_geth.eth.accounts.wallet.add(account);
        web3_erigon.eth.accounts.wallet.add(account);
        web3_nethermind.eth.accounts.wallet.add(account);
        web3_besu.eth.accounts.wallet.add(account);

        web3_tx_nodes[node_index].eth.accounts.wallet.add(account);
	eval(cont_name + ".users.push(account.address)");
        
	web3_miners[0].eth.accounts.wallet.add(account);
        
	console.log("[INFO] Successfully added to each wallet\n")
    }
}
module.exports = { create_initial_accounts, create_owner_accounts, create_user_accounts };
