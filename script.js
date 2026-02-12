/* --- KONFIGURACJA --- */
// WPISZ TU DATĘ ROZPOCZĘCIA ZWIĄZKU (Rok, Miesiąc-1, Dzień)
// Uwaga: Miesiące liczymy od 0 (Styczeń=0, Luty=1, ...)!
// Przykład dla 14 Lutego 2022:
const startDate = new Date(2022, 1, 14); 

/* --- LICZNIK DNI --- */
const today = new Date();
const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
document.getElementById("days").innerText = diff;

/* --- MUZYKA --- */
const musicBtn = document.getElementById('musicBtn');
const audio = document.getElementById('bgMusic');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    musicBtn.innerText = "🎵 Włącz naszą piosenkę";
  } else {
    audio.play().catch(e => alert("Kliknij stronę, aby odtworzyć muzykę!")); // Fix dla przeglądarek
    musicBtn.innerText = "⏸️ Pauza";
  }
  isPlaying = !isPlaying;
});

/* --- EFEKT KLIKNIĘCIA (SERDUSZKA) --- */
document.addEventListener('click', (e) => {
  // Nie twórz serca jeśli kliknięto w przycisk (żeby nie zasłaniać)
  if(e.target.tagName === 'BUTTON') return;

  const heart = document.createElement('div');
  heart.classList.add('click-heart');
  heart.innerText = '❤️';
  heart.style.left = (e.pageX - 10) + 'px';
  heart.style.top = (e.pageY - 10) + 'px';
  document.body.appendChild(heart);

  // Usuń po animacji
  setTimeout(() => heart.remove(), 1000);
});

/* --- SCROLL REVEAL (Pojawianie się elementów) --- */
const reveals = document.querySelectorAll(".reveal");

function checkReveal() {
  const triggerBottom = window.innerHeight * 0.85;
  reveals.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", checkReveal);
checkReveal(); // Uruchom raz na starcie

/* --- PARALLAX (Tło) --- */
const layers = document.querySelectorAll(".parallax");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  // Wyłącz parallax na telefonach dla wydajności
  if (window.innerWidth > 768) {
    layers.forEach(layer => {
      let speed = layer.classList.contains("bg") ? 0.2 : 0.4;
      layer.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }
});

/* --- SCROLL DO POCZĄTKU --- */
document.getElementById("startBtn").addEventListener("click", () => {
  document.querySelector(".timeline").scrollIntoView({ 
    behavior: "smooth" 
  });
});

/* --- WALENTYNKOWE PYTANIE (Uciekający przycisk) --- */
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');

// Przycisk "Nie" ucieka przed myszką/dotykiem
noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('touchstart', moveButton); // Dla telefonów

function moveButton() {
  const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20);
  const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20);
  
  noBtn.style.position = 'fixed'; // Zmiana na fixed, żeby uciekał po całym ekranie
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

// Reakcja na "Tak"
yesBtn.addEventListener('click', () => {
  // Proste konfetti z emotek
  for(let i=0; i<50; i++) {
    createConfetti();
  }
  setTimeout(() => alert("Wiedziałem! Kocham Cię! ❤️❤️❤️"), 200);
});

function createConfetti() {
  const heart = document.createElement('div');
  heart.innerText = Math.random() > 0.5 ? '❤️' : '🌹';
  heart.style.position = 'fixed';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.top = '-10vh';
  heart.style.fontSize = Math.random() * 2 + 1 + 'rem';
  heart.style.transition = 'transform 3s linear, opacity 3s';
  heart.style.zIndex = '9999';
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.style.transform = `translateY(110vh) rotate(${Math.random()*360}deg)`;
    heart.style.opacity = '0';
  }, 100);

  setTimeout(() => heart.remove(), 3000);
}
