// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract MyStorefront is OwnableUpgradeable, UUPSUpgradeable {
  address public implementation;
    struct Storefront {
        address owner;
        string metadata;
    }

    Storefront[] public storefronts;
    mapping(address => bool) public oldUserStoreFronts;

    event StorefrontCreated(address owner, string metadata);
    event StorefrontUpdated(address owner, string metadata);
    event StorefrontDeleted(address owner);

    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner); // Initialize Ownable
        storefronts.push(Storefront({ owner: initialOwner, metadata: "" }));
    }

    function createStorefront(string memory _metadata) external {
        if (bytes(_metadata).length == 0) {
            revert('Missing MetaData in body json');
        }
        if (findStorefront(msg.sender) != address(0)) {
            revert('You already have a store associated with this adress');
        }

        storefronts.push(Storefront({ owner: msg.sender, metadata: _metadata }));
        emit StorefrontCreated(msg.sender, _metadata);
    }

    function getStorefront(address _owner) public view returns (string memory) {
        address storefrontAddress = findStorefront(_owner);
        if (storefrontAddress == address(0)) {
            revert("Store doesn't exist");
        }
        return storefronts[getIndex(storefrontAddress)].metadata;
    }

    function updateStorefront(string memory _metadata) external {
        if (bytes(_metadata).length == 0) {
            revert('Missing MetaData in body json');
        }
        address storefrontAddress = findStorefront(msg.sender);
        if (storefrontAddress == address(0)) {
            revert("Store doesn't exist");
        }

        storefronts[getIndex(storefrontAddress)].metadata = _metadata;
        emit StorefrontUpdated(msg.sender, _metadata);
    }

    function deleteStorefront() external onlyOwner {
        address sender = msg.sender;
        uint index = getIndex(sender);
        if (index >= storefronts.length || storefronts[index].owner != sender) {
            revert("Store doesn't exist");
        }

        delete storefronts[index];
        emit StorefrontDeleted(sender);
    }

    function findStorefront(address _owner) internal view returns (address) {
        for (uint i = 0; i < storefronts.length; i++) {
            if (storefronts[i].owner == _owner) {
                return storefronts[i].owner;
            }
        }
        return address(0);
    }

    function getIndex(address storefrontAddress) internal view returns (uint) {
        for (uint i = 0; i < storefronts.length; i++) {
            if (storefronts[i].owner == storefrontAddress) {
                return i;
            }
        }
        revert("Storefront not found");
    }

    function migrateLegacyStorefronts() external onlyOwner {
        for (uint i = 0; i < storefronts.length; i++) {
            address user = storefronts[i].owner;
            if (!oldUserStoreFronts[user]) {
                storefronts.push(Storefront({ owner: user, metadata: "" }));
                oldUserStoreFronts[user] = true;
            }
        }
    }

    function hasStore(address user) public view returns (bool) {
        return oldUserStoreFronts[user] || findStorefront(user) != address(0);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}