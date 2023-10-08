const BridgeTwo = artifacts.require("bridgeTwo");
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("BridgeTwo", (accounts) => {
  let bridgeTwo;

  const owner = accounts[0];
  const wallet = accounts[1];
  const user = accounts[2];

  before(async () => {
    bridgeTwo = await BridgeTwo.new(wallet, owner, { from: owner });
  });

  it("should initialize correctly", async () => {
    const walletAddress = await bridgeTwo.wallet();
    assert.equal(walletAddress, wallet, "Wallet address is not set correctly");

    const tokenTwoAddress = await bridgeTwo.tokenTwo();
    assert.equal(tokenTwoAddress, owner, "TokenTwo address is not set correctly");
  });

  it("should send tokens from the contract to a user", async () => {
    const initialContractBalance = await bridgeTwo.balanceOf(bridgeTwo.address);
    const initialUserBalance = await bridgeTwo.balanceOf(user);

    const amountToSend = 100;
    await bridgeTwo.sendTokens(user, amountToSend, { from: wallet });

    const finalContractBalance = await bridgeTwo.balanceOf(bridgeTwo.address);
    const finalUserBalance = await bridgeTwo.balanceOf(user);

    assert.equal(
      finalContractBalance.toNumber(),
      initialContractBalance.toNumber() - amountToSend,
      "Contract balance did not decrease correctly"
    );

    assert.equal(
      finalUserBalance.toNumber(),
      initialUserBalance.toNumber() + amountToSend,
      "User balance did not increase correctly"
    );
  });
});