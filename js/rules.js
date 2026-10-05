// Recommendation rules from spec.md ("Recommendation state and data flow").
// Pure functions: no DOM or network, so every threshold can be unit-tested (R9).
//
// Inputs are rounded to whole numbers before comparing, so the rule always agrees
// with the value shown on screen (a feels-like of 79.6 shows as 80° and counts as Hot).

// Outfit groups by feels-like °F, warmest first. Cut-offs are a Developer product decision.
export const GROUPS = [
  { id: "hot", min: 80 },
  { id: "warm", min: 65 },
  { id: "mild", min: 55 },
  { id: "cool", min: 40 },
  { id: "cold", min: -Infinity },
];

export const LAYER_NOTE_GROUP = "cool";   // the low must be Cool or colder (Developer decision)
export const UMBRELLA_RAIN_CHANCE = 40; // % — product decision, no official cut-off
export const SUNSCREEN_UV = 3;          // EPA UV Index: Moderate and above
export const HYDRATION_FEELS_LIKE = 80; // °F — product decision
export const HYDRATION_UV = 8;          // EPA UV Index: Very High and above

const isNumber = (v) => typeof v === "number" && Number.isFinite(v);

export function groupFor(feelsLike) {
  if (!isNumber(feelsLike)) return null;
  const f = Math.round(feelsLike);
  return GROUPS.find((g) => f >= g.min).id;
}

const rank = (groupId) => GROUPS.findIndex((g) => g.id === groupId); // higher = colder

/**
 * day: one record from weather.js (feelsMax, feelsMin, rainChance, uvMax, rainChanceRestOfDay, isToday)
 * currentFeelsLike: today's current feels-like, ignored on forecast days
 * Returns { group, layerNote, reminders } or { group: null } when the key input is missing.
 */
export function recommend(day, currentFeelsLike) {
  // Group: every day, today included, uses the daily maximum feels-like.
  const group = groupFor(day.feelsMax);
  if (!group) return { group: null, layerNote: false, reminders: [] };

  // Layer note: the coldest part of the day is actually chilly (Cool or Cold, below 55°F)
  // and colder than the day's group. Today uses the lower of current and daily-minimum
  // feels-like; forecast days use the minimum.
  const lows = [day.feelsMin];
  if (day.isToday) lows.push(currentFeelsLike);
  const validLows = lows.filter(isNumber);
  const lowGroup = validLows.length ? groupFor(Math.min(...validLows)) : null;
  const layerNote = lowGroup !== null && rank(lowGroup) > rank(group) && rank(lowGroup) >= rank(LAYER_NOTE_GROUP);

  // Reminders, in display order.
  const rain = day.isToday ? day.rainChanceRestOfDay : day.rainChance;
  const uv = isNumber(day.uvMax) ? Math.round(day.uvMax) : null;
  const feels = Math.round(day.feelsMax);
  const reminders = [];
  if (isNumber(rain) && Math.round(rain) >= UMBRELLA_RAIN_CHANCE) reminders.push("umbrella");
  if (uv !== null && uv >= SUNSCREEN_UV) reminders.push("sunscreen");
  if (feels >= HYDRATION_FEELS_LIKE || (uv !== null && uv >= HYDRATION_UV)) reminders.push("hydration");

  return { group, layerNote, reminders };
}
