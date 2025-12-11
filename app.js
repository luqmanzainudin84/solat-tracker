// URL Google Apps Script kamu
const API =
  "https://script.google.com/macros/s/AKfycbznOOWdoBsjfw23Eb3o6IJVWwOFFkw6xYJc9gq-xPhgFACjuYYEiBCJja4PoQLniNs/exec";

let selectedSolat = null;

// Tukar teks + warna pill
function updatePill(solat, val) {
  const el = document.getElementById(solat + "-pill");
  const label = ["Tak Solat", "Lewat", "Awal", "Jemaah", "Belum"];
  const classes = ["red", "yellow", "green", "gold", "grey"];

  el.textContent = label[val];
  el.className = "pill " + classes[val];
}

// Buka popup
function openPopup(solat) {
  selectedSolat = solat;
  document.getElementById("popup-title").innerText = solat.toUpperCase();
  document.getElementById("popup").classList.remove("hidden");
}

// Tutup popup
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

// Hantar status ke Google Sheets
async function submitSolat(value) {
  if (!selectedSolat) return;

  const today = new Date().toISOString().slice(0, 10);

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: today,
      solat: selectedSolat,
      value: value,
    }),
  });

  closePopup();
  await loadToday();
  await loadHeatmap();
}

// Ambil status harian
async function loadToday() {
  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch(API + "?mode=detail&date=" + today);
  const d = await res.json();

  updatePill("subuh", d.subuh);
  updatePill("zohor", d.zohor);
  updatePill("asar", d.asar);
  updatePill("maghrib", d.maghrib);
  updatePill("isyak", d.isyak);
}

// Heatmap setahun
async function loadHeatmap() {
  const res = await fetch(API + "?mode=summary");
  const data = await res.json();

  const container = document.getElementById("heatmap");
  container.innerHTML = "";

  data.days.forEach((d) => {
    const div = document.createElement("div");
    div.classList.add("heat");

    if (d.status === 0) div.style.background = "#e63946"; // tak solat
    else if (d.status === 1) div.style.background = "#ffca3a"; // lewat
    else if (d.status === 2) div.style.background = "#2ecc71"; // awal
    else if (d.status === 3) div.style.background = "#f1c40f"; // jemaah
    else div.style.background = "#cccccc"; // belum data

    container.appendChild(div);
  });
}

// Init page
async function init() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById("today-date").innerText = today;

  // pastikan row hari ni wujud
  await fetch(API + "?mode=today");
  await loadToday();
  await loadHeatmap();
}

init();
