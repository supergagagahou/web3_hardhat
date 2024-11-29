/*****************包管理***************** */
require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()//使用chainlink加密密钥
// require("@nomicfoundation/hardhat-verify");

/********************API管理*********************** */
//alchemyAPI
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL
//小狐狸账户
const METAMASK_PRIVATE_KEY_0 = process.env.METAMASK_PRIVATE_KEY_0
//账户2
const METAMASK_PRIVATE_KEY_1 = process.env.METAMASK_PRIVATE_KEY_1
//apiKey
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY


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
        accounts: [METAMASK_PRIVATE_KEY_0,METAMASK_PRIVATE_KEY_1],
        chainId:11155111

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
   ,etherscan: {
      // Your API key for Etherscan
      // Obtain one at https://etherscan.io/
      apiKey:{
        sepolia:ETHERSCAN_API_KEY
      }
    
    }
    /******不要使用sourcify，打开后会连接不到etherscan，这大概就是玄学吧***** */
    // ,
    // sourcify: {
    //   // Disabled by default
      
    //   // Doesn't need an API key
    //   enabled: true
    // }

  };
