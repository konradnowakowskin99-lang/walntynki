/* SCROLL REVEAL */
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

/* PARALLAX ENGINE */
const layers = document.querySelectorAll(".parallax");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  layers.forEach(layer => {
    let speed = 0.3;
    if (layer.classList.contains("bg")) speed = 0.15;
    if (layer.classList.contains("hearts-layer")) speed = 0.35;

    layer.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

/* DAYS COUNTER */
const startDate = new Date("2022-02-14"); // <- ZMIEŃ DATĘ
const today = new Date();
const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
document.getElementById("days").innerText = diff;

/* SMOOTH SCROLL */
document.getElementById("startBtn").addEventListener("click", () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth"
  });
});
