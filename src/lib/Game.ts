const print = console.log;

enum Player {
  User, 
  Computer
}

export class Game {
  static player: Player = Player.User;
  board: GameBoard = new GameBoard()

  constructor() {
    print("Initialising game")
  }
}

export class GameBoard {
  // board
  numberOfRows = 6
  numberOfColumns = 7

  private slots: GameSlot[] = []
  
  constructor() {
    this.setup()

    this.printBoard()

    let chosenSlot = this.chooseSlot(4, 5)
    if (chosenSlot) {
      // evaluate for connect four
      // switch player
    }

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

  // Function is probably unnecessary
  private chooseSlot(rowIndex: number, columnIndex: number): GameSlot | null {
    let chosenSlot = this.slots.find(item => item.rowIndex == rowIndex && item.colIndex == columnIndex )

    if (chosenSlot) {
      print(`Chose slot at ${chosenSlot.desc}`)
      chosenSlot.filledBy = Game.player
      this.printBoard()

      return chosenSlot
    }

    return null
  }


  chooseColumn(selectedSlot: GameSlot) {
    let col = this.columnFromSlot(selectedSlot)
    
    let filledSlot = col
      .sort((a, b) => a.rowIndex- b.rowIndex) 
      .filter(slot => slot.filledBy === null)
      .pop()

    if (filledSlot) {
      filledSlot.filledBy = Game.player
      this.checkIfWon(filledSlot)
    } else {
      print("Error: Couldn't fill slot")
    }
  }

  private checkIfWon(newSlot: GameSlot) {
    let potentialWins = [
      this.checkForConnectFour(newSlot, this.rowFromSlot(newSlot), true), // this one relies on row index
      this.checkForConnectFour(newSlot, this.columnFromSlot(newSlot), false),
      this.checkForConnectFour(newSlot, this.leftDownDiagonalFromSlot(newSlot), false),
      this.checkForConnectFour(newSlot, this.rightDownDiagonalFromSlot(newSlot), false)
    ]

    if (potentialWins.some(win => win)) {
      print(`WINNER!`)
    }
  }

  private checkForConnectFour(newSlot: GameSlot, arr: GameSlot[], isRow: Boolean): Boolean {
    let count = 1
    let filled = arr
      .filter(slot => slot.filledBy == newSlot.filledBy)
      .map(item => {
        // flip around values when dealing with rows
        return new SlotInArray(isRow ? item.rowIndex : item.colIndex, isRow ? item.colIndex : item.rowIndex)
      })
      .sort((a, b) => a.index - b.index) // double check it's sorted
    
    if (filled.length < 4) {
      return false
    }

    for (var i = 1; i < filled.length; i++) {
      if (filled[i].locationIndex - filled[i-1].locationIndex != 1 ) {
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

  get numberOfFilledSlots(): number {
    return this.slots.filter(slot => slot.filledBy !== null).length
  } 

}

enum SlotState {
  Empty, Filled
}

export class GameSlot {
  filledBy: Player | null = null
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
    return `[${this,this.filledBy === null ? empty : filled }]`;
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