import React from 'react';
import ReactDOM, { render } from "react-dom";
import './Slot.css';

import { GameBoard, GameSlot } from '../../lib/Game'
import Board from '../Board/Board';

export class Slot extends React.Component <{ board: GameBoard, slot: GameSlot }> {
  board: GameBoard
  slot: GameSlot

  constructor(props: {board: GameBoard, slot: GameSlot}) {
      super(props);

      this.board = this.props.board
      this.slot = this.props.slot
  }

  handleSlotClick() {
    this.board.chooseColumn(this.slot)

    this.board.printBoard()
  }

  render() {
    let filledClass = this.slot.filledBy !== null ? " filled" : ""

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
