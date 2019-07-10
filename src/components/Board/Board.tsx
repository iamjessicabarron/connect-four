import React from 'react';
import { Game, GameSlot} from '../../lib/Game';

import './Board.css';
import BoardImage from './Board.svg';

import Slot from '../Slot/Slot'

export class Board extends React.Component <{ game: Game }, { hover: number | null }> {

  constructor(props: { game: Game}) {
    super(props);
    this.state = {
      hover: null
    }
  }

  handleRestartClick() {
    this.props.game.restartGame()
  }

  handleSlotHover(state: boolean, colIndex: number) {
    console.log("hover", state, colIndex)
    this.setState({
      hover: state ? colIndex : null
    })
  }

  render() {
    const { game } = this.props
    let board = game.board
    const slots = board.slotsByRow.map(row => {
      const rowOfSlots = row.map(slot => {
        return(<Slot game={game} slot={slot} board={game.board} key={slot.rowIndex+slot.colLetter} hover={this.state.hover === slot.colIndex} handleHover={this.handleSlotHover.bind(this)}></Slot>)
      })
  
      return(
      // <div className="slotRow" key={row[0].rowIndex}>{
        rowOfSlots
      // }</div>
      )
    })

    return(
      <div className="boardBg">
        <div className="contentContainer">
          <div className="boardContainer">
            <div className="slotsContainer">
              { slots }
            </div>
            <img src={BoardImage}></img>
          </div>
        </div>
        {/* <button 
          onClick={this.handleRestartClick.bind(this)}
          className="restartButton"
        >
          Restart Game
        </button> */}
      </div>
    );
  }
}

export default Board;
