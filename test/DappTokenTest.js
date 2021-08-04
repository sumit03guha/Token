const DappToken = artifacts.require('./DappToken');

contract('DappToken', function (accounts) {
  let tokenInstance;

  beforeEach(async () => {
    tokenInstance = await DappToken.deployed();
  });

  describe('DappToken', () => {
    it('Checks for the initial supply to the admin account', async () => {
      const adminBalance = await tokenInstance.balanceOf(accounts[0]);
      assert.equal(adminBalance, 1000000);
    });

    it('sets the total supply upon deployment', async () => {
      const totalSupply = await tokenInstance.totalSupply();
      assert.equal(totalSupply, 1000000);
    });

    it('initialises the contract with the correct values', async () => {
      const name = await tokenInstance.name();
      assert.equal(name, 'DApp Token');

      const symbol = await tokenInstance.symbol();
      assert.equal(symbol, 'DAPP');

      const standard = await tokenInstance.standard();
      assert.equal(standard, 'DApp Token v1.0');
    });
  });
});
