// Change location: bottom sheet on phone, dropdown under the controls on laptop.
// US city/ZIP search (R2), "Use my location" (R3) and its denied message (R4).
import { searchPlaces, deviceLocation } from "./location.js";

const $ = (id) => document.getElementById(id);
const sheet = $("location-sheet");
const input = $("location-search");
const results = $("results");
const message = $("sheet-message");

let onChoose = null;   // set by openSheet; receives the chosen { name, region, lat, lon }
let searchTimer = 0;
let latestQuery = "";

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** title: sheet heading; firstVisit: put "Use my location" first (R5a); choose: callback */
export function openSheet({ title, firstVisit = false, choose }) {
  onChoose = choose;
  $("sheet-title").textContent = title;
  sheet.classList.toggle("first-visit", firstVisit);
  input.value = "";
  results.innerHTML = "";
  message.textContent = "";
  anchorDropdown();
  sheet.showModal();
  (firstVisit ? $("use-location") : input).focus();
}

// On laptop the dialog drops down from the location controls (CSS reads these values).
function anchorDropdown() {
  const box = document.querySelector(".location-controls").getBoundingClientRect();
  sheet.style.setProperty("--sheet-top", `${Math.round(box.bottom + 8)}px`);
  sheet.style.setProperty("--sheet-right", `${Math.round(window.innerWidth - box.right)}px`);
}

function choose(place) {
  sheet.close();
  onChoose?.(place);
}

// Search as the User types, after a short pause; ignore replies to older queries.
input.addEventListener("input", () => {
  clearTimeout(searchTimer);
  // Clear old results right away so a quick tap or Enter can't pick a stale one.
  results.innerHTML = "";
  const query = input.value.trim();
  latestQuery = query;
  if (query.length < 2) { message.textContent = ""; return; }
  message.textContent = "Searching…";
  searchTimer = setTimeout(() => runSearch(query), 300);
});
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") results.querySelector("button")?.click(); // Enter takes the top result
  // A search box uses Esc to clear itself; close the sheet instead, as the other dialogs do.
  if (e.key === "Escape") { e.preventDefault(); sheet.close(); }
});

async function runSearch(query) {
  try {
    const places = await searchPlaces(query);
    if (query !== latestQuery) return;
    message.textContent = places.length ? "" : `No US places found for “${query}”.`;
    results.innerHTML = places
      .map((p, i) => `<li><button type="button" class="result" data-i="${i}">
          <span class="result-name">${escape(p.name)}</span>
          <span class="result-detail">${escape(p.detail)}</span></button></li>`)
      .join("");
    results.onclick = (e) => {
      const btn = e.target.closest(".result");
      if (btn) choose(places[Number(btn.dataset.i)]);
    };
  } catch (err) {
    console.error(err);
    if (query === latestQuery) message.textContent = "Search isn't working right now. Check your connection and try again.";
  }
}

$("use-location").addEventListener("click", async () => {
  message.textContent = "Finding your location…";
  try {
    choose(await deviceLocation());
  } catch (err) {
    message.textContent = err.message; // denied or unavailable; search stays available (R4)
    input.focus();
  }
});

// Close button and backdrop click; Esc is handled by <dialog>.
sheet.addEventListener("click", (e) => {
  if (e.target === sheet || e.target.closest("[data-close]")) sheet.close();
});
window.addEventListener("resize", () => { if (sheet.open) anchorDropdown(); });
