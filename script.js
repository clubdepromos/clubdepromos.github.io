const promoCodes = [
  "LLEGOCYBERFEST",
  "LLEGOCYBER",
  "COMPRAHOY",
  "BENEFICIO",
  "ARRANCOCYBER",
  "DESCUENTOHOY"
];

function getDailyCode() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );
  return promoCodes[dayOfYear % promoCodes.length];
}

function setDailyCode() {
  const code = getDailyCode();
  const daily = document.getElementById("dailyCode");
  const sticky = document.getElementById("stickyCode");
  if (daily) daily.innerText = code;
  if (sticky) sticky.innerText = code;
}

function copyCode() {
  const el = document.getElementById("dailyCode");
  if (!el) return;

  const code = el.innerText;

  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector(".copy-btn");
    if (!btn) return;

    btn.innerText = "Copiado ✓";
    btn.style.background = "#16a34a";

    setTimeout(() => {
      btn.innerText = "📋";
      btn.style.background = "";
    }, 2000);
  });
}

function copyCustomCode(button) {
  const code = button.parentElement.querySelector("span").innerText;

  navigator.clipboard.writeText(code).then(() => {
    button.innerText = "Copiado ✓";
    button.style.background = "#16a34a";

    setTimeout(() => {
      button.innerText = "Copiar";
      button.style.background = "";
    }, 2000);
  });
}

function startCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  function update() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    const diff = midnight - now;

    if (diff <= 0) {
      el.innerText = "00h 00m 00s";
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    el.innerText = `${h}h ${m}m ${s}s`;
  }

  update();
  setInterval(update, 1000);
}

function startCarousel() {
  const track = document.querySelector(".carousel-track");
  const prev = document.querySelector(".carousel-prev");
  const next = document.querySelector(".carousel-next");
  const wrapper = document.querySelector(".carousel");

  if (!track) return;

  let cards = Array.from(track.children);
  if (cards.length === 0) return;

  const gap = 30;
  let cardWidth = cards[0].offsetWidth + gap;

  const clonesToAdd = 3;
  for (let i = 0; i < clonesToAdd; i++) {
    const clone = cards[i].cloneNode(true);
    track.appendChild(clone);
  }

  cards = Array.from(track.children);

  let index = 0;
  let autoSlide;
  let isTransitioning = false;

  track.style.transition = "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

  function update() {
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    index++;
    update();

    if (index >= cards.length - clonesToAdd) {
      setTimeout(() => {
        track.style.transition = "none";
        index = 0;
        update();
        track.offsetHeight;
        track.style.transition = "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
      }, 1200);
    }

    setTimeout(() => isTransitioning = false, 1200);
  }

  function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (index === 0) {
      track.style.transition = "none";
      index = cards.length - clonesToAdd;
      update();
      track.offsetHeight;
      track.style.transition = "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
    }

    index--;
    update();

    setTimeout(() => isTransitioning = false, 1200);
  }

  function startAuto() {
    autoSlide = setInterval(nextSlide, 7000);
  }

  function stopAuto() {
    clearInterval(autoSlide);
  }

  if (next) next.addEventListener("click", () => {
    nextSlide();
    stopAuto();
    startAuto();
  });

  if (prev) prev.addEventListener("click", () => {
    prevSlide();
    stopAuto();
    startAuto();
  });

  if (wrapper) {
    wrapper.addEventListener("mouseenter", stopAuto);
    wrapper.addEventListener("mouseleave", startAuto);
  }

  let startX = 0;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    stopAuto();
  });

  track.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextSlide();
    if (endX - startX > 50) prevSlide();
    startAuto();
  });

  window.addEventListener("resize", () => {
    cardWidth = cards[0].offsetWidth + gap;
    update();
  });

  startAuto();
}

function closeModal() {
  const modal = document.getElementById("promoModal");
  if (modal) modal.style.display = "none";
}

window.addEventListener("load", () => {
  setDailyCode();
  startCountdown();
  startCarousel();

  setTimeout(() => {
  const today = new Date().toDateString();
  const lastShown = localStorage.getItem("promoShown");

  if (lastShown !== today) {
    const modal = document.getElementById("promoModal");
    if (modal) {
      modal.style.display = "flex";
      localStorage.setItem("promoShown", today);
    }
  }
}, 700);
});