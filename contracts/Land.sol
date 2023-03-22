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
        bool forBid;
        bids bid;
    }

    struct bids{
        address payable currBid;
        uint256 currBidAmt;
    }

    mapping(uint256=>plot) public plots;

    modifier _isOwnerOfPlot(uint256 _id){
        require(plots[_id].plotOwner==msg.sender,"You are not the owner of this property");
        _;
    }

    function buy(uint256 _id,int256 _dimensionX,int256 _dimensionY,int256 _dimensionZ,int256 _positionX,int256 _positionY,int256 _positionZ,uint256 _basePrice) public payable{
        require(!isOwner(_id),"You already own this property");
        if(plots[_id].plotOwner==payable(address(0))){
            require(msg.value==_basePrice,"Please send the required amount to purchase property 1");
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
            require(plots[_id].forSale,"The property is not for sale");
            plots[_id].plotOwner.transfer(msg.value);
        }
        plots[_id].plotOwner=payable(msg.sender);
        plots[_id].forSale=false;
        plots[_id].forBid=false;
    }

    function placeBid(uint256 _id,uint256 _bidAmt)public payable{
        require(plots[_id].forBid,"Not up for bidding");
        require(!isOwner(_id),"You are the owner so you cannot place bids");
        require(_bidAmt>plots[_id].bid.currBidAmt,"Bid amount should be greater than previous bid");
        require(msg.value==_bidAmt,"Please send the required funds for bidding");
        if(plots[_id].bid.currBid!=payable(address(0))){
            plots[_id].bid.currBid.transfer(plots[_id].bid.currBidAmt);
        }
        plots[_id].bid.currBid=payable(msg.sender);
        plots[_id].bid.currBidAmt=_bidAmt;
    }

    function getPrice(uint256 _id)public view returns(uint256){
        // return 0;
        return plots[_id].price==0?0:plots[_id].price;
    }

    function isOwner(uint256 _id)public view returns(bool){
        return plots[_id].plotOwner==payable(msg.sender)?true:false;
    }

    function getDetails(uint256 _id)public view returns(address,uint256,uint256,bool){
        return (plots[_id].plotOwner,plots[_id].price,plots[_id].bid.currBidAmt,plots[_id].forSale);
    }

    function setPrice(uint256 _id,uint256 _price) _isOwnerOfPlot(_id) public{
        plots[_id].price=_price;
        plots[_id].forSale=true;
        plots[_id].forBid=false;
    }
    function putForBid(uint256 _id) _isOwnerOfPlot(_id)public{
        plots[_id].forBid=true;
        plots[_id].forSale=false;
    }

    function sellForMaxBid(uint256 _id) _isOwnerOfPlot(_id) public{
        plots[_id].plotOwner.transfer(plots[_id].bid.currBidAmt);
        plots[_id].plotOwner=payable(msg.sender);
    }
    
}