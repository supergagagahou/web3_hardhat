//使用断言库测试合约
const { ethers, deployments, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai');
const { helpers } = require('@nomicfoundation/hardhat-network-helpers');//模拟时间

describe('test Fund contract', function () {
  let fund;
  let account;
  beforeEach(async function () {
    await deployments.fixture(["deploy_fund"]);//引用部署标签
    accounts = (await getNamedAccounts()).accounts1;//获取config中的账户地址
    // console.log("account:",accounts);
    const fundDeployment = await deployments.get("fundraising");//获取部署的合约信息
    fund = await ethers.getContractAt("fundraising", fundDeployment.address);//传入合约地址，获取合约的实例
  }),
    //测试是否为owner
    it('test owner == account1', async function () {

      await fund.waitForDeployment();//作用是等待部署完成
      // console.log("owner:",await fund.owner())
      assert.equal((await fund.owner()), accounts);//断言fund合约地址不为空
      //fund.owner()只有public的属性才能被外部访问
    })
})