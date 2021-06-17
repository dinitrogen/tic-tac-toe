
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

    const getSquaresArray = function() {
        return gameSquares;
    }

    const resetSquares = function() {
        gameSquares = ["","","","","","","","",""];
        return gameSquares;
    }

    return {
        setSquare,
        getSquare,
        getSquaresArray,
        resetSquares,
    }
})();

// Display controller module. Updates display each move and checks for win.
const displayController = (function() {
    const endGameOverlay = document.querySelector('#endGameOverlay');
    const gameOutcome = document.querySelector('#gameOutcome');
    const gameSquareDivs = document.querySelectorAll('.gameSquare');
    const newGameButton = document.querySelector('#newGameButton');
    const newAIGameButton = document.querySelector('#newAIGameButton');
    const replayButton = document.querySelector('#replayButton');
    const player1NameDiv = document.querySelector('#player1NameDiv');
    const player2NameDiv = document.querySelector('#player2NameDiv');
    const player1WinsDiv = document.querySelector('#player1WinsDiv');
    const player2WinsDiv = document.querySelector('#player2WinsDiv');
    let playerXturn = true;
    let player1;
    let player2;
    let vsComputerMode = false;
    
    const updateDisplay = function() {
        for (let i = 0; i < gameSquareDivs.length; i++) {
            gameSquareDivs[i].textContent = gameBoard.getSquare(i);
        }
        player1WinsDiv.textContent = `${player1.getNumWins()}`;
        player2WinsDiv.textContent = `${player2.getNumWins()}`;
    }
    
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
            gameOutcome.textContent = `${player1.getName()} wins!`;
            player1.winRound();
            player1WinsDiv.textContent = `${player1.getNumWins()}`;
            displayController.endRound();           
        } else if (winnerIsO) {
            gameOutcome.textContent = `${player2.getName()} wins!`;
            player2.winRound();
            player2WinsDiv.textContent = `${player2.getNumWins()}`;
            displayController.endRound();
        } else if (indexMapX.length + indexMapO.length === 9) {
            gameOutcome.textContent = 'Tie!';
            displayController.endRound();
        } else {    
            return;
        } 
    }

    const endRound = function() {
        for (let i = 0; i < gameSquareDivs.length; i++) {
            document.getElementById(i).style.pointerEvents = 'none';
        }
        document.getElementById('endGameOverlay').style.display = 'block';
    }

    replayButton.addEventListener('click', function() {
        gameBoard.resetSquares();
        displayController.updateDisplay();
        gameOutcome.textContent = "";
        playerXturn = true;
        document.getElementById('playerCardO').style.backgroundColor = 'white';
                document.getElementById('playerCardX').style.backgroundColor = 'rgb(196,196,196)';
        for (let i = 0; i < gameSquareDivs.length; i++) {
            document.getElementById(i).style.pointerEvents = 'auto';
        }
        document.getElementById('endGameOverlay').style.display = 'none';
    });

    newGameButton.addEventListener('click', function() {
        let player1Name = prompt('Player 1 name?', 'Player 1');
        let player2Name = prompt('Player 2 name?', 'Player 2');
        player1 = createPlayer(player1Name);
        player2 = createPlayer(player2Name);
        player1NameDiv.textContent = `${player1.getName()}:`;
        player2NameDiv.textContent = `${player2.getName()}:`;
        gameBoard.resetSquares();
        displayController.updateDisplay();
        vsComputerMode = false;
        playerXturn = true;
        document.getElementById('playerCardO').style.backgroundColor = 'white';
                document.getElementById('playerCardX').style.backgroundColor = 'rgb(196,196,196)';      
        for (let i = 0; i < gameSquareDivs.length; i++) {
            document.getElementById(i).style.pointerEvents = 'auto';
        }    
        document.getElementById('endGameOverlay').style.display = 'none';
    });

    newAIGameButton.addEventListener('click', function() {
        let player1Name = prompt('Player 1 name?', 'Player 1');
        let player2Name = 'Computer';
        player1 = createPlayer(player1Name);
        player2 = createPlayer(player2Name);
        player1NameDiv.textContent = `${player1.getName()}:`;
        player2NameDiv.textContent = `${player2.getName()}:`;
        gameBoard.resetSquares();
        displayController.updateDisplay();
        vsComputerMode = true;
        playerXturn = true;
        document.getElementById('playerCardO').style.backgroundColor = 'white';
                document.getElementById('playerCardX').style.backgroundColor = 'rgb(196,196,196)';      
        for (let i = 0; i < gameSquareDivs.length; i++) {
            document.getElementById(i).style.pointerEvents = 'auto';
        }    
        document.getElementById('endGameOverlay').style.display = 'none';
    });

    gameSquareDivs.forEach(function(e) {
        e.addEventListener('click', function() {
            if (playerXturn) {
                gameBoard.setSquare(e.id,"X");
                playerXturn = false;
                document.getElementById('playerCardO').style.backgroundColor = 'rgb(196,196,196)';
                document.getElementById('playerCardX').style.backgroundColor = 'white';
                if (vsComputerMode === true) {
                    displayController.aiMove();
                    playerXturn = true;
                    document.getElementById('playerCardO').style.backgroundColor = 'white';
                    document.getElementById('playerCardX').style.backgroundColor = 'rgb(196,196,196)';
                }
            } else {
                gameBoard.setSquare(e.id,"O");
                playerXturn = true;
                document.getElementById('playerCardO').style.backgroundColor = 'white';
                document.getElementById('playerCardX').style.backgroundColor = 'rgb(196,196,196)';
            }
            displayController.updateDisplay();
            displayController.checkForWin();
            
        });
    });

    const aiMove = function() {
        if (gameBoard.getSquaresArray().includes("") === true) {   
            let aiMoveIndex = Math.floor(Math.random() * 8);
            if (gameBoard.getSquare(aiMoveIndex) === "") {
                gameBoard.setSquare(aiMoveIndex, "O");
            } else {
                displayController.aiMove();
            }
        }
    }

    return {
        updateDisplay,
        checkForWin,
        endRound,
        aiMove,
    }
})();


// Factory function to create players
const createPlayer = function(name) {
    let numWins = 0; // declaring with "let" is important to link numWins to each instance

    const winRound = () => {
        numWins++;
    }

    const getNumWins = () => numWins;

    const getName = () => name;

    return {
        getName, getNumWins, winRound
    }
}






