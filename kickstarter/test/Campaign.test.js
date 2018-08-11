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
	it('should deploys a contract and CampaignFactory', () => {
	  assert.ok(campaign.options.address);
	  assert.ok(factory.options.address);
	});

	it('should mark caller as the manager of campaign', async () => {
		const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
	});

	it('should add approvers for campaign with contribution', async () => {
		await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200' 
		});

		const approversCount = await campaign.methods.approversCount().call();
		const isApprover = await campaign.methods.approvers(accounts[1]).call();
	  
	  assert.equal(approversCount, 1);
	  assert.ok(isApprover);
	});

  it('should require a minimum contribution to become an approver', async () => {
		try{
			await campaign.methods.contribute().send({
        from: accounts[1],
        value: '50' 
		  });
		}
		catch(err){}

		const approversCount = await campaign.methods.approversCount().call();
		const isApprover = await campaign.methods.approvers(accounts[1]).call();
	  
	  assert.equal(approversCount, 0);
	  assert.equal(isApprover, false);
	});

	it('should allow manager to create spending request', async () => {
		await campaign.methods.createSpendingRequest("pay to x", 50, accounts[2]).send({
      from: accounts[0],
      gas: 1000000
	  });

		const request = await campaign.methods.requests(0).call();

		assert.equal(request.description, "pay to x");
		assert.equal(request.value , 50);
		assert.equal(request.receiver, accounts[2]);
		assert.equal(request.completed, false);
	});

	it('should only allow manager to create spending request', async () => {
		try{
			await campaign.methods.createSpendingRequest("pay to x", 50, accounts[2]).send({
        from: accounts[1],
        gas: 1000000
	    });
	    assert.ok(false);
	  } catch(err){
	  	assert(err);
	  }
	});

	it('should allow contributors to approve a request', async () => {
		await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200' 
		});

		await campaign.methods.createSpendingRequest("pay to x", 50, accounts[2]).send({
      from: accounts[0],
      gas: 1000000
    });

    await campaign.methods.approve(0).send({
    	from: accounts[1],
    	gas: 1000000
    });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.approvalCount, 1);
	});

	it('should only allow each contributor to approve a request once', async () => {
		await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200' 
		});

		await campaign.methods.createSpendingRequest("pay to x", 50, accounts[2]).send({
      from: accounts[0],
      gas: 1000000
    });

    await campaign.methods.approve(0).send({
    	from: accounts[1],
    	gas: 1000000
    });

    try {
    	await campaign.methods.approve(0).send({
    	  from: accounts[1],
    	  gas: 1000000
      });
    } catch(err){
    	assert.ok(err);
    }      
	});	

	it('should allow manager to finalize a request', async () => {
		await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('10', 'ether') 
		});

		await campaign.methods.createSpendingRequest("pay to x", web3.utils.toWei('5', 'ether'), accounts[2]).send({
      from: accounts[0],
      gas: 1000000
    });

    await campaign.methods.approve(0).send({
    	from: accounts[1],
    	gas: 1000000
    });

    await campaign.methods.finalizeRequest(0).send({
    	from: accounts[0],
    	gas: 1000000
    });

    let balance = await web3.eth.getBalance(accounts[2]);
    balance = web3.utils.toWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 103);
	});	
 
});