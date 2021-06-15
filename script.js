
// Game Board Module
const gameBoard = (function() {
    let gameSquares = ["","","","","","","","",""];
    const setSquare = function(squareIndex, playerSymbol) {
        if (gameSquares[squareIndex] !== "") {
            return;
        } else {
            gameSquares[squareIndex] = playerSymbol;
        }
    }

    const getSquare = function(squareIndex) {
        return gameSquares[squareIndex];
    }

    const resetSquares = function() {
        gameSquares = ["","","","","","","","",""];
        return gameSquares;
    }

    return {
        setSquare,
        getSquare,
        resetSquares,
    }
})();

// Display controller module. Updates display each move and checks for win.
const displayController = (function() {
    const gameOutcome = document.querySelector('#gameOutcome');
    const gameSquareDivs = document.querySelectorAll('.gameSquare');
    const replayButton = document.querySelector('#replayButton');
    let playerXturn = true;
    
    const updateDisplay = function() {
        for (let i = 0; i < gameSquareDivs.length; i++) {
            gameSquareDivs[i].textContent = gameBoard.getSquare(i);
        }
    };
    
    const checkForWin = function() {
        let indexMapX = [];
        let indexMapO = [];
        for (let i = 0; i < gameSquareDivs.length; i++) {
            if (gameBoard.getSquare(i) === "X") {
                indexMapX.push(i);
            } else if (gameBoard.getSquare(i) === "O") {
                indexMapO.push(i);
            }
            else continue;
        }

       
        let winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
       // let winCondition = [0, 1, 2] // Example with a single win condition
       let winnerIsX = false;
       let winnerIsO = false;
       
       for (let i = 0; i < winConditions.length; i++) {
            if (winnerIsX || winnerIsO) {
                break;
            } else {
                winnerIsX = winConditions[i].every(function(el) {
                    return indexMapX.indexOf(el) !== -1;
                });
                winnerIsO = winConditions[i].every(function(el) {
                    return indexMapO.indexOf(el) !== -1;
                });
            }
        }    
        if (winnerIsX) {
            gameOutcome.textContent = 'X wins!';
            displayController.endRound();           
        } else if (winnerIsO) {
            gameOutcome.textContent = 'O wins!';
            displayController.endRound();
        } else if (indexMapX.length + indexMapO.length === 9) {
            gameOutcome.textContent = 'Tie!';
            displayController.endRound();
        } else {    
            return;
        }
        
    };

    const endRound = function() {
        for (let i = 0; i < gameSquareDivs.length; i++) {
            document.getElementById(i).style.pointerEvents = 'none';
        }
        document.getElementById('replayDiv').style.display = 'block';
    };

    replayButton.addEventListener('click', function() {
        gameBoard.resetSquares();
        displayController.updateDisplay();
        gameOutcome.textContent = "";
        playerXturn = true;
        for (let i = 0; i < gameSquareDivs.length; i++) {
            document.getElementById(i).style.pointerEvents = 'auto';
        }
        document.getElementById('replayDiv').style.display = 'none';
    });

    gameSquareDivs.forEach(function(e) {
        e.addEventListener('click', function() {
            if (playerXturn) {
                gameBoard.setSquare(e.id,"X");
                playerXturn = false;
            } else {
                gameBoard.setSquare(e.id,"O");
                playerXturn = true;
            }
            displayController.updateDisplay();
            displayController.checkForWin();
        });
    });

    return {
        updateDisplay, // Remove from returned functions later
        checkForWin,
        endRound,
    }
})();






