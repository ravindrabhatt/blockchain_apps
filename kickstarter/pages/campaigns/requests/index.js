import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from '../../../routes'
import Layout from '../../../components/Layout';

class RequestIndex extends Component {
	static async getInitialProps(props) {
		const { address } = props.query;

		return { address };
	}
	render(){
		return (
			<Layout>
			  <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary>
              Add request
            </Button>
          </a>
			  </Link>
      	<h3> requests </h3>
      </Layout>
		);
	}
}

export default RequestIndex;