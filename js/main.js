// CP1: fake state to check the layout. Replaced by live data (CP2) and state.js (CP4).
import { render } from "./ui.js";

const fakeDays = [
  ["2026-10-05", "Mon", "Mon, Oct 5", "clear", 83],
  ["2026-10-06", "Tue", "Tue, Oct 6", "partly-cloudy", 81],
  ["2026-10-07", "Wed", "Wed, Oct 7", "cloudy", 76],
  ["2026-10-08", "Thu", "Thu, Oct 8", "rain", 72],
  ["2026-10-09", "Fri", "Fri, Oct 9", "clear", 79],
  ["2026-10-10", "Sat", "Sat, Oct 10", "thunderstorm", 84],
  ["2026-10-11", "Sun", "Sun, Oct 11", "fog", 80],
].map(([date, shortName, longDate, icon, high], i) => ({
  date, shortName, longDate, icon, high, isToday: i === 0,
}));

const state = {
  slots: [{ name: "Austin" }, { name: "Los Angeles" }],
  activeSlot: 0,
  location: { name: "Austin" },
  days: fakeDays,
  selectedDate: fakeDays[0].date,
  weather: { icon: "clear", temp: 83, feelsLike: 87, humidity: 48, wind: 10 },
  outfit: { id: "hot-2", text: "Tank top, denim shorts, low-top sneakers, sunglasses." },
  layerNote: "",
  reminders: [
    { icon: "sunscreen", text: "UV is up. Put on sunscreen (SPF 30+)." },
    { icon: "water", text: "Stay hydrated. Fill up your bottle." },
  ],
};

const handlers = {
  onSelectDate(date) { state.selectedDate = date; render(state, handlers); },
  onSelectSlot(i) {
    if (!state.slots[i]) return;
    state.activeSlot = i;
    state.location = state.slots[i];
    render(state, handlers);
  },
};

render(state, handlers);
