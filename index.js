const board = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const player2Label = document.getElementById('player2Label');

let cards = [], firstCard = null, secondCard = null, lock = false;
let matched = 0, timer, timeLeft;
let currentPlayer = 1;
let playerMoves = [0, 0];
let playerPairs = [0, 0];

document.getElementById('players').addEventListener('change', (e) => {
    player2Label.style.display = e.target.value === '2' ? 'inline' : 'none';
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetSettings() {
    document.getElementById('players').value = '1';
    document.getElementById('player1').value = 'Гравець 1';
    document.getElementById('player2').value = 'Гравець 2';
    document.getElementById('rows').value = 4;
    document.getElementById('cols').value = 4;
    document.getElementById('difficulty').value = 'easy';
    document.getElementById('rounds').value = 1;
    player2Label.style.display = 'none';
}

function startGame() {
    const rows = +document.getElementById('rows').value;
    const cols = +document.getElementById('cols').value;
    const size = rows * cols;

    if (size % 2 !== 0) {
        alert("Поле повинно містити парну кількість карток.");
        return;
    }

    currentPlayer = 1;
    playerMoves = [0, 0];
    playerPairs = [0, 0];

    document.getElementById('gameStatus').style.display = 'block';
    document.getElementById('player1Stats').style.display = 'block';
    document.getElementById('player2Stats').style.display = document.getElementById('players').value === '2' ? 'block' : 'none';

    updateCurrentPlayer();
    updatePlayerStats();

    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
    board.style.gridTemplateRows = `repeat(${rows}, 80px)`;

    const values = [];
    for (let i = 0; i < size / 2; i++) {
        const val = String.fromCharCode(65 + (i % 26));
        values.push(val, val);
    }
    shuffle(values);

    cards = [];
    matched = 0;
    firstCard = null;
    secondCard = null;
    lock = false;

    values.forEach((val) => {
        const card = document.createElement('div');
        card.classList.add('card', 'hidden');
        card.dataset.value = val;
        card.textContent = val;
        card.addEventListener('click', () => flipCard(card));
        cards.push(card);
        board.appendChild(card);
    });

    clearInterval(timer);
    const difficulty = document.getElementById('difficulty').value;
    timeLeft = difficulty === 'easy' ? 180 : difficulty === 'normal' ? 120 : 60;
    timerDisplay.textContent = `Залишилось: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Залишилось: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Час вичерпано!");
        }
    }, 1000);
}

function flipCard(card) {
    if (lock || card.classList.contains('matched') || !card.classList.contains('hidden')) return;

    card.classList.remove('hidden');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lock = true;
    playerMoves[currentPlayer - 1]++;
    updatePlayerStats();

    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matched += 2;
        playerPairs[currentPlayer - 1]++;
        updatePlayerStats();
        resetFlips();
        if (matched === cards.length) {
            clearInterval(timer);
            alert("Гру завершено!");
        }
    } else {
        setTimeout(() => {
            firstCard.classList.add('hidden');
            secondCard.classList.add('hidden');
            resetFlips();
            if (document.getElementById('players').value === '2') {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                updateCurrentPlayer();
            }
        }, 1000);
    }
}

function resetFlips() {
    [firstCard, secondCard] = [null, null];
    lock = false;
}

function updateCurrentPlayer() {
    const name = currentPlayer === 1 ? document.getElementById('player1').value : document.getElementById('player2').value;
    document.getElementById('currentPlayer').textContent = `Хід: ${name}`;
}

function updatePlayerStats() {
    const name1 = document.getElementById('player1').value;
    const name2 = document.getElementById('player2').value;
    document.getElementById('player1Stats').textContent = `${name1}: Ходи ${playerMoves[0]}, Пари ${playerPairs[0]}`;
    document.getElementById('player2Stats').textContent = `${name2}: Ходи ${playerMoves[1]}, Пари ${playerPairs[1]}`;
}