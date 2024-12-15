import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { LinearProgress } from '@mui/material';
import {
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider
} from "@mui/material";

const contractAddress = "0x6FDB3D633C08D1168963d32A35Ef10FdBa8fbe37";
const contractABI = [{ "inputs": [{ "internalType": "uint256", "name": "_target", "type": "uint256" }, { "internalType": "uint256", "name": "_lock_time", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "add", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "money", "type": "uint256" }], "name": "fund_event", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_time", "type": "uint256" }], "name": "admin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "clear_fundraising_owner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contract_status", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contract_time", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "fund", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_inve", "type": "address" }], "name": "get_investor", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "is_lock_tiem", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "money_pool", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "refund", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_target", "type": "uint256" }, { "internalType": "uint256", "name": "_lock_time", "type": "uint256" }], "name": "restart", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "target", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdraw_money_pool", "outputs": [], "stateMutability": "payable", "type": "function" }];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [moneyPool, setMoneyPool] = useState("0");
  const [fundAmount, setFundAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [target, setTarget] = useState("0");
  const [contractStatus, setContractStatus] = useState("");
  const [contractTime, setContractTime] = useState({ message: "", time: "0" });
  const [newTarget, setNewTarget] = useState("");
  const [newLockTime, setNewLockTime] = useState("");
  const [adminTime, setAdminTime] = useState("");
  const [investorAmount, setInvestorAmount] = useState("0");
  const [investorAddress, setInvestorAddress] = useState("");

  useEffect(() => {
    if (contract) {
      fetchAllContractData();
    }
  }, [contract]);

  const fetchAllContractData = async () => {
    try {
      if (!contract) return;

      // 获取资金池金额
      const pool = await contract.money_pool();
      console.log("Money Pool Raw:", pool);
      setMoneyPool(ethers.formatEther(pool));

      // 获取目标金额
      const targetAmount = await contract.target();
      console.log("Target Raw:", targetAmount);
      setTarget(ethers.formatEther(targetAmount));

      // 获取合约状态
      const status = await contract.contract_status();
      console.log("Contract Status:", status);
      setContractStatus(status);

      // 获取合约时间信息
      const time = await contract.contract_time();
      console.log("Contract Time:", time);

      // 确保时间值是数字
      const timeValue = time[1].toString();
      console.log("Time Value:", timeValue);

      setContractTime({
        message: time[0],
        time: timeValue
      });

    } catch (err) {
      console.error("获取合约数据错误:", err);
      setError(err.message);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("请安装MetaMask!");

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      setAccount(accounts[0]);
      setContract(contractInstance);
      setMessage("钱包连接成功!");

      // 连接成功后立即获取合约数据
      await fetchAllContractData();
    } catch (err) {
      console.error("连接钱包错误:", err);
      setError(err.message);
    }
  };
  const handleFund = async () => {
    try {
      if (!contract) throw new Error("请先连接钱包");
      if (!fundAmount) throw new Error("请输入投资金额");

      const tx = await contract.fund({
        value: ethers.parseEther(fundAmount)
      });
      setMessage("投资交易已发送...");
      await tx.wait();
      setMessage("投资成功!");
      setFundAmount("");
      fetchAllContractData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefund = async () => {
    try {
      if (!contract) throw new Error("请先连接钱包");

      const tx = await contract.refund();
      setMessage("退款请求已发送...");
      await tx.wait();
      setMessage("退款成功!");
      fetchAllContractData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      if (!contract) throw new Error("请先连接钱包");

      const tx = await contract.withdraw_money_pool();
      setMessage("提取资金请求已发送...");
      await tx.wait();
      setMessage("资金提取成功!");
      fetchAllContractData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestart = async () => {
    try {
      if (!contract) throw new Error("请先连接钱包");
      if (!newTarget || !newLockTime) throw new Error("请输入新的目标金额和锁定时间");

      // 修改这一行，直接传入数值，不需要parseEther
      const tx = await contract.restart(newTarget, newLockTime);
      setMessage("重启交易已发送...");
      await tx.wait();
      setMessage("合约已重启!");
      setNewTarget("");
      setNewLockTime("");
      fetchAllContractData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdmin = async () => {
    try {
      if (!contract) throw new Error("请先连接钱包");
      if (!adminTime) throw new Error("请输入时间参数");

      const tx = await contract.admin(adminTime);
      setMessage("管理员操作已发送...");
      await tx.wait();
      setMessage("管理员操作成功!");
      setAdminTime("");
      fetchAllContractData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGetInvestor = async () => {
    try {
      if (!contract) throw new Error("请先连接钱包");
      if (!investorAddress) throw new Error("请输入投资者地址");

      const amount = await contract.get_investor(investorAddress);
      setInvestorAmount(ethers.formatEther(amount));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Typography variant="h3" gutterBottom align="center">
        众筹 DApp
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {account ? (
            <Typography variant="h6">钱包地址: {account}</Typography>
          ) : (
            <Button variant="contained" color="primary" onClick={connectWallet}>
              连接钱包
            </Button>
          )}
        </CardContent>
      </Card>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>

        {/* // 在合约状态卡片中修改时间显示部分: */}

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">合约状态</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={fetchAllContractData}
                  disabled={!contract}
                >
                  刷新
                </Button>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ '& > *': { mb: 1 } }}>
                <Typography>
                  <strong>当前资金池:</strong> {parseFloat(moneyPool).toFixed(4)} ETH
                </Typography>
                <Typography>
                  <strong>目标金额:</strong> {parseFloat(target).toFixed(4)} ETH
                </Typography>
                <Typography>
                  <strong>合约状态:</strong> {contractStatus}
                </Typography>
                <Typography>
                  <strong>时间状态:</strong> {contractTime.message}
                </Typography>
                <Typography>
                  <strong>剩余时间:</strong> {
                    parseInt(contractTime.time) > 0
                      ? `${parseInt(contractTime.time)} 秒`
                      : contractTime.message
                  }
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(target) > 0 ? (parseFloat(moneyPool) / parseFloat(target)) * 100 : 0}
                  sx={{ mt: 2 }}
                />
                <Typography variant="body2" color="text.secondary" align="right">
                  进度: {parseFloat(target) > 0 ? ((parseFloat(moneyPool) / parseFloat(target)) * 100).toFixed(2) : 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">投资操作</Typography>
              <Divider sx={{ my: 1 }} />
              <TextField
                label="投资金额 (ETH)"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                fullWidth
                type="number"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleFund}
                disabled={!contract}
                fullWidth
              >
                投资
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">查询投资者</Typography>
              <Divider sx={{ my: 1 }} />
              <TextField
                label="投资者地址"
                value={investorAddress}
                onChange={(e) => setInvestorAddress(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleGetInvestor}
                disabled={!contract}
                fullWidth
                sx={{ mb: 1 }}
              >
                查询
              </Button>
              <Typography>投资金额: {investorAmount} ETH</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">管理员功能</Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="新目标金额 (ETH,直接输入数字)"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  fullWidth
                  sx={{ mb: 1 }}
                  helperText="请直接输入ETH数量,例如:1"
                />
                <TextField
                  label="新锁定时间 (秒)"
                  value={newLockTime}
                  onChange={(e) => setNewLockTime(e.target.value)}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleRestart}
                  disabled={!contract}
                  fullWidth
                >
                  重启合约
                </Button>
              </Box>
              <TextField
                label="管理员时间参数"
                value={adminTime}
                onChange={(e) => setAdminTime(e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
                helperText="当锁定时间为300秒时,为强制取出"

              />
              <Button
                variant="contained"
                color="error"
                onClick={handleAdmin}
                disabled={!contract}
                fullWidth
              >
                管理员操作
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">其他操作</Typography>
              <Divider sx={{ my: 1 }} />
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleRefund}
                disabled={!contract}
                fullWidth
                sx={{ mb: 1 }}
              >
                申请退款
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleWithdraw}
                disabled={!contract}
                fullWidth
              >
                取出资金池
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;