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
    var filledClass = ""

    switch(this.slot.filledBy) {
      case Player.Computer:
        filledClass = " filled computer"
        break;
      case Player.User:
        filledClass = " filled user"
        break;
    }
    
    // this.slot.filledBy === Player.Computer

    return (
      <div
        className={`slot${filledClass}`}
        onClick={this.handleSlotClick.bind(this)} 
      >
        <div className="slotContents"></div>
  
      </div>
    );
  }

}

export default Slot;
