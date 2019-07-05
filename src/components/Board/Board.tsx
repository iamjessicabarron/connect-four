import React from 'react';
import { Game, GameSlot} from '../../lib/Game';

import Slot from '../Slot/Slot'

export class Board extends React.Component <{game: Game}> {
  render() {
    const { game } = this.props
    let board = game.board
    const slots = board.slotsByRow.map(row => {
      const rowOfSlots = row.map(slot => {
        return(<Slot slot={slot} board={game.board} key={slot.desc}></Slot>)
      })
  
      return(<div className="slotRow" key={row[0].rowIndex}>{rowOfSlots}</div>)
    })

    return(
      <div>
        { slots }
      </div>
    );
  }
}

export default Board;
