// App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PetTradingSystem from './artifacts/contracts/PetTradingSystem.sol/PetTradingSystem.json';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({ name: '', breed: '', price: '' });
  const [loading, setLoading] = useState(false);

  // 初始化Web3连接
  const initWeb3 = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // 替换为你的合约地址
        const contractAddress = "0xa9336aADA1867c648c547EEF84dDdc7b23306a1F";
        const petContract = new ethers.Contract(contractAddress, PetTradingSystem.abi, signer);
        setContract(petContract);

        loadPets();
      } else {
        alert('请安装MetaMask!');
      }
    } catch (error) {
      console.error('初始化错误:', error);
    }
  };

  // 加载所有宠物
  const loadPets = async () => {
    try {
      const allPets = await contract.getAllPets();
      setPets(allPets);
    } catch (error) {
      console.error('加载宠物失败:', error);
    }
  };

  // 注册新宠物
  const registerPet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const price = ethers.utils.parseEther(newPet.price);
      const tx = await contract.registerPet(newPet.name, newPet.breed, price);
      await tx.wait();
      loadPets();
      setNewPet({ name: '', breed: '', price: '' });
    } catch (error) {
      console.error('注册宠物失败:', error);
    }
    setLoading(false);
  };

  // 购买宠物
  const buyPet = async (petId, price) => {
    setLoading(true);
    try {
      const tx = await contract.buyPet(petId, { value: price });
      await tx.wait();
      loadPets();
    } catch (error) {
      console.error('购买宠物失败:', error);
    }
    setLoading(false);
  };

  // 上架宠物
  const listPetForSale = async (petId, price) => {
    setLoading(true);
    try {
      const priceInWei = ethers.utils.parseEther(price);
      const tx = await contract.listPetForSale(petId, priceInWei);
      await tx.wait();
      loadPets();
    } catch (error) {
      console.error('上架宠物失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    initWeb3();
  }, []);

  return (
    <div className="App">
      <h1>宠物交易系统</h1>
      <p>当前账户: {account}</p>

      {/* 注册宠物表单 */}
      <div className="register-form">
        <h2>注册新宠物</h2>
        <form onSubmit={registerPet}>
          <input
            type="text"
            placeholder="宠物名称"
            value={newPet.name}
            onChange={(e) => setNewPet({...newPet, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="宠物品种"
            value={newPet.breed}
            onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
          />
          <input
            type="text"
            placeholder="价格 (ETH)"
            value={newPet.price}
            onChange={(e) => setNewPet({...newPet, price: e.target.value})}
          />
          <button type="submit" disabled={loading}>注册宠物</button>
        </form>
      </div>

      {/* 宠物列表 */}
      <div className="pets-list">
        <h2>所有宠物</h2>
        {pets.map((pet, index) => (
          <div key={pet.id.toString()} className="pet-card">
            <h3>{pet.name}</h3>
            <p>品种: {pet.breed}</p>
            <p>价格: {ethers.utils.formatEther(pet.price)} ETH</p>
            <p>拥有者: {pet.owner}</p>
            <p>状态: {pet.forSale ? '在售' : '未在售'}</p>
            {pet.owner.toLowerCase() === account.toLowerCase() ? (
              !pet.forSale && (
                <div>
                  <input
                    type="text"
                    placeholder="设置价格 (ETH)"
                    id={`price-${pet.id}`}
                  />
                  <button onClick={() => listPetForSale(pet.id, document.getElementById(`price-${pet.id}`).value)}>
                    上架出售
                  </button>
                </div>
              )
            ) : (
              pet.forSale && (
                <button onClick={() => buyPet(pet.id, pet.price)}>
                  购买
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;