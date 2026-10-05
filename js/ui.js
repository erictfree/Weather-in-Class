// Draws every output from one state object (R8). No output computes its own rule here.

const $ = (id) => document.getElementById(id);

const ICON_LABELS = {
  clear: "Clear", "partly-cloudy": "Partly cloudy", cloudy: "Cloudy", fog: "Fog",
  rain: "Rain", snow: "Snow", thunderstorm: "Thunderstorm",
};

const icon = (name, alt = "") =>
  `<img src="assets/icons/${name}.webp" alt="${alt}" width="64" height="64">`;

export function render(state, handlers = {}) {
  const { location, days, selectedDate, weather, outfit, reminders, layerNote } = state;
  const selectedDay = days.find((d) => d.date === selectedDate);

  // Header: place, date, units (R7)
  $("place").textContent = location.name;
  $("context").textContent = `${selectedDay.isToday ? "Today · " : ""}${selectedDay.longDate} · °F`;

  // Weather card, labelled current or forecast (R7)
  $("card-label").textContent = selectedDay.isToday ? "Current conditions" : "Forecast";
  $("card-body").innerHTML = `
    <div class="card-main">
      ${icon(weather.icon, ICON_LABELS[weather.icon])}
      <p class="temp">${weather.temp}°</p>
    </div>
    <dl class="card-details">
      <div><dt>Feels like</dt><dd>${weather.feelsLike}°</dd></div>
      <div><dt>Humidity</dt><dd>${weather.humidity}%</dd></div>
      <div><dt>Wind</dt><dd>${weather.wind} mph</dd></div>
    </dl>`;

  // Character, description and alt text all come from the same outfit pick
  const character = $("character");
  character.src = `assets/characters/${outfit.id}.webp`;
  character.alt = `Character wearing ${outfit.text.toLowerCase()}`;
  $("description").textContent = outfit.text + (layerNote ? ` ${layerNote}` : "");

  $("reminders").innerHTML = reminders
    .map((r) => `<li>${icon(r.icon)}<span>${r.text}</span></li>`)
    .join("");

  // Day strip
  $("day-list").innerHTML = days
    .map((d) => `
      <li>
        <button type="button" class="day" data-date="${d.date}"
          aria-pressed="${d.date === selectedDate}"
          aria-label="${d.longDate}, ${ICON_LABELS[d.icon]}, high ${d.high}°">
          <span class="day-name">${d.isToday ? "Today" : d.shortName}</span>
          ${icon(d.icon)}
          <span class="day-temp">${d.high}°</span>
        </button>
      </li>`)
    .join("");

  // City switch: two slots, the empty one reads "+ Add city" (R5, R5a)
  $("city-switch").innerHTML = state.slots
    .map((slot, i) => slot
      ? `<button type="button" class="city" data-slot="${i}" aria-pressed="${i === state.activeSlot}">${slot.name}</button>`
      : `<button type="button" class="city add" data-slot="${i}">+ Add city</button>`)
    .join("");

  $("sheet-title").textContent = `Replace “${location.name}”`;

  wire(handlers);
}

// Event delegation is set up once; handlers come from main.js.
let wired = false;
function wire(handlers) {
  if (wired) return;
  wired = true;
  $("day-list").addEventListener("click", (e) => {
    const btn = e.target.closest(".day");
    if (btn) handlers.onSelectDate?.(btn.dataset.date);
  });
  $("city-switch").addEventListener("click", (e) => {
    const btn = e.target.closest(".city");
    if (btn) handlers.onSelectSlot?.(Number(btn.dataset.slot));
  });
  $("change-location").addEventListener("click", () => $("location-sheet").showModal());
  $("open-credits").addEventListener("click", () => $("credits").showModal());
  // Close buttons and backdrop clicks close dialogs; Esc is handled by <dialog>.
  for (const dialog of document.querySelectorAll("dialog")) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
    });
  }
}
