const historyList = document.getElementById("historyList");
const history = JSON.parse(localStorage.getItem("history")) || [];

if (history.length === 0) {
  historyList.innerHTML = "<li>No games played yet</li>";
} else {
  history.forEach(game => {
    const li = document.createElement("li");
    li.textContent = `${game.player} - ${game.result} (${game.date})`;
    historyList.appendChild(li);
  });
}

function goToGame() {
  window.location.replace("game.html");
}
