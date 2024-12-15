import { ethers } from "ethers";

import contractABI from "./artifacts/contracts/fundraising.sol/fundraising.json";


const CONTRACT_ADDRESS = "0x99AA4195b76226C4Df1eDDc6eaB9C93361735aCa"; // 替换为你的合约地址

export const connectWallet = async () => {
    if (!window.ethereum) throw new Error("MetaMask 未安装");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return { provider, signer, account: accounts[0] };
  };
  export const getContract = (signerOrProvider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signerOrProvider);
  };