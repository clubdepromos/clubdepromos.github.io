/* =========================================================
   CLUBDEPROMOS V2
   Script principal
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ARGENTINA_TIMEZONE = "America/Argentina/Buenos_Aires";


/* =========================================================
   CÓDIGOS PROMOCIONALES
   ---------------------------------------------------------
   IMPORTANTE:
   - Máximo 3 códigos por día
   - Se renuevan automáticamente a las 00:00 de Argentina
   - Para agregar nuevos códigos simplemente agregamos
     una nueva fecha.
========================================================= */

const dailyPromoCodes = {

  "2026-09-27": [
    {
      code: "SOLYFLOR10",
      category: "Todos"
    },
  ],

};


/* =========================================================
   FECHA ACTUAL DE ARGENTINA
========================================================= */

function getArgentinaDate() {

  const now = new Date();

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: ARGENTINA_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(now);

}


/* =========================================================
   OBTENER CÓDIGOS DEL DÍA
========================================================= */

function getTodayPromoCodes() {

  const today =
    getArgentinaDate();

  const codes =
    dailyPromoCodes[today] || [];

  /*
    Seguridad:
    nunca mostrar más de 3 códigos
  */

  return codes.slice(0, 3);

}


/* =========================================================
   ACTUALIZAR CÓDIGO PRINCIPAL
========================================================= */

function setDailyCode() {

  const codes =
    getTodayPromoCodes();

  const dailyCode =
    document.getElementById("dailyCode");

  const stickyCode =
    document.getElementById("stickyCode");


  /*
    Usamos el primer código como
    "Código del día".
  */

  const mainCode =
    codes.length > 0
      ? codes[0].code
      : "Sin código";


  if (dailyCode) {

    dailyCode.textContent =
      mainCode;

  }


  if (stickyCode) {

    stickyCode.textContent =
      mainCode;

  }

}


/* =========================================================
   RENDERIZAR CÓDIGOS ACTIVOS
========================================================= */

function renderActiveCodes() {

  const container =
    document.getElementById("activeCodes");

  if (!container) {
    return;
  }


  const codes =
    getTodayPromoCodes();


  /*
    Limpiamos el contenido anterior.
  */

  container.innerHTML = "";


  /*
    Si no hay códigos cargados para hoy.
  */

  if (codes.length === 0) {

    container.innerHTML = `
      <div class="codes-empty">
        <strong>No hay códigos activos por el momento.</strong>
        <span>Volvé a consultar más tarde.</span>
      </div>
    `;

    return;
  }


  /*
    Crear cada tarjeta
  */

  codes.forEach((promo) => {

    const card =
      document.createElement("div");

    card.className =
      "code-card";


    card.innerHTML = `

      <div class="code-title">
        ${promo.category}
      </div>

      <div class="code-box-alt">

        <code>
          ${promo.code}
        </code>

        <button
          type="button"
          class="copy-btn-alt"
          data-code="${promo.code}"
        >
          Copiar
        </button>

      </div>

      <small class="code-expiration">
        ⏳ Válido hasta las 00:00 hs
      </small>

    `;


    container.appendChild(card);

  });


  /*
    Activar botones de copiar
  */

  container
    .querySelectorAll(".copy-btn-alt")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const code =
            button.dataset.code;

          copyToClipboard(
            code,
            button,
            "Copiar"
          );

        }
      );

    });

}


/* =========================================================
   COPIAR TEXTO
========================================================= */

async function copyToClipboard(
  text,
  button,
  defaultText
) {

  try {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(text);

    } else {

      const textarea =
        document.createElement("textarea");

      textarea.value =
        text;

      textarea.style.position =
        "fixed";

      textarea.style.opacity =
        "0";

      document.body.appendChild(
        textarea
      );

      textarea.select();

      document.execCommand("copy");

      textarea.remove();

    }


    if (button) {

      button.textContent =
        "Copiado ✓";

      button.style.background =
        "#16a34a";

      button.style.color =
        "#fff";


      setTimeout(() => {

        button.textContent =
          defaultText;

        button.style.background =
          "";

        button.style.color =
          "";

      }, 1800);

    }

  } catch (error) {

    console.error(
      "No se pudo copiar el código:",
      error
    );

  }

}


/* =========================================================
   COPIAR CÓDIGO DEL MODAL
========================================================= */

function copyCode() {

  const element =
    document.getElementById(
      "dailyCode"
    );

  const button =
    document.querySelector(
      ".copy-btn"
    );


  if (!element) {
    return;
  }


  const code =
    element.textContent.trim();


  if (!code || code === "Sin código") {
    return;
  }


  copyToClipboard(
    code,
    button,
    "📋"
  );

}


