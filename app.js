const API = "https://script.google.com/macros/s/AKfycbznOOWdoBsjfw23Eb3o6IJVWwOFFkw6xYJc9gq-xPhgFACjuYYEiBCJja4PoQLniNs/exec";

let selectedSolat = null;

function updatePill(solat, val) {
  const el = document.getElementById(solat + "-pill");
  const label = ["Tak Solat", "Lewat", "Awal", "Jemaah", "Belum"];
  const classes = ["red", "yellow", "green", "gold", "grey"];

  el.innerText = label[val];
  el.className = "pill " + classes[val];
}

function openPopup(solat) {
  selectedSolat = solat;
  document.getElementById("popup-title").innerText = solat.toUpperCase();
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

async function submitSolat(status) {
  const today = new Date().toISOString().slice(0, 10);

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: today,
      solat: selectedSolat,
      value: status
    })
  });

  closePopup();
  loadToday();
  loadHeatmap();
}

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

async function loadHeatmap() {
  const res = await fetch(API + "?mode=summary");
  const data = await res.json();

  const map = document.getElementById("heatmap");
  map.innerHTML = "";

  data.days.forEach(day => {
    const box = document.createElement("div");
    box.classList.add("heat");

    if (day.status === 0) box.style.background = "#e63946";
    else if (day.status === 1) box.style.background = "#ffca3a";
    else if (day.status === 2) box.style.background = "#2ecc71";
    else if (day.status === 3) box.style.background = "#f1c40f";
    else box.style.background = "#ccc";

    map.appendChild(box);
  });
}

function init() {
  loadToday();
  loadHeatmap();
  document.getElementById("today-date").innerText =
    new Date().toISOString().slice(0, 10);
}

init();
