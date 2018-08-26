import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Button, Input, Message, Grid } from 'semantic-ui-react';
import Campaign from '../../../ethereum/Campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';

class RequestNew extends Component {
	static async getInitialProps(props){
    const { address } = props.query;
    return { address };
	}

	state = {
    description: '',
    value: '',
    recipient: '',
    errorMessage: '',
    loading: false
	};

	onSubmit = async (event) => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    const {description, value, recipient} = this.state;

    this.setState({ loading: true, errorMessage: '' });

    try{
		  const accounts = await web3.eth.getAccounts();
		  await campaign.methods
			  .createSpendingRequest(description,web3.utils.toWei(value, 'ether'),recipient)
			  .send({
			    from: accounts[0]
			  });

      Router.pushRoute('/campaigns/${this.props.address}/requests');
        
		} catch(err){
      this.setState({ errorMessage: err.message });
		} 

    this.setState({ loading: false }); 
	};


	render(){
		return (
			<Layout>
			  <Grid >
			    <Grid.Row>
			      <Grid.Column width={2}>
						  <Link route={`/campaigns/${this.props.address}/requests`}>
			          <a>
			              Back
			          </a>
						  </Link>
					  </Grid.Column>
				  </Grid.Row>

			    <Grid.Row>
			      <Grid.Column width={7}>
				      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}> 
				        
				        <Form.Field>
				          <label>Description</label>
				          <Input 
				            label="Buy case" 
				            labelPosition="right"
				            value={this.state.description}
				            onChange={ event => 
				            	this.setState({ description: event.target.value })}
				          />
				        </Form.Field>

				        <Form.Field>
				          <label>Value</label>
				          <Input 
				            label="ether" 
				            labelPosition="right"
				            value={this.state.value}
				            onChange={ event => 
				            	this.setState({ value: event.target.value })}
				          />
				        </Form.Field>

				        <Form.Field>
				          <label>Recipient</label>
				          <Input 
				            label="address" 
				            labelPosition="right"
				            value={this.state.recipient}
				            onChange={ event => 
				            	this.setState({ recipient: event.target.value })}
				          />
				        </Form.Field>
				        <Message error header="Oops!" content={this.state.errorMessage} />
				        <Button loading={this.state.loading} primary>Create</Button>
				      </Form>
			      </Grid.Column>
			    </Grid.Row>
	      </Grid>
      </Layout>
		);
	}
}


export default RequestNew;