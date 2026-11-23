/* SOPHIETASTE · Del guardado al plato
   Editá acá el enlace de compra y el precio. */
const CONFIG = {
  hotmartUrl: 'https://pay.hotmart.com/C108411608Q?off=fpn26sij',
  precio: 'USD 6',             // precio de lanzamiento
  precioRegular: 'USD 10',     // vuelve el 1 de enero
  finLanzamiento: '2026-12-31' // último día del precio de lanzamiento
};
/* Después del 31/12 la página muestra sola el precio regular y oculta
   los textos de lanzamiento. Acordate de cambiar también el precio en Hotmart. */
const LANZAMIENTO = Date.now() <= new Date(CONFIG.finLanzamiento + 'T23:59:59-03:00').getTime();
if (!LANZAMIENTO) CONFIG.precio = CONFIG.precioRegular;

(function () {
  'use strict';

  /* Enlaces de compra y precio desde CONFIG */
  document.querySelectorAll('[data-comprar]').forEach(function (a) { a.href = CONFIG.hotmartUrl; });
  document.querySelectorAll('[data-precio]').forEach(function (el) { el.textContent = CONFIG.precio; });
  if (!LANZAMIENTO) document.querySelectorAll('[data-lanzamiento]').forEach(function (el) { el.hidden = true; });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('nav');
  const hero = document.getElementById('inicio');

  /* Navegación: transparente sobre el hero, crema al desplazarse */
  function navEstado() {
    if (!nav) return;
    const limite = hero ? 24 : -1;
    nav.classList.toggle('solida', window.scrollY > limite);
  }
  navEstado();
  window.addEventListener('scroll', navEstado, { passive: true });

  /* Menú en celular */
  const menuBtn = nav && nav.querySelector('.nav__menu');
  const panel = document.getElementById('nav-panel');
  function cerrarMenu() {
    if (!menuBtn) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    nav.classList.remove('abierta');
  }
  if (menuBtn && panel) {
    menuBtn.addEventListener('click', function () {
      const abierto = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!abierto));
      panel.hidden = abierto;
      nav.classList.toggle('abierta', !abierto);
    });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) cerrarMenu(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { cerrarMenu(); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 980px)').addEventListener('change', cerrarMenu);
  }

  /* Pestañas de la guía rápida (patrón ARIA tabs, activación automática) */
  const tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    function activar(tab, enfocar) {
      tabs.forEach(function (t) {
        const sel = t === tab;
        t.setAttribute('aria-selected', String(sel));
        t.tabIndex = sel ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !sel;
      });
      if (enfocar) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { activar(t, false); }); });
    tablist.addEventListener('keydown', function (e) {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); activar(tabs[n], true); }
    });
  }

  /* Visor de la página del recetario */
  const visor = document.getElementById('visor');
  if (visor && typeof visor.showModal === 'function') {
    let origen = null;
    document.querySelectorAll('[data-visor]').forEach(function (b) {
      b.addEventListener('click', function () { origen = b; visor.showModal(); });
    });
    visor.querySelector('[data-cerrar]').addEventListener('click', function () { visor.close(); });
    visor.addEventListener('click', function (e) { if (e.target === visor || e.target.classList.contains('visor__in')) visor.close(); });
    visor.addEventListener('close', function () { if (origen) origen.focus(); });
  }

  /* Barra de compra fija en celular: aparece después del hero y
     se oculta en la receta de regalo, la oferta y el cierre */
  const barra = document.getElementById('barra');
  if (barra && hero && 'IntersectionObserver' in window) {
    const ocultas = ['regalo', 'oferta', 'cierre'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
    const estado = { heroVisible: true, enOculta: new Set() };
    const barraBtn = barra.querySelector('a');
    function actualizar() {
      const ver = !estado.heroVisible && estado.enOculta.size === 0;
      barra.classList.toggle('visible', ver);
      barra.setAttribute('aria-hidden', String(!ver));
      barraBtn.tabIndex = ver ? 0 : -1;
    }
    new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { estado.heroVisible = en.isIntersecting; });
      actualizar();
    }, { threshold: 0, rootMargin: '0px 0px -40% 0px' }).observe(hero);
    const io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) estado.enOculta.add(en.target.id); else estado.enOculta.delete(en.target.id);
      });
      actualizar();
    }, { threshold: 0 });
    ocultas.forEach(function (s) { io.observe(s); });
  }

  /* Aparición sutil al desplazarse */
  const revelables = document.querySelectorAll('.revela');
  if (!reduce && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visto'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revelables.forEach(function (el) { ro.observe(el); });
  } else {
    revelables.forEach(function (el) { el.classList.add('visto'); });
  }
})();
