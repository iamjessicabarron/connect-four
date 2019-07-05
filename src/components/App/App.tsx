import React from 'react';
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';

import { Game } from '../../lib/Game'

import Board from '../Board/Board'

class App extends React.Component {
  
  render() {
    let game = new Game()

    return (
      <div className="App">
          <Board game={game}></Board>
      </div>
    );
  }
}


export default App;
