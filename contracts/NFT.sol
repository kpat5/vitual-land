// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./interfaces/events.sol";
import "./Land.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage,events{
    uint256 public totalCount;

    constructor() ERC721("Pixel Plots", "PPT"){}

    function mint(string memory _tokenURI,uint _id) external returns(uint256){
        totalCount++;
        _mint(msg.sender, _id);
        _setTokenURI(_id, _tokenURI);
        emit newNftMinted(_id,_tokenURI);
        return totalCount;
    }

}
