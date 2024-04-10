// MyStorefront.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyStorefront {
    struct Storefront {
        address owner;
        string metadata;
    }

    mapping(address => Storefront) public storefronts;

    function createStorefront(string memory _metadata) external {
        require(bytes(_metadata).length > 0, "Metadata should not be empty");
        require(storefronts[msg.sender].owner == address(0), "Storefront already exists");
        
        Storefront memory newStorefront = Storefront({
            owner: msg.sender,
            metadata: _metadata
        });

        storefronts[msg.sender] = newStorefront;
    }
}
