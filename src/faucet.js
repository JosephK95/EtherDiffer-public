async function check_balances() {
    console.log("<< ACCOUNT BALANCE STATES >>\n");
    
    for (let i = 0; i < accounts.length; i++) {
        console.log("Address: " + accounts[i] + "  |  Balance: " +
                     await web3_geth.eth.getBalance(accounts[i]) + " wei");
    }
    console.log("");
}

async function transfer_owner_Ethers() {
    const faucet_node = web3_miners[0];
    const node_accounts = await faucet_node.eth.getAccounts();

    console.log("\n---------- [ETHER TRANSFERS TO OWNER ACCOUNTS BEGINS..] ----------\n");
    for (let i = 0; i < web3_tx_nodes.length; i++) {
	let receiver = web3_tx_nodes[i].eth.accounts.wallet[0].address;
        try {
            await faucet_node.eth.personal.unlockAccount(node_accounts[0], "1234", 0);
            await faucet_node.eth.sendTransaction({
                from: node_accounts[0],
                to: receiver,
                value: ether(20),
                gasPrice: "5000000000"
            });
            console.log("[OK] Faucet account -> (20 Ether) -> " + receiver);
        } catch (e) {
            console.error("[ERROR] Transferring from faucet account to " + 
		    	   receiver + " failed" + e);
            process.exit(1);
        };
    }
    console.log("");
    await check_balances();
}

async function transfer_user_Ethers() {
    const faucet_node = web3_miners[0];
    const node_accounts = await faucet_node.eth.getAccounts();

    console.log("\n---------- [ETHER TRANSFERS TO USER ACCOUNTS BEGINS..] ----------\n");
    for (let i = web3_tx_nodes.length; i < accounts.length; i++) {
        try {
            await faucet_node.eth.personal.unlockAccount(node_accounts[0], "1234", 0);
            await faucet_node.eth.sendTransaction({
                from: node_accounts[0],
                to: accounts[i],
                value: ether(20),
                gasPrice: "5000000000"
            });
            console.log("[OK] Faucet account -> (20 Ether) -> " + accounts[i]);
        } catch (e) {
            console.error("[ERROR] Transferring from faucet account to " + 
		    	   accounts[i] + " failed" + e);
            process.exit(1);
        };
    }
    console.log("");
    await check_balances();
}
module.exports = { check_balances, transfer_owner_Ethers, transfer_user_Ethers };
