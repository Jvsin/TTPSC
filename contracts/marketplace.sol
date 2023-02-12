// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.17;
import "./Token_test.sol";
import "./notification.sol";
import "./workers.sol";

contract marketplace {
    enum item_status {
        SELLING, // jest sprzedawany
        ARCHIVED // jest zarchiwizowany
    }
    struct items {
        uint256 id; // nr iteama
        string name; // nazwa przedmiotu
        uint256 price; // cena przedmiotu
        item_status status; 
    }

    struct history {
        uint256 id; // nr transakcji 
        address buyer; // nabywca
        uint256 data; // data zakupu 
        uint256 item_ID;
    }

    Notifications tickets;

    // zawartosc sklepu 
    items[] public Items;

    // historia zakupowa 
    history[] public historia; 

    // moze go nie byc jak jest pusty
    constructor () {}

    function AddItem( string calldata _name , uint256 _price ) external {
        require(_price >= 0, "Price cannot be negative");
        require( bytes(_name).length != 0 , "Name cannot be empty");
        uint256 _id = Items.length;
        Items.push(items(_id, _name, _price, item_status.SELLING ));
    }

    function ArchiveItem ( uint256 _id ) external {
        require( Items.length > 0 , "Empty stack");
        require ( _id < Items.length , "Product out of the list"); 
        require ( Items[_id].status != item_status.ARCHIVED, "Item is already archived");
        Items[_id].status = item_status.ARCHIVED;
    } 

    function SellItem ( uint256 _id ) external {
        require( Items.length > 0 , "Empty stack");
        require(_id < Items.length,"Product out of the list");
        require ( Items[_id].status != item_status.SELLING, "Item is already for sale");
        Items[_id].status = item_status.SELLING;
    }

    function GetAllItems () external view returns(items[] memory) {
        require ( Items.length > 0 , "Empty stack");
        items[] memory temp = new items[](Items.length);
        for ( uint256 i = 0 ; i < Items.length; i++) {
            temp[i] = Items[i];
        }
        return temp;
    }

    function GetForSaleItems () external view returns(items[] memory) {
        require ( Items.length > 0 , "Empty stack");
        uint256 counter = 0;
        for ( uint256 i = 0 ; i < Items.length; i++) {
            if ( Items[i].status == item_status.SELLING ) {
                counter++;
            } 
        }
        require( counter > 0 , "No items for sale" );
        items[] memory temp = new items[](counter);
        counter = 0 ;
        for ( uint256 i = 0 ; i < Items.length; i++) {
            if ( Items[i].status == item_status.SELLING ) {
                temp[counter] = Items[i];
                counter++;
            } 
        }
        return temp;
    }

    //dodaj do historii zakupowej
    function AddToHistory (uint256 _productID, address user) public returns(bool) {
        require(_productID <= Items.length,"Product does not exist");
        uint256 count = historia.length;
        uint256 date = block.timestamp;
        historia.push(history(count, user, date, _productID));
        return true;
    }

    //pobierz historie zakupow
    function GetAllHistory () external view returns(history[] memory) {
        require ( historia.length > 0 , "Empty stack");
        history[] memory temp = new history[](historia.length);
        for ( uint256 i = 0 ; i < historia.length; i++) {
            temp[i] = historia[i];
        }
        return temp;
    }
}