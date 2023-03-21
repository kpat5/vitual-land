// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Land{

    address payable owner;

    constructor(){
        owner=payable(msg.sender);
    }

    struct plot{
        int256 dimensionY;
        int256 dimensionX;
        int256 dimensionZ;
        int256 positionX;
        int256 positionY;
        int256 positionZ;
        uint256 price;
        uint256 basePrice;
        address payable plotOwner;
        bool forSale;
    }

    mapping(uint256=>plot) public plots;

    modifier _isOwnerOfPlot(uint256 _id){
        require(plots[_id].plotOwner==msg.sender,"You are not the owner of this property");
        _;
    }

    function buy(uint256 _id,int256 _dimensionX,int256 _dimensionY,int256 _dimensionZ,int256 _positionX,int256 _positionY,int256 _positionZ,uint256 _basePrice)public payable{
        if(plots[_id].plotOwner==address(0)){
            require(msg.value==_basePrice,"Please send the required amount to purchase property");
            owner.transfer(msg.value);
            plots[_id].dimensionX=_dimensionX;
            plots[_id].dimensionY=_dimensionY;
            plots[_id].dimensionZ=_dimensionZ;
            plots[_id].positionX=_positionX;
            plots[_id].positionY=_positionY;
            plots[_id].positionZ=_positionZ;
        }
        else{
            require(msg.value==plots[_id].price,"Please send the required amount to purchase property");
            require(plots[_id].forSale,"The property is not for sale");
            plots[_id].plotOwner.transfer(msg.value);
        }
        plots[_id].plotOwner=payable(msg.sender);
        plots[_id].forSale=false;
    }

    function getPrice(uint256 _id)public view returns(uint256){
        return plots[_id].price;
    }

    function setPrice(uint256 _id,uint256 _price) _isOwnerOfPlot(_id) public{
        plots[_id].price=_price;
        plots[_id].forSale=true;
    }
    
}