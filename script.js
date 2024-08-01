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
const guessButton = document.getElementById('guess');

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

guessButton.addEventListener('click', e => {

    let letter = document.getElementById('letter-container').innerText;
    console.log(selectedWord);
    console.log(letter);
    if (letter != '') {
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

