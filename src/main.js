import './style.css';
import './terminal.js';


let music;

function initializeMusic() {
    music = new Audio('../Music.mp3');
    music.loop = true;
    music.play().catch(error => {
        console.log("Auto-play was prevented. Please use the play button.");
    });
}

window.addEventListener('load', () => {
    initializeMusic();
    // Scroll to the top of the page when the window loads
    window.scrollTo(0, 0);
});

function toggleMusic() {
    if (!music) {
        initializeMusic();
    } else if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}
window.addEventListener('load', initializeMusic);

document.querySelector('.music-toggle').addEventListener('click', toggleMusic);

document.getElementById('music-message').addEventListener('click', initializeMusic);

let typewriterIndex = 0;
const typewriterText = document.getElementById('typewriter-text');
const typewriterSentences = [
    "I'm a passionate programmer and creator.",
    "I build innovative tech solutions.",
    "Let's collaborate on amazing projects."
];

function typeWriter() {
    let sentence = typewriterSentences[typewriterIndex];
    typewriterText.innerHTML = "";
    let charIndex = 0;

    function type() {
        if (charIndex < sentence.length) {
            typewriterText.innerHTML += sentence.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                typewriterIndex = (typewriterIndex + 1) % typewriterSentences.length;
                typeWriter(); // Call typeWriter again for the next sentence
            }, 2000);
        }
    }

    type();
}

typeWriter();