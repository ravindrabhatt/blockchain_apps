import React, { Component } from 'react';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {

  state = { 
    manager: '',
    players: [],
    balance: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }
  render() {
    return (
      <div>
        <h2>Lottery contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people entered,
          completing to win {web3.utils.fromWei(this.state.balance)} ether!
        </p>
      </div>  
    );
  }
}

export default App;
