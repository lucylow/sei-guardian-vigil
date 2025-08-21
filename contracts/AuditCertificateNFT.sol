// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AuditCertificateNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Mapping to track authorized minters (CS_CAT audit system)
    mapping(address => bool) public authorizedMinters;
    
    // Audit certificate metadata
    struct AuditCertificate {
        address auditor;           // CS_CAT's verification address
        address project;           // Audited contract or project address
        bytes32 auditReportHash;   // Hash of audit findings/report
        uint64 auditDate;          // Block timestamp of issuance
        uint8 score;               // 0-100 security rating
        uint8 criticalFindings;    // Number of critical issues found
        bool isRevoked;            // Certificate revocation status
        string contractName;       // Name of audited contract
        string blockchain;         // Target blockchain (SEI, Ethereum, etc.)
    }
    
    // Mapping from token ID to audit certificate data
    mapping(uint256 => AuditCertificate) public certificates;
    
    // Events
    event CertificateMinted(uint256 indexed tokenId, address indexed to, address indexed project);
    event CertificateRevoked(uint256 indexed tokenId, string reason);
    event MinterUpdated(address indexed minter, bool enabled);
    
    constructor() ERC721("SEI Audit Certificate", "SEIAUDIT") Ownable(msg.sender) {}
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    /**
     * @dev Set or remove authorized minters
     */
    function setMinter(address minter, bool enabled) external onlyOwner {
        authorizedMinters[minter] = enabled;
        emit MinterUpdated(minter, enabled);
    }
    
    /**
     * @dev Mint a new audit certificate NFT
     */
    function mintCertificate(
        address to,
        address project,
        bytes32 auditReportHash,
        uint8 score,
        uint8 criticalFindings,
        string calldata contractName,
        string calldata blockchain,
        string calldata tokenURI
    ) external onlyAuthorizedMinter returns (uint256) {
        require(score <= 100, "Invalid security score");
        require(criticalFindings <= 255, "Invalid critical findings count");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Mint the NFT
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Store audit certificate data
        certificates[newTokenId] = AuditCertificate({
            auditor: msg.sender,
            project: project,
            auditReportHash: auditReportHash,
            auditDate: uint64(block.timestamp),
            score: score,
            criticalFindings: criticalFindings,
            isRevoked: false,
            contractName: contractName,
            blockchain: blockchain
        });
        
        emit CertificateMinted(newTokenId, to, project);
        return newTokenId;
    }
    
    /**
     * @dev Revoke an audit certificate (only owner or original auditor)
     */
    function revokeCertificate(uint256 tokenId, string calldata reason) external {
        require(_exists(tokenId), "Token does not exist");
        require(
            msg.sender == owner() || 
            msg.sender == certificates[tokenId].auditor,
            "Not authorized to revoke"
        );
        
        certificates[tokenId].isRevoked = true;
        emit CertificateRevoked(tokenId, reason);
    }
    
    /**
     * @dev Get audit certificate data
     */
    function getCertificate(uint256 tokenId) external view returns (AuditCertificate memory) {
        require(_exists(tokenId), "Token does not exist");
        return certificates[tokenId];
    }
    
    /**
     * @dev Check if certificate is valid (not revoked and not expired)
     */
    function isCertificateValid(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) return false;
        
        AuditCertificate memory cert = certificates[tokenId];
        
        // Check if revoked
        if (cert.isRevoked) return false;
        
        // Check if expired (1 year validity)
        if (block.timestamp > cert.auditDate + 365 days) return false;
        
        return true;
    }
    
    /**
     * @dev Get total certificates minted
     */
    function totalCertificates() external view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Get certificates by project address
     */
    function getCertificatesByProject(address project) external view returns (uint256[] memory) {
        uint256 total = _tokenIds.current();
        uint256[] memory temp = new uint256[](total);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= total; i++) {
            if (certificates[i].project == project) {
                temp[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }
        
        return result;
    }
    
    /**
     * @dev Override _burn to also clear certificate data
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
        delete certificates[tokenId];
    }
}
