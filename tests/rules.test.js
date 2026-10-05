// Boundary tests for the recommendation rules (R9). Run: npm test (or node --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { groupFor, recommend } from "../js/rules.js";
import { iconForCode } from "../js/content.js";

// A mild forecast day with nothing triggered; each test overrides what it checks.
const day = (overrides = {}) => ({
  isToday: false, feelsMax: 60, feelsMin: 58, rainChance: 0, uvMax: 0, rainChanceRestOfDay: null,
  ...overrides,
});

test("outfit groups at each feels-like boundary", () => {
  const cases = [
    [80, "hot"], [79, "warm"],
    [65, "warm"], [64, "mild"],
    [55, "mild"], [54, "cool"],
    [40, "cool"], [39, "cold"],
    [-10, "cold"], [110, "hot"],
  ];
  for (const [f, group] of cases) assert.equal(groupFor(f), group, `${f}°F`);
});

test("values are rounded before comparing, matching what is shown", () => {
  assert.equal(groupFor(79.5), "hot");  // shows 80°
  assert.equal(groupFor(79.4), "warm"); // shows 79°
});

test("group uses the daily maximum feels-like, today included", () => {
  assert.equal(recommend(day({ feelsMax: 85, feelsMin: 70 })).group, "hot");
  assert.equal(recommend(day({ isToday: true, feelsMax: 85, feelsMin: 70 }), 72).group, "hot");
});

test("layer note when the low falls in a colder group", () => {
  assert.equal(recommend(day({ feelsMax: 70, feelsMin: 66 })).layerNote, false); // both warm
  assert.equal(recommend(day({ feelsMax: 70, feelsMin: 64 })).layerNote, true);  // mild low
});

test("today's layer note uses the lower of current and daily-minimum feels-like", () => {
  const today = day({ isToday: true, feelsMax: 70, feelsMin: 66 });
  assert.equal(recommend(today, 68).layerNote, false);
  assert.equal(recommend(today, 63).layerNote, true); // current is colder than the daily min
});

test("forecast days ignore the current feels-like for the layer note", () => {
  assert.equal(recommend(day({ feelsMax: 70, feelsMin: 66 }), 30).layerNote, false);
});

test("umbrella at 40% rain chance", () => {
  assert.ok(!recommend(day({ rainChance: 39 })).reminders.includes("umbrella"));
  assert.ok(recommend(day({ rainChance: 40 })).reminders.includes("umbrella"));
});

test("today's umbrella uses the rain chance from now to midnight, not the daily max", () => {
  const today = day({ isToday: true, rainChance: 90, rainChanceRestOfDay: 10 });
  assert.ok(!recommend(today, 60).reminders.includes("umbrella"));
  const later = day({ isToday: true, rainChance: 20, rainChanceRestOfDay: 40 });
  assert.ok(recommend(later, 60).reminders.includes("umbrella"));
});

test("sunscreen at UV 3", () => {
  assert.ok(!recommend(day({ uvMax: 2 })).reminders.includes("sunscreen"));
  assert.ok(recommend(day({ uvMax: 3 })).reminders.includes("sunscreen"));
  assert.ok(recommend(day({ uvMax: 2.6 })).reminders.includes("sunscreen")); // rounds to 3
});

test("hydration at feels-like 80°F", () => {
  assert.ok(!recommend(day({ feelsMax: 79 })).reminders.includes("hydration"));
  assert.ok(recommend(day({ feelsMax: 80 })).reminders.includes("hydration"));
});

test("hydration at UV 8, even when it isn't hot", () => {
  assert.ok(!recommend(day({ uvMax: 7 })).reminders.includes("hydration"));
  assert.ok(recommend(day({ uvMax: 8 })).reminders.includes("hydration"));
});

test("reminders are independent and keep a fixed order", () => {
  assert.deepEqual(recommend(day({ feelsMax: 90, rainChance: 60, uvMax: 9 })).reminders,
    ["umbrella", "sunscreen", "hydration"]);
  assert.deepEqual(recommend(day()).reminders, []);
});

test("missing data: no group without feels-like, missing reminder inputs don't trigger", () => {
  assert.equal(recommend(day({ feelsMax: null })).group, null);
  const r = recommend(day({ rainChance: null, uvMax: null, feelsMin: null }));
  assert.equal(r.group, "mild");
  assert.deepEqual(r.reminders, []);
  assert.equal(r.layerNote, false);
});

test("WMO weather codes map to the 7 icons", () => {
  const cases = [
    [0, "clear"], [1, "clear"], [2, "partly-cloudy"], [3, "cloudy"],
    [45, "fog"], [48, "fog"],
    [51, "rain"], [57, "rain"], [61, "rain"], [67, "rain"], [80, "rain"], [82, "rain"],
    [71, "snow"], [77, "snow"], [85, "snow"], [86, "snow"],
    [95, "thunderstorm"], [96, "thunderstorm"], [99, "thunderstorm"],
  ];
  for (const [code, icon] of cases) assert.equal(iconForCode(code), icon, `code ${code}`);
});
