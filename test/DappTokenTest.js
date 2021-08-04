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

    it('transfers token ownership', async () => {
      const receipt = await tokenInstance.transfer(accounts[1], 10, {
        from: accounts[0],
      });
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(
        receipt.logs[0].event,
        'Transfer',
        'should be the "Transfer" event'
      );
      assert.equal(
        receipt.logs[0].args._from,
        accounts[0],
        'logs the account the tokens are transferred from'
      );
      assert.equal(
        receipt.logs[0].args._to,
        accounts[1],
        'logs the account the tokens are transferred to'
      );
      assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
      const balance = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(balance, 10);
      const success = await tokenInstance.transfer.call(accounts[1], 10, {
        from: accounts[0],
      });
      assert.equal(success, true);
    });
  });
});
