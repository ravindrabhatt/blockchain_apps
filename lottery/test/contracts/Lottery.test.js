const ganache = require('ganache-cli');
const assert = require('assert');

const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../../compile');

let accounts;
let lottery;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	lottery = await new web3.eth.Contract(JSON.parse(interface))
	  .deploy({ data: bytecode })
	  .send({ from: accounts[0], gas: '1000000'} );

});

describe('Lottery', () => {
	it('deploys a contract', () => {
	  assert.ok(lottery.options.address);
	});

	it('allows on account to enter', async () => {
    await lottery.methods.enter().send({
    	from: accounts[0],
    	value: web3.utils.toWei('0.011', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
    	from: accounts[0]
    })

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
	});

	it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
    	from: accounts[0],
    	value: web3.utils.toWei('0.011', 'ether')
    });

    await lottery.methods.enter().send({
    	from: accounts[1],
    	value: web3.utils.toWei('0.021', 'ether')
    });

    await lottery.methods.enter().send({
    	from: accounts[2],
    	value: web3.utils.toWei('0.031', 'ether')
    });


    const players = await lottery.methods.getPlayers().call({
    	from: accounts[0]
    })

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
	});

	it('only allows account to enter with a minimum value of ether', async () => {
    try {
	    await lottery.methods.enter().send({
	    	from: accounts[0],
	    	value: web3.utils.toWei('0.031', 'ether')
	    });
    }catch(err) {
      assert(err); 
    }
	});

	it('only manager can call pickWinner', async () => {
    try {
	    await lottery.methods.pickWinner().send({ from: accounts[1] });
    }catch(err) {
      assert(err); 
    }
	});

	it('transfers ether to winning player\'s account', async () => {

    await lottery.methods.enter().send({
    	from: accounts[0],
    	value: web3.utils.toWei('2', 'ether')
    });

		const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('1.9', 'ether'));
    
    const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
    assert.equal(0, players.length);
	});

});