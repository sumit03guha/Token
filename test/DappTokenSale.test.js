const DappTokenSale = artifacts.require('./DappTokenSale');

contract('DappTokenSale', function (accounts) {
  let tokenSaleInstance;
  let tokenPrice = 1000000000000000; // in wei = 0.001 ether

  beforeEach(async () => {
    tokenSaleInstance = await DappTokenSale.deployed();
  });

  describe('DappTokenSale tests', () => {
    it('checks for the address', async () => {
      const address = await tokenSaleInstance.address;
      assert.ok(address);
    });

    it('checks for the token contract', async () => {
      const address = await tokenSaleInstance.tokenContract();
      assert.ok(address);
    });

    it('checks for the token price', async () => {
      const price = await tokenSaleInstance.tokenPrice();
      assert.equal(price, tokenPrice);
    });
  });
});
