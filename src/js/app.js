App = {
  web3Provider: null,
  contracts: {},
  account: null,
  tokenPrice: 100000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,

  init: () => {
    console.log('App initialized');
    return App.initWeb3();
  },

  initWeb3: async () => {
    if (typeof window.ethereum !== 'undefined') {
      App.web3Provider = window.ethereum;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/108fe4c89c274ccebbd2e19013757153'
      );
      console.log(1234);
    }
    await ethereum.request({ method: 'eth_requestAccounts' });
    return App.initContracts();
  },

  initContracts: () => {
    $.getJSON('DappTokenSale.json', (dappTokenSale) => {
      App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
      App.contracts.DappTokenSale.setProvider(App.web3Provider);
      App.contracts.DappTokenSale.deployed().then((dappTokenSale) => {
        console.log('Dapp Token Sale Address: ', dappTokenSale.address);
      });
    })
      .done(() => {
        $.getJSON('DappToken.json', (dappToken) => {
          App.contracts.DappToken = TruffleContract(dappToken);
          App.contracts.DappToken.setProvider(App.web3Provider);
          App.contracts.DappToken.deployed().then((dappToken) => {
            console.log('Dapp Token Address: ', dappToken.address);
          });
        });
      })
      .done(() => {
        App.listenForEvents();
        return App.render();
      });
  },

  listenForEvents: async () => {
    const instance = await App.contracts.DappTokenSale.deployed();
    // console.log(instance.Sell);
    instance.Sell(
      {
        filter: {},
        fromBlock: 0,
      },
      function (error, event) {
        console.log(event);
        console.log(error || 'No error');
        App.render();
      }
    );
  },

  render: async () => {
    if (App.loading) {
      return;
    }
    App.loading = true;

    const loader = $('#loader');
    const content = $('#content');

    loader.show();
    content.hide();

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    // console.log(accounts[0]);
    App.account = accounts[0];
    $('#accountAddress').html('Your Account: ' + App.account);

    App.contracts.DappTokenSale.deployed()
      .then((instance) => {
        dappTokenSale = instance;
        return dappTokenSale.tokenPrice();
      })
      .then((tokenPrice) => {
        // console.log(tokenPrice.toNumber());
        App.tokenPrice = tokenPrice;
        $('.token-price').html(Web3.utils.fromWei(App.tokenPrice, 'ether'));
        return dappTokenSale.tokensSold();
      })
      .then((tokensSold) => {
        App.tokensSold = tokensSold.toNumber();
        // console.log(App.tokensSold);
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);
        const progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + '%');

        App.contracts.DappToken.deployed()
          .then((instance) => {
            dappToken = instance;
            return dappToken.balanceOf(App.account);
          })
          .then((balance) => {
            $('.dapp-balance').html(balance.toNumber());
          });
      });
    App.loading = false;
    loader.hide();
    content.show();
  },

  buyTokens: () => {
    $('loader').show();
    $('content').hide();
    const numberOFTokens = $('#numberOfTokens').val();

    App.contracts.DappTokenSale.deployed()
      .then((instance) => {
        dappTokenSale = instance;
        return dappTokenSale.buyToken(numberOFTokens, {
          from: App.account,
          value: numberOFTokens * App.tokenPrice,
          gas: 500000,
        });
      })
      .then((result) => {
        console.log('bought');
        $('form').trigger('reset');
      });
  },
};

$(function () {
  $(window).on('load', function () {
    App.init();
  });
});
