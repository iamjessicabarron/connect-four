import React from 'react';
import ReactDOM, { render } from "react-dom";
import './Slot.css';

import { GameBoard, GameSlot } from '../../lib/Game'
import Board from '../Board/Board';

export class Slot extends React.Component <{ board: GameBoard, slot: GameSlot }, { filled: Boolean }> {
  board: GameBoard
  slot: GameSlot

  constructor(props: {board: GameBoard, slot: GameSlot }) {
      super(props);

      this.board = this.props.board
      this.slot = this.props.slot

      this.state = {
        filled: this.slot.filledBy != null
      }
  }

  handleSlotClick() {
    this.board.chooseColumn(this.slot)

    this.board.printBoard()
    console.log("There are", this.board.numberOfFilledSlots, "filled slots")
  }

  render() {
    let filledClass = this.state.filled ? " filled" : ""

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
