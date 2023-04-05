// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Land.sol";
import "./interfaces/events.sol";
import "./libraries/LandLibrary.sol";


contract Bid is Land,events{

    function placeBid(uint256 _id,uint256 _bidAmt)public payable{
        require(plots[_id].status==LandLibrary.Status.forBid,"Not up for bidding");
        require(!isOwner(_id),"You are the owner so you cannot place bids");
        require(_bidAmt>plots[_id].bid.currBidAmt,"Bid amount should be greater than previous bid");
        require(msg.value==_bidAmt,"Please send the required funds for bidding");
        if(plots[_id].bid.currBid!=payable(address(0))){
            plots[_id].bid.currBid.transfer(plots[_id].bid.currBidAmt);
        }
        plots[_id].bid.currBid=payable(msg.sender);
        plots[_id].bid.currBidAmt=_bidAmt;
        emit bidPlaced(_id,plots[_id].bid.currBid,plots[_id].bid.currBidAmt);
    }

    function putForBid(uint256 _id) _isOwnerOfPlot(_id)public{
        plots[_id].status=LandLibrary.Status.forBid;
        emit hasPutForBid(_id,plots[_id].plotOwner);
    }

    function sellForMaxBid(uint256 _id) _isOwnerOfPlot(_id) public{
        plots[_id].plotOwner.transfer(plots[_id].bid.currBidAmt);
        nft.safeTransferFrom(plots[_id].plotOwner,msg.sender,_id);
        plots[_id].plotOwner=payable(msg.sender);
        emit soldForMaxBid(_id,plots[_id].bid.currBid,msg.sender,plots[_id].bid.currBidAmt);
    }
}