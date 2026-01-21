let score = 0;
const user = prompt("Name eingeben:");
const scoreDiv = document.getElementById("score");

async function loadQuestion() {
  const res = await fetch("/api/question");
  const data = await res.json();

  document.getElementById("question").innerText = data.question;

  const img = document.getElementById("qImage");
  if (data.image) {
    img.src = data.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  data.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.className = "normal";
    btn.onclick = () => checkAnswer(option, data.answer);
    optionsDiv.appendChild(btn);
  });
}

async function checkAnswer(answer, correct) {
  if (answer === correct) {
    alert("✅ Richtig!");
    score++;
  } else {
    alert("❌ Falsch! Richtige Antwort: " + correct);
  }

  scoreDiv.innerText = "Punkte: " + score;

  await fetch("/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, points: score })
  });

  loadQuestion();
}

document.getElementById("leaderboardBtn").onclick = async () => {
  const res = await fetch("/api/scores");
  const data = await res.json();

  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  document.getElementById("leaderboard").innerHTML =
    "<h3>🏆 Leaderboard</h3>" +
    sorted.map(([u, p]) => `${u}: ${p}`).join("<br>");
};

loadQuestion();
