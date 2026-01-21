const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Scores laden
let scores = {};
if (fs.existsSync('scores.json')) {
  scores = JSON.parse(fs.readFileSync('scores.json', 'utf8'));
}

// Fragen laden
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

// Eine zufällige Frage
app.get('/api/question', (req, res) => {
  const index = Math.floor(Math.random() * questions.length);
  res.json(questions[index]);
});

// Scores abrufen
app.get('/api/scores', (req, res) => {
  res.json(scores);
});

// Score speichern
app.post('/api/scores', (req, res) => {
  const { user, points } = req.body;
  if (!user || points == null) {
    return res.status(400).json({ error: 'User oder Punkte fehlen' });
  }

  if (!scores[user] || points > scores[user]) {
    scores[user] = points;
    fs.writeFileSync('scores.json', JSON.stringify(scores, null, 2));
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});