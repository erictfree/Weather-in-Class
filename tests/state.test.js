// Recommendation state and variation tests (R8, R10).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildState, createPicker } from "../js/state.js";
import { OUTFITS, MESSAGES } from "../js/content.js";

const austin = { name: "Austin", lat: 30.2672, lon: -97.7431 };
const la = { name: "Los Angeles", lat: 34.0522, lon: -118.2437 };

// A forecast where every day is hot, rainy and high-UV, so all three reminders show.
const forecast = {
  current: { icon: "clear", temp: 88, feelsLike: 90, humidity: 40, wind: 8 },
  days: ["2026-10-05", "2026-10-06", "2026-10-07"].map((date, i) => ({
    date, isToday: i === 0, icon: "rain", high: 88, humidity: 50, wind: 10,
    feelsMax: 90, feelsMin: 75, rainChance: 70, rainChanceRestOfDay: 70, uvMax: 9,
    shortName: "D", longDate: date,
  })),
};

const build = (pick, location = austin, selectedDate = null) =>
  buildState({ location, forecast, selectedDate, pick, slots: [location, null], activeSlot: 0 });

test("one state holds group, outfit, reminders and weather for the selected day", () => {
  const s = build(createPicker());
  assert.equal(s.group, "hot");
  assert.ok(OUTFITS.hot.includes(s.outfit));
  assert.deepEqual(s.reminders.map((r) => r.type), ["umbrella", "sunscreen", "hydration"]);
  for (const r of s.reminders) assert.ok(MESSAGES[r.type].wordings.includes(r.text));
  assert.equal(s.weather.temp, 88); // today → current conditions
  assert.equal(build(createPicker(), austin, "2026-10-06").weather.tempLabel, "High"); // forecast day
});

test("returning to a date shows the same picks (same visit)", () => {
  const pick = createPicker();
  const first = build(pick, austin, "2026-10-06");
  build(pick, austin, "2026-10-07");
  build(pick, la, "2026-10-06");
  const again = build(pick, austin, "2026-10-06");
  assert.equal(again.outfit, first.outfit);
  assert.deepEqual(again.reminders.map((r) => r.text), first.reminders.map((r) => r.text));
});

test("picks are made per location and per date", () => {
  // A scripted random sequence: each new pick takes the next value.
  const seq = [0, 0.4, 0.8, 0.1, 0.5, 0.9, 0.2, 0.6, 0.95];
  let i = 0;
  const pick = createPicker(() => seq[i++ % seq.length]);
  const a = build(pick, austin, "2026-10-05");
  const b = build(pick, austin, "2026-10-06");
  assert.notEqual(a.outfit, b.outfit);
});

test("outfit and wordings are chosen independently, never as fixed pairs", () => {
  // Over many fresh visits, every outfit appears with every umbrella wording.
  const combos = new Set();
  for (let n = 0; n < 400; n++) {
    const s = build(createPicker());
    combos.add(`${s.outfit.id}|${s.reminders[0].text}`);
  }
  assert.equal(combos.size, OUTFITS.hot.length * MESSAGES.umbrella.wordings.length); // 3 × 3 = 9
});

test("a fresh visit (reload) can pick different variations", () => {
  const outfits = new Set();
  for (let n = 0; n < 50; n++) outfits.add(build(createPicker()).outfit.id);
  assert.equal(outfits.size, 3);
});

test("missing feels-like data gives no outfit", () => {
  const broken = structuredClone(forecast);
  broken.days[0].feelsMax = null;
  const s = buildState({ location: austin, forecast: broken, selectedDate: null, pick: createPicker(), slots: [], activeSlot: 0 });
  assert.equal(s.outfit, null);
  assert.equal(s.group, null);
});
