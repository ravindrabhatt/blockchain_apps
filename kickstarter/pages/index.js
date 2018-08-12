import React,{ Component } from 'react';
import factory from '../ethereum/factory';

class CampaignIndex extends Component {

	async componentDidMount() {
		const contracts = await factory.methods.getDeployedContracts().call();

		console.log(contracts);
	}

	render() {
		return <div>Index page!</div>
	}
}

export default CampaignIndex;