//使用断言库测试合约
const { ethers, deployments, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai');
const { helpers } = require('@nomicfoundation/hardhat-network-helpers');//模拟时间

describe('test Fund contract', function () {
  let fund;
  let account;
  beforeEach(async function () {
    await deployments.fixture(["deploy_fund"]);//引用部署标签
    account = (await getNamedAccounts()).accounts1;//获取config中的账户地址
    // console.log("account:",accounts);
    const fundDeployment = await deployments.get("fundraising");//获取部署的合约信息
    fund = await ethers.getContractAt("fundraising", fundDeployment.address);//传入合约地址，获取合约的实例
  }),
    //测试是否为owner
    it('test owner == account1', async function () {

      await fund.waitForDeployment();//作用是等待部署完成
      // console.log("owner:",await fund.owner())
      assert.equal((await fund.owner()), account);//断言fund合约地址不为空
      //fund.owner()只有public的属性才能被外部访问
    }),
    //测试投资者是否可以投资
    it('test investor can invest', async function () {
      const amount = 2150207040;
      await fund.fund({ value: amount });
      const balance = await fund.get_investor(account);//无法使用balance，只能调用合约函数
      assert.equal(balance, amount);
      console.log("investor:", account, "balance:", balance);
    })
})