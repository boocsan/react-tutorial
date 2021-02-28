import React, { MouseEventHandler } from "react";
import ReactDOM from "react-dom";
import "./index.css";

type SquareProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  value: string;
};

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

type BoardProps = {
  squares: string[];
  onClick(i: number): void;
};

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

type GamePropsHistoryPosition = {
  x: number;
  y: number;
};

type GamePropsHistory = {
  squares: string[];
  position: GamePropsHistoryPosition;
};

type GameProps = {
  history: GamePropsHistory[];
  stepNumber: number;
  xIsNext: boolean;
};

class Game extends React.Component<{}, GameProps> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(""),
          position: {
            x: -1,
            y: -1,
          },
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i: number): void {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: {
            x: (i % 3) + 1,
            y: Math.floor(i / 3) + 1,
          },
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(i: number): void {
    this.setState({
      stepNumber: i,
      xIsNext: i % 2 === 0,
    });
  }

  render() {
    const histories = this.state.history;
    const current = histories[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = histories.map((history: GamePropsHistory, move: number) => {
      const desc = move
        ? `Go to move #${move} (x: ${history.position.x}, y: ${history.position.y})`
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (!current.squares.includes("")) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i: number) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
