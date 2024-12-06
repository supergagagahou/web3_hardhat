//使用deploy包快速部署合约
// 1. 导入部署包
//2. 导入getAccounts方法，用于获取部署者账户
//3. 部署合约，使用deploy方法，传入合约名称和构造函数参数
//4. 日志记录，log: true

const {FUND_TARGET, FUND_TIME, WAITING_BLOCKS}=require("../helper-hardhat-config.js")
// 导入配置
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const accounts  = (await getNamedAccounts()).accounts1; // 使用accounts1账户进行部署
//没有使用network参数，默认部署到的是hardhat网络，获取到的地址也是hardhat网络的地址，而不是sepolia地址

  console.log("deployer:", accounts);
  await deploy("fundraising", {
    from: accounts, // 部署者账户
    args: [FUND_TARGET, FUND_TIME], // 构造函数参数
    waitConfirmations: WAITING_BLOCKS, // 等待5个区块的确认
    log: true, // 日志记录
  });
}

module.exports.tags = ["deploy_fund","fundraising"] // 标签，用于部署脚本的筛选