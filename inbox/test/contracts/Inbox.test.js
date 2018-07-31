const ganache = require('ganache-cli');
const assert = require('assert');

const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../../compile');

const INITIAL_MESSAGE = 'Hi, there!';

let accounts;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	inbox = await new web3.eth.Contract(JSON.parse(interface))
	.deploy({data: bytecode, arguments: [INITIAL_MESSAGE]})
	.send({from: accounts[0], gas: '1000000'});

});

describe('Inbox', () => {
	it('deploys a contract', () => {
		assert.ok(inbox.options.address);
	})

	it('has a default message', async () => {
		const message = await inbox.methods.message().call();

		assert.equal(message, INITIAL_MESSAGE);
	})

	it('allows setting new message', async () => {
		const newMessage = "Bye";
		await inbox.methods.setMessage(newMessage).send({ from: accounts[0]});

		const message = await inbox.methods.message().call();

		assert.equal(message, newMessage);
	})
});