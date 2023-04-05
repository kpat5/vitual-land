// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface events{
    event newNftMinted(uint256 _id, string URI);
    event nftBought(uint256 _id,address _buyer,address _seller, uint256 _price,string URI);
    event bidPlaced(uint256 _id,address _placedBy, uint256 _bidAmt);
    event priceSet(uint256 _id,address _owner,uint256 _amt);  
    event hasPutForBid(uint256 _id,address _owner);  
    event soldForMaxBid(uint256 _id,address _buyer,address _seller,uint256 _amt);
}