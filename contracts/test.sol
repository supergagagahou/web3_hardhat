// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;
contract Test{
    address owner;
    constructor(){
        owner=msg.sender;
    }
    function hello()pure external returns(string memory ){
        return "hello world";
    }
}