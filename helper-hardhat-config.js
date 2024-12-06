//存储一些配置变量，如参数等
const FUND_TARGET=1; //设置默认的预售目标，单位为ETH
const FUND_TIME=180; //设置默认的预售时长，单位为S
const WAITING_BLOCK=5; //设置验证交易的等待区块数

module.exports = {//导出配置变量
  FUND_TARGET,
  FUND_TIME,
  WAITING_BLOCK
};