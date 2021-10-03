/*
Add your code for Game here
 */

export default class Game {
    constructor(dimensions) {
        this.gameState = {
            'board': new Array(dimensions * dimensions).fill(0),
            'score': 0,
            'won': false,
            'over': false
        };

        this.dimensions = dimensions;
        this.moveListeners = [];
        this.winListeners = [];
        this.loseListeners = [];
        this.same = false;

        this.setupNewGame();
    };

    setupNewGame() {
        // runs after game is over
        this.gameState.board = new Array(this.dimensions * this.dimensions).fill(0);
        this.gameState.score = 0;
        this.gameState.won = false;
        this.gameState.over = false;
        // fill 2 random, empty tiles with either a 2 (90% chance) or a 4 (10% chance)
        this.makeTwoNewTiles();
        return;
    };

    loadGame(gameState) {
        // setGameState
        this.gameState.board = gameState.board;
        this.gameState.score = gameState.score;
        this.gameState.won = gameState.won;
        this.gameState.over = gameState.over;
        return;
    };

    move(direction) {
        // add new space after legal move
        let beforeMove = this.gameState.board

        let didMerge = false;

        if (direction === 'left') {
            // make 4 arrays, one for each row in game board
            let leftArrays = this.makeRowArrays();
            // filter out zeroes from each array
            let filteredLeft = [];
            for (let i = 0; i < this.dimensions; i++) {
                filteredLeft.push(leftArrays[i].filter(tile => tile !== 0 && tile !== undefined));
            }
            // combine any pairs of identical, adjacent tiles starting from the left, replace one tile with 0,  and filter out for zeroes again
            while (!didMerge) {
                for (let i = 0; i < this.dimensions; i++) {
                    for (let j = 0; j < filteredLeft[i].length - 1; j++) {
                        if (filteredLeft[i][j] === filteredLeft[i][j + 1]) {
                            filteredLeft[i][j] = filteredLeft[i][j] * 2;
                            filteredLeft[i][j + 1] = 0;
                            // update score!
                            this.gameState.score += filteredLeft[i][j];
                        }
                    }
                    filteredLeft[i] = filteredLeft[i].filter(tile => tile !== 0);
                }
                didMerge = true;
            }
            // filter out zeroes from each row
            filteredLeft.forEach(row => row.filter(tile => tile !== 0));

            // add trailing zeroes until array is back to length of this.dimensions
            for (let i = 0; i < this.dimensions; i++) {
                for (let j = filteredLeft[i].length; j < this.dimensions; j++) {
                    filteredLeft[i].push(0);
                }
            }

            // flatten out double array and set board to new values
            this.gameState.board = filteredLeft.flat();

        } else if (direction === 'right') {
            // make 4 arrays, one for each row in game board
            let rightArrays = this.makeRowArrays();
            // filter out zeroes from each array
            let filteredRight = [];
            for (let i = 0; i < this.dimensions; i++) {
                filteredRight.push(rightArrays[i].filter(tile => tile !== 0 && tile !== undefined));
            }
            // combine any pairs of identical tiles, replace one tile with 0,  and filter out for zeroes again

            while (!didMerge) {
                for (let i = 0; i < this.dimensions; i++) {
                    for (let j = filteredRight[i].length - 1; j > 0; j--) {
                        if (filteredRight[i][j - 1] === filteredRight[i][j]) {
                            filteredRight[i][j] = filteredRight[i][j] * 2;
                            filteredRight[i][j - 1] = 0;
                            // update score!
                            this.gameState.score += filteredRight[i][j];
                        }
                    }
                    filteredRight[i] = filteredRight[i].filter(tile => tile !== 0);
                }
                didMerge = true;
                break;
            }
            // filter out zeroes from each row
            filteredRight.forEach(row => row.filter(tile => tile !== 0));

            // add leading zeroes until array is back to length of this.dimensions
            for (let i = 0; i < this.dimensions; i++) {
                for (let j = filteredRight[i].length; j < this.dimensions; j++) {
                    filteredRight[i].unshift(0);
                }
            }
            // flatten out double array and set board to new values
            this.gameState.board = filteredRight.flat();

        } else if (direction === 'up') {
            // make 4 arrays, one for each row in game board
            let upArrays = this.makeColArrays();
            // filter out zeroes from each array
            let filteredUp = [];
            for (let i = 0; i < this.dimensions; i++) {
                filteredUp.push(upArrays[i].filter(tile => tile !== 0 && tile !== undefined));
            }
            // combine any pairs of identical tiles, replace one tile with 0,  and filter out for zeroes again
            while (!didMerge) {
                for (let i = 0; i < this.dimensions; i++) {
                    for (let j = 0; j < filteredUp[i].length - 1; j++) {
                        if (filteredUp[i][j] === filteredUp[i][j + 1]) {
                            filteredUp[i][j] = filteredUp[i][j] * 2;
                            filteredUp[i][j + 1] = 0;
                            // update score!
                            this.gameState.score += filteredUp[i][j];
                        }
                    }
                    filteredUp[i] = filteredUp[i].filter(tile => tile !== 0);
                }
                didMerge = true;
                break;
            }

            // filter out 0s from each col
            filteredUp.forEach(col => col.filter(tile => tile !== 0));


            // add leading zeroes until array is back to length of this.dimensions
            for (let i = 0; i < this.dimensions; i++) {
                for (let j = filteredUp[i].length; j < this.dimensions; j++) {
                    filteredUp[i].push(0);
                }
            }

            // flatten out double array and set board to new values
            this.gameState.board = this.flattenCols(filteredUp);

        } else if (direction === 'down') {
            // make 4 arrays, one for each row in game board
            let downArrays = this.makeColArrays();
            // filter out zeroes from each array
            let filteredDown = [];
            for (let i = 0; i < this.dimensions; i++) {
                filteredDown.push(downArrays[i].filter(tile => tile !== 0 && tile !== undefined));
            }
            // combine any pairs of identical tiles, replace one tile with 0,  and filter out for zeroes again
            while (!didMerge) {
                for (let i = 0; i < this.dimensions; i++) {
                    for (let j = filteredDown[i].length - 1; j > 0; j--) {
                        if (filteredDown[i][j - 1] === filteredDown[i][j]) {
                            filteredDown[i][j] = filteredDown[i][j] * 2;
                            filteredDown[i][j - 1] = 0;
                            // update score!
                            this.gameState.score += filteredDown[i][j];
                        }
                    }
                    filteredDown[i] = filteredDown[i].filter(tile => tile !== 0);
                }
                didMerge = true;
                break;
            }

            // filter out 0s from each col
            filteredDown.forEach(col => col.filter(tile => tile !== 0));

            // add leading zeroes until array is back to length of this.dimensions

            for (let i = 0; i < this.dimensions; i++) {
                for (let j = filteredDown[i].length; j < this.dimensions; j++) {
                    filteredDown[i].unshift(0);
                }
            }

            // flatten out double array and set board to new values
            this.gameState.board = this.flattenCols(filteredDown);
        }

        let afterMove = this.gameState.board;

        // make sure valid move occurred
        let same = true;
        for (let i = 0; i < this.dimensions * this.dimensions; i++) {
            if (beforeMove[i] !== afterMove[i]) same = false;
        }
        if (same === false) this.makeNewTile();
        this.same = same;
        // call move listeners
        for (let i = 0; i < this.moveListeners.length; i++) {
            this.moveListeners[i](this.gameState);
        }

        // check for a 2048 tile and call all win listeners
        if (this.gameState.board.filter(tile => tile === 2048).length !== 0 && this.gameState.board.filter(tile => tile === 2048) !== undefined) {
            this.gameState.won = true;
        }
        if (this.gameState.won) {
            for (let i = 0; i < this.winListeners.length; i++) {
                this.winListeners[i](this.gameState);
            }
        }

        // see if board is stuck and call all lose listeners
        // FINSISHED HERE 3/26/21
        let zeroes = this.gameState.board.filter(tile => tile === 0).length;
        let checkBoardForMoves = this.makeRowArrays();

        let canMove = false;
        for (let i = 0; i < this.dimensions; i++) {
            for (let j = 0; j < this.dimensions - 1; j++) {
                if (checkBoardForMoves[i][j] === checkBoardForMoves[i][j + 1]) {
                    canMove = true;
                    break;
                }
            }
        }
        for (let i = 0; i < this.dimensions - 1; i++) {
            for (let j = 0; j < this.dimensions; j++) {
                if (checkBoardForMoves[i][j] === checkBoardForMoves[i + 1][j]) {
                    canMove = true;
                    break;
                }
            }
        }

        if ((zeroes === 0) && !canMove) {
            this.gameState.over = true;
        }

        if (this.gameState.over) {
            for (let i = 0; i < this.loseListeners.length; i++) {
                this.loseListeners[i](this.gameState);
            }
        }

        return;
    };

