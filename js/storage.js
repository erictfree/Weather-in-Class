// The only data the app stores on the device: the two location slots and which
// one is active (R5, R16). Nothing else is written to storage.
const KEY = "weather-in-class.locations";

export function loadLocations() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved?.slots) && saved.slots.length === 2) {
      const active = saved.slots[saved.active] ? saved.active : Math.max(0, saved.slots.findIndex(Boolean));
      return { slots: saved.slots, active };
    }
  } catch {
    // Storage blocked or corrupt: fall through to a first visit.
  }
  return { slots: [null, null], active: 0 };
}

export function saveLocations(slots, active) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ slots, active }));
  } catch {
    // Storage unavailable (private mode): the app still works for this visit.
  }
}
