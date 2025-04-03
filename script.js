document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const boardElement = document.getElementById('board');
    const gameStatusElement = document.getElementById('game-status');
    const resetButton = document.getElementById('reset-btn');
    const newGameButton = document.getElementById('new-game-btn');
    const pvpButton = document.getElementById('pvp-btn');
    const aiButton = document.getElementById('ai-btn');
    const xScoreElement = document.getElementById('x-score');
    const oScoreElement = document.getElementById('o-score');
    const soundToggle = document.getElementById('sound-toggle');
    
    // Audio elements
    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const drawSound = document.getElementById('draw-sound');
    
    // Game state
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'pvp'; // 'pvp' or 'ai'
    let scores = { X: 0, O: 0 };
    
    // Initialize the game
    function initGame() {
        createBoard();
        updateGameStatus();
        updateScores();
    }
    
    // Create the game board
    function createBoard() {
        boardElement.innerHTML = '';
        board = ['', '', '', '', '', '', '', '', ''];
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', () => handleCellClick(i));
            boardElement.appendChild(cell);
        }
    }
    
    // Handle cell click
    function handleCellClick(index) {
        if (!gameActive || board[index] !== '') return;
        
        // Play click sound if sound is enabled
        if (soundToggle.checked) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
        
        // Make the move
        board[index] = currentPlayer;
        const cell = boardElement.children[index];
        cell.innerHTML = `<i class="fas fa-${currentPlayer === 'X' ? 'times' : 'circle'}"></i>`;
        cell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        if (checkWin()) {
            handleWin();
            return;
        }
        
        if (checkDraw()) {
            handleDraw();
            return;
        }
        
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateGameStatus();
        
        // If playing against AI and it's AI's turn
        if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
            setTimeout(makeAIMove, 800);
        }
    }
    
    // Make AI move
    function makeAIMove() {
        if (!gameActive) return;
        
        // Simple AI - random move
        const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            handleCellClick(randomIndex);
        }
    }
    
    // Check for win
    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        return winPatterns.some(pattern => {
            return pattern.every(index => {
                return board[index] === currentPlayer;
            });
        });
    }
    
    // Check for draw
    function checkDraw() {
        return board.every(cell => cell !== '');
    }
    
    // Handle win
    function handleWin() {
        gameActive = false;
        scores[currentPlayer]++;
        updateScores();
        
        // Play win sound if sound is enabled
        if (soundToggle.checked) {
            winSound.currentTime = 0;
            winSound.play();
        }
        
        // Highlight winning cells
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        const winningPattern = winPatterns.find(pattern => {
            return pattern.every(index => board[index] === currentPlayer);
        });
        
        if (winningPattern) {
            winningPattern.forEach(index => {
                boardElement.children[index].classList.add('win');
            });
        }
        
        gameStatusElement.textContent = `Player ${currentPlayer} Wins!`;
        createConfetti();
    }
    
    // Handle draw
    function handleDraw() {
        gameActive = false;
        
        // Play draw sound if sound is enabled
        if (soundToggle.checked) {
            drawSound.currentTime = 0;
            drawSound.play();
        }
        
        gameStatusElement.textContent = "Game Ended in a Draw!";
    }
    
    // Update game status
    function updateGameStatus() {
        gameStatusElement.textContent = `Player ${currentPlayer}'s Turn`;
        
        // Update active player UI
        document.querySelector('.x-player').classList.toggle('active', currentPlayer === 'X');
        document.querySelector('.o-player').classList.toggle('active', currentPlayer === 'O');
    }
    
    // Update scores
    function updateScores() {
        xScoreElement.textContent = scores.X;
        oScoreElement.textContent = scores.O;
    }
    
    // Reset game (keep scores)
    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        createBoard();
        updateGameStatus();
    }
    
    // New game (reset scores)
    function newGame() {
        scores = { X: 0, O: 0 };
        updateScores();
        resetGame();
    }
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['#f72585', '#4cc9f0', '#4895ef', '#4361ee', '#3f37c9'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -10 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.opacity = Math.random();
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            document.body.appendChild(confetti);
            
            const animationDuration = Math.random() * 3 + 2;
            
            confetti.animate([
                { top: '-10px', transform: 'rotate(0deg)' },
                { top: '100vh', transform: 'rotate(360deg)' }
            ], {
                duration: animationDuration * 1000,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
            });
            
            setTimeout(() => {
                confetti.remove();
            }, animationDuration * 1000);
        }
    }
    
    // Set game mode
    function setGameMode(mode) {
        gameMode = mode;
        pvpButton.classList.toggle('active', mode === 'pvp');
        aiButton.classList.toggle('active', mode === 'ai');
        newGame();
    }
    
    // Event listeners
    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', newGame);
    pvpButton.addEventListener('click', () => setGameMode('pvp'));
    aiButton.addEventListener('click', () => setGameMode('ai'));
    
    // Initialize the game
    initGame();
});
