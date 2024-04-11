// MyStorefront.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyStorefront is Initializable, OwnableUpgradeable, UUPSUpgradeable {
  struct Storefront {
    address owner;
    string metadata;
    // overtimeYou can add more fields here as your storefront grows 
  }

  // Storage is declared using 'storage' keyword
  Storefront[] public storefronts;
  mapping(address => bool) public oldUserStoreFronts;

  // Events for storefront actions
  event StorefrontCreated(address owner, string metadata);
  event StorefrontUpdated(address owner, string metadata);
  event StorefrontDeleted(address owner);

  // Errors for clarity
  error EmptyMetadata();
  error StorefrontExists();
  error InvalidOwner();
  error StorefrontNotFound();

  // Initializer function (called only once during deployment)
  function initialize(address initialOwner) public initializer {
    __UUPSUpgradeable_init(); // Initialize upgradeability
    storefronts.push(Storefront({owner: initialOwner, metadata: ""})); // Set initial storefront
  }

  // Create a storefront
  function createStorefront(string memory _metadata) external {
    if (bytes(_metadata).length == 0) {
      revert("Metadata cannot be empty");
    }
    if (findStorefront(msg.sender) != address(0)) {
      revert("Storefront already exists for this owner");
    }

    storefronts.push(Storefront({owner: msg.sender, metadata: _metadata}));

    emit StorefrontCreated(msg.sender, _metadata);
  }

  // Read a storefront by owner address
  function getStorefront(address _owner) public view returns (string memory) {
    address storefrontAddress = findStorefront(_owner);
    if (storefrontAddress == address(0)) {
      revert StorefrontNotFound();
    }
    return storefronts[getIndex(storefrontAddress)].metadata;
  }

  // Update a storefront by owner address
  function updateStorefront(string memory _metadata) external {
    if (bytes(_metadata).length == 0) {
      revert EmptyMetadata();
    }
    address storefrontAddress = findStorefront(msg.sender);
    if (storefrontAddress == address(0)) {
      revert StorefrontNotFound();
    }

    storefronts[getIndex(storefrontAddress)].metadata = _metadata;

    emit StorefrontUpdated(msg.sender, _metadata);
  }

  // Delete a storefront by owner address (only owner can delete)
  function deleteStorefront() external onlyOwner {
    address storefrontAddress = findStorefront(msg.sender);
    if (storefrontAddress == address(0)) {
      revert StorefrontNotFound();
    }

    uint index = getIndex(storefrontAddress);
    delete storefronts[index];

    // Shift down elements after deletion to maintain a compact array
    for (uint i = index; i < storefronts.length - 1; i++) {
      storefronts[i] = storefronts[i + 1];
    }
    storefronts.pop(); // Remove the last element

    emit StorefrontDeleted(msg.sender);
  }

  // Internal helper function to find storefront index by owner
  function findStorefront(address _owner) internal view returns (address) {
    for (uint i = 0; i < storefronts.length; i++) {
      if (storefronts[i].owner == _owner) {
        return storefronts[i].owner;
      }
    }
    return address(0);
  }

  // Internal helper function to get storefront index by address
  function getIndex(address storefrontAddress) internal view returns (uint) {
    for (uint i = 0; i < storefronts.length; i++) {
      if (storefronts[i].owner == storefrontAddress) {
        return i;
      }
    }
    revert("Storefront not found"); // Should never reach here
  }

  function hasStore(address user) public view returns (bool) {
    return oldUserStoreFronts[user] || findStorefront(user) != address(0);
  }

  // This function is required for upgradeability (only modify access control if needed)
  function _authorizeUpgrade(address newImplementation)
      internal
      override
      onlyOwner // Restrict upgrade to owner (optional)
  {}

  constructor(address initialOwner) {
    // Assuming __UUPSUpgradeable_init() does not require any arguments
    __UUPSUpgradeable_init();
    _disableInitializers();
    // Pass the initial owner to the initializer
    initialize(initialOwner);
  }
}