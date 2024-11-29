const { ethers } = require("hardhat");

async function main() {
    const recipientAddress = "0xB415BF5893CCa27a68021a09096BC17f73FfF8de";

    // 使用全限定名来加载特定的合约
    const TYX = await ethers.getContractFactory("contracts/TYX-ERC20.sol:TYX");

    console.log("Deploying TYX contract...");
    const tyx = await TYX.deploy(recipientAddress);
    await tyx.deployed();
    console.log(`TYX deployed to: ${tyx.address}`);

    const recipientBalance = await tyx.balanceOf(recipientAddress);
    console.log(
        `Recipient (${recipientAddress}) balance: ${ethers.utils.formatUnits(
            recipientBalance,
            await tyx.decimals()
        )} TYX`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


//TTH:0xac61f8758A1566d8F1F976E87C29B2354e7Cc30a