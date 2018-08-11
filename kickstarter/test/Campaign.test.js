const ganache = require('ganache-cli');
const assert = require('assert');

const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
	  .deploy({ data: compiledFactory.bytecode })
	  .send({ from: accounts[0], gas: '1000000'});

  await factory.methods.createCampaign('100').send({
  	from: accounts[0],
  	gas: '1000000'
  });

  [campaignAddress] = await factory.methods.getDeployedContracts().call();

  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaign', () => {
	it('deploys a contract and CampaignFactory', () => {
	  assert.ok(campaign.options.address);
	  assert.ok(factory.options.address);
	});
});