// Finding a location: US city or ZIP search through Open-Meteo geocoding (R2),
// and the browser's device location (R3, R4).

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

const STATE_CODES = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO",
  Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY",
  Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH",
  "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI",
  "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
  "Puerto Rico": "PR", Guam: "GU", "U.S. Virgin Islands": "VI",
};

// Returns [{ name, region, lat, lon }]. Only US results (countryCode=US).
export async function searchPlaces(query) {
  const params = new URLSearchParams({ name: query.trim(), count: 8, language: "en", format: "json", countryCode: "US" });
  const response = await fetch(`${GEOCODING_URL}?${params}`);
  if (!response.ok) throw new Error(`Geocoding responded ${response.status}`);
  const { results = [] } = await response.json();
  return results
    .filter((r) => r.country_code === "US")
    .map((r) => ({
      name: r.name,
      region: STATE_CODES[r.admin1] ?? r.admin1 ?? "",
      detail: [r.admin2, r.admin1].filter(Boolean).join(", "), // county and state, to tell same-named towns apart
      lat: r.latitude,
      lon: r.longitude,
    }));
}

// Device location. The app assumes it's in the US and doesn't check (spec R3 revision).
// Resolves { name: "My location", lat, lon }; rejects with a message for the sheet (R4).
export function deviceLocation() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("This browser can't share your location. Search for a city instead."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ name: "My location", region: "", lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(new Error(err.code === err.PERMISSION_DENIED
        ? "Location access is turned off. Search for a city or ZIP instead."
        : "Couldn't find your location. Search for a city or ZIP instead.")),
      { timeout: 10000, maximumAge: 10 * 60 * 1000 },
    );
  });
}
