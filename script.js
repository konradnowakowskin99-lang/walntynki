/* --- KONFIGURACJA --- */
const startDate = new Date(2022, 1, 14); 

/* --- SILNIK 3D PARTICLE HEART (CHAOS TO ORDER) --- */
const canvas = document.getElementById("heart-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
const isMobile = window.innerWidth < 768;
// DUŻO drobnych cząsteczek dla efektu gwiezdnego pyłu
const particleCount = isMobile ? 1200 : 2500; 
let angle = 0;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    // START W CHAOSIE (Losowe punkty daleko poza ekranem lub rozrzucone)
    this.x = (Math.random() - 0.5) * width * 3;
    this.y = (Math.random() - 0.5) * height * 3;
    this.z = (Math.random() - 0.5) * 1000;
    
    // CEL (SERCE)
    const baseScale = Math.min(width, height);
    const scale = isMobile ? (baseScale / 16) : (baseScale / 28);
    
    const t = Math.random() * Math.PI * 2; 
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    
    this.tx = hx * scale;
    this.ty = hy * scale;
    this.tz = (Math.random() - 0.5) * 100 * (scale / 10);

    // Timing (każda cząsteczka startuje w innym momencie)
    this.delay = Math.random() * 100; // Opóźnienie startu lotu
    this.accel = Math.random() * 0.02 + 0.005; // Prędkość dolotu
    
    this.size = Math.random() * 1.5 + 0.2; // Bardzo drobne
    
    const blues = ["#ffffff", "#00ccff", "#0066ff", "#002244", "#00ffff"];
    this.color = blues[Math.floor(Math.random() * blues.length)];
  }

  update() {
    // "Harmider" zamieniający się w porządek
    // Cząsteczka zaczyna lecieć do celu dopiero po upływie swojego delay
    if (this.delay > 0) {
        this.delay -= 1;
        // W fazie chaosu lekko się poruszają
        this.x += (Math.random() - 0.5) * 2;
        this.y += (Math.random() - 0.5) * 2;
    } else {
        // Lot do celu z efektem poświaty (płynne hamowanie)
        this.x += (this.tx - this.x) * this.accel;
        this.y += (this.ty - this.y) * this.accel;
        this.z += (this.tz - this.z) * this.accel;
    }

    // Delikatne pulsowanie, gdy już są na miejscu
    if (Math.abs(this.tx - this.x) < 5) {
      this.x += Math.sin(Date.now() * 0.001 + this.tx) * 0.2;
      this.y += Math.cos(Date.now() * 0.001 + this.ty) * 0.2;
    }
  }

  draw() {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rx = this.x * cos - this.z * sin;
    const rz = this.x * sin + this.z * cos;
    
    const fl = isMobile ? 300 : 450; 
    const scale = fl / (fl + rz + 500); 
    
    const x2d = rx * scale + width / 2;
    const y2d = this.y * scale + height / 2 - (isMobile ? 20 : 50); 

    if (scale > 0.1) {
      ctx.beginPath();
      ctx.arc(x2d, y2d, this.size * scale, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function drawReflection() {
  const reflectSize = isMobile ? 250 : 450;
  const gradient = ctx.createRadialGradient(
    width / 2, height - 50, 10,
    width / 2, height - 50, reflectSize
  );
  gradient.addColorStop(0, "rgba(0, 204, 255, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.save();
  ctx.translate(0, height - 20);
  ctx.scale(1, 0.15); 
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(width/2, 0, reflectSize, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function animate() {
  // KLUCZ DO POŚWIATY (SMUG): Nie czyścimy całego ekranu, 
  // tylko nakładamy bardzo przezroczystą warstwę czerni
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)"; // Im mniejsza liczba, tym dłuższe smugi
  ctx.fillRect(0, 0, width, height);

  drawReflection();

  // Tryb 'lighter' sprawia, że drobinki świecą, gdy się nakładają
  ctx.globalCompositeOperation = 'lighter';

  angle += 0.005; 
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  requestAnimationFrame(animate);
}
animate();

/* --- PRZEJŚCIE --- */
const introOverlay = document.getElementById('intro-overlay');
const mainContent = document.getElementById('main-content');
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

introOverlay.addEventListener('click', () => {
  particles.forEach(p => {
    p.accel = 0.3; // Wybuch przy kliknięciu
    p.tx = (Math.random() - 0.5) * 5000;
    p.ty = (Math.random() - 0.5) * 5000;
  });

  audio.volume = 0.5;
  audio.play().then(() => {
    isPlaying = true;
    musicBtn.innerText = "⏸️ Pauza";
  }).catch(() => {});

  introOverlay.style.opacity = 0;
  setTimeout(() => {
    introOverlay.style.display = 'none';
    mainContent.classList.add('visible');
    document.body.classList.remove('locked');
    runSiteLogic();
  }, 1000);
});

function runSiteLogic() {
  const diff = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
  document.getElementById("days").innerText = diff;

  const reveals = document.querySelectorAll(".reveal");
  const checkReveal = () => {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) 
        el.classList.add("active");
    });
  };
  window.addEventListener("scroll", checkReveal);
  checkReveal();

  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  if(noBtn && yesBtn) {
    const moveBtn = () => {
      noBtn.style.position = 'fixed';
      noBtn.style.left = Math.random()*(window.innerWidth-100)+'px';
      noBtn.style.top = Math.random()*(window.innerHeight-50)+'px';
    };
    noBtn.addEventListener('mouseover', moveBtn);
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveBtn(); });
    yesBtn.addEventListener('click', () => {
      for(let i=0;i<50;i++) createConfetti();
      setTimeout(()=>alert("Wiedziałem! ❤️"),300);
    });
  }
}

function createConfetti() {
  const h = document.createElement('div');
  h.innerText = Math.random()>0.5?'❤️':'🌹';
  h.style.position='fixed'; h.style.left=Math.random()*100+'vw'; h.style.top='-10vh';
  h.style.fontSize='1.5rem'; h.style.transition='3s linear'; h.style.zIndex='9999';
  document.body.appendChild(h);
  setTimeout(()=>{ h.style.transform=`translateY(110vh) rotate(360deg)`; h.style.opacity=0; },100);
  setTimeout(()=>h.remove(), 3000);
}

musicBtn.addEventListener('click', () => {
  if(isPlaying) { audio.pause(); musicBtn.innerText="🎵 Muzyka"; }
  else { audio.play(); musicBtn.innerText="⏸️ Pauza"; }
  isPlaying = !isPlaying;
});

document.getElementById("startBtn").addEventListener("click", () => {
  document.querySelector(".timeline").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener('click', (e) => {
  if(document.getElementById('intro-overlay').style.display === 'none') {
    if(e.target.tagName !== 'BUTTON') {
      const h = document.createElement('div');
      h.innerText = '💙';
      h.style.position = 'absolute';
      h.style.left = e.pageX + 'px'; h.style.top = e.pageY + 'px';
      h.style.pointerEvents = 'none';
      h.style.fontSize = '1.5rem';
      h.style.animation = 'floatUp 1s forwards';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1000);
    }
  }
});
