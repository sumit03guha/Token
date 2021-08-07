const DappToken = artifacts.require('./DappToken');
const DappTokenSale = artifacts.require('./DappTokenSale');

contract('DappTokenSale', function (accounts) {
  let tokenSaleInstance;
  let tokenInstance;
  let tokenPrice = 100000000000000; // in wei = 0.0001 ether
  const tokensAvailable = 750000;
  const admin = accounts[0];
  const buyer = accounts[9];
  const numberOfTokens = 8000;
  const value = numberOfTokens * tokenPrice;

  beforeEach(async () => {
    tokenSaleInstance = await DappTokenSale.deployed();
    tokenInstance = await DappToken.deployed();
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

    it('fascilitates token buying', async () => {
      await tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {
        from: admin,
      });
      const receipt = await tokenSaleInstance.buyToken(numberOfTokens, {
        from: buyer,
        value: value,
      });
      const amount = await tokenSaleInstance.tokensSold();
      assert.equal(amount, numberOfTokens);
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(
        receipt.logs[0].args._buyer,
        buyer,
        'logs the account the tokens are sold to'
      );
      assert.equal(
        receipt.logs[0].args._amount,
        numberOfTokens,
        'logs the number of tokens sold'
      );
      const balance = await tokenInstance.balanceOf(tokenSaleInstance.address);
      assert.equal(balance, tokensAvailable - numberOfTokens);
    });

    it('ends token sale', async () => {
      await tokenSaleInstance.endSale({ from: admin });
      const balance = await tokenInstance.balanceOf(admin);
      assert.equal(balance, 992000, 'returns all unused tokens to admin');
      const price = await tokenSaleInstance.tokenPrice();
      assert.equal(price.toNumber(), 0, 'sets token price to zero');
    });
  });
});