    toString() {
        let rows = this.makeRowArrays();
        console.table(rows);
        // return this.gameState.board.map(tile => new Array(1).fill(tile));
        return;
    };

    onMove(callback) {
        // register callback as listener for .move
        this.moveListeners.push(callback);
        return;
    };

    onWin(callback) {
        // register callback as listener for this.getGameState.won
        this.winListeners.push(callback);
        return;
    };

    onLose(callback) {
        // register callback as listener for .move
        this.loseListeners.push(callback);
        return;
    };

    getGameState() {
        return this.gameState;
    };


    // Helper functions start here

    makeNewTile() {
        let chance = 0;
        let i = 0;
        let index = 0;

        while (i < 1) {
            chance = Math.floor(Math.random() * 100);
            // random index
            index = Math.floor(Math.random() * ((this.dimensions * this.dimensions)));
            if (this.gameState.board[index] === 0) {
                this.gameState.board[index] = (chance < 90) ? 2 : 4;
                i++;
            }
            else {
                continue;
            }
        }
        return;
    };

    makeTwoNewTiles() {
        let chance = 0;
        let i = 0;
        let index = 0;

        while (i < 2) {
            chance = Math.floor(Math.random() * 100);
            // random index
            index = Math.floor(Math.random() * ((this.dimensions * this.dimensions)));
            if (this.gameState.board[index] === 0) {
                this.gameState.board[index] = (chance < 90) ? 2 : 4;
                i++;
            }
            else {
                continue;
            }
        }
        return;
    };

