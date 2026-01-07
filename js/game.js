/*************************
  BASIC SETUP
*************************/
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

/*************************
  GAME STATE
*************************/
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let currentPlayer = "X";

/*************************
  PLAYER & MODE
*************************/
const playerName = localStorage.getItem("playerName") || "Player";
const friendName = localStorage.getItem("friendName") || "Friend";
const mode = localStorage.getItem("mode") || "AI";

const player1 = playerName;
const player2 = mode === "FRIEND" ? friendName : "AI";

/*************************
  POINTS
*************************/
let stats = JSON.parse(localStorage.getItem("stats")) || { points: 0 };

const pointsEl = document.getElementById("points");
pointsEl.textContent = `⭐ Points: ${stats.points}`;

/*************************
  PLAYER INFO
*************************/
const playerInfo = document.getElementById("playerInfo");
playerInfo.textContent =
  mode === "FRIEND"
    ? `${player1} (X) vs ${player2} (O)`
    : `${player1} (X) vs AI (O)`;

statusText.textContent = `${player1}'s Turn (X)`;

/*************************
  WIN PATTERNS
*************************/
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/*************************
  EVENT LISTENERS
*************************/
cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);

/*************************
  MAIN CLICK HANDLER
*************************/
function handleClick() {
  const index = this.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);

  if (checkGameOver(currentPlayer)) return;

  if (mode === "AI" && currentPlayer === "X") {
    statusText.textContent = "🤖 AI Thinking...";
    setTimeout(aiMove, 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent =
      currentPlayer === "X"
        ? `${player1}'s Turn (X)`
        : `${player2}'s Turn (O)`;
  }
}

/*************************
  AI LOGIC (SMART)
*************************/
function aiMove() {
  if (!gameActive) return;

  const move = findBestMove();
  makeMove(move, "O");
  checkGameOver("O");

  currentPlayer = "X";
  statusText.textContent = `${player1}'s Turn (X)`;
}

function findBestMove() {

  // AI tries to win
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      if (isWinning("O")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // Block player win
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      if (isWinning("X")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // Take center
  if (board[4] === "") return 4;

  // Random empty
  const empty = board
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

  return empty[Math.floor(Math.random() * empty.length)];
}

function isWinning(player) {
  return winPatterns.some(p => p.every(i => board[i] === player));
}

/*************************
  CORE FUNCTIONS
*************************/
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player);
}


function checkGameOver(player) {

  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] === player && board[b] === player && board[c] === player) {
        // STEP 5: board shake animation
const boardEl = document.querySelector(".board");
boardEl.classList.add("shake");

// highlight winning cells
cells[a].classList.add("win-cell");
cells[b].classList.add("win-cell");
cells[c].classList.add("win-cell");


      if (mode === "AI") {
        if (player === "X") {
          statusText.textContent = `🔥 ${player1} Wins!`;
          stats.points += 10;
          saveHistory("WIN");
        } else {
          statusText.textContent = "💀 AI Wins!";
          stats.points -= 5;
          saveHistory("LOSS");
        }
        updatePoints();
      } else {
        statusText.textContent =
          player === "X"
            ? `🔥 ${player1} Wins!`
            : `🔥 ${player2} Wins!`;
      }

      gameActive = false;
      return true;
    }
    

  }

  if (!board.includes("")) {
    statusText.textContent = "😵 Draw Game!";
    if (mode === "AI") {
      stats.points += 2;
      saveHistory("DRAW");
      updatePoints();
    }
    gameActive = false;
    return true;
  }

  return false;
}

/*************************
  HISTORY & POINTS
*************************/
function saveHistory(result) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({
    player: player1,
    result: result,
    date: new Date().toLocaleString()
  });
  localStorage.setItem("history", JSON.stringify(history));
}

function updatePoints() {
  localStorage.setItem("stats", JSON.stringify(stats));
  pointsEl.textContent = `⭐ Points: ${stats.points}`;
}

/*************************
  RESTART
*************************/
function restartGame() {

  // STEP 6: restart animation
  const boardEl = document.querySelector(".board");
  boardEl.classList.add("restart");

  setTimeout(() => {
    boardEl.classList.remove("restart");
  }, 300);

  board = ["","","","","","","","",""];
  gameActive = true;
  currentPlayer = "X";

  statusText.textContent = `${player1}'s Turn (X)`;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O", "win-cell");
  });
}

