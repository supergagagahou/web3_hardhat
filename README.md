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

5.2、已部署众筹合约fund的0x99AA4195b76226C4Df1eDDc6eaB9C93361735aCa

测试链接：(https://sepolia.etherscan.io/address/0x99AA4195b76226C4Df1eDDc6eaB9C93361735aCa#readContract)

6、使用deploy库部署合约

6.1、安装deploy库，编写deploy脚本










