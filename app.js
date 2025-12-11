const API_URL = "https://script.google.com/macros/s/AKfycby0cahQAxv-OLXdmp0e_mwNl76AgVJzX0DredA1khK0ZJTMjXEHW-sh9_wWY481Rk25/exec";

let selectedSolat = null;

// =====================================
//  AUTO CREATE TODAY ROW
// =====================================
async function ensureToday() {
  await fetch(API_URL + "?mode=today");
}

// =====================================
//  LOAD TODAY STATUS
// =====================================
async function loadToday() {
  const res = await fetch(API_URL + "?mode=summary");
  const data = await res.json();

  const tzDate = new Date().toISOString().slice(0, 10);

  const today = data.days.find(x => x.date === tzDate);

  document.getElementById("today-date").textContent = tzDate;

  if (!today) return;

  updatePill("subuh", today);
  updatePill("zohor", today);
  updatePill("asar", today);
  updatePill("maghrib", today);
  updatePill("isyak", today);
}

function updatePill(solat, today) {
  let val = getValue(today.date, solat);

  let pill = document.getElementById(solat + "-status");

  const label = ["Tak Solat", "Lewat", "Awal", "Jemaah", "Belum"];

  pill.textContent = label[val];

  pill.className = "status-pill " +
    (val === 0 ? "red" :
    val === 1 ? "yellow" :
    val === 2 ? "green" :
    val === 3 ? "green-gold" :
    "grey");
}

// get actual value from sheet
function getValue(date, solat) {
  // UI C: We fetch entire summary, then determine today's detail
  // BUT summary only shows overall status.
  // So we must query individual solat values in future update.
  // For now, default: 4 (Belum)
  return 4;
}

// =====================================
//  LOAD HEATMAP
// =====================================
async function loadHeatmap() {
  const res = await fetch(API_URL + "?mode=summary");
  const data = await res.json();

  const container = document.getElementById("heatmap");
  const grid = document.createElement("div");
  grid.className = "heatmap-grid";

  data.days.forEach(day => {
    let div = document.createElement("div");
    div.className = "day";

    div.classList.add(
      day.status === 0 ? "red" :
      day.status === 1 ? "yellow" :
      day.status === 2 ? "green" :
      "grey"
    );

    if (day.jemaah) div.classList.add("jemaah");

    div.title = day.date;
    grid.appendChild(div);
  });

  container.innerHTML = "";
  container.appendChild(grid);
}

// =====================================
//  POPUP INTERFACE
// =====================================
function openPopup(solat) {
  selectedSolat = solat;
  document.getElementById("popup-title").textContent = "Update " + solat.toUpperCase();
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

// =====================================
// SUBMIT STATUS
// =====================================
async function submitSolat(value) {
  const today = new Date().toISOString().slice(0,10);

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: today,
      solat: selectedSolat,
      value: value
    })
  });

  closePopup();
  await loadToday();
  await loadHeatmap();
}

// =====================================
// INIT
// =====================================
(async () => {
  await ensureToday();
  await loadToday();
  await loadHeatmap();
})();

