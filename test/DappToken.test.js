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

    it('approves tokens for delegated transfer', async () => {
      const success = await tokenInstance.approve.call(accounts[1], 100);
      assert.equal(success, true);
      const receipt = await tokenInstance.approve(accounts[1], 100, {
        from: accounts[0],
      });
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(
        receipt.logs[0].event,
        'Approval',
        'should be the "Approval" event'
      );
      assert.equal(
        receipt.logs[0].args._owner,
        accounts[0],
        'logs the account the tokens are authorized from'
      );
      assert.equal(
        receipt.logs[0].args._spender,
        accounts[1],
        'logs the account the tokens are authorized to'
      );
      assert.equal(
        receipt.logs[0].args._value,
        100,
        'logs the transfer amount'
      );

      const allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
      assert.equal(allowance, 100);
    });

    it('handles delegated transfer', async () => {
      const fromAccount = accounts[5];
      const toAccount = accounts[6];
      const spendingAccount = accounts[7];

      await tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
      await tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
      const success = await tokenInstance.transferFrom.call(
        fromAccount,
        toAccount,
        10,
        { from: spendingAccount }
      );
      assert.equal(success, true);

      const receipt = await tokenInstance.transferFrom(
        fromAccount,
        toAccount,
        10,
        { from: spendingAccount }
      );
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(
        receipt.logs[0].event,
        'Transfer',
        'should be the "Transfer" event'
      );
      assert.equal(
        receipt.logs[0].args._from,
        fromAccount,
        'logs the account the tokens are transferred from'
      );
      assert.equal(
        receipt.logs[0].args._to,
        toAccount,
        'logs the account the tokens are transferred to'
      );
      assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');

      const fromBalance = await tokenInstance.balanceOf(fromAccount);
      assert.equal(fromBalance, 90, 'deducted balance');
      const toBalance = await tokenInstance.balanceOf(toAccount);
      assert.equal(toBalance, 10, 'added balance');

      const allowance = await tokenInstance.allowance(
        fromAccount,
        spendingAccount
      );
      assert.equal(allowance, 0);
    });
  });
});
