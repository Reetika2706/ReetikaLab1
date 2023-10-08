//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

// Interfaces
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract bridgeOne {
    address public wallet;
    IERC20 public tokenOne;

     // Executed on deployment
    constructor(address _wallet, address _token) {
        wallet = _wallet;
        tokenOne = IERC20(_token);
    }

    event SendTokens(address indexed to, uint256 amount);

    modifier onlyWallet() {
        require(msg.sender == wallet);
        _;
    }

    function sendTokens(address _to, uint256 _amount) external onlyWallet {
        require(tokenOne.balanceOf(address(this)) >= _amount, "Balance of the smart contract is too low!");

        tokenOne.approve(_to, _amount); // Approve the receiver to use tokens

        tokenOne.transferFrom(address(this), _to, _amount); // Send the tokens

        emit SendTokens(_to, _amount);
    }
}