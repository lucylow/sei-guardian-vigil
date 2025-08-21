// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleToken is ERC20, Ownable {
    mapping(address => bool) public whitelist;
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    
    function addToWhitelist(address user) public onlyOwner {
        whitelist[user] = true;
    }
    
    function removeFromWhitelist(address user) public onlyOwner {
        whitelist[user] = false;
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(whitelist[msg.sender], "Not whitelisted");
        return super.transfer(to, amount);
    }
    
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(whitelist[from], "From address not whitelisted");
        return super.transferFrom(from, to, amount);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
