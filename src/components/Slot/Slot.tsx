import React from 'react';
import ReactDOM, { render } from "react-dom";
import './Slot.css';

import { Game, GameBoard, GameSlot, Player } from '../../lib/Game'
import Board from '../Board/Board';

export class Slot extends React.Component <{ game: Game, board: GameBoard, slot: GameSlot }> {
  board: GameBoard
  slot: GameSlot
  game: Game

  constructor(props: {game: Game, board: GameBoard, slot: GameSlot}) {
      super(props);

      this.board = this.props.board
      this.slot = this.props.slot
      this.game = this.props.game
  }

  handleSlotClick() {
    this.game.placeTotemInColumn(this.slot)
  }

  render() {
    var playerClass = ""
    let animationClass = ""

    switch(this.slot.filledBy) {
      case Player.Computer:
        playerClass = " filled computer"
        animationClass = " animateToken"
        break;
      case Player.User:
        playerClass = " filled user"
        animationClass = " animateToken"
        break;
    }

    return (
      <div
        className={`slot${playerClass}`}
        onClick={this.handleSlotClick.bind(this)} 
      >
        <div className="slotContents">
          <div className={`token${animationClass}`}></div>
        </div>
  
      </div>
    );
  }

}

export default Slot;
