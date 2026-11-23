/* =========================================================
   SOPHIETASTE · Del guardado al plato
   Todo lo que cambia con la oferta está acá.
   El 1 de enero no hace falta tocar nada: después de offerEnds
   la página muestra sola el precio regular y oculta los textos
   de lanzamiento. Igual revisá que Hotmart cobre lo mismo.
   ========================================================= */
const CONFIG = {
  price: 6,
  regularPrice: 10,
  currency: "USD",
  offerEnds: "2026-12-31", // último día de la oferta (inclusive)
  checkoutUrl: "https://pay.hotmart.com/C108411608Q?off=fpn26sij"
};

(function () {
  "use strict";

  // Fin de la oferta: 31/12 a las 23:59:59, hora de Argentina (UTC-3)
  const offerEnd = new Date(CONFIG.offerEnds + "T23:59:59-03:00");
  const offerActive = Date.now() <= offerEnd.getTime();
  const currentPrice = offerActive ? CONFIG.price : CONFIG.regularPrice;
  const fmt = (n) => CONFIG.currency + " " + n;

  document.querySelectorAll("[data-price]").forEach((el) => {
    el.textContent = fmt(currentPrice);
  });
  document.querySelectorAll("[data-regular-price]").forEach((el) => {
    el.textContent = fmt(CONFIG.regularPrice);
  });
  if (!offerActive) {
    document.querySelectorAll("[data-offer-only]").forEach((el) => {
      el.hidden = true;
    });
  }

  // Todos los botones de compra van al mismo checkout
  document.querySelectorAll("[data-checkout]").forEach((el) => {
    el.href = CONFIG.checkoutUrl;
    el.addEventListener("click", () => {
      // Evento para el píxel de Meta (si está cargado por Netlify)
      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout", {
          value: currentPrice,
          currency: CONFIG.currency,
          content_name: "Del guardado al plato"
        });
      }
    });
  });

  // Modal «Más recetas»
  const openBtn = document.getElementById("more-btn");
  const dialog = document.getElementById("more-dialog");
  const closeBtn = document.getElementById("more-close");

  if (openBtn && dialog && typeof dialog.showModal === "function") {
    openBtn.addEventListener("click", () => {
      dialog.showModal();
      closeBtn.focus();
    });
    closeBtn.addEventListener("click", () => dialog.close());
    // Cerrar tocando afuera
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    // Esc lo maneja el navegador; el foco vuelve al botón
    dialog.addEventListener("close", () => openBtn.focus());
  } else if (openBtn) {
    // Navegadores muy viejos sin <dialog>
    openBtn.addEventListener("click", () => {
      window.alert("En preparación: nuevos recetarios de la colección Recetarios por el mundo ya están en la cocina.");
    });
  }
})();
