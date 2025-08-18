// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AgentNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Agent {
        string agentType;
        uint256 level;
        uint256 experience;
        uint256 battlesWon;
        uint256 battlesLost;
        uint256 totalSentEarned;
        uint256 criticalVulnsFound;
        uint256 lastBattleTime;
        bool isActive;
        string[] achievements;
    }

    mapping(uint256 => Agent) public agents;
    mapping(string => uint256) public agentTypeCounts;
    mapping(uint256 => string) public agentPersonalities; // Eliza personality data

    event AgentMinted(uint256 indexed tokenId, address indexed owner, string agentType);
    event AgentLevelUp(uint256 indexed tokenId, uint256 newLevel);
    event AchievementUnlocked(uint256 indexed tokenId, string achievement);

    constructor() ERC721("SentinelAgent", "SAGENT") {}

    function mintAgent(
        address to,
        string memory agentType,
        string memory personalityData
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        agents[newTokenId] = Agent({
            agentType: agentType,
            level: 1,
            experience: 0,
            battlesWon: 0,
            battlesLost: 0,
            totalSentEarned: 0,
            criticalVulnsFound: 0,
            lastBattleTime: block.timestamp,
            isActive: true,
            achievements: new string[](0)
        });

        agentPersonalities[newTokenId] = personalityData;
        agentTypeCounts[agentType]++;

        _mint(to, newTokenId);
        emit AgentMinted(newTokenId, to, agentType);
        
        return newTokenId;
    }

    // ...existing code...
}