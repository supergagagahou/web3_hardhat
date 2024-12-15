// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Fundraising Contract", function () {
//     let fundraising, owner, addr1, addr2;
//     const lockTime = 300; // 300 秒锁定期
//     const startTime = Math.floor(Date.now() / 1000) + lockTime; // 合约开始时间（300秒后）
//     const target = ethers.parseUnits("1"); // 目标金额为 1 ETH

//     beforeEach(async function () {
//         // 部署合约
//         const Fundraising = await ethers.getContractFactory("fundraising");
//         [owner, addr1, addr2] = await ethers.getSigners();

//         // 使用开始时间和目标金额部署合约
//         fundraising = await Fundraising.deploy(startTime, target); // 部署合约
//         await fundraising.deployed(); // 等待合约部署
//     });

//     it("Should allow investments during lock time", async function () {
//         const investAmount = ethers.parseUnits("1");

//         // 确保当前时间在锁定期内
//         await ethers.provider.send("evm_increaseTime", [lockTime - 10]); // 增加时间到锁定期
//         await ethers.provider.send("evm_mine", []); // 持续执行

//         // addr1 进行投资
//         await expect(
//             addr1.sendTransaction({
//                 to: fundraising.address,
//                 value: investAmount,
//             })
//         )
//             .to.emit(fundraising, "fund_event")
//             .withArgs(addr1.address, investAmount);

//         // 验证资金池和投资金额
//         expect(await fundraising.money_pool()).to.equal(investAmount);
//         expect(await fundraising.investor(addr1.address)).to.equal(investAmount);
//     });

//     it("Should not allow investments after the target is reached", async function () {
//         const investAmount = ethers.parseUnits("1");

//         // 达到目标金额后，无法进行投资
//         await fundraising.setTargetReached(true); // 模拟目标已完成

//         await expect(
//             addr1.sendTransaction({
//                 to: fundraising.address,
//                 value: investAmount,
//             })
//         ).to.be.revertedWith("finish has target!!!");
//     });

//     it("Should not allow investments if contract is canceled", async function () {
//         const investAmount = ethers.parseUnits("1");

//         // 模拟合约被取消
//         await fundraising.setFundState(false);

//         await expect(
//             addr1.sendTransaction({
//                 to: fundraising.address,
//                 value: investAmount,
//             })
//         ).to.be.revertedWith("fundraising is clear!!!");
//     });

//     it("Should not allow investments with zero value", async function () {
//         // 投资金额为0，应该抛出异常
//         await expect(
//             addr1.sendTransaction({
//                 to: fundraising.address,
//                 value: 0,
//             })
//         ).to.be.revertedWith("The investment value must be greater than 0 !!!");
//     });

//     it("Should revert if trying to invest outside the lock time", async function () {
//         const investAmount = ethers.parseUnits("1");

//         // 增加时间超出锁定期
//         await ethers.provider.send("evm_increaseTime", [lockTime + 10]);
//         await ethers.provider.send("evm_mine", []); // 继续执行

//         // 锁定期结束，投资应该失败
//         await expect(
//             addr1.sendTransaction({
//                 to: fundraising.address,
//                 value: investAmount,
//             })
//         ).to.be.revertedWith("now is not lock time,not fund !!!");
//     });
// });
