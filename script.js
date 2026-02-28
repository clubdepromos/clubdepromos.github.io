window.onload = function() {
  setTimeout(() => {
    document.getElementById("promoModal").style.display = "flex";
  }, 500);
};

function closeModal() {
  document.getElementById("promoModal").style.display = "none";
}

function copyCode() {
  const code = document.getElementById("dailyCode").innerText;
  navigator.clipboard.writeText(code);
  alert("Código copiado: " + code);
}

// ===============================
// 🎟️ SISTEMA CODIGO DEL DIA DINAMICO
// ===============================

const promoCodes = [
  "AHORRO15",
  "TECH20",
  "OFERTA25",
  "PREMIUM30",
  "FLASH10"
];

// Genera código diferente según el día del año
function getDailyCode() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
  return promoCodes[dayOfYear % promoCodes.length];
}

function setDailyCode() {
  const code = getDailyCode();
  document.getElementById("dailyCode").innerText = code;
  document.getElementById("stickyCode").innerText = code;
}

function copyCode() {
  const code = document.getElementById("dailyCode").innerText;
  navigator.clipboard.writeText(code);

  const btn = document.querySelector(".copy-btn");
  btn.innerText = "✅";
  setTimeout(() => {
    btn.innerText = "📋";
  }, 1500);
}

// ===============================
// ⏳ CONTADOR HASTA MEDIANOCHE
// ===============================

function startCountdown() {
  const countdownElement = document.getElementById("countdown");

  function updateCountdown() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);

    const diff = midnight - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownElement.innerText =
      hours + "h " + minutes + "m " + seconds + "s";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===============================
// 🎟️ MODAL + BARRA STICKY
// ===============================

window.onload = function () {
  setDailyCode();
  startCountdown();

  setTimeout(() => {
    document.getElementById("promoModal").style.display = "flex";
  }, 700);
};

function closeModal() {
  document.getElementById("promoModal").style.display = "none";
}

// ===============================
// 🎡 CARRUSEL INFINITO SUAVE
// ===============================

function startInfiniteCarousel() {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  // Duplicamos los productos para loop perfecto
  track.innerHTML += track.innerHTML;

  let position = 0;
  const speed = 0.3; // cuanto menor, más lento

  function animate() {
    position -= speed;

    // Cuando llega a la mitad (porque duplicamos)
    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0;
    }

    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}

startInfiniteCarousel();