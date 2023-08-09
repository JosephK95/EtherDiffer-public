// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// i <- {0, 1, 2, 3, 4}
// [DEPLOYMENT ARGUMENTS] from: owner
/* [VALID SEQ #1] verify <accounts[i], , ([H(1), H(23)], H(0123), H(0), 0)>
   [VALID SEQ #2] verify <accounts[i], , ([H(0), H(23)], H(0123), H(1), 1)>
   [VALID SEQ #3] verify <accounts[i], , ([H(3), H(01)], H(0123), H(2), 2)>
   [VALID SEQ #4] verify <accounts[i], , ([H(2), H(01)], H(0123), H(3), 3)>
   [VALID SEQ #5] verify <accounts[i], , ([H(0), H(23)], H(0123), H(0), 0)>
   [VALID SEQ #6] verify <accounts[i], , ([H(1), H(23)], H(0123), H(1), 1)>
   [VALID SEQ #7] verify <accounts[i], , ([H(2), H(01)], H(0123), H(2), 2)>
   [VALID SEQ #8] verify <accounts[i], , ([H(3), H(01)], H(0123), H(3), 3)>
*/
// [NOTE] H(N) is the hash value of N-th index element
// [NOTE] H(NM) is the hash value of H(N) and H(M)
// [NOTE] H(NMXY) is the hash value of H(NM) and H(XY)

contract MerkleProof {
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf,
        uint index
    ) public returns (bool) {
        bytes32 hash = leaf;

        for (uint i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (index % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, proofElement));
            } else {
                hash = keccak256(abi.encodePacked(proofElement, hash));
            }

            index = index / 2;
        }

        return hash == root;
    }
}
