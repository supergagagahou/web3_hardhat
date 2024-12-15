import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, TextField, Typography, Box, Alert } from "@mui/material";

const contractAddress = "0x6FDB3D633C08D1168963d32A35Ef10FdBa8fbe37";
const contractABI = [{"inputs":[{"internalType":"uint256","name":"_target","type":"uint256"},{"internalType":"uint256","name":"_lock_time","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"add","type":"address"},{"indexed":false,"internalType":"uint256","name":"money","type":"uint256"}],"name":"fund_event","type":"event"},{"inputs":[{"internalType":"uint256","name":"_time","type":"uint256"}],"name":"admin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"clear_fundraising_owner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contract_status","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contract_time","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fund","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_inve","type":"address"}],"name":"get_investor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"is_lock_tiem","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"money_pool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_target","type":"uint256"},{"internalType":"uint256","name":"_lock_time","type":"uint256"}],"name":"restart","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"target","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw_money_pool","outputs":[],"stateMutability":"payable","type":"function"}];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [moneyPool, setMoneyPool] = useState("0");
  const [fundAmount, setFundAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (contract) {
      fetchContractData();
    }
  }, [contract]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("请安装 MetaMask！");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, await signer);
      setContract(contractInstance);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchContractData = async () => {
    try {
      const pool = await contract.money_pool();
      setMoneyPool(ethers.formatEther(pool));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFund = async () => {
    try {
      if (!contract) throw new Error("请先连接钱包");
      if (!fundAmount) throw new Error("请输入投资金额");
      const tx = await contract.fund({ value: ethers.parseEther(fundAmount) });
      setMessage("交易已发送,等待确认...");
      await tx.wait();
      setMessage("投资成功！");
      fetchContractData();
      setFundAmount("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefund = async () => {
    try {
      if (!contract) throw new Error("请先连接钱包");
      const tx = await contract.refund();
      setMessage("交易已发送,等待确认...");
      await tx.wait();
      setMessage("退款成功！");
      fetchContractData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      if (!contract) throw new Error("请先连接钱包");
      const tx = await contract.withdraw_money_pool();
      setMessage("交易已发送,等待确认...");
      await tx.wait();
      setMessage("取出资金池成功！");
      fetchContractData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>众筹 DApp</Typography>
      {account ? (
        <Typography variant="h6">已连接: {account}</Typography>
      ) : (
        <Button variant="contained" color="primary" onClick={connectWallet}>
          连接钱包
        </Button>
      )}
      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Typography variant="h6" sx={{ mt: 2 }}>当前资金池: {moneyPool} ETH</Typography>
      <Box mt={2}>
        <TextField
          label="投资金额 (ETH)"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
          fullWidth
          type="number"
          inputProps={{ min: "0", step: "0.01" }}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleFund}
            disabled={!contract}
          >
            投资
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleRefund}
            disabled={!contract}
          >
            退款
          </Button>
          <Button 
            variant="contained" 
            color="warning" 
            onClick={handleWithdraw}
            disabled={!contract}
          >
            取出资金池
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
