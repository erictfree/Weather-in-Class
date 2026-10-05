// Fixed content: weather icons now; outfits and wordings are added in CP3/CP4.

// WMO weather codes (as used by Open-Meteo) mapped to the 7 weather icons.
// https://open-meteo.com/en/docs — "WMO Weather interpretation codes"
export function iconForCode(code) {
  if (code <= 1) return "clear";              // 0 clear sky, 1 mainly clear
  if (code === 2) return "partly-cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 95) return "thunderstorm";      // 95, 96, 99
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  return "rain";                              // drizzle 51–57, rain 61–67, showers 80–82
}

export const ICON_LABELS = {
  clear: "Clear", "partly-cloudy": "Partly cloudy", cloudy: "Cloudy", fog: "Fog",
  rain: "Rain", snow: "Snow", thunderstorm: "Thunderstorm",
};
