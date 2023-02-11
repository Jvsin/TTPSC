// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <=0.8.17;

import "./Token_test.sol";
import "./workers.sol";
contract Notifications {
    enum statuses {
        SEND, // wyslane
        APPROVED,  // zatwierdzone
        REJECTED // odrzucone
    }
    struct Notification {
        uint256 id; // id zgloszenia 
        uint NotificationData; // data utworzenia zgloszenia -> tutaj masz objasnienie daty https://soliditytips.com/articles/solidity-dates-time-operations/
        string Explenation; // wyjasnienie dlaczegp
        uint256 TokenAmount; // ilosc tokenow 
        address SenderWallet; // adres portfela wysylajacego 
        address ReciverWallet; // adres na jaki ma to isc 
        statuses Status; // enum do statusow , zmienia sie wraz z odrzuceniem, zatwierdzeniem zgloszenia
        string StatusExplanation; // wyjasnienie czemu zatweirdzamy/ odrzucamy zgloszenie
    }


    //address tokenAddress = address(this);

    // konstruktor workers 
    AccountTypes pracownicy;

    //tabla z danymi o ticketach
    Notification[] public Table;


    // dodanie ticketu 
    function NewTicket ( string calldata _Explenation, uint256 _TokenAmount, address _ReciverWallet, address _SenderWallet ) external {
        require( _TokenAmount > 0, "To low token amount");
        require( bytes(_Explenation).length != 0 , "Explanation cannot be empty");
        uint256 id = Table.length;
        uint256 today = block.timestamp;
        Table.push(Notification(id, today ,_Explenation, _TokenAmount, _SenderWallet, _ReciverWallet, statuses.SEND , "" ));
    }

    // odrzucanie ticketa 
    function reject ( uint256 _id , string calldata _Explenation ) external {
        require( _id >= 0, "Negative id");
        require( Table.length > 0 , "Empty stack");
        require( _id < Table.length, "Index out of range");
        require( bytes(_Explenation).length != 0 , "Explanation cannot be empty");
        require( Table[_id].Status == statuses.SEND, "Ticket is closed");
        Table[_id].Status = statuses.REJECTED;
        Table[_id].StatusExplanation = _Explenation;
    }

    // wyswietlanie wszystkich ticketow 
    function GetAll () external view returns(Notification[] memory) {
        require(Table.length > 0 , "Empty stack");
        Notification[] memory temp = new Notification[](Table.length);
        for ( uint256 i = 0 ; i < Table.length; i++) {
            temp[i] = Table[i];
        }
        return temp;
    }

    // wyswietlanie wyslanych 
    function GetSent () external view returns(Notification[] memory) {
        require(Table.length > 0 , "Empty stack");
        uint256 counter = 0 ;
        for ( uint256 i = 0 ; i < Table.length; i++) {
            if ( Table[i].Status == statuses.SEND) {
                counter++;
            }
        }
        require(counter > 0, "No send elements");
        Notification[] memory temp = new Notification[](counter);
        counter = 0;
        for ( uint256 i = 0 ; i < Table.length; i++) {
            if ( Table[i].Status == statuses.SEND) {
                temp[counter] = Table[i];
                counter++;
            }
        }
        return temp;
    }

    // wyswietlanie swoich zgloszen 
    function GetMy ( address _owner ) external view returns(Notification[] memory) {
        require(Table.length > 0 , "Empty stack");
        uint256 counter = 0 ;
        for ( uint256 i = 0 ; i < Table.length; i++) {
            if ( Table[i].SenderWallet == _owner ) {
                counter++;
            }
        }
        require(counter > 0, "No send elements");
        Notification[] memory temp = new Notification[](counter);
        counter = 0;
        for ( uint256 i = 0 ; i < Table.length; i++) {
            if ( Table[i].SenderWallet == _owner ) {
                temp[counter] = Table[i];
                counter++;
            }
        }
        return temp;
    }
}