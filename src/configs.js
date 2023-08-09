const fs = require("fs");

function create_configs() {
    let template_geth_json = fs.readFileSync(GETH_TEMPLATE_CONFIG_PATH);
    let template_nethermind_json = fs.readFileSync(NETHERMIND_TEMPLATE_JSON_CONFIG_PATH);
    
    template_geth_json = JSON.parse(template_geth_json);
    template_nethermind_json = JSON.parse(template_nethermind_json);

    template_geth_json.alloc = { [faucet]: { "balance": INIT_BALANCE } };

    template_nethermind_json.accounts = { [faucet]: { "balance": INIT_BALANCE,
                                                      "nonce": "0x0" } };

    fs.writeFileSync(GETH_CONFIG_PATH, JSON.stringify(template_geth_json, null, 4));
    fs.writeFileSync(ERIGON_CONFIG_PATH, JSON.stringify(template_geth_json, null, 4));
    fs.writeFileSync(NETHERMIND_CHAINSPEC_PATH, JSON.stringify(template_nethermind_json, null, 4));
    fs.writeFileSync(BESU_CONFIG_PATH, JSON.stringify(template_geth_json, null, 4));
}

function create_config_nethermind(enode_url) {
    let template_nethermind_cfg = fs.readFileSync(NETHERMIND_TEMPLATE_CFG_CONFIG_PATH);
    template_nethermind_cfg = JSON.parse(template_nethermind_cfg);

    template_nethermind_cfg.Init = { "ChainSpecPath": NETHERMIND_CHAINSPEC_PATH,
                                     "BaseDbPath": NETHERMIND_DIR },

    template_nethermind_cfg.Discovery = { "Bootnodes": enode_url };
    template_nethermind_cfg.JsonRpc.Port = NETHERMIND_RPC_PORT;

    template_nethermind_cfg.Network = { "DiscoveryPort": NETHERMIND_P2P_PORT,
                                        "P2PPort": NETHERMIND_P2P_PORT };

    fs.writeFileSync(NETHERMIND_CONFIG_PATH, JSON.stringify(template_nethermind_cfg, null, 4));
}

module.exports = { create_configs, create_config_nethermind };
