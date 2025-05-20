

const board = document.querySelectorAll('.cell');
let currentPlayer = 'X'; // Player starts as X

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

// Check if there's a winner
function checkWinner(player) {
  return winningCombinations.some(combination => {
    return combination.every(index => {
      return board[index].textContent === player;
    });
  });
}

// Check if the board is full (draw)
function isBoardFull() {
  return [...board].every(cell => cell.textContent !== '');
}

// Handle player's click
board.forEach(cell => {
  cell.addEventListener('click', (event) => {
    if (event.target.textContent === '' && currentPlayer === 'X') {
      event.target.textContent = 'X'; // Player move
      if (checkWinner('X')) {
        setTimeout(() => alert('Player X wins!'), 100);
        resetBoard();
        return;
      }
      if (isBoardFull()) {
        setTimeout(() => alert('It\'s a draw!'), 100);
        resetBoard();
        return;
      }
      currentPlayer = 'O'; // AI's turn
      setTimeout(aiMove, 500); // AI plays after 500ms
    }
  });
});

// AI move using Minimax Algorithm
function aiMove() {
  const bestMove = minimax(board, 'O').index;
  board[bestMove].textContent = 'O'; // AI makes its move
  if (checkWinner('O')) {
    setTimeout(() => alert('AI wins!'), 100);
    resetBoard();
    return;
  }
  if (isBoardFull()) {
    setTimeout(() => alert('It\'s a draw!'), 100);
    resetBoard();
    return;
  }
  currentPlayer = 'X'; // Switch back to player
}

// Minimax Algorithm
function minimax(newBoard, player) {
  const availableCells = [...newBoard].filter(cell => cell.textContent === '');

  // Check for terminal states
  if (checkWinner('X')) return { score: -10 };
  if (checkWinner('O')) return { score: 10 };
  if (availableCells.length === 0) return { score: 0 };

  const moves = [];

  // Loop through available spots
  availableCells.forEach(cell => {
    const index = cell.getAttribute('data-index');
    const move = { index: parseInt(index) };

    // Simulate the move
    newBoard[index].textContent = player;

    // Get the score from calling minimax recursively
    if (player === 'O') {
      const result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      const result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    // Reset the board
    newBoard[index].textContent = '';
    moves.push(move);
  });

  // Find the best move
  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    moves.forEach(move => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach(move => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  }

  return bestMove;
}

// Reset the board
function resetBoard() {
  board.forEach(cell => {
    cell.textContent = '';
  });
  currentPlayer = 'X'; // Player starts again
}
