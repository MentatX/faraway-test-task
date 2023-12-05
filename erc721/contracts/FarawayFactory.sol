// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FarawayCollection.sol";

/**
 * @dev {FarawayFactory} including:
 *
 *  - create collections
 *  - mint tokens
 */
contract FarawayFactory {
    // Collections
    address[] _collections;

    /**
     * @dev Emitted when collection is created.
     */
    event CollectionCreated(address collection, string name, string symbol);

    /**
     * @dev Emitted when token is minted.
     */
    event TokenMinted(address collection, address recipient, uint256 tokenId, string tokenUri);

    /**
     * @dev Returns collections.
     */
    function collections() public view returns (address[] memory) {
        return _collections;
    }

    /**
     * @dev Deploys a new collection.
     */
    function createCollection(string memory name, string memory symbol) public returns (address) {
        FarawayCollection collection = new FarawayCollection(name, symbol, address(this), address(this));
        
        _collections.push(address(collection));
        
        emit CollectionCreated(address(collection), name, symbol);

        return address(collection);
    }

    /**
     * @dev Mints a new token.
     */
    function mintToken(address collection, address recipient, uint256 tokenId, string memory tokenUri) public returns (uint256) {
        FarawayCollection(collection).safeMint(recipient, tokenId, tokenUri);
        
        emit TokenMinted(collection, recipient, tokenId, tokenUri);

        return tokenId;
    }
}