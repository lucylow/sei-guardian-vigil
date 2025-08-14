// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MemoryAnchor {
    struct AuditDecision {
        address auditor;
        bytes32 taskHash;
        uint256 timestamp;
        string action;
        string rationale;
    }
    
    mapping(bytes32 => AuditDecision) public decisions;
    
    function recordDecision(
        bytes32 taskHash, 
        string memory action,
        string memory rationale
    ) public {
        decisions[taskHash] = AuditDecision(
            msg.sender,
            taskHash,
            block.timestamp,
            action,
            rationale
        );
    }
}
