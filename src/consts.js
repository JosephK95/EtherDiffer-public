const path = require("path");

/* Inter-Modular Global Variables
 *
 * All variables below are defined as properties of the 'global' object
 * and can be referenced from other modules as well
 *
 * Ex) global.BASE_PATH, global.BASE_CONFIG_PATH, global.BASE_LOG_PATH, ...
 */

BASE_PATH = path.join(__dirname, "..");
BASE_TEMPLATE_CONFIG_PATH = path.join(BASE_PATH, "configs");
BASE_CONFIG_PATH = path.join(BASE_PATH, "out/configs");
BASE_LOG_PATH = path.join(BASE_PATH, "out/logs");

GETH_TEMPLATE_CONFIG_PATH = path.join(BASE_TEMPLATE_CONFIG_PATH, "template-geth.json");
NETHERMIND_TEMPLATE_JSON_CONFIG_PATH = path.join(BASE_TEMPLATE_CONFIG_PATH, "template-nethermind.json");
NETHERMIND_TEMPLATE_CFG_CONFIG_PATH = path.join(BASE_TEMPLATE_CONFIG_PATH, "template-nethermind.cfg");

GETH_CONFIG_PATH = path.join(BASE_CONFIG_PATH, "geth.json");
ERIGON_CONFIG_PATH = path.join(BASE_CONFIG_PATH, "erigon.json");
NETHERMIND_CHAINSPEC_PATH = path.join(BASE_CONFIG_PATH, "nethermind.json");
NETHERMIND_CONFIG_PATH = path.join(BASE_CONFIG_PATH, "nethermind.cfg");
BESU_CONFIG_PATH = path.join(BASE_CONFIG_PATH, "besu.json");

CLIENT_BIN_PATH = BASE_PATH + "/clients/Geth:" + 
                  BASE_PATH + "/clients/Erigon:" +
                  BASE_PATH + "/clients/Nethermind:" +
                  BASE_PATH + "/clients/Besu:" +
		  process.env.PATH

GETH_DIR = path.join(BASE_PATH, "data-geth");
ERIGON_DIR = path.join(BASE_PATH, "data-erigon");
NETHERMIND_DIR = path.join(BASE_PATH, "data-nethermind");
BESU_DIR = path.join(BASE_PATH, "data-besu");

GETH_TX1_DIR = path.join(BASE_PATH, "data-tx-1");
GETH_TX2_DIR = path.join(BASE_PATH, "data-tx-2");
GETH_TX3_DIR = path.join(BASE_PATH, "data-tx-3");
GETH_TX4_DIR = path.join(BASE_PATH, "data-tx-4");
GETH_TX5_DIR = path.join(BASE_PATH, "data-tx-5");
GETH_TX6_DIR = path.join(BASE_PATH, "data-tx-6");
GETH_TX7_DIR = path.join(BASE_PATH, "data-tx-7");
GETH_TX8_DIR = path.join(BASE_PATH, "data-tx-8");
GETH_TX9_DIR = path.join(BASE_PATH, "data-tx-9");
GETH_TX10_DIR = path.join(BASE_PATH, "data-tx-10");
GETH_TX11_DIR = path.join(BASE_PATH, "data-tx-11");
GETH_TX12_DIR = path.join(BASE_PATH, "data-tx-12");

GETH_MINER1_DIR = path.join(BASE_PATH, "data-mining");
GETH_MINER2_DIR = path.join(BASE_PATH, "data-mining-2");
GETH_MINER3_DIR = path.join(BASE_PATH, "data-mining-3");


GETH_RPC_PORT = "8545";
GETH_AUTHRPC_PORT = "9545";
ERIGON_RPC_PORT = "8547";
NETHERMIND_RPC_PORT = "8548";
BESU_RPC_PORT = "8549";

GETH_TX1_RPC_PORT = "8551";
GETH_TX2_RPC_PORT = "8552";
GETH_TX3_RPC_PORT = "8553";
GETH_TX4_RPC_PORT = "8554";
GETH_TX5_RPC_PORT = "8555";
GETH_TX6_RPC_PORT = "8556";
GETH_TX7_RPC_PORT = "8557";
GETH_TX8_RPC_PORT = "8558";
GETH_TX9_RPC_PORT = "8559";
GETH_TX10_RPC_PORT = "8560";
GETH_TX11_RPC_PORT = "8561";
GETH_TX12_RPC_PORT = "8562";

