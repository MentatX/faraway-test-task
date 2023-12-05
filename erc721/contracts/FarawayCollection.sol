// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./token/ERC721/ERC721.sol";
import "./token/ERC721/extensions/ERC721URIStorage.sol";
import "./access/AccessControlEnumerable.sol";

/**
 * @dev {FarawayCollection} including:
 *
 *  - a minter role that allows for token minting (creation)
 *
 * This contract uses {AccessControlEnumerable} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 */
contract FarawayCollection is ERC721, ERC721URIStorage, AccessControlEnumerable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(string memory name, string memory symbol, address defaultAdmin, address minter)
        ERC721(name, symbol)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
    }

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyRole(MINTER_ROLE)
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControlEnumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}