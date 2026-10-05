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

// Outfits (spec.md, Content variation). Each id matches assets/characters/<id>.webp.
export const OUTFITS = {
  hot: [
    { id: "hot-1", text: "Graphic tee, athletic shorts, slide sandals" },
    { id: "hot-2", text: "Tank top, denim shorts, low-top sneakers, sunglasses" },
    { id: "hot-3", text: "Loose linen button-up, chino shorts, canvas sneakers, cap" },
  ],
  warm: [
    { id: "warm-1", text: "Plain tee, light jeans, white sneakers" },
    { id: "warm-2", text: "Polo shirt, chino shorts, canvas sneakers" },
    { id: "warm-3", text: "Striped tee, joggers, running shoes" },
  ],
  mild: [
    { id: "mild-1", text: "Long-sleeve tee, jeans, sneakers" },
    { id: "mild-2", text: "Flannel shirt open over a tee, chinos, sneakers" },
    { id: "mild-3", text: "Light crewneck sweatshirt, joggers, sneakers" },
  ],
  cool: [
    { id: "cool-1", text: "Hoodie, denim jacket, jeans, sneakers" },
    { id: "cool-2", text: "Knit sweater, light puffer vest, chinos, boots" },
    { id: "cool-3", text: "Quarter-zip pullover, bomber jacket, jeans, sneakers" },
  ],
  cold: [
    { id: "cold-1", text: "Long puffer coat, beanie, scarf, jeans, winter boots" },
    { id: "cold-2", text: "Wool peacoat, knit hat, gloves, thick sweater, boots" },
    { id: "cold-3", text: "Parka with hood, fleece layer, joggers, insulated boots" },
  ],
};

// Reminder and layer-note wordings (spec.md), with the icon each one shows.
export const MESSAGES = {
  umbrella: {
    icon: "umbrella",
    wordings: [
      "Rain's likely. Grab an umbrella.",
      "Umbrella day. Don't get caught between classes.",
      "Showers in the forecast. Pack an umbrella.",
    ],
  },
  sunscreen: {
    icon: "sunscreen",
    wordings: [
      "UV is up. Put on sunscreen (SPF 30+).",
      "Sunscreen before you head out.",
      "Strong sun. SPF 30+ is a good call.",
    ],
  },
  hydration: {
    icon: "water",
    wordings: [
      "Strong sun or heat. Bring a water bottle.",
      "Stay hydrated. Fill up your bottle.",
      "Long day in the sun or heat? Keep water with you.",
    ],
  },
  layer: {
    icon: "layer",
    wordings: [
      "Cooler at the start or end of the day. Bring a layer.",
      "It'll feel colder for part of the day. Pack an extra layer.",
      "Chilly hours ahead. Throw a layer in your bag.",
    ],
  },
};
