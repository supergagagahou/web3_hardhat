const {ethers} = require("hardhat");

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//异步函数
async function main() {
    //获取合约工厂
    const fundFactory=await ethers.getContractFactory("fundraising")//这里是合约名不是文件名
    //await 异步运行
    //部署合约相当于remix上的depoly操作
    const fund=await fundFactory.deploy(1,300)//这里是构造函数的参数
    
    //等待合约写入区块链
    await fund.waitForDeployment()
    console.log("contract deploy");
    console.log("contract address:"+fund.target)//返回部署地址，在ethers6.0中使用targat代替address

        //hardhat的验证脚本
    //等待区块链共识完成再验证，防止因未上链就开始验证
    await delay(30000); // 使用 async delay 函数来延迟
    await hre.run("verify:verify", {
        address: fund.target,//合约地址
        constructorArguments: [//合约构造参数
              1,
              300
            //   "a string argument",
            //   {
            //     x: 10,
            //     y: 5,
            //   },
            //   "0xabcdef",
        ],
    });


    //获取账户
    const [Account1,Account2]=await ethers.getSigners()

   const fundTX=await fund.fund({value:ethers.parseEther("0.1")})//发送0.1eth给合约
    await fundTX.wait()//等待交易完成
    const fundBalance=await ethers.provider.getBalance(fund.target)//获取合约余额,这里的target是合约地址
    console.log(`fund balance: ${fundBalance}`)

    //使用第二个账户进行转账，不写connect(Account2)默认使用第一个账户
    const fundTX2=await fund.connect(Account2).fund({value:ethers.parseEther("0.2")})//发送0.1eth给合约
    await fundTX2.wait()//等待交易完成
    const fundBalance2=await ethers.provider.getBalance(fund.target)//获取合约余额,这里的target是合约地址
    console.log(`fund balance: ${fundBalance2}`)

    const Account1Balance=await ethers.provider.getBalance(Account1.address)//获取第一个账户余额
    console.log(`Account1 balance: ${Account1Balance}`)
    const Account2Balance=await ethers.provider.getBalance(Account2.address)//获取第二个账户余额
    console.log(`Account2 balance: ${Account2Balance}`)
}

main().then().catch((error)=>{
    console.error(error)
    process.exit(1)
})
