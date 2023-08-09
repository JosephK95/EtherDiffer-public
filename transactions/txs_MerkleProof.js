const Web3 = require("web3");
const utils = Web3.utils;

function gen_MerkleProof_hash() {
    let H_0 = utils.soliditySha3("alice -> bob");
    let H_1 = utils.soliditySha3("bob -> dave");
    let H_2 = utils.soliditySha3("carol -> alice");
    let H_3 = utils.soliditySha3("dave -> bob");

    let H_01 = utils.soliditySha3(H_0, H_1);
    let H_23 = utils.soliditySha3(H_2, H_3);

    let H_0123 = utils.soliditySha3(H_01, H_23);

    MerkleProof.hashes = { "0": H_0, "1": H_1, "2": H_2, "3": H_3,
                           "01": H_01, "23": H_23, "0123": H_0123 };
}

function gen_txs_MerkleProof() {
    let addr1 = this.users[0];
    
    if (this.hashes === undefined) {
        gen_MerkleProof_hash();
    }
    let proof;
    switch (Math.floor(Math.random() * 8)) {
        case 0:
	    proof = "[" + _dq(this.hashes["1"]) + ", " + _dq(this.hashes["23"]) + "]";
	    this.mc_list.push({ cont: "MerkleProof", func: "verify", 
		    		sender: addr1, 
		    	        args: [ proof, _dq(this.hashes["0123"]), 
					_dq(this.hashes["0"]), "0" ] });
	    break;
        case 1:
	    proof = "[" + _dq(this.hashes["0"]) + ", " + _dq(this.hashes["23"]) + "]";
	    this.mc_list.push({ cont: "MerkleProof", func: "verify", 
		    		sender: addr1, 
		    	        args: [ proof, _dq(this.hashes["0123"]), 
					_dq(this.hashes["1"]), "1" ] });
	    break;
        case 2:
	    proof = "[" + _dq(this.hashes["3"]) + ", " + _dq(this.hashes["01"]) + "]";
	    this.mc_list.push({ cont: "MerkleProof", func: "verify", 
		    		sender: addr1, 
		    	        args: [ proof, _dq(this.hashes["0123"]), 
					_dq(this.hashes["2"]), "2" ] });
	    break;
        case 3:
	    proof = "[" + _dq(this.hashes["2"]) + ", " + _dq(this.hashes["01"]) + "]";
	    this.mc_list.push({ cont: "MerkleProof", func: "verify", 
		    		sender: addr1, 
		    	        args: [ proof, _dq(this.hashes["0123"]), 
					_dq(this.hashes["2"]), "2" ] });
	    break;
        case 4:
	    proof = "[" + _dq(this.hashes["0"]) + ", " + _dq(this.hashes["23"]) + "]";
	    this.mc_list.push({ cont: "MerkleProof", func: "verify", 
		    		sender: addr1, 
		    	        args: [ proof, _dq(this.hashes["0123"]), 
					_dq(this.hashes["0"]), "0" ] });
	    break;
        case 5:
	    proof = "[" + _dq(this.hashes["1"]) + ", " + _dq(this.hashes["23"]) + "]";
	    this.mc_list.push({ cont: "MerkleProof", func: "verify", 
		    		sender: addr1, 
		    	        args: [ proof, _dq(this.hashes["0123"]), 
					_dq(this.hashes["1"]), "1" ] });
	    break;
        case 6:
	    proof = "[" + _dq(this.hashes["2"]) + ", " + _dq(this.hashes["01"]) + "]";
	    this.mc_list.push({ cont: "MerkleProof", func: "verify", 
		    		sender: addr1, 
		    	        args: [ proof, _dq(this.hashes["0123"]), 
					_dq(this.hashes["2"]), "2" ] });
	    break;
        case 7:
	    proof = "[" + _dq(this.hashes["3"]) + ", " + _dq(this.hashes["01"]) + "]";
	    this.mc_list.push({ cont: "MerkleProof", func: "verify", 
		    		sender: addr1, 
		    	        args: [ proof, _dq(this.hashes["0123"]), 
					_dq(this.hashes["3"]), "3" ] });
	    break;
    }
}

module.exports = gen_txs_MerkleProof;
    
