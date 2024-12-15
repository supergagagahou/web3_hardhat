// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PetTradingSystem {
    // 宠物结构体
    struct Pet {
        uint256 id; // 宠物ID
        string name; // 宠物名称
        string breed; // 宠物品种
        uint256 price; // 宠物价格
        address owner; // 宠物当前拥有者
        bool forSale; // 是否在售
    }

    // 存储所有宠物
    Pet[] public pets;

    // 事件
    event PetRegistered(uint256 indexed petId, string name, string breed, uint256 price, address indexed owner);
    event PetBought(uint256 indexed petId, address indexed newOwner, uint256 price);
    event PetListedForSale(uint256 indexed petId, uint256 price);

    // 注册宠物
    function registerPet(string memory _name, string memory _breed, uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");

        uint256 petId = pets.length;
        pets.push(Pet(petId, _name, _breed, _price, msg.sender, false));

        emit PetRegistered(petId, _name, _breed, _price, msg.sender);
    }

    // 将宠物标记为出售
    function listPetForSale(uint256 _petId, uint256 _price) public {
        require(_petId < pets.length, "Invalid pet ID");
        Pet storage pet = pets[_petId];

        require(msg.sender == pet.owner, "Only the owner can list the pet for sale");
        require(_price > 0, "Price must be greater than zero");

        pet.price = _price;
        pet.forSale = true;

        emit PetListedForSale(_petId, _price);
    }

    // 购买宠物
    function buyPet(uint256 _petId) public payable {
        require(_petId < pets.length, "Invalid pet ID");
        Pet storage pet = pets[_petId];

        require(pet.forSale, "This pet is not for sale");
        require(msg.value >= pet.price, "Insufficient payment");

        address previousOwner = pet.owner;

        // 转移宠物所有权
        pet.owner = msg.sender;
        pet.forSale = false;

        // 支付给原主人
        payable(previousOwner).transfer(pet.price);

        emit PetBought(_petId, msg.sender, pet.price);
    }

    // 获取所有宠物
    function getAllPets() public view returns (Pet[] memory) {
        return pets;
    }

    // 获取宠物详情
    function getPetDetails(uint256 _petId) public view returns (Pet memory) {
        require(_petId < pets.length, "Invalid pet ID");
        return pets[_petId];
    }
}
