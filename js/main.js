// App entry: holds the selection (slots, active slot, date), loads weather, and
// redraws from one recommendation state. Locations are hard-coded until CP6.
import { render } from "./ui.js";
import { fetchForecast } from "./weather.js";
import { buildState, createPicker } from "./state.js";

const app = {
  slots: [
    { name: "Austin", lat: 30.2672, lon: -97.7431 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  ],
  activeSlot: 0,
  forecasts: {}, // in memory, keyed by slot index
  selectedDate: null,
  pick: createPicker(),
};

function draw() {
  const state = buildState({
    location: app.slots[app.activeSlot],
    forecast: app.forecasts[app.activeSlot],
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

async function load(slot) {
  if (!app.forecasts[slot]) {
    document.getElementById("card-label").textContent = "Loading…";
    const { lat, lon } = app.slots[slot];
    app.forecasts[slot] = await fetchForecast(lat, lon);
  }
  draw();
}

const handlers = {
  onSelectDate(date) { app.selectedDate = date; draw(); },
  onSelectSlot(i) {
    if (!app.slots[i] || i === app.activeSlot) return;
    app.activeSlot = i;
    app.selectedDate = null;
    load(i).catch(showError);
  },
};

// Basic error output; the full loading and error states come in CP7.
function showError(err) {
  console.error(err);
  document.getElementById("card-label").textContent = "Weather data couldn't be loaded.";
}

load(app.activeSlot).catch(showError);
