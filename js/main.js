// CP2: live weather for two hard-coded slots. Outfit and reminders are still fake
// until the rules (CP3) and recommendation state (CP4); locations come in CP6.
import { render } from "./ui.js";
import { fetchForecast } from "./weather.js";

const state = {
  slots: [
    { name: "Austin", lat: 30.2672, lon: -97.7431 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  ],
  activeSlot: 0,
  forecasts: {},      // in-memory, keyed by slot index
  selectedDate: null,
};

// Fake recommendation until CP3/CP4.
const fakeOutfit = { id: "hot-2", text: "Tank top, denim shorts, low-top sneakers, sunglasses." };
const fakeReminders = [
  { icon: "sunscreen", text: "UV is up. Put on sunscreen (SPF 30+)." },
  { icon: "water", text: "Stay hydrated. Fill up your bottle." },
];

// Today shows current conditions; other days show the daily forecast (R7).
function weatherFor(forecast, day) {
  if (day.isToday) return forecast.current;
  return {
    icon: day.icon, temp: day.high, tempLabel: "High",
    feelsLike: day.feelsMax, humidity: day.humidity, wind: day.wind,
  };
}

function draw() {
  const forecast = state.forecasts[state.activeSlot];
  const day = forecast.days.find((d) => d.date === state.selectedDate) ?? forecast.days[0];
  state.selectedDate = day.date;
  const view = {
    slots: state.slots,
    activeSlot: state.activeSlot,
    location: state.slots[state.activeSlot],
    days: forecast.days,
    selectedDate: day.date,
    weather: weatherFor(forecast, day),
    outfit: fakeOutfit,
    layerNote: "",
    reminders: fakeReminders,
  };
  window.appState = view; // for dev-tools checks
  render(view, handlers);
}

async function load(slot) {
  if (!state.forecasts[slot]) {
    document.getElementById("card-label").textContent = "Loading…";
    const { lat, lon } = state.slots[slot];
    state.forecasts[slot] = await fetchForecast(lat, lon);
  }
  draw();
}

const handlers = {
  onSelectDate(date) { state.selectedDate = date; draw(); },
  onSelectSlot(i) {
    if (!state.slots[i] || i === state.activeSlot) return;
    state.activeSlot = i;
    state.selectedDate = null;
    load(i).catch(showError);
  },
};

// Basic error output; the full loading and error states come in CP7.
function showError(err) {
  console.error(err);
  document.getElementById("card-label").textContent = "Weather data couldn't be loaded.";
}

load(state.activeSlot).catch(showError);
