// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.17;
import "./Token_test.sol";
import "./notification.sol";
import "./workers.sol"; 
import "./marketplace.sol";


contract Main is marketplace , Notifications, AccountTypes {

    address tokenAddress = address(this);   
    
    constructor() {}
    
    function getBalanceKontrakt() external view returns(uint) {
        return Token_test(tokenAddress).balanceOf(tokenAddress);
    }
    // wyjasnienie -> tutaj sa tylko funkcje ktore uzywaja adresu kontraktu
    //akceptacja ticketa 
    function approve ( uint256 _id , string calldata _Explenation ) external {
        require( _id >= 0, "Negative id");
        require( _id < Table.length, "Index out of range");
        require( Table[_id].Status == statuses.SEND, "Ticket is closed");
        Table[_id].Status = statuses.APPROVED;
        Table[_id].StatusExplanation = _Explenation;
        Token_test(tokenAddress).transfer(Table[_id].ReciverWallet, Table[_id].TokenAmount);
    }

    // kupno przedmiotu 
    function BuyItem ( uint256 item_id , address _buyer ) external  {
        require( item_id > 0  , "Negative ID");
        require( item_id < Items.length,"Product out of the list");
        require( Items[item_id].status == item_status.SELLING, "Product is not for sale" );
        Token_test(tokenAddress).approve(_buyer, Items[item_id].price );

    }

}