GETH_TX1_AUTHRPC_PORT = "9551";
GETH_TX2_AUTHRPC_PORT = "9552";
GETH_TX3_AUTHRPC_PORT = "9553";
GETH_TX4_AUTHRPC_PORT = "9554";
GETH_TX5_AUTHRPC_PORT = "9555";
GETH_TX6_AUTHRPC_PORT = "9556";
GETH_TX7_AUTHRPC_PORT = "9557";
GETH_TX8_AUTHRPC_PORT = "9558";
GETH_TX9_AUTHRPC_PORT = "9559";
GETH_TX10_AUTHRPC_PORT = "9560";
GETH_TX11_AUTHRPC_PORT = "9561";
GETH_TX12_AUTHRPC_PORT = "9562";

GETH_MINER1_RPC_PORT = "8565";
GETH_MINER2_RPC_PORT = "8566";
GETH_MINER3_RPC_PORT = "8567";

GETH_MINER1_AUTHRPC_PORT = "9565";
GETH_MINER2_AUTHRPC_PORT = "9566";
GETH_MINER3_AUTHRPC_PORT = "9567";

GETH_P2P_PORT = "30303";
ERIGON_P2P_PORT = "30305";
NETHERMIND_P2P_PORT = "30306";
BESU_P2P_PORT = "30307";

GETH_TX1_P2P_PORT = "30311";
GETH_TX2_P2P_PORT = "30312";
GETH_TX3_P2P_PORT = "30313";
GETH_TX4_P2P_PORT = "30314";
GETH_TX5_P2P_PORT = "30315";
GETH_TX6_P2P_PORT = "30316";
GETH_TX7_P2P_PORT = "30317";
GETH_TX8_P2P_PORT = "30318";
GETH_TX9_P2P_PORT = "30319";
GETH_TX10_P2P_PORT = "30320";
GETH_TX11_P2P_PORT = "30321";
GETH_TX12_P2P_PORT = "30322";

GETH_MINER1_P2P_PORT = "30323";
GETH_MINER2_P2P_PORT = "30324";
GETH_MINER3_P2P_PORT = "30325";


GETH_COMMON_FLAGS = ["--http",
                     "--http.api", "admin,debug,eth,miner,net,personal,txpool,web3",
                     "--networkid", "15",
                     "--nodiscover",
                     "--allow-insecure-unlock",
                     "--syncmode", "full",
		     "--gcmode", "archive",
                     "--verbosity", "5" ];
GETH_MINER_COMMON_FLAGS = GETH_COMMON_FLAGS.concat(["--mine", "--miner.etherbase",
                     "0x0123456789012345678901234567890123456789", "--miner.threads", "1"]);

GETH_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth.log")]);
ERIGON_FLAGS = ["--http",
                "--http.api", "admin,debug,eth,net,txpool,web3",
		"--networkid", "15",
                "--nodiscover",
                "--verbosity", "5",
                "2>>" + path.join(BASE_LOG_PATH, "erigon.log")];
BESU_FLAGS = ["--rpc-http-enabled",
              "--rpc-http-api", "ETH,NET,WEB3,ADMIN,DEBUG,TRACE,TXPOOL",
              "--network-id", "15",
              "--discovery-enabled", "false",
              "--logging", "TRACE",
              "1>>" + path.join(BASE_LOG_PATH, "besu.log")];

GETH_TX1_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-1.log")]);
GETH_TX2_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-2.log")]);
GETH_TX3_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-3.log")]);
GETH_TX4_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-4.log")]);
GETH_TX5_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-5.log")]);
GETH_TX6_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-6.log")]);
GETH_TX7_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-7.log")]);
GETH_TX8_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-8.log")]);
GETH_TX9_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-9.log")]);
GETH_TX10_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-10.log")]);
GETH_TX11_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-11.log")]);
GETH_TX12_FLAGS = GETH_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, "geth-tx-12.log")]);

GETH_MINER1_FLAGS = GETH_MINER_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, 
						    	   "geth-miner.log")]);
GETH_MINER2_FLAGS = GETH_MINER_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH, 
							   "geth-miner-2.log")]);
GETH_MINER3_FLAGS = GETH_MINER_COMMON_FLAGS.concat(["2>>" + path.join(BASE_LOG_PATH,
							   "geth-miner-3.log")]);

GETH_TESTING_FLAGS = GETH_COMMON_FLAGS.concat(["--gcmode", "archive",
					       "2>>" + path.join(BASE_LOG_PATH, 
						       "geth-miner.log")]);

INIT_BALANCE = "850000000000000000000";

MINE_STOP = "curl --data '{\"method\":\"miner_stop\"," +
                "\"params\":[],\"jsonrpc\":\"2.0\",\"id\":1}' " +
                "-H \"Content-Type: application/json\" -X POST ";