/* =========================================================
   COUNTDOWN
   ---------------------------------------------------------
   Cuenta hasta las 00:00 de Argentina.
========================================================= */

function startCountdown() {

  const element =
    document.getElementById(
      "countdown"
    );

  if (!element) {
    return;
  }


  function update() {

    const now =
      new Date();


    /*
      Obtenemos la fecha actual
      en Argentina.
    */

    const argentinaDate =
      getArgentinaDate();


    /*
      Argentina utiliza UTC-3.
      Construimos la próxima medianoche.
    */

    const tomorrow =
      new Date(
        `${argentinaDate}T00:00:00-03:00`
      );


    tomorrow.setDate(
      tomorrow.getDate() + 1
    );


    const difference =
      tomorrow.getTime() -
      now.getTime();


    if (difference <= 0) {

      element.textContent =
        "00h 00m 00s";

      /*
        Actualizamos códigos
        inmediatamente.
      */

      renderActiveCodes();
      setDailyCode();

      return;

    }


    const hours =
      Math.floor(
        difference / 3600000
      );


    const minutes =
      Math.floor(
        (difference % 3600000) /
        60000
      );


    const seconds =
      Math.floor(
        (difference % 60000) /
        1000
      );


    element.textContent =
      `${String(hours).padStart(2, "0")}h ` +
      `${String(minutes).padStart(2, "0")}m ` +
      `${String(seconds).padStart(2, "0")}s`;

  }


  update();


  setInterval(
    update,
    1000
  );

}


/* =========================================================
   MODAL
========================================================= */

function openModal() {

  const modal =
    document.getElementById(
      "promoModal"
    );

  if (!modal) {
    return;
  }


  modal.classList.add(
    "is-open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}


function closeModal() {

  const modal =
    document.getElementById(
      "promoModal"
    );

  if (!modal) {
    return;
  }


  modal.classList.remove(
    "is-open"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}


/* =========================================================
   MODAL — CLICK FUERA
========================================================= */

function setupModal() {

  const modal =
    document.getElementById(
      "promoModal"
    );

  if (!modal) {
    return;
  }


  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        closeModal();

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeModal();

      }

    }
  );

}


/* =========================================================
   MOSTRAR MODAL UNA VEZ POR DÍA
========================================================= */

function showDailyModal() {

  const today =
    getArgentinaDate();


  const lastShown =
    localStorage.getItem(
      "clubdepromos_promo_date"
    );


  if (
    lastShown === today
  ) {

    return;

  }


  /*
    No mostramos modal si
    no hay código activo.
  */

  const codes =
    getTodayPromoCodes();


  if (codes.length === 0) {
    return;
  }


  setTimeout(() => {

    openModal();


    localStorage.setItem(
      "clubdepromos_promo_date",
      today
    );

  }, 1200);

}


/* =========================================================
   CAROUSEL
========================================================= */

function startCarousel() {

  const track =
    document.getElementById(
      "productTrack"
    );

  const carousel =
    document.querySelector(
      ".carousel"
    );

  const previous =
    document.querySelector(
      ".carousel-prev"
    );

  const next =
    document.querySelector(
      ".carousel-next"
    );


  if (
    !track ||
    !carousel ||
    !previous ||
    !next
  ) {

    return;

  }


  let interval;


  function getCardWidth() {

    const card =
      track.querySelector(
        ".product-card"
      );


    if (!card) {
      return 0;
    }


    const styles =
      window.getComputedStyle(
        track
      );


    const gap =
      parseFloat(
        styles.columnGap ||
        styles.gap ||
        0
      );


    return (
      card.offsetWidth +
      gap
    );

  }


  function move(direction) {

    const width =
      getCardWidth();


    if (!width) {
      return;
    }


    track.scrollBy({

      left:
        direction * width,

      behavior:
        "smooth"

    });

  }


  function startAuto() {

    stopAuto();


    interval =
      setInterval(
        () => {

          if (
            window.innerWidth <= 700
          ) {

            return;

          }


          move(1);

        },
        6000
      );

  }


  function stopAuto() {

    if (interval) {

      clearInterval(
        interval
      );

      interval = null;

    }

  }


  previous.addEventListener(
    "click",
    () => {

      move(-1);

      startAuto();

    }
  );


  next.addEventListener(
    "click",
    () => {

      move(1);

      startAuto();

    }
  );


  carousel.addEventListener(
    "mouseenter",
    stopAuto
  );


  carousel.addEventListener(
    "mouseleave",
    startAuto
  );


  startAuto();

}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setDailyCode();

    renderActiveCodes();

    startCountdown();

    setupModal();

    startCarousel();

    showDailyModal();

  }
);