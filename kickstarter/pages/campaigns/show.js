import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/Campaign';
import { Card } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';

class CampaignShow extends Component {
	static async getInitialProps(props){
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.summary().call();
    return {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
	}

  renderCards(){
    const {
    	minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager
    } = this.props;
    

  	const items = [
  	  {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: {overflowWrap: 'break-word'}
  	  },
  	  {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contrubute this much wei to become an approver'
  	  },
  	  {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'A request tries to withdraw money from the contract. Request must be approved by approvers'
  	  },
  	  {
        header: approversCount,
        meta: 'Number of approvers',
        description: 'Number of people who have alredy donated to this campaign'
  	  }, 
  	  {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign balance (ether)',
        description: 'Amount of money this campaign has left to spent'
  	  },   	   	    	  
  	];

  	return < Card.Group items={items} />;
  }

	render(){
   return (
   	  <Layout>
        {this.renderCards()}
   	  </Layout>
   	);
	}
}

export default CampaignShow;