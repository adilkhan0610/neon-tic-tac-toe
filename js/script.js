const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const HUMAN = "X";
const AI = "O";

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", humanMove));
restartBtn.addEventListener("click", restartGame);

/* =========================
   HUMAN MOVE
========================= */
function humanMove() {
  const index = this.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  makeMove(index, HUMAN);

  if (checkGameOver(HUMAN)) return;

  statusText.textContent = "🤖 AI Thinking...";
  setTimeout(aiMove, 500); // delay for realism
}

/* =========================
   AI MOVE
========================= */
function aiMove() {
  if (!gameActive) return;

  let move = findBestMove();

  makeMove(move, AI);
  checkGameOver(AI);
}

/* =========================
   CORE FUNCTIONS
========================= */
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player);
}

function checkGameOver(player) {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (board[a] === player && board[b] === player && board[c] === player) {
      statusText.textContent = player === HUMAN ? "🔥 You Win!" : "💀 AI Wins!";
      highlightWin(pattern);
      document.body.classList.add("win");
      gameActive = false;
      return true;
    }
  }

  if (!board.includes("")) {
    statusText.textContent = "😵 Draw Game!";
    gameActive = false;
    return true;
  }

  statusText.textContent = "Your Turn (X)";
  return false;
}

/* =========================
   AI BRAIN 🧠
========================= */
function findBestMove() {

  // 1️⃣ Try to win
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = AI;
      if (isWinning(AI)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // 2️⃣ Block human win
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = HUMAN;
      if (isWinning(HUMAN)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // 3️⃣ Take center
  if (board[4] === "") return 4;

  // 4️⃣ Take random empty
  let emptyCells = board
    .map((val, idx) => val === "" ? idx : null)
    .filter(v => v !== null);

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function isWinning(player) {
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

/* =========================
   UI HELPERS
========================= */
function highlightWin(pattern) {
  pattern.forEach(i => cells[i].style.boxShadow = "0 0 30px yellow");
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  statusText.textContent = "Your Turn (X)";
  document.body.classList.remove("win");

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O");
    cell.style.boxShadow = "0 0 15px cyan";
  });
}
