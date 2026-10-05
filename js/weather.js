// Open-Meteo forecast client (R1). Returns one record per day, all in the
// location's own timezone (timezone=auto), so "today" is the location's today.
import { iconForCode } from "./content.js";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export function forecastUrl(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    hourly: "precipitation_probability",
    daily: [
      "weather_code", "temperature_2m_max", "apparent_temperature_max", "apparent_temperature_min",
      "precipitation_probability_max", "uv_index_max", "relative_humidity_2m_mean", "wind_speed_10m_max",
    ].join(","),
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
    forecast_days: 7,
  });
  return `${FORECAST_URL}?${params}`;
}

export async function fetchForecast(lat, lon) {
  const response = await fetch(forecastUrl(lat, lon));
  if (!response.ok) throw new Error(`Open-Meteo responded ${response.status}`);
  return toDays(await response.json());
}

// Turn the raw response into { fetchedAt, current, days[] }.
export function toDays(data) {
  const { current, hourly, daily } = data;
  const today = daily.time[0];
  const currentHour = current.time.slice(0, 13); // "YYYY-MM-DDTHH"

  // Highest hourly rain chance from the current hour to midnight (umbrella rule, today only)
  const restOfToday = hourly.time
    .map((t, i) => [t, hourly.precipitation_probability[i]])
    .filter(([t]) => t.startsWith(today) && t.slice(0, 13) >= currentHour)
    .map(([, p]) => p);

  const days = daily.time.map((date, i) => ({
    date,
    isToday: i === 0,
    icon: iconForCode(daily.weather_code[i]),
    high: Math.round(daily.temperature_2m_max[i]),
    feelsMax: daily.apparent_temperature_max[i],
    feelsMin: daily.apparent_temperature_min[i],
    rainChance: daily.precipitation_probability_max[i],
    uvMax: daily.uv_index_max[i],
    humidity: Math.round(daily.relative_humidity_2m_mean[i]),
    wind: Math.round(daily.wind_speed_10m_max[i]),
    ...dateLabels(date),
  }));

  days[0].rainChanceRestOfDay = restOfToday.length ? Math.max(...restOfToday) : null;

  return {
    fetchedAt: new Date(),
    current: {
      icon: iconForCode(current.weather_code),
      temp: Math.round(current.temperature_2m),
      feelsLike: current.apparent_temperature,
      humidity: Math.round(current.relative_humidity_2m),
      wind: Math.round(current.wind_speed_10m),
    },
    days,
  };
}

// "2026-10-05" → { shortName: "Mon", longDate: "Mon, Oct 5" }.
// Formatted in UTC so the calendar date never shifts with the device's timezone.
function dateLabels(date) {
  const d = new Date(`${date}T12:00:00Z`);
  const fmt = (opts) => d.toLocaleDateString("en-US", { timeZone: "UTC", ...opts });
  return {
    shortName: fmt({ weekday: "short" }),
    longDate: fmt({ weekday: "short", month: "short", day: "numeric" }),
  };
}
