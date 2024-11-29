const { ethers } = require('hardhat')

// 异步延时函数，返回一个Promise，用于等待指定的时间
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
    const Test_Factory = await ethers.getContractFactory("Test");
    const Test = await Test_Factory.deploy();

    //等待合约写入区块链
    await Test.waitForDeployment();
    console.log("contract deploy");
    console.log("contract address:" + Test.target);//返回部署地址，在ethers6.0中使用targat代替address

    //hardhat的验证脚本
    //等待区块链共识完成再验证，防止因未上链就开始验证
    await delay(30000); // 使用 async delay 函数来延迟
    await hre.run("verify:verify", {
        address: Test.target,//合约地址
        constructorArguments: [//合约构造参数
            //   50,
            //   "a string argument",
            //   {
            //     x: 10,
            //     y: 5,
            //   },
            //   "0xabcdef",
        ],
    });

}

main().then().catch((error) => {
    console.error(error);
    process.exit(1);
})

