import youtubePlayer from 'youtube-player';
import './style.css';
import './terminal.js';

let player;
let isMusicPlaying = false;
const videoId = '47dtFZ8CFo8';

function initializeYouTubePlayer() {
    player = youtubePlayer('music-player', {
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: videoId,
        }
    });

    player.on('stateChange', onPlayerStateChange);
    player.on('ready', onPlayerReady);
}

function onPlayerReady() {
    player.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data === window.YT.PlayerState.PLAYING) {
        isMusicPlaying = true;
    } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
        isMusicPlaying = false;
    }
    updateMusicButtonIcon();
}

function toggleMusic() {
    if (isMusicPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function updateMusicButtonIcon() {
    const musicButton = document.getElementById('music-button');
    const musicIcon = musicButton.querySelector('i');

    if (isMusicPlaying) {
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-pause');
    } else {
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-music');
    }
}

document.getElementById('music-button').addEventListener('click', toggleMusic);

// Initialize the YouTube player
initializeYouTubePlayer();

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
