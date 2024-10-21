document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const message = document.getElementById("message");
    const resetButton = document.getElementById("reset");
    const gameModeSelect = document.getElementById("gameMode"); // Reference to the dropdown

    let currentPlayer = "X"; // Human player
    let gameActive = true;
    let boardState = ["", "", "", "", "", "", "", "", ""];
    let singlePlayerMode = true; // True for single player, false for two players
    let playerTurnActive = true; // To prevent player clicks during the PC turn

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    function createBoard() {
        board.innerHTML = ""; // Clear the board
        boardState.forEach((_, index) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.dataset.index = index;
            square.addEventListener("click", handleSquareClick);
            board.appendChild(square);
        });
    }

    function handleSquareClick(event) {
        if (!playerTurnActive || !gameActive) return; // Block clicks during PC turn and when game is inactive

        const index = event.target.dataset.index;
        if (boardState[index]) return; // Prevent clicking already filled squares

        boardState[index] = currentPlayer;
        event.target.textContent = currentPlayer;

        checkResult();

        if (gameActive && singlePlayerMode) {
            playerTurnActive = false; // Disable player turn during PC's move
            currentPlayer = "O"; // Switch to computer
            message.textContent = "Ход на компютъра...";
            setTimeout(computerMove, 1000); // Delay for computer move
        } else if (gameActive) {
            currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player in two-player mode
            message.textContent = `Ход на играч ${currentPlayer}`;
        }
    }

    function computerMove() {
        const bestMove = getBestMove();
        makeMove(bestMove);
        playerTurnActive = true; // Re-enable player's turn after the PC moves
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === "") {
                boardState[i] = "O"; // AI is "O"
                let score = minimax(boardState, 0, false);
                boardState[i] = ""; // Undo move
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function minimax(state, depth, isMaximizing) {
        const scores = { X: -1, O: 1, tie: 0 };

        let result = checkWinner(state);
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < state.length; i++) {
                if (state[i] === "") {
                    state[i] = "O"; // AI
                    let score = minimax(state, depth + 1, false);
                    state[i] = ""; // Undo move
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < state.length; i++) {
                if (state[i] === "") {
                    state[i] = "X"; // Player
                    let score = minimax(state, depth + 1, true);
                    state[i] = ""; // Undo move
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinner(state) {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (state[a] && state[a] === state[b] && state[a] === state[c]) {
                return state[a]; // X or O
            }
        }

        if (!state.includes("")) {
            return "tie";
        }

        return null; // No winner yet
    }

    function makeMove(index) {
        boardState[index] = currentPlayer;
        const square = board.querySelector(`[data-index="${index}"]`);
        square.textContent = currentPlayer;

        checkResult();
        if (gameActive) {
            currentPlayer = singlePlayerMode ? "X" : (currentPlayer === "X" ? "O" : "X"); // Switch players
            message.textContent = `Ход на играч ${currentPlayer}`;
        }
    }

    function checkResult() {
        let roundWon = false;
        let winningSquares = [];

        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                roundWon = true;
                winningSquares = [a, b, c]; // Save winning squares
                break;
            }
        }

        if (roundWon) {
            message.textContent = `Играч ${currentPlayer} спечели!`;
            gameActive = false;
            highlightWinningSquares(winningSquares);
            return;
        }

        if (!boardState.includes("")) {
            message.textContent = "Равенство!";
            gameActive = false;
            highlightTieEffect();
            return;
        }
    }

    function highlightWinningSquares(winningSquares) {
        winningSquares.forEach(index => {
            const square = board.querySelector(`[data-index="${index}"]`);
            square.classList.add(currentPlayer === "X" ? "winning-square-green" : "winning-square-red");
        });
    }

    function highlightTieEffect() {
        const squares = board.querySelectorAll(".square");
        squares.forEach(square => {
            square.classList.add("tie-square");
        });
    }

    resetButton.addEventListener("click", () => {
        boardState = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        playerTurnActive = true; // Re-enable the player turn
        message.textContent = `Ход на играч ${currentPlayer}`;
        createBoard();
    });

    gameModeSelect.addEventListener("change", () => {
        singlePlayerMode = gameModeSelect.value === "computer"; // Set mode based on dropdown
        resetButton.click(); // Reset the game on mode change
        message.textContent = singlePlayerMode ? "Играч X, ходи!" : "Ход на играч X";
    });

    createBoard();
});
