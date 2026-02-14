/* --- KONFIGURACJA DATY --- */
const startDate = new Date("2026-01-01T17:00:00");

/* --- SILNIK 3D PARTICLE HEART (RED) --- */
const canvas = document.getElementById("heart-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
const isMobile = window.innerWidth < 768;
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
    this.x = (Math.random() - 0.5) * width * 3;
    this.y = (Math.random() - 0.5) * height * 3;
    this.z = (Math.random() - 0.5) * 1000;
    
    const baseScale = Math.min(width, height);
    const scale = isMobile ? (baseScale / 16) : (baseScale / 28);
    
    const t = Math.random() * Math.PI * 2; 
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    
    this.tx = hx * scale;
    this.ty = hy * scale;
    this.tz = (Math.random() - 0.5) * 100 * (scale / 10);

    this.delay = Math.random() * 100;
    this.accel = Math.random() * 0.02 + 0.005; 
    this.size = Math.random() * 1.5 + 0.2; 
    
    const reds = ["#ff0033", "#ff6699", "#ffffff", "#ff3366", "#cc0000"];
    this.color = reds[Math.floor(Math.random() * reds.length)];
  }

  update() {
    if (this.delay > 0) {
        this.delay -= 1;
        this.x += (Math.random() - 0.5) * 2;
        this.y += (Math.random() - 0.5) * 2;
    } else {
        this.x += (this.tx - this.x) * this.accel;
        this.y += (this.ty - this.y) * this.accel;
        this.z += (this.tz - this.z) * this.accel;
    }

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
  gradient.addColorStop(0, "rgba(255, 0, 50, 0.2)");
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
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  ctx.fillRect(0, 0, width, height);
  drawReflection();
  ctx.globalCompositeOperation = 'lighter'; 
  angle += 0.005; 
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

/* --- LOGIKA STRONY --- */
const introOverlay = document.getElementById('intro-overlay');
const mainContent = document.getElementById('main-content');
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isMusicPlaying = false;

// INTRO CLICK
introOverlay.addEventListener('click', () => {
  particles.forEach(p => {
    p.accel = 0.3;
    p.tx = (Math.random() - 0.5) * 5000;
    p.ty = (Math.random() - 0.5) * 5000;
  });

  audio.volume = 0.5;
  audio.play().then(() => {
    isMusicPlaying = true;
    musicBtn.innerText = "⏸️ Pauza";
  }).catch(e => console.log(e));

  introOverlay.style.opacity = 0;
  setTimeout(() => {
    introOverlay.style.display = 'none';
    mainContent.classList.add('visible');
    document.body.classList.remove('locked');
    runSiteLogic();
  }, 1000);
});

function runSiteLogic() {
  const reveals = document.querySelectorAll(".reveal");
  const checkReveal = () => {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) 
        el.classList.add("active");
    });
  };
  window.addEventListener("scroll", checkReveal);
  checkReveal();

  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  setInterval(() => {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
  }, 1000);

  // OBSŁUGA PREZENTU
  const surpBtn = document.getElementById('surpriseBtn');
  const hiddenMsg = document.getElementById('hiddenMessage');
  if(surpBtn) {
    surpBtn.addEventListener('click', () => {
      for(let i=0; i<30; i++) createConfetti();
      hiddenMsg.style.display = 'block';
      surpBtn.style.display = 'none';
      // Usuń też tekst zachęcający "Kliknij jak się odważysz" jeśli jest rodzeństwem
      if(surpBtn.nextElementSibling && surpBtn.nextElementSibling.tagName === 'P') {
        surpBtn.nextElementSibling.style.display = 'none';
      }
    });
  }

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
  if(isMusicPlaying) { audio.pause(); musicBtn.innerText="🎵 Włącz muzykę"; }
  else { audio.play(); musicBtn.innerText="⏸️ Pauza"; }
  isMusicPlaying = !isMusicPlaying;
});

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("history-start").scrollIntoView({ behavior: "smooth" });
});
