// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// i <- {0, 1, 2, 3, 4}
// [DEPLOYMENT ARGUMENTS] from: owner
/* [VALID SEQ #1] set <accounts[i], , (0, nonce)> :: get <accounts[i], , (0)>
   [VALID SEQ #2] set <accounts[i], , (1, nonce)> :: get <accounts[i], , (1)>
   [VALID SEQ #3] set <accounts[i], , (2, nonce)> :: get <accounts[i], , (2)>
*/
// [NOTE] 'nonce' tracks the number of fulfilled sequences of this application

contract Storage {
    struct MyStruct {
        uint value;
    }

    // struct stored at slot 0
    MyStruct public s0 = MyStruct(123);
    // struct stored at slot 1
    MyStruct public s1 = MyStruct(456);
    // struct stored at slot 2
    MyStruct public s2 = MyStruct(789);

    function _get(uint i) internal pure returns (MyStruct storage s) {
        // get struct stored at slot i
        assembly {
            s.slot := i
        }
    }

    /*
    get(0) returns 123
    get(1) returns 456
    get(2) returns 789
    */
    function get(uint i) external view returns (uint) {
        // get value inside MyStruct stored at slot i
        return _get(i).value;
    }

    /*
    We can save data to any slot including slot 999 which is normally unaccessble.

    set(999) = 888 
    */
    function set(uint i, uint x) external {
        // set value of MyStruct to x and store it at slot i
        _get(i).value = x;
    }
}

