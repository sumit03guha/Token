App = {
  web3Provider: null,
  contracts: {},
  account: null,

  init: () => {
    console.log('app initialized');
    return App.initWeb3();
  },

  initWeb3: () => {
    if (typeof window.ethereum !== 'undefined') {
      App.web3Provider = window.ethereum;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider(
        'HTTP://127.0.0.1:7545'
      );
    }
    return App.initContracts();
  },

  initContracts: () => {
    $.getJSON('DappTokenSale.json', (dappTokenSale) => {
      App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
      App.contracts.DappTokenSale.setProvider(App.web3Provider);
      App.contracts.DappTokenSale.deployed().then((dappTokenSale) => {
        console.log('Dapp Token Sale Address: ', dappTokenSale.address);
      });
    }).done(() => {
      $.getJSON('DappToken.json', (dappToken) => {
        App.contracts.DappToken = TruffleContract(dappToken);
        App.contracts.DappToken.setProvider(App.web3Provider);
        App.contracts.DappToken.deployed().then((dappToken) => {
          console.log('Dapp Token Address: ', dappToken.address);
        });
      });
    });

    return App.render();
  },

  render: async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    // console.log(accounts[0]);
    App.account = accounts[0];
    $('#accountAddress').html('Your Account: ' + App.account);
  },
};

$(function () {
  $(window).on('load', function () {
    App.init();
  });
});
