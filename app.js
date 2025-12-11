// LETAK URL SCRIPT KAU DI SINI
const API_URL = https://script.google.com/macros/s/AKfycbz3Q3l5eKbkZw9mqW6uuEBUcHn4PnXyjLBQQ4Z56f27UGFJ8bLrK6jkPUCFbZ4xhKX3/exec;

async function fetchSummary() {
  const res = await fetch(API_URL);
  const json = await res.json();
  return json.days || [];
}

function buildHeatmap(days) {
  const heatmap = document.getElementById('heatmap');
  const grid = document.createElement('div');
  grid.className = 'heatmap-grid';

  // Susun ikut hari minggu – kita anggap date string "YYYY-MM-DD"
  days.forEach(d => {
    const dateObj = new Date(d.date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay(); // 0=Ahad..6=Sabtu
    // grid-auto-flow column, jadi kita tak perlu set row/col manually.
    const cell = document.createElement('div');
    cell.classList.add('day');

    // status: 0=merah,1=kuning,2=hijau, -1=tiada
    if (d.status === 0) cell.classList.add('miss');
    else if (d.status === 1) cell.classList.add('lewat');
    else if (d.status === 2) cell.classList.add('awal');

    if (d.jamaah === 1) cell.classList.add('jamaah');

    const label = d.status === 0 ? 'Tinggal'
                 : d.status === 1 ? 'Lewat'
                 : d.status === 2 ? 'Awal'
                 : 'Tiada rekod';

    cell.title = `${d.date} – ${label}${d.jamaah === 1 ? ' (Jemaah)' : ''}`;

    grid.appendChild(cell);
  });

  heatmap.innerHTML = "";
  heatmap.appendChild(grid);

  document.getElementById('totalDays').textContent = days.length;
}

(async function init() {
  try {
    const days = await fetchSummary();
    buildHeatmap(days);
  } catch (e) {
    console.error(e);
    document.getElementById('heatmap').innerText = "Error load data";
  }
})();
