// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./NFT.sol";
import "./libraries/LandLibrary.sol";

contract Land{

    address payable owner;
    using LandLibrary for LandLibrary.Plot;
    using LandLibrary for LandLibrary.Bids;
    // using LandLibrary for LandLibrary.Status;
    NFT nft=new NFT();
    
    constructor(){
        owner=payable(msg.sender);
    }

    mapping(uint256=>LandLibrary.Plot) public plots;

        
    modifier _isOwnerOfPlot(uint256 _id){
        require(plots[_id].plotOwner==msg.sender,"You are not the owner of this property");
        _;
    }


    function getStatus(uint256 _id)public view returns(uint256){
        if(plots[_id].status==LandLibrary.Status.notForSale)return 0;
        if(plots[_id].status==LandLibrary.Status.forSale)return 1;
        if(plots[_id].status==LandLibrary.Status.forBid)return 2;
        return 3;
    }

    function getPrice(uint256 _id)public view returns(uint256){
        return plots[_id].price==0?0:plots[_id].price;
    }

    function isOwner(uint256 _id)public view returns(bool){
        return plots[_id].plotOwner==payable(msg.sender)?true:false;
    }

    function getOwnerDetails(uint256 _id)public view returns(address,bool){
        return (plots[_id].plotOwner,plots[_id].plotOwner==payable(msg.sender)?true:false);
    }

    function getBidDetails(uint256 _id)public view returns(address,uint256,address){
        return (plots[_id].plotOwner,plots[_id].bid.currBidAmt,plots[_id].bid.currBid);
    }   
}