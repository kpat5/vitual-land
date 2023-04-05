// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


import "./interfaces/events.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Land.sol";
import "./Bid.sol";

contract BuyLand is Land,events,Bid{
    
    function buy(uint256 _id,int256 _dimensionX,int256 _dimensionY,int256 _dimensionZ,int256 _positionX,int256 _positionY,int256 _positionZ,uint256 _basePrice,string memory _URI) public payable{
        require(!isOwner(_id),"You already own this property");
        if(plots[_id].plotOwner==payable(address(0))){
            require(msg.value==_basePrice,"Please send the required amount to purchase property 1");
            nft.mint(_URI,_id);
            owner.transfer(msg.value);
            plots[_id].dimensionX=_dimensionX;
            plots[_id].dimensionY=_dimensionY;
            plots[_id].dimensionZ=_dimensionZ;
            plots[_id].positionX=_positionX;
            plots[_id].positionY=_positionY;
            plots[_id].positionZ=_positionZ;
            plots[_id].basePrice=_basePrice;
            plots[_id].price=_basePrice;
        }
        else{
            require(msg.value==plots[_id].price,"Please send the required amount to purchase property");
            require(plots[_id].status==LandLibrary.Status.forSale,"The property is not for sale");
            nft.safeTransferFrom(plots[_id].plotOwner,msg.sender,_id);
            plots[_id].plotOwner.transfer(msg.value);
            emit nftBought(_id,msg.sender,plots[_id].plotOwner,plots[_id].price,_URI);
        }
        plots[_id].plotOwner=payable(msg.sender);
        plots[_id].status=LandLibrary.Status.notForSale;       
    }
    
    function setPrice(uint256 _id,uint256 _price) _isOwnerOfPlot(_id) public{
        plots[_id].price=_price;
        plots[_id].status=LandLibrary.Status.forSale;
        emit priceSet(_id,plots[_id].plotOwner,_price);
    }
}