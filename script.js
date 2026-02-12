/* --- KONFIGURACJA DATY --- */
const startDate = new Date(2022, 1, 14); // ROK, MIESIĄC (0=Styczeń, 1=Luty), DZIEŃ

/* --- PARTICLE HEART ANIMATION (Intro) --- */
const canvas = document.getElementById("heart-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
const particleCount = 400; // Ilość cząsteczek (zmniejsz jeśli telefon się zacina)

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Matematyczny wzór serca
function getHeartPoint(t) {
  const scale = Math.min(width, height) / 35; // Skala wielkości serca
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return {
    x: width / 2 + x * scale,
    y: height / 2 + y * scale
  };
}

class Particle {
  constructor() {
    this.respawn();
  }

  respawn() {
    // Losowa pozycja startowa (wybuch ze środka lub losowo z ekranu)
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    
    // Losowy cel na obwodzie serca
    const t = Math.random() * Math.PI * 2;
    const target = getHeartPoint(t);
    this.tx = target.x;
    this.ty = target.y;
    
    this.speed = Math.random() * 0.05 + 0.02; // Prędkość przyciągania
    this.size = Math.random() * 2 + 1;
    
    // Kolor cząsteczki: Czerwony/Różowy/Biały neon
    const colors = ["#ff3366", "#ff6699", "#ffffff", "#ff0000"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    // Ruch w stronę celu (lerp)
    this.x += (this.tx - this.x) * this.speed;
    this.y += (this.ty - this.y) * this.speed;
    
    // Efekt "drżenia" (żyjące serce)
    if (Math.abs(this.tx - this.x) < 5 && Math.abs(this.ty - this.y) < 5) {
      this.x += (Math.random() - 0.5) * 2;
      this.y += (Math.random() - 0.5) * 2;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Inicjalizacja cząsteczek
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  // Efekt smugi (lekko przezroczyste tło zamiast czyszczenia)
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* --- PRZEJŚCIE Z INTRO DO STRONY --- */
const introOverlay = document.getElementById('intro-overlay');
const mainContent = document.getElementById('main-content');
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isMusicPlaying = false;

// Kliknięcie w Intro uruchamia wszystko
introOverlay.addEventListener('click', () => {
  // 1. Fade out Intro
  introOverlay.style.opacity = '0';
  setTimeout(() => {
    introOverlay.style.display = 'none';
  }, 1500);

  // 2. Fade in Strony
  mainContent.classList.add('visible');
  
  // 3. Start Muzyki
  audio.volume = 0.5;
  audio.play().then(() => {
    isMusicPlaying = true;
    musicBtn.innerText = "⏸️ Pauza";
  }).catch(e => console.log("Audio block", e));

  // 4. Uruchom liczniki i animacje na stronie
  startSiteLogic();
});


/* --- LOGIKA STRONY GŁÓWNEJ --- */
function startSiteLogic() {
  // Licznik dni
  const today = new Date();
  const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  document.getElementById("days").innerText = diff;

  // Scroll Reveal
  const reveals = document.querySelectorAll(".reveal");
  window.addEventListener("scroll", () => {
    const triggerBottom = window.innerHeight * 0.85;
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < triggerBottom) el.classList.add("active");
    });
    
    // Parallax (tylko PC)
    if(window.innerWidth > 768) {
      document.querySelectorAll(".parallax").forEach(layer => {
        const speed = layer.classList.contains("bg") ? 0.2 : 0.4;
        layer.style.transform = `translateY(${window.scrollY * speed}px)`;
      });
    }
  });
}

// Obsługa przycisku muzyki na dole
musicBtn.addEventListener('click', () => {
  if (isMusicPlaying) {
    audio.pause();
    musicBtn.innerText = "🎵 Muzyka";
  } else {
    audio.play();
    musicBtn.innerText = "⏸️ Pauza";
  }
  isMusicPlaying = !isMusicPlaying;
});

// Scroll do sekcji historii
document.getElementById("startBtn").addEventListener("click", () => {
  document.querySelector(".timeline").scrollIntoView({ behavior: "smooth" });
});

// Efekt serduszek przy klikaniu (globalny)
document.addEventListener('click', (e) => {
  if(e.target.closest('#intro-overlay') || e.target.tagName === 'BUTTON') return;
  
  const heart = document.createElement('div');
  heart.innerText = '❤️';
  heart.className = 'click-heart';
  heart.style.left = (e.pageX - 10) + 'px';
  heart.style.top = (e.pageY - 10) + 'px';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1000);
});

// Pytanie Walentynkowe (Uciekający przycisk)
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');

if(noBtn && yesBtn) {
  const moveBtn = () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20);
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  };
  noBtn.addEventListener('mouseover', moveBtn);
  noBtn.addEventListener('touchstart', moveBtn);

  yesBtn.addEventListener('click', () => {
    // Konfetti
    for(let i=0; i<50; i++) {
      const h = document.createElement('div');
      h.innerText = Math.random()>0.5 ? '❤️':'🌹';
      h.style.position='fixed'; h.style.left=Math.random()*100+'vw'; h.style.top='-10vh';
      h.style.fontSize=Math.random()*2+1+'rem'; h.style.zIndex='9999';
      h.style.transition='3s';
      document.body.appendChild(h);
      setTimeout(()=> { h.style.transform=`translateY(110vh)`; h.style.opacity='0'; },100);
      setTimeout(()=> h.remove(), 3000);
    }
    setTimeout(() => alert("Wiedziałem! Kocham Cię! ❤️"), 500);
  });
}
