
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
    let gameOver = false;
    let difficultyLevel = '1';
    
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
            gameOver = true;        
        } else if (winnerIsO) {
            gameOutcome.textContent = `${player2.getName()} wins!`;
            player2.winRound();
            player2WinsDiv.textContent = `${player2.getNumWins()}`;
            displayController.endRound();
            gameOver = true;
        } else if (indexMapX.length + indexMapO.length === 9) {
            gameOutcome.textContent = 'Tie!';
            displayController.endRound();
            gameOver = true;
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
        gameOver = false;
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
        gameOver = false;
        let player1Name = prompt('Player 1 name?', 'Player 1');
        if (!player1Name) {
            player1Name = 'Player 1';
        }
        let player2Name = prompt('Player 2 name?', 'Player 2');
        if (!player2Name) {
            player2Name = 'Player 2';
        }
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
        gameOver = false;
        let player1Name = prompt('Player 1 name?', 'Player 1');
        if (!player1Name) {
            player1Name = 'Player 1';
        }
        let player2Name = 'Computer';
        difficultyLevel = prompt('Enter difficulty (1 = easy, 2 = medium, 3 = impossible!)', 1);
        if (difficultyLevel !== '1' && difficultyLevel !== '2' && difficultyLevel !== '3') {
            difficultyLevel = '1';
        }
        let difficultyText;
        if (difficultyLevel === '1') {
            difficultyText = 'Easy';    
        } else if (difficultyLevel === '2') {
            difficultyText = 'Medium';
        } else {
            difficultyText = 'Impossible';
        }
        player1 = createPlayer(player1Name);
        player2 = createPlayer(player2Name);
        player1NameDiv.textContent = `${player1.getName()}:`;
        player2NameDiv.textContent = `${difficultyText} ${player2.getName()}:`;
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
            if (gameBoard.getSquare(e.id) !== "") {
                return;
            }
            
            if (playerXturn) {
                gameBoard.setSquare(e.id,"X");
                playerXturn = false;
                document.getElementById('playerCardO').style.backgroundColor = 'rgb(196,196,196)';
                document.getElementById('playerCardX').style.backgroundColor = 'white';
                displayController.updateDisplay();
                displayController.checkForWin();
                if (vsComputerMode === true && !gameOver) {
                    if (difficultyLevel === '1') {
                        displayController.aiMove();
                    } else {
                    displayController.smartAIMove();
                    }
                    playerXturn = true;
                    document.getElementById('playerCardO').style.backgroundColor = 'white';
                    document.getElementById('playerCardX').style.backgroundColor = 'rgb(196,196,196)';
                    displayController.updateDisplay();
                    displayController.checkForWin();
                }
            } else {
                gameBoard.setSquare(e.id,"O");
                playerXturn = true;
                document.getElementById('playerCardO').style.backgroundColor = 'white';
                document.getElementById('playerCardX').style.backgroundColor = 'rgb(196,196,196)';
                displayController.updateDisplay();
                displayController.checkForWin();
            }
            
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

    const smartAIMove = function() {
        let indexedBoard = [];
        let playerO = "O";
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getSquare(i) === "") {
                indexedBoard[i] = i;
            } else {
                indexedBoard[i] = gameBoard.getSquare(i);
            }
        }
        let smartAIMove;
        if (difficultyLevel === '2') {
            mediumAI.resetDepthCounter();
            smartAIMove = mediumAI.getBestMove(indexedBoard, playerO);
        } else if (difficultyLevel === '3') {
            smartAIMove = impossibleAI.getBestMove(indexedBoard, playerO);
        }
        gameBoard.setSquare(smartAIMove.index, "O");
    }

    return {
        updateDisplay,
        checkForWin,
        endRound,
        aiMove,
        smartAIMove
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


// Minimax algorithm for unbeatable AI

const impossibleAI = (function() {

    const playerO = "O";
    const playerX = "X";

    const getPossibleSpots = function(boardState) {
        return boardState.filter(s => s != "O" && s != "X");
    }

    const isWinner = function(boardState, player) {
        if (
            (boardState[0] == player && boardState[1] == player && boardState[2] == player) ||
            (boardState[3] == player && boardState[4] == player && boardState[5] == player) ||
            (boardState[6] == player && boardState[7] == player && boardState[8] == player) ||
            (boardState[0] == player && boardState[3] == player && boardState[6] == player) ||
            (boardState[1] == player && boardState[4] == player && boardState[7] == player) ||
            (boardState[2] == player && boardState[5] == player && boardState[8] == player) ||
            (boardState[0] == player && boardState[4] == player && boardState[8] == player) ||
            (boardState[2] == player && boardState[4] == player && boardState[6] == player)
            ) {
            return true;
        } else {
            return false;
        }
    }

    const getBestMove = function(boardState, player) {

        let possibleSpots = getPossibleSpots(boardState);

        if (isWinner(boardState, playerO)) {
            return {score: -10};
        }
        else if (isWinner(boardState, playerX)) {
            return {score: 10};
        } else if (possibleSpots.length === 0) {
            return {score: 0};
        }

        let moves = [];

        for (let i = 0; i < possibleSpots.length; i++) {
            let move = {};
            move.index = boardState[possibleSpots[i]];
            boardState[possibleSpots[i]] = player;

            if (player === playerX) {
                let result = getBestMove(boardState, playerO);
                move.score = result.score;
            }
            else {
                let result = getBestMove(boardState, playerX);
                move.score = result.score;
            }

            boardState[possibleSpots[i]] = move.index;

            moves.push(move);
        }

        let bestMove;
        if (player === playerX) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if(moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];

    }
    return {
        getPossibleSpots,
        isWinner,
        getBestMove
    }

})();


// Medium difficulty algorithm. Added a counter that triggers some randomness.

const mediumAI = (function() {

    const playerO = "O";
    const playerX = "X";

    let depthCounter = 0;

    function resetDepthCounter() {
        depthCounter = 0;
    }

    function getPossibleSpots(boardState) {
        return boardState.filter(s => s != "O" && s != "X");
    }

    function isWinner(boardState, player) {
        if (
            (boardState[0] == player && boardState[1] == player && boardState[2] == player) ||
            (boardState[3] == player && boardState[4] == player && boardState[5] == player) ||
            (boardState[6] == player && boardState[7] == player && boardState[8] == player) ||
            (boardState[0] == player && boardState[3] == player && boardState[6] == player) ||
            (boardState[1] == player && boardState[4] == player && boardState[7] == player) ||
            (boardState[2] == player && boardState[5] == player && boardState[8] == player) ||
            (boardState[0] == player && boardState[4] == player && boardState[8] == player) ||
            (boardState[2] == player && boardState[4] == player && boardState[6] == player)
            ) {
            return true;
        } else {
            return false;
        }
    }

    function getBestMove(boardState, player) {
        depthCounter++;

        
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === "") {
                boardState[i] = i;
            }
        }
        let possibleSpots = getPossibleSpots(boardState);
        
        // Can increase depth counter limit to increase difficulty
        if (depthCounter > 1000) {
            let randIndex = Math.floor(Math.random() * possibleSpots.length);
            let randScoreIndex = Math.floor(Math.random() * 3);
            let randScore;
            if (randScoreIndex === 0) {
                randScore = -10;
            } else if (randScore === 1) {
                randScore = 0;
            } else {
                randScore = 10;
            }
            return {index: possibleSpots[randIndex], score: randScore}
        }
        
        
        if (isWinner(boardState, playerO)) {
            return {score: -10};
        } else if (isWinner(boardState, playerX)) {
            return {score: 10};
        } else if (possibleSpots.length === 0) {
            return {score: 0};
        }

        let moves = [];

        for (let i = 0; i < possibleSpots.length; i++) {
    
            let move = {};
            move.index = boardState[possibleSpots[i]];
            boardState[possibleSpots[i]] = player;

            if (player === playerX) {
                let result = getBestMove(boardState, playerO);
                move.score = result.score;
            }
            else {
                let result = getBestMove(boardState, playerX);
                move.score = result.score;
            }

            boardState[possibleSpots[i]] = move.index;

            moves.push(move);
        }

        let bestMove;
        if (player === playerX) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if(moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];

    }
    return {
        resetDepthCounter,
        getPossibleSpots,
        isWinner,
        getBestMove
    }

})();

