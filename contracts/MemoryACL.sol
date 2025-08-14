// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MemoryACL {
    mapping(address => mapping(bytes32 => uint)) permissions;
    
    function check_access(
        address agent, 
        bytes32 memory_segment
    ) public view returns (bool) {
        return permissions[agent][memory_segment] > 0;
    }
}
