import './style.css';
import './terminal.js';

let music;
let hasInteracted = false;

function initializeMusic() {
  music = new Audio('../Music.mp3');
  music.loop = true;
  music.play().catch(error => {
    console.log("Auto-play was prevented. Please use the play button.");
  });
}

function toggleMusic() {
  if (!music) {
    initializeMusic();
  } else if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}


window.addEventListener('click', initializeMusic);

document.querySelector('.music-toggle').addEventListener('click', toggleMusic);

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