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
    this.setState((state, props) => ({
      game: state.game
    }))
  }
  
  render() {
    return (
      <div className="App">
          <Board game={this.state.game}></Board>
          <aside className="">
            <h1>Join Four</h1>
            <h2>Try to win by joining four red tokens together!</h2>
            <div className="creditBox"><p>Built by <a href="https://www.linkedin.com/in/iamjessicabarron/" target="_blank">Jessica Barron</a></p></div>
          </aside>
      </div>
    );
  }
}


export default App;
