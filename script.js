/*var constraints = { video: true };
var video = document.querySelector('video');
navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.srcObject = stream;
});*/

const wordE1 = document.getElementById('word');
const wrongLettersE1 = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll(".figure-part");

const words = ['cinderella', 'moana', 'mulan', 'ariel', 'tiana', 'belle', 'merida', 'elsa', 'aurora', 'scoobydoo', 'shrek', 'dory', 'nemo', 'mickey', 'simba', 'nala', 'goofy'];

let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

function displayWord() {
    wordE1.innerHTML = `
    ${selectedWord
            .split('')
            .map(
                letter => `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ''}
        </span>
        `
            )
            .join('')}
    `;

    const innerWord = wordE1.innerText.replace(/\n/g, '');

    if (innerWord === selectedWord) {
        finalMessage.innerText = 'You won';
        popup.style.display = 'flex';
    }
}
function addLetter() {
    const letterInput = document.getElementById('letter-input');
    const letter = letterInput.value.toLowerCase(); // Get the letter in lowercase

    if (letter && letter.match(/[a-z]/i)) { // Check if a valid letter was entered
        if (selectedWord.includes(letter)) {
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);
                updateDisplayWord();
            } else {
                showNotification();
            }
        } else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLetterE1();
            } else {
                showNotification();
            }
        }
        letterInput.value = ''; // Clear the input box
    }
}
function cancelLetter() {
    const letterInput = document.getElementById('letter-input');
    letterInput.value = ''; // Clear the input box
}
function updateWrongLetterE1() {
    wrongLettersE1.innerHTML = `
    ${wrongLetters.length > 0 ? 'Wrong:' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
    `;

    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if (index < errors) {
            part.style.display = 'block'
        }
        else {
            part.style.display = 'none';
        }
    });

    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = 'You lost';
        popup.style.display = 'flex';
    }
}

function showNotification() {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

window.addEventListener('keydown', e => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key;

        if (selectedWord.includes(letter)) {
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);

                displayWord();
            } else {
                showNotification();
            }
        } else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);

                updateWrongLetterE1();
            } else {
                showNotification();
            }
        }
    }
});

playAgainBtn.addEventListener('click', () => {
    correctLetters.splice(0);
    wrongLetters.splice(0);

    selectedWord = words[Math.floor(Math.random() * words.length)];

    displayWord();
    updateWrongLetterE1();

    popup.style.display = 'none';
});

displayWord();

