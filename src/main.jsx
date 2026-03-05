import './style.css';

// Typewriter Effect
const typewriter = document.getElementById('typewriter');
const text = "Your are the best one of my life… Happy Birthday ❤️";
let i = 0;

function type() {
  if (i < text.length) {
    typewriter.innerHTML += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}

// Interactive Cake (Image-based Splitting Effect)
const cakeContainer = document.getElementById('cake-container');
cakeContainer.addEventListener('click', () => {
  if (!cakeContainer.classList.contains('sliced')) {
    cakeContainer.classList.add('sliced');

    // Confetti Explosion
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffb6c1', '#ff69b4', '#fff0f5', '#ffd700']
    });

    // Heart Explosion
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        shapes: ['square'],
        colors: ['#ff69b4']
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        shapes: ['square'],
        colors: ['#ffb6c1']
      }));
    }, 250);
  }
});

// Floating Birthday Wishes
const wishesContainer = document.getElementById('wishes-container');
const wishes = [
  "Happy Birthday 💖",
  "Happhy birthday piggy🐷🐽",
  "❤️",
  "Happy 20 🎂",
  "Stay Blessed",
];

function createFloatingWish() {
  const wish = document.createElement('div');
  wish.className = 'floating-wish';
  wish.innerText = wishes[Math.floor(Math.random() * wishes.length)];

  const left = Math.random() * 100;
  const duration = 6 + Math.random() * 6; // Increased speed (lower duration)
  const drift = (Math.random() - 0.5) * 400; // Increased spread

  wish.style.left = `${left}%`;
  wish.style.setProperty('--duration', `${duration}s`);
  wish.style.setProperty('--drift', `${drift}px`);

  wishesContainer.appendChild(wish);

  setTimeout(() => {
    wish.remove();
  }, duration * 1000);
}

setInterval(createFloatingWish, 800); // Higher frequency

// Floating Balloons
function createBalloon() {
  const balloon = document.createElement('div');
  const types = ['pink', 'red', 'blue', 'yellow', 'purple'];
  const type = types[Math.floor(Math.random() * types.length)];
  balloon.className = `balloon ${type}`;

  const left = Math.random() * 100;
  const duration = 6 + Math.random() * 8; // Faster float up
  const drift = (Math.random() - 0.5) * 400; // More drift
  const size = 30 + Math.random() * 50; // Increased max size

  balloon.style.left = `${left}%`;
  balloon.style.width = `${size}px`;
  balloon.style.height = `${size * 1.2}px`;
  balloon.style.setProperty('--duration', `${duration}s`);
  balloon.style.setProperty('--drift', `${drift}px`);

  document.querySelector('.background-container').appendChild(balloon);

  setTimeout(() => {
    balloon.remove();
  }, duration * 1000);
}

setInterval(createBalloon, 400); // Increased frequency from 600ms

// Music Control
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const musicStatus = musicBtn.querySelector('.music-status');

musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicStatus.innerText = "ON";
    musicBtn.classList.add('playing');
  } else {
    bgMusic.pause();
    musicStatus.innerText = "OFF";
    musicBtn.classList.remove('playing');
  }
});

// Bunting initialization
function initBunting() {
  const buntingColors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#9b59b6', '#ff9f43', '#ff9ff3'];
  const rows = document.querySelectorAll('.bunting-row');

  rows.forEach((row, rowIndex) => {
    const flagCount = Math.floor(window.innerWidth / 25);
    for (let i = 0; i < flagCount; i++) {
      const flag = document.createElement('div');
      flag.className = 'flag';
      flag.style.backgroundColor = buntingColors[(i + rowIndex) % buntingColors.length];
      flag.style.setProperty('--duration', `${2 + Math.random() * 2}s`);
      flag.style.animationDelay = `${Math.random() * -2}s`;
      row.appendChild(flag);
    }
  });
}

// Streamers and Confetti initialization
function initStreamers() {
  const container = document.querySelector('.streamer-container');
  const colors = ['#ff4d4d', '#4d94ff', '#4dff4d', '#ffff4d', '#ff944d', '#944dff'];

  // Create Streamers
  for (let i = 0; i < 15; i++) {
    const streamer = document.createElement('div');
    streamer.className = 'streamer';
    const color = colors[i % colors.length];
    const left = Math.random() * 100;
    const height = 100 + Math.random() * 300;
    const duration = 3 + Math.random() * 3;

    streamer.style.left = `${left}%`;
    streamer.style.height = `${height}px`;
    streamer.style.backgroundColor = color;
    // Add spiral effect via gradient
    streamer.style.backgroundImage = `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)`;
    streamer.style.setProperty('--duration', `${duration}s`);
    streamer.style.animationDelay = `${Math.random() * -5}s`;

    container.appendChild(streamer);
  }

  // Create Confetti
  for (let i = 0; i < 60; i++) {
    const bit = document.createElement('div');
    bit.className = 'confetti-bit';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 6;
    const drift = (Math.random() - 0.5) * 400;

    bit.style.left = `${left}%`;
    bit.style.backgroundColor = color;
    bit.style.setProperty('--duration', `${duration}s`);
    bit.style.setProperty('--drift', `${drift}px`);
    bit.style.animationDelay = `${Math.random() * -10}s`;

    // Random shapes
    if (Math.random() > 0.5) {
      bit.style.borderRadius = '50%';
    }

    container.appendChild(bit);
  }
}

// Initializations
initBunting();
initStreamers();
type();
// Initial balloons burst
for (let i = 0; i < 20; i++) {
  setTimeout(createBalloon, i * 150);
}
for (let i = 0; i < 5; i++) {
  setTimeout(createFloatingWish, i * 500);
}
