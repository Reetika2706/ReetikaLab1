// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract TestDelegateCall{

    string public alertMsg = "This is a alert msg";

    address public owner;
    function setNewMsg(string memory _msg) external {

        alertMsg = _msg;

        owner = msg.sender;
    }
}
contract DelegateCall{

    string public alertMsg;

    address public owner;

     function setNewMsg(address _testAddress, string calldata _msg) external {

      (bool success, bytes memory data) = _testAddress.delegatecall(

          abi.encodeWithSelector(TestDelegateCall.setNewMsg.selector, _msg));

          require(success, "delegatecall failed");

    }

}