    makeColArrays() {
        let cols = new Array(this.dimensions).fill(0).map(() => new Array(this.dimensions).fill(0));
        // cols = [[0,0,0,0]...]
        let rows = this.makeRowArrays();
        // iterates rows
        for (let i = 0; i < this.dimensions; i++) {
            // iterates cols
            for (let j = 0; j < this.dimensions; j++) {
                cols[i][j] = rows[j][i];
            }
        }
        return cols;
    };

    flattenCols(colArr) {
        // let rows = [];
        // for (let i = 0; i < this.dimensions; i++) {
        //     rows[i] = [];
        //     for (let j = 0; j < this.dimensions; j++) {
        //         rows[i][j] = colArr[j][i]
        //     }
        // }
        // return rows.flat();

        let output = [];
        let counter = 0;
        for (let i = 0; i < this.dimensions; i++) {
            for (let j = 0; j < this.dimensions; j++) {
                output[counter] = colArr[j][i]
                counter++;
            }
        }
        return output;
    }

    makeRowArrays() {
        let rows = new Array(this.dimensions).fill(0).map(() => new Array(this.dimensions).fill(0));
        let counter = 0;
        // iterates cols
        for (let i = 0; i < this.dimensions; i++) {
            // iterates rows
            for (let j = 0; j < this.dimensions; j++) {
                if (!rows[i][j]) rows[i][j] = this.gameState.board[counter];
                if (rows[i][j] === undefined) rows[i][j] = 0;
                counter++;
            }
        }
        return rows;
    };
};