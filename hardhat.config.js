/************启动必看******* */
//由于使用了env-enc加密了密钥，每次启动cmd之前需要先
//运行npx env-enc set-pw验证密码，否则配置文件将会报错
//             

/*****************包管理***************** */
require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()//使用chainlink加密密钥
require("hardhat-deploy")
require("@nomicfoundation/hardhat-ethers")
require("hardhat-deploy-ethers")
// require("@nomicfoundation/hardhat-verify");


/********************API管理*********************** */
//alchemyAPI
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL
//小狐狸账户
const METAMASK_PRIVATE_KEY_0 = process.env.METAMASK_PRIVATE_KEY_0
//账户2
const METAMASK_PRIVATE_KEY_1 = process.env.METAMASK_PRIVATE_KEY_1
//etherscan apiKey
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


/***************解决中国墙阻止etherscanAPI访问网络******************** */
const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890");//要修改为代理软件的端口
setGlobalDispatcher(proxyAgent);

/***********************hardhat配置管理***************************** */
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.26",

  networks: {
    sepolia: {
      url: ALCHEMY_API_URL,
      accounts: [METAMASK_PRIVATE_KEY_0, METAMASK_PRIVATE_KEY_1],
      chainId: 11155111

    },
    // hardhat: {
    //   //更改默认链ID
    //   chainId: 1337
    // },
    ganache: {
      //部署到ganache网络
      url: 'http://127.0.0.1:7545'
    }
  }
  , etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }

  },
  namedAccounts: {
    accounts1: {
      default: 0, // 默认使用第一个账户作为部署者
    },
    accounts2: {
      default: 1, // 默认使用第二个账户作为部署者
    }
  }
  /******不要使用sourcify，打开后会连接不到etherscan，这大概就是玄学吧***** */
  // ,
  // sourcify: {
  //   // Disabled by default

  //   // Doesn't need an API key
  //   enabled: true
  // }
  // ,
  // paths:{//将合约 ABI 导出到前端项目中
  //   artifacts: "./frontend/src/artifacts", // 设置 ABI 存放路径

  // }
};
