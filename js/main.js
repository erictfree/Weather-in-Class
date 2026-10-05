// App entry: holds the selection (two location slots, active slot, date), loads
// weather, and redraws the main screen from one recommendation state.
import { render, renderEmpty, placeName } from "./ui.js";
import { fetchForecast } from "./weather.js";
import { buildState, createPicker, locationKey } from "./state.js";
import { loadLocations, saveLocations } from "./storage.js";
import { openSheet } from "./sheet.js";

const saved = loadLocations();
const app = {
  slots: saved.slots,      // [location | null, location | null]
  activeSlot: saved.active,
  forecasts: new Map(),    // in memory, keyed by location
  selectedDate: null,
  pick: createPicker(),
};

const activeLocation = () => app.slots[app.activeSlot];

function draw() {
  const location = activeLocation();
  if (!location) { renderEmpty(app.slots, handlers); return; }
  const state = buildState({
    location,
    forecast: app.forecasts.get(locationKey(location)),
    selectedDate: app.selectedDate,
    pick: app.pick,
    slots: app.slots,
    activeSlot: app.activeSlot,
  });
  app.selectedDate = state.selectedDate;
  // Dev-tools hook (R8 check): edit window.appState, then call window.render().
  window.appState = state;
  render(state, handlers);
}
window.render = () => render(window.appState, handlers);

async function load() {
  const location = activeLocation();
  if (location && !app.forecasts.has(locationKey(location))) {
    document.getElementById("card-label").textContent = "Loading…";
    app.forecasts.set(locationKey(location), await fetchForecast(location.lat, location.lon));
  }
  draw();
}

// Put a chosen place in a slot, make it active, save both slots, and load it.
function fillSlot(slot, place) {
  app.slots[slot] = place;
  app.activeSlot = slot;
  app.selectedDate = null;
  saveLocations(app.slots, app.activeSlot);
  load().catch(showError);
}

function chooseFor(slot, firstVisit = false) {
  const current = app.slots[slot];
  openSheet({
    title: firstVisit ? "Choose a location" : current ? `Replace “${placeName(current)}”` : "Add a city",
    firstVisit,
    choose: (place) => fillSlot(slot, place),
  });
}

const handlers = {
  onSelectDate(date) { app.selectedDate = date; draw(); },
  onSelectSlot(i) {
    if (!app.slots[i]) { chooseFor(i); return; } // "+ Add city"
    if (i === app.activeSlot) return;
    app.activeSlot = i;
    app.selectedDate = null;
    saveLocations(app.slots, app.activeSlot);
    load().catch(showError);
  },
  // ✎ replaces the selected city; with nothing saved yet it fills the first slot.
  onChangeLocation() { chooseFor(app.activeSlot, !app.slots.some(Boolean)); },
};

// Basic error output; the full loading and error states come in CP7.
function showError(err) {
  console.error(err);
  document.getElementById("card-label").textContent = "Weather data couldn't be loaded.";
}

// First visit: no saved location, so open the sheet straight away (R5a).
load().catch(showError);
if (!app.slots.some(Boolean)) chooseFor(0, true);
