
let score = 0;
let answer = "";
let answered = false;



async function getline() {
    const puzzle = document.getElementById('puzzle');
    puzzle.textContent = 'Loading quote...';

    try {
        const txt = await $.get('./DELTARUNE.txt');

        const lines = txt.split(/\r?\n/).filter(line =>
            line.trim().split(/\s+/).length >= 2 &&
            /\b[a-zA-Z]{4,}\b/.test(line)
        );

        if (lines.length === 0) {
            puzzle.textContent = 'No suitable quotes found in the file.';
            return;
        }

        const line = lines[Math.floor(Math.random() * lines.length)];
        const words = [...line.matchAll(/\b[a-zA-Z]{4,}\b/g)];
        const word = words[Math.floor(Math.random() * words.length)];

        answer = word[0];
        answered = false;

        puzzle.textContent =
            line.slice(0, word.index) +
            'X'.repeat(answer.length) +
            line.slice(word.index + answer.length);

        document.getElementById('guess').value = '';
        document.getElementById('feedback').textContent = '';
        document.getElementById('guess').disabled = false;
        document.getElementById('submit').disabled = false;
        document.getElementById('guess').focus();

    } catch (error) {
        console.error('Failed to load quote:', error);
        puzzle.textContent =
            'Could not load DELTARUNE.txt. Check the file path and server.';
    }
}


function checkGuess() {
    if (answered) return;

    const guess = document.getElementById('guess').value.trim();

    if (!guess) return;

    if (guess.toLowerCase() === answer.toLowerCase()) {
        score++;
        document.getElementById('score').textContent = score;
        document.getElementById('feedback').textContent =
            'ugh yes.';
        answered = true;

        document.getElementById('guess').disabled = true;
        document.getElementById('submit').disabled = true;
    } else {
        document.getElementById('feedback').textContent =
            'NO LOSER!!! try again or something';
    }
}

document.getElementById('submit').addEventListener('click', checkGuess);

document.getElementById('guess').addEventListener('keydown', event => {
    if (event.key === 'Enter') checkGuess();
});

document.getElementById('reset').addEventListener('click', getline);

getline();
