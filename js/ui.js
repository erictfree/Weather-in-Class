// Draws every output from one state object (R8). No output computes its own rule here.

import { ICON_LABELS } from "./content.js";

const $ = (id) => document.getElementById(id);


const icon = (name, alt = "") =>
  `<img src="assets/icons/${name}.webp" alt="${alt}" width="64" height="64">`;

export function render(state, handlers = {}) {
  const { location, days, selectedDate, weather, outfit, reminders } = state;
  // The strip and city switch are rebuilt below; remember which one had keyboard focus.
  const focusedIn = document.activeElement?.closest("#day-list, #city-switch")?.id;
  const selectedDay = days.find((d) => d.date === selectedDate);

  // Header: place, date, units (R7)
  $("place").textContent = placeName(location);
  $("context").textContent = `${selectedDay.isToday ? "Today · " : ""}${selectedDay.longDate} · °F`;

  // Weather card, labelled current or forecast (R7)
  $("card-label").textContent = selectedDay.isToday ? "Current conditions" : "Forecast";
  $("card-body").innerHTML = `
    <div class="card-main">
      ${icon(weather.icon, ICON_LABELS[weather.icon])}
      <p class="temp">${weather.temp}°${weather.tempLabel ? `<span class="temp-label">${weather.tempLabel}</span>` : ""}</p>
    </div>
    <dl class="card-details">
      <div><dt>Feels like</dt><dd>${Math.round(weather.feelsLike)}°</dd></div>
      <div><dt>Humidity</dt><dd>${weather.humidity}%</dd></div>
      <div><dt>Wind</dt><dd>${weather.wind} mph</dd></div>
    </dl>`;

  // Character, description and alt text all come from the same outfit pick.
  // No outfit means the key data is missing: the recommendation stays hidden (R12).
  document.querySelector(".outfit").hidden = !outfit;
  if (outfit) {
    const character = $("character");
    character.src = `assets/characters/${outfit.id}.webp`;
    character.alt = `Character wearing ${outfit.text.toLowerCase()}`;
    $("description").textContent = `${outfit.text}.`;
  }

  $("reminders").innerHTML = reminders
    .map((r) => `<li>${icon(r.icon)}<span>${r.text}</span></li>`)
    .join("");

  // Day strip
  $("day-list").innerHTML = days
    .map((d) => `
      <li>
        <button type="button" class="day" data-date="${d.date}"
          aria-pressed="${d.date === selectedDate}"
          ${d.date === selectedDate ? 'aria-current="date"' : ""}
          aria-label="${d.longDate}, ${ICON_LABELS[d.icon]}, high ${d.high}°">
          <span class="day-name">${d.isToday ? "Today" : d.shortName}</span>
          ${icon(d.icon)}
          <span class="day-temp">${d.high}°</span>
        </button>
      </li>`)
    .join("");

  renderCitySwitch(state.slots, state.activeSlot);

  // Keep the selected day visible in the sideways strip (phone), and give focus
  // back to the control the keyboard user was on.
  const selectedButton = document.querySelector('.day[aria-pressed="true"]');
  selectedButton?.scrollIntoView({ block: "nearest", inline: "nearest" });
  if (focusedIn === "day-list") selectedButton?.focus({ preventScroll: true });
  if (focusedIn === "city-switch") document.querySelector('.city[aria-pressed="true"]')?.focus();
  updateStripFade();

  wire(handlers);
}

export const placeName = (loc) => (loc.region ? `${loc.name}, ${loc.region}` : loc.name);

// City switch: two slots; an empty one reads "+ Add city" (R5, R5a).
function renderCitySwitch(slots, activeSlot) {
  $("city-switch").innerHTML = slots
    .map((slot, i) => slot
      ? `<button type="button" class="city" data-slot="${i}" aria-pressed="${i === activeSlot}"
           aria-label="${placeName(slot)}">${slot.name}</button>`
      : `<button type="button" class="city add" data-slot="${i}">+ Add city</button>`)
    .join("");
}

// First visit, before any location is chosen: prompt instead of weather.
export function renderEmpty(slots, handlers) {
  $("place").textContent = "Weather in Class";
  $("context").textContent = "What to wear, from the forecast";
  $("card-label").textContent = "No location yet";
  $("card-body").innerHTML = `<p class="card-message">Choose a US city, ZIP or your location to see the weather.</p>
    <button type="button" class="card-action" id="choose-first">Choose a location</button>`;
  $("choose-first").addEventListener("click", () => handlers.onChangeLocation?.());
  document.querySelector(".outfit").hidden = true;
  $("day-list").innerHTML = "";
  renderCitySwitch(slots, 0);
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
  const strip = document.querySelector(".day-strip");
  strip.addEventListener("scroll", updateStripFade, { passive: true });
  window.addEventListener("resize", updateStripFade);
  $("change-location").addEventListener("click", () => handlers.onChangeLocation?.());
  const credits = $("credits");
  $("open-credits").addEventListener("click", () => credits.showModal());
  // Close button and backdrop click; Esc is handled by <dialog>.
  credits.addEventListener("click", (e) => {
    if (e.target === credits || e.target.closest("[data-close]")) credits.close();
  });
}

// Mark which sides of the day strip have more days off screen (drives the fade hint).
function updateStripFade() {
  const strip = document.querySelector(".day-strip");
  const max = strip.scrollWidth - strip.clientWidth;
  strip.classList.toggle("more-left", strip.scrollLeft > 2);
  strip.classList.toggle("more-right", strip.scrollLeft < max - 2);
}
