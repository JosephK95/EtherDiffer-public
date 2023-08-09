const contracts = require("./compile");
const { check_balances } = require("./faucet");

async function deploy_contract(key, contract, node, args, var_name) {
    let contract_obj = contracts[key][contract];
    process.stdout.write("Deploying \"" + key + "\"...");
   
    let instance = await (new node.eth.Contract(contract_obj.abi)
                                  .deploy({
                                      data: contract_obj.evm.bytecode.object, 
                                      arguments: args})
                                  .send({
                                      from: node.eth.accounts.wallet[0].address, 
                                      gas: 2500000, 
                                      gasPrice: "5000000000"}));
    cont_addrs.push(instance.options.address);
    
    let _slots = contract_obj.storageLayout.storage.reduce((arr, obj) => {
        arr.push(obj.slot);
	return arr;
    }, []);
    eval(var_name + " = instance;");
    eval(var_name + ".slots = _slots;");
    
    cont_vars.push(eval(var_name));

    process.stdout.write("[OK] @" + instance.options.address + "\n");
}

async function deploy_contracts() {
    console.log("\n---------- [DEPLOYING SMART CONTRACTS BEGINS..] ----------\n");
  
    await deploy_contract("BiDirectionalPaymentChannel", "BiDirectionalPaymentChannel", 
	    		   web3_tx_nodes[0], [], "BiDirectionalPaymentChannel");
    await deploy_contract("CrowdFund/ERC20", "ERC20", web3_tx_nodes[1], [], "ERC20_CrowdFund");
    await deploy_contract("CrowdFund/CrowdFund", "CrowdFund", web3_tx_nodes[1], 
	    		   [ ERC20_CrowdFund.options.address ], "CrowdFund");
    await deploy_contract("DutchAuction/ERC721", "ERC721", web3_tx_nodes[2], [], "ERC721_DutchAuction");
    await deploy_contract("DutchAuction/DutchAuction", "DutchAuction", 
	    		   web3_tx_nodes[2], [ ERC721_DutchAuction.options.address ], "DutchAuction");
    await deploy_contract("EnglishAuction/ERC721", "ERC721", web3_tx_nodes[3], [], "ERC721_EngAuction");
    await deploy_contract("EnglishAuction/EnglishAuction", "EnglishAuction", 
	    		   web3_tx_nodes[3], [ ERC721_EngAuction.options.address ], "EnglishAuction");
    
    await deploy_contract("ERC20", "ERC20", web3_tx_nodes[4], [], "ERC20");
    await deploy_contract("ERC721", "ERC721", web3_tx_nodes[5], [], "ERC721");
    await deploy_contract("EtherWallet", "EtherWallet", web3_tx_nodes[6], [], "EtherWallet");
    await deploy_contract("MerkleProof", "MerkleProof", web3_tx_nodes[7], [], "MerkleProof");
    await deploy_contract("MultiSigWallet", "MultiSigWallet", web3_tx_nodes[8], [], "MultiSigWallet");
    await deploy_contract("Storage", "Storage", web3_tx_nodes[9], [], "Storage");
    await deploy_contract("TimeLock", "TimeLock", web3_tx_nodes[10], [], "TimeLock");
    await deploy_contract("UniDirectionalPaymentChannel", "UniDirectionalPaymentChannel", 
	    		   web3_tx_nodes[11], [], "UniDirectionalPaymentChannel");
      
    console.log("\n[OK] ALL CONTRACTS ARE SUCCESSFULLY DEPLOYED!\n");
}

module.exports = { deploy_contracts };
