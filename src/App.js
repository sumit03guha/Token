import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Web3 from 'web3';
import tokenSale from './build/contracts/DappTokenSale.json';
import token from './build/contracts/DappToken.json';
import {
  Form,
  Input,
  Container,
  Message,
  Header,
  Progress,
} from 'semantic-ui-react';
import ButtonMeta from './components/Button';
import { useState, useEffect } from 'react';

function App() {
  const tokenSale_abi = tokenSale.abi;
  const token_abi = token.abi;

  const [price, setPrice] = useState('');
  const [balance, setBalance] = useState('0');
  const [account, setAccount] = useState('Wallet not connected');
  const [value, setValue] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenInstance, setTokenInstance] = useState();
  const [tokenSaleInstance, setTokenSaleInstance] = useState();
  const [success, setSuccess] = useState(false);
  const [supply, setSupply] = useState('');
  const [disabled, setDisabled] = useState(false);

  let provider;
  let web3;
  let accounts = [];

  if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum;
    web3 = new Web3(provider);
  } else {
    provider = new Web3.providers.HttpProvider(
      'https://rinkeby.infura.io/v3/108fe4c89c274ccebbd2e19013757153'
    );

    web3 = new Web3(provider);
  }

  const loadBlockchain = async () => {
    const instance = await new web3.eth.Contract(
      tokenSale_abi,
      '0x606552d0A716219eeFbe577A15daAB83d2E17344'
    );
    setTokenSaleInstance(instance);

    const p = web3.utils.fromWei(
      await instance.methods.tokenPrice().call(),
      'ether'
    );
    setPrice(p);
  };

  const getAccounts = async () => {
    accounts = window.ethereum.on('accountsChanged', (accounts) =>
      setAccount(accounts[0])
    );
    if (account === 'Wallet not connected') {
      accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setAccount(accounts[0]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setContent(null);
    setLoading(true);
    setDisabled(true);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      await tokenSaleInstance.methods.buyToken(value).send({
        from: accounts[0],
        value: web3.utils.toWei((value * price).toString(), 'ether'),
      });
      setSuccess(true);
      setContent('SUCCESS!');
    } catch (err) {
      setContent(err.message);
      console.log(err);
    }
    setLoading(false);
    setValue('');
    setDisabled(false);
  };

  useEffect(() => {
    getAccounts();
    loadBlockchain();
  }, []);

  useEffect(() => {
    (async () => {
      const instance = await new web3.eth.Contract(
        token_abi,
        '0xf0fB2a440D5895C2Fa9f27C57D74d820F0D6A734'
      );
      setTokenInstance(instance);
      if (
        (account !== 'Wallet not connected') &
        (typeof account !== 'undefined')
      ) {
        const b = await tokenInstance.methods.balanceOf(account).call();
        setBalance(b);
      }
    })();
  }, [account, content]);

  useEffect(() => {
    (async () => {
      const instance1 = await new web3.eth.Contract(
        tokenSale_abi,
        '0x606552d0A716219eeFbe577A15daAB83d2E17344'
      );
      const instance2 = await new web3.eth.Contract(
        token_abi,
        '0xf0fB2a440D5895C2Fa9f27C57D74d820F0D6A734'
      );
      const t = await instance2.methods
        .balanceOf(instance1.options.address)
        .call();
      setSupply(t);
    })();
  }, [content]);

  return (
    <Container textAlign='center' style={{ marginTop: '50px' }}>
      <ButtonMeta />
      <br />
      <Header as='h1'> Introducing Decentralized App Token (DAPP)</Header>
      <Header as='h3'>
        Disclaimer : This is not a real world use-case token and is made for
        educational and entertainment purpose.
        <br />
        The token has been deployed on the Rinkeby Test Network.
      </Header>
      <a href='https://github.com/sumit03guha/Token'>
        Click here to find out more about the source code of the DAPP token.
      </a>
      <Header as='h3'>1 DAPP = {price} ether.</Header>
      <br />
      <Form onSubmit={onSubmit} error={!!content} success={!!content}>
        <Form.Field disabled={disabled}>
          <Input
            error
            value={value}
            placeholder='Enter whole numbers...'
            action={{ color: 'teal', content: 'Buy Token' }}
            onChange={(e) => setValue(e.target.value)}
            loading={loading}
          />
        </Form.Field>
        <Message success={success} error content={content}></Message>
      </Form>
      <br />
      <Progress
        color='violet'
        value={750000 - supply}
        total='750000'
        progress='value'
        label={`${750000 - supply} / 750,000 tokens sold`}
      />
      <br />
      <Header as='h3' color='green'>
        You currently have: {balance} DAPP
      </Header>
      <Header as='h4' color='grey'>
        Your account: {account}
      </Header>
    </Container>
  );
}

export default App;
