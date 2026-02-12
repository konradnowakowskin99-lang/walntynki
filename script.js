/* --- KONFIGURACJA DATY --- */
const startDate = new Date(2022, 1, 14); // Zmień na swoją datę

/* --- SILNIK 3D BIG BLUE HEART --- */
const canvas = document.getElementById("heart-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
// ZWIĘKSZONA ILOŚĆ DLA LEPSZEGO EFEKTU
const particleCount = 1500; 
let angle = 0;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// KLASA CZĄSTECZKI 3D
class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = (Math.random() - 0.5) * width;
    // Startują niżej lub rozproszone, ale wolniej
    this.y = initial ? (Math.random() - 0.5) * height : height + Math.random() * 200;
    this.z = (Math.random() - 0.5) * 500;
    
    // ZWIĘKSZONA SKALA SERCA (/25 zamiast /45 - dużo większe!)
    const scale = Math.min(width, height) / 25; 
    
    const t = Math.random() * Math.PI * 2; 
    
    // Wzór serca
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    
    this.tx = hx * scale;
    this.ty = hy * scale;
    this.tz = (Math.random() - 0.5) * 150 * (scale / 10); // Większa głębia

    // SPOWOLNIONE PRZYCIĄGANIE (Slower animation)
    // Wcześniej było 0.04, teraz jest max 0.015 - bardzo powolne "składanie się"
    this.speed = Math.random() * 0.01 + 0.005; 
    
    this.size = Math.random() * 2.5 + 0.5;
    
    // KOLORY NIEBIESKIE/BIAŁE
    const blues = ["#ffffff", "#00ccff", "#0066ff", "#002244"];
    this.color = blues[Math.floor(Math.random() * blues.length)];
  }

  update() {
    this.x += (this.tx - this.x) * this.speed;
    this.y += (this.ty - this.y) * this.speed;
    this.z += (this.tz - this.z) * this.speed;

    // Delikatne migotanie na miejscu
    if (Math.abs(this.tx - this.x) < 20) {
      this.x += (Math.random() - 0.5) * 1.5;
      this.y += (Math.random() - 0.5) * 1.5;
      this.z += (Math.random() - 0.5) * 1.5;
    }
  }

  draw() {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Obrót 3D
    const rx = this.x * cos - this.z * sin;
    const rz = this.x * sin + this.z * cos;
    
    // Perspektywa
    const fl = 400; 
    const scale = fl / (fl + rz + 500); 
    
    const x2d = rx * scale + width / 2;
    // Wyśrodkowanie w pionie - podniesienie trochę wyżej
    const y2d = this.y * scale + height / 2 - 50; 

    if (scale > 0) {
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
  // Niebieska poświata na dole (Podłoga)
  const gradient = ctx.createRadialGradient(
    width / 2, height - 50, 10,
    width / 2, height - 50, 400 // Większy promień bo serce większe
  );
  gradient.addColorStop(0, "rgba(0, 204, 255, 0.3)");
  gradient.addColorStop(0.5, "rgba(0, 102, 255, 0.1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.save();
  ctx.translate(0, height - 20);
  ctx.scale(1, 0.15); 
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(width/2, 0, 400, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, width, height);

  drawReflection();

  // SPOWOLNIONY OBRÓT (0.003 zamiast 0.01)
  angle += 0.003; 

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}
animate();

/* --- LOGIKA STRONY --- */
const introOverlay = document.getElementById('intro-overlay');
const mainContent = document.getElementById('main-content');
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

introOverlay.addEventListener('click', () => {
  // Rozbicie serca
  particles.forEach(p => {
    p.speed = 0.5;
    p.tx = (Math.random() - 0.5) * 5000;
    p.ty = (Math.random() - 0.5) * 5000;
  });

  audio.volume = 0.5;
  audio.play().then(() => {
    isPlaying = true;
    musicBtn.innerText = "⏸️ Pauza";
  }).catch(e => console.log(e));

  introOverlay.style.opacity = 0;
  
  setTimeout(() => {
    introOverlay.style.display = 'none';
    mainContent.classList.add('visible');
    runSiteLogic();
  }, 1500); // Troszkę dłuższe zanikanie
});

function runSiteLogic() {
  const diff = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
  document.getElementById("days").innerText = diff;

  const reveals = document.querySelectorAll(".reveal");
  window.addEventListener("scroll", () => {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) 
        el.classList.add("active");
    });
  });

  // Uciekający przycisk
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  if(noBtn && yesBtn) {
    const moveBtn = () => {
      noBtn.style.position = 'fixed';
      noBtn.style.left = Math.random()*(window.innerWidth-100)+'px';
      noBtn.style.top = Math.random()*(window.innerHeight-50)+'px';
    };
    noBtn.addEventListener('mouseover', moveBtn);
    noBtn.addEventListener('touchstart', moveBtn);
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
  h.style.fontSize=Math.random()*2+1+'rem'; h.style.transition='3s'; h.style.zIndex='9999';
  document.body.appendChild(h);
  setTimeout(()=>{ h.style.transform=`translateY(110vh)`; h.style.opacity=0; },100);
  setTimeout(()=>h.remove(),3000);
}

musicBtn.addEventListener('click', () => {
  if(isPlaying) { audio.pause(); musicBtn.innerText="🎵 Muzyka"; }
  else { audio.play(); musicBtn.innerText="⏸️ Pauza"; }
  isPlaying = !isPlaying;
});

document.getElementById("startBtn").addEventListener("click", () => {
  document.querySelector(".timeline").scrollIntoView({ behavior: "smooth" });
});
