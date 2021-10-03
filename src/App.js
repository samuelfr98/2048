import './App.css';
import Game from './game.js';
// import $ from "jquery";
import { useState } from "react";
import {useEffect} from 'react'

function App() {

  // Set up the game
  const [boardGame, setBoardGame] = useState(new Game(4));

  useEffect(() => {
    const handleKeyDown = function(e) {
      let temp = new Game(4);
      temp.loadGame(boardGame.getGameState());

      let direction = "";
      if (e.keyCode === 37) {
        e.preventDefault();
        direction = 'left';
      } else if (e.keyCode === 38) {
        e.preventDefault();
        direction = 'up';
      } else if (e.keyCode === 39) {
        e.preventDefault();
        direction = 'right';
      } else if (e.keyCode === 40) {
        e.preventDefault();
        direction = 'down';
      }

      if (direction !== "") {
        temp.move(direction);
      }

      setBoardGame(p => temp);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [boardGame]);


  return (
    <div>
      <div>
        <div className="Instructions">
          <b>{instructions}</b>
          </div>
        <div className="GameProgress">  
          <p className ="">
            Game is over? It appears that is: <b className="Over">{gameOver(boardGame)}</b>
          </p>
          <p className="">
            You think you won? It appears that is: <b className="Won">{gameWon(boardGame)}</b>
          </p>
        </div>
        <div className="ScoreTile">
          <p className="Score">
            Score: {score(boardGame)}
          </p>
        </div>
        <div className="Tile">
          <button className="Reset" onClick = {() => clicked()}>
            Reset
          </button>
        </div>
        <div className="Board" >
          {board(boardGame.gameState.board)} 
        </div>
      </div>
    </div>
  );
}
 
// Instructions
const instructions = 
  <div className="Instructions">
    <p>
      Join the tiles to get to 2048!
    </p>
  </div>;


// gameProgess
const gameOver = function(boardGame) {
  if (boardGame.gameState.over) return "True! You loser!";
  if (!boardGame.gameState.over) return "False! Keep playing!";
}

const gameWon = function(boardGame) {
  if (boardGame.gameState.won) return "True! You winner!";
  if (!boardGame.gameState.won) return "False! Not a winner yet!";
}
  

// Score
const score = function (boardGame) {
    return boardGame.gameState.score;
}

const clicked = function() {
  window.location.reload();
}

// Set up board
const board = function(b) {
  return(
    b.map((number, i) =>
      <div key={i} className="Tile"> 
        <div className="Value">
          {number} 
        </div>
      </div>
  )
  );
};

export default App;
