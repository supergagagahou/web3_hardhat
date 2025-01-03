一、项目构建说明(创建过程，非学习可跳到第二部分)：
1、初始化目录

npm init --yes

2、安装依赖(注意版本)

npm install --save-dev hardhat

npx hardhat

3、使用samle脚本将合约部署到repolia测试链(先使用水龙头领点币，不够gas无法部署)

npx hardhat run --network sepolia .\scripts\sample-script.js

3.1、测试合约

npx hardhat test

3.2、无法获取测试币时，使用hardhat自带的测试网，在另一个终端启动node节点生成账户

npx hardhat node

npx hardhat run --network localhost .\scripts\sample-script.js

3.3、部署到ganache网络，先在ganache中将端口改成8545,再将合约部署到local(不要开node网络，否则会冲突)

npx hardhat test --network localhost

4、使用chainlink加密密钥

npx env-enc set-pw

npx env-enc set

4.1、在启动时需要先执行npx env-enc set-pw验证密码才能访问密钥

5、验证合约

npx hardhat verify --network sepolia 合约地址 "构造函数参数"

5.1、在部署脚本内写入验证脚本可以在部署的同时验证合约，命令和部署脚本一样

5.2、已部署众筹合约fund的0x6FDB3D633C08D1168963d32A35Ef10FdBa8fbe37

测试链接：(https://sepolia.etherscan.io/address/0x6FDB3D633C08D1168963d32A35Ef10FdBa8fbe37aCa#readContract)

6、使用deploy库部署合约

npx hardhat deploy --network sepolia
npx hardhat deploy --network localhost

6.1、安装deploy库，编写deploy脚本

7.0、已修改了run-moble-fundraising.js脚本，可以直接运行，会自动部署合约并验证合约

npx hardhat run --network sepolia .\scripts\run-moble-fundraising.js

8.0、使用react框架构建了一个简单的前端界面

cd .\frontend\

8.1、启动react服务

npm strart

二、项目运行：

1、安装node.js(https://nodejs.org/en/)，并配置环境变量

2、安装metamask插件(https://metamask.io/)，可直接在浏览器设置-拓展-搜索matemask

2.1、在matemask上创建钱包，切换到测试sepolia网络，项目部署需要sepolia测试币，领取网站：https://www.sepoliafaucet.io/，领取不了可到小黄鱼购买
3、克隆项目到本地

3.1、git clone https://github.com/supergagagahou/web3_hardhat.git

3.2、由于我在项目使用了env加密私钥和api，所以请删除web3_hardhat\.env.enc文件

3.3、修改hardhat.config.js文件中的私钥和api地址，将以下内容替换到hardhat.config.js文件中：

`/*****************包管理***************** */`
`require("@nomicfoundation/hardhat-toolbox");`
`//require("@chainlink/env-enc").config()//使用chainlink加密密钥`
`require("hardhat-deploy")`
`require("@nomicfoundation/hardhat-ethers")`
`require("hardhat-deploy-ethers")`
`// require("@nomicfoundation/hardhat-verify");`


`$/********************API管理*********************** */$`
`//alchemyAPI`
`const ALCHEMY_API_URL =你的alchemyAPI   //申请地址https://www.alchemy.com/`
`//matemask账户1`
`const METAMASK_PRIVATE_KEY_0 = 你的matemask账户1的私钥`
`//matemask账户2`
`const METAMASK_PRIVATE_KEY_1 = 你的matemask账户2的私钥`
`//etherscan API`
`const ETHERSCAN_API_KEY =你的etherscanAPI   //申请地址 https://etherscan.io/apis`

4.0、运行npx hardhat run --network sepolia .\scripts\run-moble-fundraising.js 测试配置是否正确,并获取合约地址，请记住合约地址，后续使用。

`/*******正确结果*********/`
    PS C:\Users\tian\Desktop\Warehouse\Demo\solidity\web3_hardhat copy> npx hardhat run --network sepolia .\scripts\run-moble-fundraising.js
    contract deploy
    contract address:0xA1D3E99D698226aAF00ec8360aF849007ed5a98b
    The contract 0xA1D3E99D698226aAF00ec8360aF849007ed5a98b has already been verified on the block explorer. If you're trying to verify a partially verified contract, please use the --force flag.
    https://sepolia.etherscan.io/address/0xA1D3E99D698226aAF00ec8360aF849007ed5a98b#code
`/********************/`

4.1、如果出现报错，请检查API是否正确，私钥是否正确，网络是否正确，以及是否有足够的测试币（大概需要0.02805044ETH）。

4.2、进入react项目

cd .\frontend\

4.3、修改合约地址，在src\App.js文件中修改合约地址为上一步获取的合约地址。

`const contractAddress = "上一步获取到的合约地址";//请修改此处为自己部署的合约地址，否则你将会众筹到我的地址，无法取出ETH币。`


5.0、启动项目

5.1、启动react服务

npm strart