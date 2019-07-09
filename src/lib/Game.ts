const print = console.log;

export enum Player {
  User, 
  Computer
}

export class Game {
  private readonly onGameChange = new LiteEvent<Player>();
  public get GameChanged() { return this.onGameChange.expose() }
  public changeHandler? : VoidFunction | null

  static player: Player = Player.User
  static winner?: Player | null 

  board: GameBoard = new GameBoard()

  constructor() {
    let self = this
    print("Initialising game")

    // game logic
    this.onGameChange.on(nextPlayer => {
      if (nextPlayer) {
        self.delayComputerTurn(nextPlayer)
      }
    })
  }

  restartGame() {
    Game.player = Player.User

    this.board.slots.map(item => {
      let itemCopy = item
      itemCopy.filledBy = null
      return itemCopy
    }, this)
  }

  placeTotemInColumn(selectedSlot: GameSlot) {
    if (Game.player === Player.User) {
      this.board.chooseColumn(selectedSlot)
    } else {
      print("It's not the user's turn!")
    }
  }

  delayComputerTurn(nextPlayer: Player) {
    let timeout;
      if (timeout) {
        // clear if one already exists
        clearTimeout(timeout) 
      }

      timeout = setTimeout(() => {
        this.playComputerTurn(nextPlayer)
      }, 500)
  }

  playComputerTurn(nextPlayer: Player) {
    if (nextPlayer === Player.Computer) {
      print("COMPUTER'S TURN")
      let validColumns = this.board.slotsByCol.filter(col => {
        return col.some(item => item.filledBy === null)
      })
      
      let randomColIndex = this.getRandomInt(validColumns.length)
      let newSlot = new GameSlot(0, validColumns[randomColIndex][0].colIndex)
      
      let didSelectSlot = false
      while (!didSelectSlot && validColumns.length > 0) {
        didSelectSlot = this.board.chooseColumn(newSlot)
      }
    }
  }

  switchToOtherPlayer() {
    let newPlayer = Player.Computer
    if (Game.player === Player.Computer) {
      newPlayer = Player.User
    }

    Game.player = newPlayer
    this.onGameChange.trigger(newPlayer)
  }

  public registerListener(func: VoidFunction) {
    this.board.slots.forEach(item => {
      item.SlotChanged.on(slot => {
        func() // execute the registered function

        if (slot) {
          // a reset happened, don't continue the game
          if (slot.filledBy === null) { return }

          this.continueGameOnSlotChange(slot)
        }
      })
    })
  }

  continueGameOnSlotChange(slot: GameSlot) {          
    // check if user has won
    let winner = this.board.checkIfWon(slot)
    let boardFull = this.board.slots.every(item => item.filledBy !== null)
    
    if (boardFull) {
      print("BOARD FULL -> Game should restart")
    }

    if (winner === Player.User) {
      alert("You win!")
      this.restartGame()
    } else if (boardFull || winner === Player.Computer) {
      alert("You lose")
      this.restartGame()
    } else {
      print("GAME CONTINUES")
    }
    this.switchToOtherPlayer()
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

}



export class GameBoard {
  private readonly onBoardChange = new LiteEvent<void>();
  public get BoardChanged() { return this.onBoardChange.expose() }

  // board
  numberOfRows = 6
  numberOfColumns = 7

  slots: GameSlot[] = []
  
  constructor() {
    this.setup()
    this.printBoard()
  }
  // life cycle
  setup() {
    for (let s = 0; s < this.numberOfRows; s++) {
      for (let c = 0; c < this.numberOfColumns; c++) {
        let newSlot = new GameSlot(s, c)
        this.slots.push(newSlot)
      }
    }
  }

  clear() {
    this.slots = []
  }

  chooseColumn(selectedSlot: GameSlot): boolean {
    let col = this.columnFromSlot(selectedSlot)
    
    let filledSlot = col
      .sort((a, b) => a.rowIndex- b.rowIndex) 
      .filter(slot => slot.filledBy === null)
      .pop()

    if (filledSlot) {
      filledSlot.filledBy = Game.player
      return true
    } else {
      print("Error: Couldn't fill slot")
      return false
    }
  }

  checkIfWon(newSlot: GameSlot): Player | null | Error {
    let potentialWins = [
      this.checkForConnectFour(newSlot, this.rowFromSlot(newSlot), true), // this one relies on row index
      this.checkForConnectFour(newSlot, this.columnFromSlot(newSlot), false),
      this.checkForConnectFour(newSlot, this.leftDownDiagonalFromSlot(newSlot), false),
      this.checkForConnectFour(newSlot, this.rightDownDiagonalFromSlot(newSlot), false)
    ]

    if (potentialWins.some(win => win)) {
      if (newSlot.filledBy !== null) {
        print("WINNER")
        return newSlot.filledBy
      } else {
        return Error("Placed slot isn't owned by a player")
      }
    } else {
      return null
    }
  }

