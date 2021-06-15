
// Game Board Module
const gameBoard = (function() {
    const gameSquares = ["","","","","","","","",""];
    const setSquare = function(squareIndex, playerSymbol) {
        if (gameSquares[squareIndex] !== "") {
            return;
        } else {
            gameSquares[squareIndex] = playerSymbol;
            console.log(gameSquares); // Delete later
        }
    }

    const getSquare = function(squareIndex) {
        return gameSquares[squareIndex];
    }

    return {
        setSquare,
        getSquare,
    }
})();

// Display controller module. Updates display each move and checks for win.
const displayController = (function() {
    const gameSquareDivs = document.querySelectorAll('.gameSquare');
    
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
            console.log('X wins');
        } else if (winnerIsO) {
            console.log('O wins');
        } else if (indexMapX.length + indexMapO.length === 9) {
            console.log('Tie');
        } else {    
            return;
        }
        
    };

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
    }
})();



let playerXturn = true; // remove this from global scope eventually



