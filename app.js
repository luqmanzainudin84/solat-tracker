const API = "https://script.google.com/macros/s/AKfycby0cahQAxv-OLXdmp0e_mwNl76AgVJzX0DredA1khK0ZJTMjXEHW-sh9_wWY481Rk25/exec";

let selectedSolat = null;

async function init() {
  const today = new Date().toISOString().slice(0,10);
  document.getElementById("today-date").innerText = today;

  await fetch(API + "?mode=today");
  await loadToday();
  await loadHeatmap();
}

async function loadToday() {
  const today = new Date().toISOString().slice(0,10);
  const res = await fetch(API + "?mode=detail&date=" + today);
  const d = await res.json();

  updatePill("subuh", d.subuh);
  updatePill("zohor", d.zohor);
  updatePill("asar", d.asar);
  updatePill("maghrib", d.maghrib);
  updatePill("isyak", d.isyak);
}

function updatePill(solat, val) {
  const el = document.getElementById(solat+"-pill");
  const label = ["Tak Solat","Lewat","Awal","Jemaah","Belum"];
  const classes = ["red","yellow","green","green-gold","grey"];

  el.textContent = label[val];
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

async function submitSolat(value) {
  const today = new Date().toISOString().slice(0,10);

  await fetch(API, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      date:today,
      solat:selectedSolat,
      value:value
    })
  });

  closePopup();
  await loadToday();
  await loadHeatmap();
}

async function loadHeatmap() {
  const res = await fetch(API + "?mode=summary");
  const data = await res.json();

  const container = document.getElementById("heatmap");
  container.innerHTML = "";

  data.days.forEach(d => {
    const div = document.createElement("div");
    div.classList.add("heat");

    if (d.status === 0) div.style.background = "#e44";
    else if (d.status === 1) div.style.background = "#e8c547";
    else if (d.status === 2) div.style.background = "#3ebf6b";
    else div.style.background = "#555";

    container.appendChild(div);
  });
}

init();
