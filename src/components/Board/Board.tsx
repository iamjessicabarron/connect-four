import React from 'react';
import { Game, GameSlot} from '../../lib/Game';

import Slot from '../Slot/Slot'

export class Board extends React.Component <{ game: Game }> {

  handleRestartClick() {
    this.props.game.restartGame()
  }

  render() {
    const { game } = this.props
    let board = game.board
    const slots = board.slotsByRow.map(row => {
      const rowOfSlots = row.map(slot => {
        return(<Slot game={game} slot={slot} board={game.board} key={slot.rowIndex+slot.colLetter}></Slot>)
      })
  
      return(<div className="slotRow" key={row[0].rowIndex}>{rowOfSlots}</div>)
    })

    return(
      <div>
        { slots }
        <button 
          onClick={this.handleRestartClick.bind(this)}
        >
          Restart Game
        </button>
      </div>
    );
  }
}

export default Board;
