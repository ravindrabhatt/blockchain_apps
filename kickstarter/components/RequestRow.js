import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/Campaign';

class RequestRow extends Component {
	onApprove = async() => {
    const campaign = new Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approve(this.props.ID).send({
      from: accounts[0]
    });
	}

	onFinalize = async() => {
    const campaign = new Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.ID).send({
      from: accounts[0]
    });
	}	

	render() {
		const { Row, Cell}  = Table;
    const { ID, request, approversCount } = this.props;
	  return (
      <Row>
        <Cell>{ID}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.receiver}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>
        <Cell>
          <Button color="green" basic onClick={this.onApprove}>Approve</Button>
        </Cell>
        <Cell>
          <Button color="teal" basic onClick={this.onFinalize}>Finalize</Button>
        </Cell>
      </Row>
	  );
	}
}

export default RequestRow;