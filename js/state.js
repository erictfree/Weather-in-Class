// Builds the one recommendation state that drives every output (R8), and keeps
// variation picks stable for each location and date during the visit (R10).
import { recommend } from "./rules.js";
import { OUTFITS, MESSAGES } from "./content.js";

// Picks live in memory only: nothing is written to storage, so a reload re-picks (spec decision).
// Each output is picked on its own the first time it's needed, so outfits and
// wordings are never paired. `random` can be swapped in tests.
export function createPicker(random = Math.random) {
  const memory = new Map(); // "lat,lon|date" → { [slot]: index }

  return function pick(locationKey, date, slot, options) {
    const key = `${locationKey}|${date}`;
    if (!memory.has(key)) memory.set(key, {});
    const picks = memory.get(key);
    if (!(slot in picks)) picks[slot] = Math.floor(random() * options.length);
    return options[picks[slot]];
  };
}

export const locationKey = (loc) => `${loc.lat.toFixed(4)},${loc.lon.toFixed(4)}`;

// Today shows current conditions; other days show the daily forecast (R7).
function weatherFor(forecast, day) {
  if (day.isToday) return forecast.current;
  return {
    icon: day.icon, temp: day.high, tempLabel: "High",
    feelsLike: day.feelsMax, humidity: day.humidity, wind: day.wind,
  };
}

/**
 * location: { name, lat, lon }; forecast: from weather.js; selectedDate: "YYYY-MM-DD" or null.
 * Returns everything ui.js needs to draw the main screen.
 */
export function buildState({ location, forecast, selectedDate, pick, slots, activeSlot }) {
  const day = forecast.days.find((d) => d.date === selectedDate) ?? forecast.days[0];
  const key = locationKey(location);
  const rec = recommend(day, forecast.current.feelsLike);

  // Outfit slot is per group, so if fresh data moves the day to another group
  // it gets its own (also stable) pick.
  const outfit = rec.group ? pick(key, day.date, `outfit-${rec.group}`, OUTFITS[rec.group]) : null;
  const message = (type) => ({
    type,
    icon: MESSAGES[type].icon,
    text: pick(key, day.date, type, MESSAGES[type].wordings),
  });

  return {
    slots,
    activeSlot,
    location,
    days: forecast.days,
    selectedDate: day.date,
    weather: weatherFor(forecast, day),
    group: rec.group,
    outfit,
    // The layer note shows as its own chip in the reminder row, after the reminders.
    reminders: [...rec.reminders, ...(rec.layerNote ? ["layer"] : [])].map(message),
  };
}
