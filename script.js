/* --- KONFIGURACJA DATY --- */
// ZMIEŃ TUTAJ: Rok, Miesiąc (0=Styczeń, 1=Luty...), Dzień
const startDate = new Date(2022, 1, 14); 

/* --- 1. SILNIK 3D PARTICLE HEART (BLUE NEON) --- */
const canvas = document.getElementById("heart-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
const particleCount = 600; // Ilość kropek (zmniejsz do 300, jeśli telefon tnie)
let angle = 0; // Kąt obrotu serca

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Klasa cząsteczki 3D
class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    // Pozycja w 3D (x, y, z)
    // Cząsteczki startują "z podłogi" (dół ekranu) lub losowo przy starcie
    this.x = (Math.random() - 0.5) * width;
    this.y = initial ? (Math.random() - 0.5) * height : height + Math.random() * 100;
    this.z = (Math.random() - 0.5) * 500;
    
    // Docelowa pozycja w kształcie serca 3D
    // Matematyczny wzór serca parametrycznego
    const t = Math.random() * Math.PI * 2; 
    const scale = Math.min(width, height) / 45; // Skala wielkości serca

    // x = 16sin^3(t)
    // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    
    this.tx = hx * scale;
    this.ty = hy * scale;
    this.tz = (Math.random() - 0.5) * 150 * (scale / 10); // Głębokość serca

    this.speed = Math.random() * 0.04 + 0.015;
    this.size = Math.random() * 2 + 0.5;
    
    // Kolory: Błękit, Biały, Ciemny Niebieski (paleta z filmu)
    const blues = ["#ffffff", "#00ccff", "#0066ff", "#001133"];
    this.color = blues[Math.floor(Math.random() * blues.length)];
  }

  update() {
    // Ruch cząsteczki w stronę celu (tx, ty, tz)
    this.x += (this.tx - this.x) * this.speed;
    this.y += (this.ty - this.y) * this.speed;
    this.z += (this.tz - this.z) * this.speed;

    // Losowe drganie (iskrzenie)
    if (Math.abs(this.tx - this.x) < 20) {
      this.x += (Math.random() - 0.5) * 2;
      this.y += (Math.random() - 0.5) * 2;
      this.z += (Math.random() - 0.5) * 2;
    }
  }

  draw() {
    // Matematyka obrotu 3D
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Obrót wokół osi Y
    const rx = this.x * cos - this.z * sin;
    const rz = this.x * sin + this.z * cos;
    
    // Rzutowanie perspektywiczne (3D -> 2D)
    const fl = 400; // Ogniskowa kamery
    const scale = fl / (fl + rz + 500); // +500 odsuwa obiekt od kamery
    
    const x2d = rx * scale + width / 2;
    const y2d = this.y * scale + height / 2 - 60; // -60 podnosi serce wyżej

    if (scale > 0) { // Rysuj tylko to co jest przed kamerą
      ctx.beginPath();
      ctx.arc(x2d, y2d, this.size * scale, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

// Tworzymy cząsteczki
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Funkcja rysująca "kałużę" (odbicie na dole)
function drawReflection() {
  const gradient = ctx.createRadialGradient(
    width / 2, height - 100, 10,
    width / 2, height - 100, 300
  );
  gradient.addColorStop(0, "rgba(0, 204, 255, 0.4)");
  gradient.addColorStop(0.5, "rgba(0, 102, 255, 0.1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.save();
  ctx.translate(0, height - 50);
  ctx.scale(1, 0.2); // Spłaszcz koło
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(width/2, 0, 300, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function animate() {
  // Czyszczenie ekranu z efektem smugi (trail)
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, width, height);

  drawReflection();

  angle += 0.01; // Prędkość obrotu serca

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}
animate();

/* --- 2. LOGIKA PRZEJŚCIA I STRONY --- */
const introOverlay = document.getElementById('intro-overlay');
const mainContent = document.getElementById('main-content');
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

// Kliknięcie w Intro
introOverlay.addEventListener('click', () => {
  // Rozbij serce przy kliknięciu
  particles.forEach(p => {
    p.speed = 0.5;
    p.tx = (Math.random() - 0.5) * 5000;
    p.ty = (Math.random() - 0.5) * 5000;
  });

  // Włącz muzykę
  audio.volume = 0.5;
  audio.play().then(() => {
    isPlaying = true;
    musicBtn.innerText = "⏸️ Pauza";
  }).catch(e => console.log("Audio zablokowane", e));

  // Animacja znikania czarnego tła
  introOverlay.style.opacity = 0;
  
  setTimeout(() => {
    introOverlay.style.display = 'none'; // Usuń intro
    mainContent.classList.add('visible'); // Pokaż stronę
    runSiteLogic(); // Uruchom resztę skryptów
  }, 1200);
});

/* --- 3. RESZTA FUNKCJI STRONY --- */
function runSiteLogic() {
  
  // A) Licznik Dni
  const today = new Date();
  const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  document.getElementById("days").innerText = diff;

  // B) Scroll Reveal (Pojawianie się elementów)
  const reveals = document.querySelectorAll(".reveal");
  function checkReveal() {
    const triggerBottom = window.innerHeight * 0.85;
    reveals.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) el.classList.add("active");
    });
  }
  window.addEventListener("scroll", checkReveal);
  checkReveal();

  // C) Parallax (Efekt tła)
  window.addEventListener("scroll", () => {
    if (window.innerWidth > 768) {
      const scrollY = window.scrollY;
      document.querySelectorAll(".parallax").forEach(layer => {
        let speed = layer.classList.contains("bg") ? 0.2 : 0.4;
        layer.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  });

  // D) Uciekający przycisk "Nie"
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  if(noBtn) {
    const moveBtn = () => {
      const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20);
      const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20);
      noBtn.style.position = 'fixed';
      noBtn.style.left = `${x}px`;
      noBtn.style.top = `${y}px`;
    };
    noBtn.addEventListener('mouseover', moveBtn);
    noBtn.addEventListener('touchstart', moveBtn);

    // Reakcja na "Tak"
    yesBtn.addEventListener('click', () => {
      // Konfetti
      for(let i=0; i<50; i++) createConfetti();
      setTimeout(() => alert("Wiedziałem! Kocham Cię! ❤️❤️❤️"), 300);
    });
  }
}

// Funkcja Konfetti
function createConfetti() {
  const h = document.createElement('div');
  h.innerText = Math.random()>0.5 ? '❤️' : '🌹';
  h.style.position='fixed'; h.style.left=Math.random()*100+'vw'; h.style.top='-10vh';
  h.style.fontSize=Math.random()*2+1+'rem'; h.style.zIndex='9999';
  h.style.transition='transform 3s linear, opacity 3s';
  document.body.appendChild(h);
  setTimeout(()=> { h.style.transform=`translateY(110vh) rotate(${Math.random()*360}deg)`; h.style.opacity='0'; },100);
  setTimeout(()=> h.remove(), 3000);
}

// Obsługa przycisku muzyki (dół strony)
musicBtn.addEventListener('click', () => {
  if(isPlaying) { audio.pause(); musicBtn.innerText="🎵 Muzyka"; }
  else { audio.play(); musicBtn.innerText="⏸️ Pauza"; }
  isPlaying = !isPlaying;
});

// Scroll do początku historii
document.getElementById("startBtn").addEventListener("click", () => {
  document.querySelector(".timeline").scrollIntoView({ behavior: "smooth" });
});

// Efekt serc przy klikaniu (Nie działa na intro, żeby nie psuć efektu)
document.addEventListener('click', (e) => {
  if(e.target.closest('#intro-overlay') || e.target.tagName === 'BUTTON') return;
  const h = document.createElement('div');
  h.className = 'click-heart'; 
  h.innerText = '💙'; // Niebieskie serce (pasuje do motywu)
  h.style.position = 'absolute';
  h.style.left = (e.pageX - 10) + 'px'; 
  h.style.top = (e.pageY - 10) + 'px';
  h.style.animation = 'flyUp 1s ease-out forwards';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1000);
});
