# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Research your context of use, references, weather guidance, technical options, and choices that will guide the specification.

## Instructions for the Developer

Judge sources and recommendations, make the consequential decisions, and keep this file current as the work develops.

To begin, open the project repository in a fresh chat and enter:

`Read ./research.md and help me begin Project 3 research.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, and this file. Ask one focused question at a time. Help investigate and compare options without deciding for the Developer. Verify sources directly and keep this file concise.

## Context of use

As the User, describe when and where you would use the app and what you need from it. Record important circumstances, assumptions, and limitations.

Used both for a quick same-day check (grabbing the phone before leaving for class) and for planning ahead a day or more (e.g. the night before an event). Phone is the primary device; laptop use happens when planning ahead from a desk.

Assumptions and limitations:
- Connectivity between buildings or on the way to class can be weak or spotty; the app should indicate when data is stale, loading, or unavailable rather than failing silently.
- The User may check more than one US location across sessions (e.g. home town vs. campus), even though the brief specifies saving only the most recent location on the device.

## User story

Write at least one user story grounded in your context of use:

> As a [type of user], I want to [need or goal], so that [reason or outcome].

Focus on the need rather than prescribing an interface or feature.

> As a college student deciding what to wear, I want a quick glance at today's or an upcoming day's forecast translated into a concrete outfit and reminders, so that I don't have to interpret raw weather data myself before heading out.

> As a student who often forgets small prep items, I want a clear reminder when conditions call for an umbrella, sunscreen, or extra water, so that I'm not caught off guard partway through the day.

> As a student with an event or trip coming up, I want to check a forecast date in advance and see what to wear for it, so that I can plan and pack ahead of time rather than guessing.

> As a student who needs high-contrast, readable visuals, I want the recommendation and reminders to remain legible under high-contrast or similar accessibility settings, so that I can use the app effectively outdoors or with visual accommodations.

> As a student who splits time between two places (e.g. home and campus), I want to switch locations easily even though only the most recent is saved, so that I'm not stuck with an outdated location.

## References

Collect 5–10 reference images from relevant products and interfaces. Save each image in `reference/`, identify its source, and record a brief observation about what is useful, ineffective, or relevant to this project. Reference images are examples only; do not use them in the app.

1. **`reference/01-weatherfit.jpg`** — [WeatherFit: Outfit Forecast](https://apps.apple.com/us/app/weather-fit-outfit-forecast/id1194408342), App Store screenshot. Full-body illustrated character standing in a scene that matches the forecast (season, sky, weather), with the temperature and "feels like" shown above. Closest structural match to this project's character concept — outfit and background both reflect one weather state at a glance.

2. **`reference/02-thewear.png`** — [TheWear](https://apps.apple.com/us/app/thewear/id1481102346), App Store screenshot. Simpler character-only illustration (no scene/background) against a flat color tied to conditions, with location and temperature above. Shows a leaner alternative to WeatherFit's fuller scene — less art to produce, still legible.

3. **`reference/03-stylix.jpg`** — [Stylix: Plan Outfit by Weather](https://apps.apple.com/us/app/stylix-plan-outfit-by-weather/id6737645412), App Store screenshot. AI-generated photo of a person wearing an outfit, with weather detail (feels like, wind, humidity, UV) and an hourly strip below. No illustrated character; useful for how much weather detail can surround a recommendation without crowding it, but the photorealistic-model approach doesn't fit a drawn/original-art character.

4. **`reference/04-wearther.jpg`** — [Wearther: What to Wear](https://apps.apple.com/us/app/wearther-what-to-wear/id6757251662), App Store screenshot. No character — instead lays out recommended items (top, bottom, shoes, accessory) as a flat-lay grid pulled from the user's own wardrobe. Relevant for the "recommendation categories" structure (tops/bottoms/shoes) even though it skips the character entirely.

5. **`reference/05-dailydressme.jpg`** — [Daily Dress Me](https://apps.apple.com/us/app/daily-dress-me-what-to-wear/id6447927117), App Store screenshot. Flat-lay outfit photo (sweater, jeans, bag, shoes) with a short day/forecast strip at the bottom. Similar wardrobe-flat-lay pattern to Wearther; confirms that's a distinct, non-character convention in this space rather than a one-off.

6. **`reference/06-forecastwhattowear.png`** — [Forecast & What to Wear](https://mwm.ai/apps/forecast-what-to-wear/1396769360), App Store screenshot, designed for children. Cartoon character plus a row of individual clothing-item icons (shoes, pants, shirt, jacket) alongside the character, with big tappable weather-period buttons (Now/Today/Tomorrow). The icon row makes the recommendation's parts legible independent of the character illustration — a useful accessibility/clarity pattern (don't rely on the character alone to convey the recommendation).

7. **`reference/07-weatherproof.jpg`** — [Weatherproof – What to Wear?](https://play.google.com/store/apps/details?id=com.changemystyle.weatherproof&hl=en_US), Google Play screenshot. No character at all — just weather data plus a row of plain clothing-symbol icons (umbrella, sunscreen shirt, pants, boots). Demonstrates the minimum viable version of a "recommendation state to visuals" mapping; useful as a floor to compare against, and as a model for reminder icons specifically.

8. **`reference/08-clotim.png`** — [Clotim](https://www.producthunt.com/products/clotim), product screenshot. Conversational/card layout: a sentence describing the weather ("San Francisco is cold and rainy with 54°F"), a short written reminder ("Take the umbrella"), then a list of clothing categories with emoji. Relevant for wording style — pairs a plain-language reminder sentence with the data, which is closer to the brief's "written recommendation" requirement than the pure-icon apps above.

**Overall takeaway:** two real conventions exist — illustrated-character apps (WeatherFit, TheWear, Forecast & What to Wear) that show outfit + reminders through one figure, and wardrobe/icon apps (Stylix, Wearther, Daily Dress Me, Weatherproof, Clotim) that skip the character and list items or icons directly. The brief's "character is the focus of the main screen" requirement points toward the first group, but the icon-row pattern from Forecast & What to Wear and Weatherproof is worth borrowing so weather icons and reminders stay legible independent of the character art.

## Weather and technical evidence

Record each useful source, what it supports, and important limitations. Research the weather variables, apparel guidance, reminders, accessibility, privacy, artwork, weather providers, and technical options needed for informed decisions.

### Weather provider

Compared three free options:

- **[National Weather Service API](https://www.weather.gov/documentation/services-web-alerts)** — free, no key, official US-only source, matches the brief's "US location" scope exactly. Requires a two-step lat/lon → grid point → forecast lookup, a `User-Agent` header, and a separate geocoder for manual address entry (no built-in geocoding).
- **[OpenWeatherMap One Call 3.0](https://openweathermap.org/price)** — free tier of 1,000 calls/day, requires signup with a credit card on file. Global coverage with built-in geocoding, but a search result flagged possible deprecation in favor of a newer version; not independently verified.
- **[Open-Meteo](https://open-meteo.com/en/terms)** — free, no key, no signup, 10,000 calls/day. Current + forecast + geocoding endpoints in one API. Free tier is non-commercial-use only; [Open-Meteo's terms](https://open-meteo.com/en/terms) explicitly list "educational content" as a qualifying non-commercial use, which fits this project. Data is licensed CC-BY 4.0, requiring attribution.

**Decision: Open-Meteo.** Lowest integration friction (no key/signup, built-in geocoding), generous free limits, and its terms directly cover educational use. Attribution requirement is satisfied by the brief's existing info-screen requirement to credit the weather-data source.

Confirmed via [Open-Meteo's docs](https://open-meteo.com/en/docs) that the variables needed for every reminder category in the brief are available in one API: UV index (sunscreen), precipitation probability/amount (umbrella), apparent/"feels-like" temperature (outfit warmth, combines wind chill + humidity + solar radiation), relative humidity/dew point (hydration), and wind speed/gusts (jacket vs. layers). No second data source needed.

### Apparel and reminder guidance

- **Sunscreen (UV Index):** [EPA UV Index scale](https://www.epa.gov/sites/default/files/documents/uviguide.pdf) — 1–2 Low, 3–5 Moderate, 6–7 High, 8–10 Very High, 11+ Extreme. EPA guidance recommends SPF 30+ broad-spectrum sunscreen starting at Moderate (3+), with long sleeves added at High (6+) and reapplication every two hours at Extreme (11+).
- **Umbrella (precipitation):** No single official percentage threshold found; [Open-Meteo's precipitation probability field](https://open-meteo.com/en/docs) uses a >0.1mm threshold to register a "yes." A reasonable, common convention (used by most consumer weather apps) is to surface the umbrella reminder at ≥40–50% precipitation probability — this is a product judgment call, not a cited standard, and needs Developer sign-off.
- **Cold-weather layering:** [NWS wind chill guidance](https://www.weather.gov/media/unr/windchill.pdf) — wind chill is only defined at or below 50°F with wind above 3 mph; recommends layering, a hat, and covering skin as wind chill drops, with frostbite risk at extreme values. Supports using apparent/"feels-like" temperature (already available from Open-Meteo) rather than raw air temperature for the outfit-warmth rule.
- **Hydration:** No cited standard — triggered as a simple common-sense proxy based on high temperature and/or high UV rather than a specific outdoor-exertion guideline (workplace heat-stress figures don't fit a student's daily walk to class).

**Needs Developer decision:** exact numeric thresholds for each recommendation category and reminder (e.g. the specific °F bands per outfit category, the precipitation-probability cutoff, the temperature/UV cutoff for hydration) belong in `spec.md` as testable requirements, informed by this sourced guidance.

### Privacy

**This app** (client-side static site, no backend planned):
- Device location, if used, comes from the browser's Geolocation API, which prompts the user for permission directly — the app never accesses it silently.
- The selected location (device or manual) is sent to Open-Meteo to fetch weather data; that is the only place location data leaves the device.
- Per the brief, only the most recent location is saved, in browser storage (e.g. `localStorage`) on the user's own device — not sent to or stored on any server, since there is no backend.
- No accounts, no analytics or tracking planned.

**Open-Meteo** (confirmed via [their terms](https://open-meteo.com/en/terms)):
- The Open-Meteo website itself collects no user data and uses no cookies.
- The free API logs IP address and request coordinates only for abuse-prevention/troubleshooting, does not share logs with third parties, and deletes them after 90 days.

### Artwork approach

**Decision: AI-generated art** for the character and outfit variations. Specific tool not yet chosen — to be selected during asset creation, once recommendation categories (and the resulting art count) are finalized in `spec.md`. The info screen's art-credits/license requirement will need to disclose the AI tool used once picked.

### Accessibility standard

**Decision: WCAG 2.2 Level AA.** Confirmed via [W3C's WCAG 2.2](https://www.w3.org/TR/WCAG22/) (current recommendation) and [WebAIM](https://webaim.org/articles/contrast/). Requirements most relevant to this app:

- **Contrast:** 4.5:1 for normal text, 3:1 for large text (18pt+, or 14pt bold) and for UI components/graphics.
- **Don't rely on color alone (1.4.1):** weather state (warm/cold, rain/clear) and reminders must also be conveyed through icons/text, not color shift alone — supports user story #4 and the icon-row pattern noted in reference #6/#7.
- **Target size (2.5.8):** interactive elements at least 24×24 CSS px — relevant to one-handed phone use.
- **Text alternatives (1.1.1):** the character illustration and weather/reminder icons need accessible text equivalents so the recommendation state isn't conveyed by the picture alone.

Screen-reader-specific implementation (ARIA patterns, live regions) deferred to `spec.md`/build time once the actual screen structure is known.

### Deployment

**Decision: GitHub Pages**, matching the brief's recommendation. This repo is already public on GitHub, so Pages can be enabled directly from it without a separate hosting account.

## Decisions

Record the selected weather provider, forecast range, recommendation categories and rules, screen structure, visual direction, artwork approach (original, AI-generated, or appropriately licensed), deployment method, and one additional feature justified by the research. Briefly explain important trade-offs.

Once the recommendation categories are chosen, estimate the art needed: the character, three outfit variations per category, weather icons, and reminder icons. Use that estimate to choose the artwork approach.

- **Weather provider:** Open-Meteo (see Weather and technical evidence above).
- **Forecast range:** 7 days (today + next 6 days), well within Open-Meteo's supported forecast window. Matches typical weather-app conventions and covers most trip/event planning without stretching into low-confidence long-range forecasts.
- **Artwork approach:** AI-generated (tool TBD during asset creation).
- **Deployment:** GitHub Pages.
- **Recommendation categories:** top, bottom, footwear, outerwear. Each needs at least 3 variations per the brief.
- **Reminder categories:** umbrella (rain), sunscreen (UV), hydration (heat) — the three examples named directly in the brief. Each needs at least 3 wording variations per the brief.
- **Art estimate:** 1 base character + up to 4 categories × 3 variations = up to 12 clothing-art pieces, plus weather icons (sun/cloud/rain/snow, etc.) and reminder icons (umbrella, sunscreen, water). Confirms AI-generated art is the right call above — 12+ clothing pieces plus icons is a lot to commission or hand-draw within the project timeline.
- **Visual direction:** cartoon, Pixar-style 3D-ish illustration. Detailed screen structure and layout deferred to `spec.md`, defined from hand-drawn screens once drawn.
- **Additional feature:** quick two-location switch — lets the User flip between two saved locations (e.g. home town and campus) without re-entering one each time. Directly answers user story #5 (splitting time between two places), which the brief's "save only the most recent location" requirement doesn't cover on its own.

## Revisions

Record new evidence or changed decisions and explain why they changed.

- **2026-10-05:** Corrected the additional-feature reference to user story #5 (there are five stories), removed an unsourced claim that Stylix and Wearther support multiple locations, and reworded the art-estimate timeline note. No decisions changed.

## Approval

The Developer reviews the sources and decisions, corrects this file, and explicitly approves it before specification begins.

## Saving the transcript

After the Developer approves the research, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/research-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
