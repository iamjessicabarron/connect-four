import React from 'react';
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';

import { Game } from '../../lib/Game'
import Board from '../Board/Board'

class App extends React.Component<{}, {game: Game}>{
  constructor(props: {}) {
    super(props)

    this.state = {
      game: new Game()
    }

    this.state.game.registerListener(this.updateOnGameChange.bind(this))
  }

  updateOnGameChange() {
    console.log("update on game change??")

    this.setState((state, props) => ({
      game: state.game
    }))
  }
  
  render() {
    return (
      <div className="App">
          <Board game={this.state.game}></Board>
      </div>
    );
  }
}


export default App;
