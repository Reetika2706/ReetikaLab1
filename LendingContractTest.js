
const lendingCOntract = artifacts.require("lendingCOntract");

contract("lendingCOntract", (accounts) => {
  let lendingContract;

  beforeEach(async () => {
    lendingContract = await lendingCOntract.new(5); // 5% annual interest rate
  });

  it("should allow users to deposit assets", async () => {
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    const depositAmount = web3.utils.toWei("1", "ether");

    await lendingContract.deposit({ from: accounts[1], value: depositAmount });

    const finalBalance = await web3.eth.getBalance(accounts[1]);
  });
  
  it("should allow users to borrow assets", async () => {
    const borrowAmount = web3.utils.toWei("0.5", "ether");

    await lendingContract.deposit({ from: accounts[1], value: web3.utils.toWei("1", "ether") });
    await lendingContract.borrow(borrowAmount, { from: accounts[1] });

    const borrowedAmount = await lendingContract.borrowedAmount(accounts[1]);
    assert.equal(borrowedAmount, borrowAmount);
  });

  it("should calculate interest correctly", async () => {
    const depositAmount = web3.utils.toWei("1", "ether");
    await lendingContract.deposit({ from: accounts[1], value: depositAmount });

    // Assuming a 5% annual interest rate
    const expectedInterest = (depositAmount * 5) / 100 / 365; // Daily interest
    const calculatedInterest = await lendingContract.calculateInterest(accounts[1]);

});
