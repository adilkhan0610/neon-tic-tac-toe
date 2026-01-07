function playAI() {
  const name = document.getElementById("playerName").value;

  if (name === "") {
    alert("Please enter your name");
    return;
  }

  localStorage.setItem("playerName", name);
  localStorage.setItem("mode", "AI");

  window.location.href = "game.html";
}

function joinRoom() {
  const name = document.getElementById("playerName").value;
  const code = document.getElementById("roomCode").value;

  if (name === "") {
    alert("Please enter your name");
    return;
  }

  if (code === "") {
    alert("Please enter room code");
    return;
  }

  localStorage.setItem("playerName", name);
  localStorage.setItem("roomCode", code);
  localStorage.setItem("mode", "FRIEND");

  window.location.href = "game.html";
}

function playFriend() {
  const name = document.getElementById("playerName").value;
  const friend = document.getElementById("friendName").value;

  if (name === "" || friend === "") {
    alert("Please enter both player names");
    return;
  }

  localStorage.setItem("playerName", name);
  localStorage.setItem("friendName", friend);
  localStorage.setItem("mode", "FRIEND");

  window.location.href = "game.html";
}

