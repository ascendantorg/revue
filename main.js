/* ===========================================================
   REVUE BRUTALE – JS minimal
   – fetch revues.json
   – ouverture/fermeture modal
   – formulaire client-side
   – toggle thème clair/sombre
   =========================================================== */

// --- CONFIGURATION ---
const REVUES_JSON = './revues.json';

// --- UTILS ---
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

// --- REVUES ---
async function loadRevues(limit = 0) {
  const res = await fetch(REVUES_JSON);
  const data = await res.json();
  const revues = limit ? data.slice(0, limit) : data;
  renderGrille(revues);
}

function renderGrille(list) {
  const container = $('.grille-revues');
  if (!container) return;
  container.innerHTML = list.map(r => `
    <article class="card" tabindex="0">
      <img src="${r.cover}" alt="Couverture ${r.titre}" width="220" height="300">
      <h3>${r.titre}</h3>
      <time>${r.annee}</time>
    </article>
  `).join('');
  bindCards(list);
}

function bindCards(list) {
  $$('.card').forEach((card, i) => {
    card.addEventListener('click', () => openModal(list[i]));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openModal(list[i]);
    });
  });
}

function openModal(r) {
  const modal = $('#modal');
  $('#modal-title').textContent = r.titre;
  $('#modal-desc').textContent = `${r.annee} – ${r.description}`;
  $('#viewer').src = r.pdf;
  modal.showModal();
}

function closeModal() {
  $('#modal').close();
}

// --- FORMULAIRE ---
function handleForm() {
  const form = $('#form-contact');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('TODO : envoi serveur');
    form.reset();
  });
}

// --- THÈME ---
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.body.dataset.theme = saved;
  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.textContent = saved === 'dark' ? '☀️' : '🌙';
  btn.title = 'Changer de thème';
  $('header nav').appendChild(btn);

  btn.addEventListener('click', () => {
    const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = next;
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// --- SCROLL HERO ---
function scrollToRevues() {
  $('#entrer')?.addEventListener('click', () => $('#revues').scrollIntoView({ behavior: 'smooth' }));
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  loadRevues(location.pathname.endsWith('index.html') ? 3 : 0);
  handleForm();
  initTheme();
  scrollToRevues();
  $('#fermer')?.addEventListener('click', closeModal);
  $('#modal')?.addEventListener('click', e => {
    if (e.target === $('#modal')) closeModal();
  });
});
