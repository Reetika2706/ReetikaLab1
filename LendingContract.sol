// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract lendingCOntract {
    mapping(address => uint) public balances;
    mapping(address => uint) public borrowedAmount;
    uint public interestRate;

    constructor(uint _interestRate) {
        interestRate = _interestRate;
    }

 
    event Deposit(address indexed user, uint amount);

function deposit() external payable {
    balances[msg.sender] += msg.value;
    emit Deposit(msg.sender, msg.value); // Emit the Deposit event
}

    function borrow(uint amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        borrowedAmount[msg.sender] += amount;
        balances[msg.sender] -= amount;
    }

    function repay(uint amount) external payable {
        require(borrowedAmount[msg.sender] >= amount, "Insufficient borrowed amount");
        require(msg.value == amount, "Please repay the exact borrowed amount");
        borrowedAmount[msg.sender] -= amount;
        balances[msg.sender] += amount;
    }

    function calculateInterest(address user) external view returns (uint) {
        uint borrowed = borrowedAmount[user];
        return (borrowed * interestRate) / 100;
    }
}
