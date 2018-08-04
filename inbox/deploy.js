const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3');
const { interface, bytecode } = require('./compile.js');

const provider = new HDWalletProvider(
	'kick black brave script enemy clap draft rural rubber napkin refuse repeat',
	'https://rinkeby.infura.io/v3/abd29d73ddca4fc39cf1bd9ad2fd9ccb'
	);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy with account', accounts[0]);

  result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!']})
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Deployed contract to address', result.options.address);  
};

deploy();