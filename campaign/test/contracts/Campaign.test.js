const ganache = require('ganache-cli');
const assert = require('assert');

const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../../compile');

let accounts;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	campaign = await new web3.eth.Contract(JSON.parse(interface))
	  .deploy({ data: bytecode })
	  .send({ from: accounts[0], gas: '1000000'} );

});

describe('Campaign', () => {
	it('deploys a contract', () => {
	  assert.ok(campaign.options.address);
	});
});