  private checkForConnectFour(newSlot: GameSlot, arr: GameSlot[], isRow: boolean): boolean {
    let count = 1
    let filled = arr
      .filter(slot => slot.filledBy === newSlot.filledBy)
      .map(item => {
        // flip around values when dealing with rows
        return new SlotInArray(isRow ? item.rowIndex : item.colIndex, isRow ? item.colIndex : item.rowIndex)
      })
      .sort((a, b) => a.index - b.index) // double check it's sorted
    
    if (filled.length < 4) {
      return false
    }

    for (var i = 1; i < filled.length; i++) {
      if (filled[i].locationIndex - filled[i-1].locationIndex !== 1 ) {
        return false
      } 
      count ++

      if (count >= 4) {
        return true
      }
    }

    return false 
  }

  // evaluate relevant slots
  columnFromSlot(newSlot: GameSlot): GameSlot[] {
    return this.slots.filter(slot => slot.colIndex === newSlot.colIndex)
  } 

  rowFromSlot(newSlot: GameSlot): GameSlot[] {
    return this.slots.filter(slot => slot.rowIndex === newSlot.rowIndex)
  } 

  leftDownDiagonalFromSlot(newSlot: GameSlot): GameSlot[] {
    return this.slots.filter(slot => {
      let slotSum = slot.rowIndex + slot.colIndex
      let newSlotSum = newSlot.rowIndex + newSlot.colIndex
      
      return newSlotSum === slotSum
    })
  }
  rightDownDiagonalFromSlot(newSlot: GameSlot): GameSlot[] {
    return this.slots.filter(slot => {
      let slotSum = slot.rowIndex - slot.colIndex
      let newSlotSum = newSlot.rowIndex - newSlot.colIndex
      
      return newSlotSum === slotSum
    })
  }

  // printing
  printBoard() {
    for (let s = 0; s < this.numberOfRows; s++) {
      let rowString = ""
      let row = this.slots.filter(slot => slot.rowIndex === s)
      row.forEach(item => rowString += item.desc)

      print(rowString)
    }
  }

  printRowsForEvaluation(chosenSlot: GameSlot) {
    // get columns
      print("Row: ")
      print(this.rowFromSlot(chosenSlot).map(item => item.desc).join(""))

      print("Column:")
      this.columnFromSlot(chosenSlot).forEach(item => print(item.desc))

      print("Right diagonal:")
      this.rightDownDiagonalFromSlot(chosenSlot).forEach(item => print(item.desc))
      
      print("Left diagonal")
      this.leftDownDiagonalFromSlot(chosenSlot).forEach(item => print(item.desc))
  }

  // UI helpers
  get slotsByRow(): GameSlot[][] {
    let arr = []
    for (var i = 0; i < this.numberOfRows; i++) {
      arr.push(this.slots.filter(item => item.rowIndex === i))
    }
    return arr
  } 

  get slotsByCol(): GameSlot[][] {
    let arr = []
    for (var i = 0; i < this.numberOfColumns; i++) {
      arr.push(this.slots.filter(item => item.colIndex === i))
    }
    return arr
  } 

  get numberOfFilledSlots(): number {
    return this.slots.filter(slot => slot.filledBy !== null).length
  } 

}

export class GameSlot {
  private readonly onSlotChange = new LiteEvent<GameSlot>();
  public get SlotChanged() { return this.onSlotChange.expose() }

  // filledBy: Player | null = null
  private player: Player | null = null

  rowIndex: number
  colIndex: number

  colLetter: string

  constructor(slotIndex: number, colIndex: number) {
    this.rowIndex = slotIndex
    this.colIndex = colIndex

    // for convenience sake
    this.colLetter = String.fromCharCode(97 + this.colIndex);
  }

  get desc(): string {
    let empty = `${this.rowIndex}${this.colLetter}`
    let filled = "  "
    return `[${this.player === null ? empty : filled }]`;
  } 

  get filledBy(): Player | null {
    return this.player
  }

  set filledBy(setPlayer: Player | null)  {
    this.player = setPlayer
    this.onSlotChange.trigger(this)
  }
}

// TODO: Consider if necessary
class SlotInArray {
  index: number
  locationIndex: number

  constructor(index: number, locationIndex: number) {
    this.index = index // row index
    this.locationIndex = locationIndex
  }
}

/// Events related stuff
interface ILiteEvent<T> {
  on(handler: { (data?: T): void }) : void;
  off(handler: { (data?: T): void }) : void;
}

class LiteEvent<T> implements ILiteEvent<T> {
  private handlers: { (data?: T): void; }[] = [];

  public on(handler: { (data?: T): void }) : void {
      this.handlers.push(handler);
  }

  public off(handler: { (data?: T): void }) : void {
      this.handlers = this.handlers.filter(h => h !== handler);
  }

  public trigger(data?: T) {
      this.handlers.slice(0).forEach(h => h(data));
  }

  public expose() : ILiteEvent<T> {
      return this;
  }
}
