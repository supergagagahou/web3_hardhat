// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/*
V4.1版本：
1.设置众筹目标值和众筹时间
2.当众筹达到目标值时可以取出
3.当在规定时间内未达到目标值时取消合约，可以退款
4.管理员救币函数，强制退币
5.

*/

contract fundraising {
    address public owner;
    //发起者
    uint256 public target = 10**18; //wei
    //目标
    uint256 public money_pool;
    //资金池数量
    mapping(address => uint256) investor;
    //投资人地址与金额映射
    address[] investor_list;
    //投资人
    bool private fund_is_clear = false; //合约是否被取消

    uint256 start_time;
    uint256 lock_time;

    //众筹锁定时间，只有在锁定时间后，并且目标未达成才能取出余额

    constructor(uint256 _target, uint256 _lock_time) {
        //设定众筹时间和目标
        owner = msg.sender;
        start_time = block.timestamp;
        target *= _target;
        lock_time = _lock_time;
    }

    event fund_event(address add, uint256 money);

    function fund() external payable {
        //投资
        require(
            block.timestamp - lock_time < start_time, //是否在锁定期，非锁定时间代表已经合约结束
            "now is not lock time,It's already over. !!!"
        );
        require(!finish_target(), "finish has target!!!"); //合约是否已经完成众筹目标
        require(!fund_is_clear, "fundraising is clear!!!"); //合约没有被取消
        require(
            msg.value > 0,
            "The investment value must be greater than 0 !!!" //投资金额要>0
        );
        investor[msg.sender] += msg.value;
        investor_list.push(msg.sender);
        money_pool += msg.value;
        emit fund_event(msg.sender, msg.value); //写入日志
    }

    function get_investor(address _inve) external view returns (uint256) {
        //查询地址投资数量
        return investor[_inve];
    }

    function finish_target() internal view returns (bool) {
        //是否完成目标
        if (money_pool >= target) {
            return true;
        } else {
            return false;
        }
    }

    // 取消函数：发起者取消众筹（在锁定期内目标未完成时调用）
    function clear_fundraising_owner() external {
        require(owner == msg.sender, "you not woner !!!");
        require(!fund_is_clear, "Crowdfunding already clear"); // 确保众筹未被取消
        // require(!finish_target(), "finish is target!!!"); // 确保目标未完成(不需要众筹了，退回筹款)
        require(!is_lock_tiem(), "now is not lock time ,It's already over.!!!"); //超过锁定期
        fund_is_clear = true; // 标记众筹已取消
        //退款
    }

    function clear_time_refund() internal {
        //管理员超时未取消合约，自动取消
        if (
            (block.timestamp - 3 * lock_time > start_time) &&
            (fund_is_clear) &&
            (!is_lock_tiem()) &&
            (!finish_target())
        ) {
            //时间超过3倍锁定时间&未被取消&已超期&目标未达成
            fund_is_clear = true; //标记已取消合约，允许退款
        }
    }

    // 退款函数：允许投资者提取其投资金额（众筹取消后调用）
    function refund() external {
        //合约超时，合约取消，可以随意退款
        require(fund_is_clear, "Crowdfunding is not clear"); // 确保众筹已取消
        uint256 amount = investor[msg.sender];
        require(amount > 0, "No funds to refund"); // 确保余额金额大于0
        money_pool -= amount;
        investor[msg.sender] = 0; // 将投资金额置为0，防止重复退款
        payable(msg.sender).transfer(amount); // 转账退款给投资者
    }

    //结束众筹，取走资金池
    function withdraw_money_pool() external payable {
        require(owner == msg.sender, "you not woner!!!");
        require(finish_target(), "Unfinished target!!!");
        // require(!is_lock_tiem(), "now is lock time!!!");//完成目标可提前结束，不必等待锁定期
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(success, "transfer fail !!!");
        money_pool = 0;
        fund_is_clear=true;
    }

    function set_lock_time(uint256 _lock_time) internal {
        //管理员专属，重新初始化锁定期
        require(owner == msg.sender, "you not sender");
        lock_time = _lock_time;
        is_lock_tiem(); //刷新time_status变量
    }

    function is_lock_tiem() public view returns (bool) {
        //判断是否在锁定期
        if (block.timestamp - lock_time < start_time) {
            return true;
        } else {
            return false;
        }
    }

    function restart(uint256 _target, uint256 _lock_time) external {
        //重置函数
        require(fund_is_clear, "contract no clear!!!");
        require(money_pool == 0, "monery pool !=0 !!!"); //地址池已完全清空
        require(owner == msg.sender, "you not owner!!!");
        // 清除映射内容 防止管理员取出余额后，investor未初始化，重新开始合约
        for (uint256 i = 0; i < investor_list.length; i++) {
            delete investor[investor_list[i]]; // 删除每个投资者的金额
        }
        delete investor_list; // 清空存储投资者地址的数组
        fund_is_clear = false;
        start_time = block.timestamp; //重置开始时间
        target = _target * 10**18;
        lock_time = _lock_time;
    }
    //时间等于300为救币函数，时间为修改时间函数
    function admin(uint256 _time) external {
        //救币函数
        require(owner == msg.sender, "you no adminer");
        if (_time != 300) {
            //300未默认时间不做修改
            set_lock_time(_time); //设置众筹时间
        }else{
                    bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        if (!success) {
            //取出失败，使用transfer重试
            payable(msg.sender).transfer(address(this).balance);
        }
        require(success, "transfer fail !!!");
        money_pool = 0;
        fund_is_clear = true;
        }

    }

    function contract_time() external view returns (string memory, uint256) {
        //获取合约是否在锁定期

        if (is_lock_tiem()) {
            return (
                "There is still time left",
                start_time + lock_time - block.timestamp
            );
        } else {
            return (
                "It's already over.",
                block.timestamp - (start_time + lock_time)
            );
        }
    }

    function contract_status() external returns (string memory) {
        //获取合约状态函数
        clear_time_refund();
        if (!is_lock_tiem()) {
            return " now is not lock time,It's already over. !!!";
        }
        if (finish_target()) {
            return ("finish has target!!!");
        }
        if (fund_is_clear) {
            return "fundraising is clear!!!";
        } else {
            return "The contract is normal !!!";
        }
    }

    //时间修改器
    // modifier is_lock_tiem() {//合约是否在锁定期

    //     //_;在前表示先执行被修改的函数的函数体

    //     require(
    //         block.timestamp - lock_time > start_time,
    //         "now is lock time",time_state=false
    //     );
    //     _; //当_;在函数体后时代表先执行Windows_time函数，再执行被修改的函数
    // }

    //重启函数，重新开始合约
}
