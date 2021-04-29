import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.2
  }
  constructor(props) {
    super(props);
      this.state = {
        hasWon: false,
        board: this.createBoard()
      }
    this.flipCellsAround = this.flipCellsAround.bind(this);
    this.gameState = this.gameState.bind(this);
  }


  createBoard() {
    let board = [];
    let lightsOn = 0;
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      let x = 0;
      while (x < this.props.ncols) {
        let cell = {};
        cell.coord = `${y}-${x}`
        cell.isLit = (Math.random() < this.props.chanceLightStartsOn) ? true : false;
        if (cell.isLit) lightsOn++;
        row.push(cell);
        x++;
      }
      board.push(row);
    }
    if (lightsOn % 2 !== 0)  {
      return this.createBoard()
    } else {
    return board
    };
  }

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        console.log(board[y][x])
        board[y][x].isLit = !board[y][x].isLit;
      } else {
        console.log("Off board cell!")
      }
    }

    flipCell(y, x)
    flipCell(y-1, x) // North
    flipCell(y+1, x) // South
    flipCell(y, x-1) // East
    flipCell(y, x+1) // West

    // win when every cell is turned off
    let hasWon = this.state.hasWon;
    if (this.gameState()) hasWon = true;

    this.setState({board, hasWon});
  }

  gameState() {
    let {ncols, nrows} = this.props;
    let board = this.state.board;

    for (let y = 0; y < nrows; y++) {
      let x = 0;
      while (x < ncols) {
        if (board[y][x].isLit) return false;
        x++;
      }
    }
    return true;
  }

  makeTable() {
    return (
    <table className="Board">
          <tbody>
            {this.state.board.map((row, idx) => (
              <tr key={idx}>
                {row.map(cell => (
                  <Cell key={cell.coord} value={cell.coord} isLit={cell.isLit} flipCellsAroundMe={this.flipCellsAround}/>
                ))}
              </tr>
            ))
            }
          </tbody>
        </table>
    )
  }

  render() {
    return (
      <div>
        {this.state.hasWon ? (
          <div className="Board-title winner">
            <span className="neon-blue">You</span>
            <span className="neon-orange">Win!</span>
          </div>
        ) : (
        <div className="Board-display">
          <div className="Board-title">
            <div className="neon-orange">Lights</div>
            <div className="neon-blue">Out</div>
          </div>
          {this.makeTable()}
        </div>
        )}
      </div>
    )
  };
};

export default Board;
