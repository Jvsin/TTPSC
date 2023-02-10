// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.17;
import "./Token_test.sol";


contract AccountTypes {

    enum role {  // role uzytkownikow
        EMPLOYEE, // pracownik 
        HR, // ci od owocowych czwartkow
        ADMIN, // administrator
        OWNER, // tu trzymamy portfel glowny firmy
        NOT_WORKED // pracownicy ktorzy juz nie pracuja 
    }
    
    address private owner;
     // adres 
    struct user_t{
        uint256 ID; // id 
        address user; // adres urzytkownika 
        string Name; // imie 
        string Surname; // nazwisko 
        string Email; // email 
        role Rank; 
    }

    user_t[] public workers;

    constructor () {}
  
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    // znajdowanie usera czy juz istnieje 
    function findUser(address user, string calldata name, string calldata surname)external view returns(bool){
        for(uint256 i = 0; i < workers.length; i++){
            if(user == workers[i].user && compareStrings(name,workers[i].Name) && compareStrings(surname,workers[i].Surname)){
                return true;
            }
        }
        return false;
    }

    // znajdowanie portfela wsrod pracownikow
    function findWallet(address wallet) external view returns(bool){
        for(uint256 i = 0; i < workers.length; i++){
            if(workers[i].user == wallet){
                return true;
            }
        }
        return false;
    }

    //dodawanie nowego usera
    function addUser(address user, string calldata name, string calldata surname, string calldata email, role rank) external {
        require(this.findUser(user,name,surname) == false ,"User is existing");
        user_t memory new_worker;
        new_worker.ID = workers.length;
        new_worker.user = user;
        new_worker.Name = name;
        new_worker.Surname = surname;
        new_worker.Email = email;
        new_worker.Rank = rank;
        workers.push(new_worker);
    }

    // zmiana roli pracownika 
    function changeRole(uint256 _id, role new_role) external returns(bool) {
        require( workers.length > 0 , "Empty Stack");
        require(_id < workers.length,"ID out of the scope");
        workers[_id].Rank = new_role;
        return true;
    }

    function getAllUsers () external view returns(user_t[] memory) {
        require ( workers.length > 0 , "Empty stack");
        user_t[] memory temp = new user_t[](workers.length);
        for ( uint256 i = 0 ; i < workers.length; i++) {
            temp[i] = workers[i];
        }
        return temp;
    }

    function getUser(address userAddress) external view returns (user_t memory) {
        require ( workers.length > 0 , "Empty stack");
        user_t memory user = user_t({ID: 0, user: address(0), Name: "", Surname: "", Email: "", Rank: role.NOT_WORKED});
        for (uint256 i = 0; i < workers.length; i++) {
            if (workers[i].user == userAddress) {
                user = workers[i];
                break;
            }
        }
        return user;
    }
}