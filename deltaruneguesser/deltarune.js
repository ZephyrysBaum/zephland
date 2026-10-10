
let score = 0;
let highscore = Number(localStorage.getItem('highscore')) || 0;
let answer = "";
let answered = false;

let line = "";
let wordStart = 0;
let revealed = new Set();
let hintCount = 0;


// Load a random quote
async function getline() {
    const puzzle = document.getElementById('puzzle');
    puzzle.textContent = 'Loading quote...';

    try {
        const txt = await $.get('./DELTARUNE.txt');

        const lines = txt.split(/\r?\n/).filter(line =>
            line.trim().split(/\s+/).length >= 3 &&
            /\b[a-zA-Z]{4,}\b/.test(line) &&
            !/~[1-9]/.test(line)
        );

        if (lines.length === 0) {
            puzzle.textContent = 'No suitable quotes found in the file.';
            return;
        }

        // Pick a random quote containing a suitable word
        let words = [];

        while (words.length === 0) {
            line = lines[Math.floor(Math.random() * lines.length)];

            words = [...line.matchAll(/\b[a-zA-Z]{4,}\b/g)];
        }

        const word = words[Math.floor(Math.random() * words.length)];

        answer = word[0];
        wordStart = word.index;

        revealed = new Set();
        hintCount = 0;
        answered = false;

        // Reset the interface
        puzzle.textContent =
            line.slice(0, wordStart) +
            'X'.repeat(answer.length) +
            line.slice(wordStart + answer.length);

        document.getElementById('guess').value = '';
        document.getElementById('feedback').textContent = '';
        document.getElementById('guess').disabled = false;
        document.getElementById('submit').disabled = false;
        document.getElementById('hint').disabled = false;

        updateCounters();

        document.getElementById('guess').focus();

    } catch (error) {
        console.error('Failed to load quote:', error);
        puzzle.textContent =
            'Could not load DELTARUNE.txt. Check the file path and server.';
    }
}


// Update score, high score and hint counter
function updateCounters() {
    document.getElementById('score').textContent = score;
    document.getElementById('highscore').textContent = highscore;
    document.getElementById('hintCount').textContent = hintCount;
}


// Check the player's guess
function checkGuess() {
    if (answered) return;

    const guess = document.getElementById('guess').value.trim();

    if (!guess) return;

    if (guess.toLowerCase() === answer.toLowerCase()) {
        score++;

        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
        }

        document.getElementById('feedback').textContent = 'ugh yes.';
        answered = true;

        // Reveal the complete quote
        document.getElementById('puzzle').textContent = line;

        document.getElementById('guess').disabled = true;
        document.getElementById('submit').disabled = true;
        document.getElementById('hint').disabled = true;

    } else {
        score = 0;

        document.getElementById('feedback').textContent =
            'NO LOSER!!! try again or something';
    }

    updateCounters();
}


// Reveal one random, previously hidden letter
function hint() {
    if (answered || revealed.size >= answer.length) return;

    // Find positions that have not been revealed yet
    const available = [];

    for (let i = 0; i < answer.length; i++) {
        if (!revealed.has(i)) {
            available.push(i);
        }
    }

    if (available.length === 0) return;

    const r = available[Math.floor(Math.random() * available.length)];

    revealed.add(r);
    hintCount++;

    const maskedWord = [...answer]
        .map((char, i) => revealed.has(i) ? char : 'X')
        .join('');

    document.getElementById('puzzle').textContent =
        line.slice(0, wordStart) +
        maskedWord +
        line.slice(wordStart + answer.length);

    updateCounters();

    // Disable hints once every letter is revealed
    if (revealed.size >= answer.length) {
        document.getElementById('hint').disabled = true;
    }
}


// Reset the game
function resetGame() {
    score = 0;
    updateCounters();
    getline();
}


// Event listeners
document.getElementById('submit').addEventListener('click', checkGuess);

document.getElementById('guess').addEventListener('keydown', event => {
    if (event.key === 'Enter') checkGuess();
});

document.getElementById('reset').addEventListener('click', resetGame);
document.getElementById('hint').addEventListener('click', hint);


// Initialise the game
updateCounters();
getline();
