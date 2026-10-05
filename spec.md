# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved research, project brief, and hand-drawn screen designs into testable requirements.

## Instructions for the Developer

Make and approve the product decisions, draw every proposed screen, provide the drawings to the Agent, and keep this file current as the intended result changes.

To begin, open the project repository in a fresh chat and enter:

`Read ./spec.md and help me begin the Project 3 specification.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, and this file. Review the screen drawings the Developer provides. Ask one focused question at a time, surface gaps and trade-offs without inventing requirements, and keep the specification concise and testable.

## Goal

State what the app should help its Users accomplish and name the user story or stories that define that need.

Help a US college student decide what to wear for today or any of the next six days. They get a glance at the forecast for a location they choose, turned into a character dressed for the conditions, a short written outfit description and reminders (umbrella, sunscreen, water), so they don't have to interpret raw weather data. Defined by the user stories in `research.md`: the main quick-glance story, forgotten prep items, planning ahead, high-contrast readability, and switching between two places.

## Screen designs

Draw every proposed screen by hand, in both phone and laptop layouts, on paper, a tablet, a whiteboard, or another hand-drawing surface. Save photos or exports in `reference/`, provide them to the Agent, and link them here. Use the drawings to define layout, hierarchy, controls, navigation, and important interaction states.

- [Hand sketch, v1](reference/screens-v1-sketch.jpg): phone, desktop and credits.
- [Wireframe, v2](reference/screens-v2-wireframe.png) ([SVG](reference/screens-v2-wireframe.svg)): redrawn from the sketch with a revised location control and date picker.

**The Developer chose v2 as the layout the build follows.** v1 remains the original hand drawing that v2 is based on.

**Main screen, phone (top to bottom):** header with the active place, the date and units (read-only); a weather card labelled current or forecast, showing an icon, the temperature, feels like, humidity and wind; the character; the clothing description; the reminder row; the 7-day strip, which scrolls sideways; the two-city switch and the ✎ Change button, within thumb reach; and a Credits link.

**Main screen, laptop:** the header is at top left, with the two-city switch and ✎ at top right; all 7 days show in a full-width row; the weather card is on the left and the character is on the right, with the clothing description and reminder row under the character; Credits is at the bottom.

**Reminders:** a row of icons with short text, placed directly under the clothing description in both layouts.

**Change location:** opens from ✎ as a bottom sheet on the phone and a dropdown on the laptop. It contains a US city or ZIP search, "Use my location" and a results list, and it replaces the selected city. If location permission is denied, it shows a short message and search stays available.

**Credits:** a popup, the same in both layouts.

**Data source:** named in the Credits popup only. The Developer decided not to show it on the main screen, even though the spec template asks for it there.

**Loading and errors:** these appear inside the weather card. While data loads, the card shows "Loading…". On a service error or missing data, it shows a plain-language message and a **Retry** button. The character, clothing description and reminders stay hidden until there is valid data. If older data is still on screen, for example after a failed refresh, the card shows "Last updated [time]".

**Deliberate change from the brief:** the brief says to save only the most recent location. The Developer has chosen the two-city switch as the additional feature, so two locations are saved on the device.

## Requirements

Translate every fixed brief requirement and the selected research-driven feature into a testable requirement. Define the chosen behavior, content, controls, current and forecast data, responsive layout, accessibility, error handling, privacy, credits, and deployment. The main screen should make clear the location, date, units, data source, and whether conditions are current or forecast. Include an acceptance check for each requirement.

DRAFT, awaiting Developer review. Items marked *(proposed)* are Agent suggestions that need a decision.

| # | Requirement | Acceptance check |
|---|---|---|
| R1 | **Live weather.** Current and 7-day forecast data (today plus 6 days) comes from Open-Meteo. No values are hard-coded. | The values shown match an Open-Meteo API response for the same coordinates and time. |
| R2 | **Manual location.** In Change location, the User searches by US city or ZIP using Open-Meteo geocoding. Only US results are listed. | "Austin" and "78701" both find Austin, TX. "London" shows no UK result. |
| R3 | **Device location.** "Use my location" asks for browser permission and uses the coordinates it returns. A location outside the US shows a message and the location is not used. | Allowing permission shows local weather. A non-US position shows the message. |
| R4 | **Denied location.** If permission is denied or unavailable, a short message appears in the sheet and search still works. | Block location in the browser, tap "Use my location", see the message, then search successfully. |
| R5 | **Two-city switch (additional feature).** Two location slots. ✎ replaces the selected slot. Switching takes one tap. Both slots and the active one are saved in `localStorage`. This is a deliberate change from the brief's single saved location. | Set Austin and LA, switch between them, reload: both are still there and the active one is the same. |
| R6 | **Date selection.** A 7-day strip (swipe on phone, full row on laptop). Today is selected by default. The selected day is visibly marked by more than colour alone. | Choose each day: the header date, the card label and the recommendation all update. |
| R7 | **Main-screen context.** The header shows the place, the date and °F. The weather card is labelled "Current conditions" for today and "Forecast" for other days. The data source appears in Credits only (Developer decision). | Check the header and card label on today and on a forecast day. |
| R8 | **One recommendation state.** Location, date and weather data produce one state object (group, outfit pick, active reminders, wording picks, layer note). The character image, weather icon, clothing description, reminders and alt text all read from it. | In code review, no output computes its own rule. Change the state in dev tools: every output changes together. |
| R9 | **Rules.** Outfit groups, the layer note and reminders follow the tables under Recommendation state. | Test inputs at each threshold boundary (for example 79/80°F, 39%/40%, UV 2/3, UV 7/8) give the expected output. |
| R10 | **Variations.** At least 3 outfits per group and 3 wordings per reminder or note, picked independently at random. Revisiting a location and date in the same visit shows the same picks. A reload may re-pick. | Over 20 loads of the same day, different outfit and wording combinations appear. Moving between dates and back keeps the picks. |
| R11 | **Credits / info popup.** Lists the creator; Open-Meteo with a link and CC BY 4.0 attribution; the recommendation methods and sources (EPA, NWS, product decisions); privacy practices; and art credits, including the AI tool used. | Open it on phone and laptop and check that every item is there. |
| R12 | **Loading, missing data, errors.** Shown inside the weather card as described in Screen designs, with Retry and "Last updated [time]". | Throttle the network to see the loading state. Block the API to see the error and Retry. Restore the network and Retry recovers. |
| R13 | **Responsive layout.** Phone and laptop layouts follow the v2 wireframe. *(proposed)* Switch at a 900px viewport width. | At 375px and 1280px widths, the layout matches the wireframe with no horizontal scrolling. |
| R14 | **One-handed phone use.** The day strip, city switch and ✎ sit in the bottom third of the screen. *(proposed)* Touch targets are at least 44×44px. | On a real phone, every main control can be reached with the thumb of the holding hand. |
| R15 | **Accessibility, WCAG 2.2 AA.** Contrast is at least 4.5:1 for text and 3:1 for UI. Nothing relies on colour alone. The character's alt text comes from the state (for example "Character wearing a hoodie, denim jacket, jeans and sneakers"). Everything works with a keyboard and focus is visible. Popups and sheets trap focus and close with Esc. Reminders are icon plus text. | Run an axe or Lighthouse accessibility check with no failures, plus a manual keyboard-only pass and a screen-reader spot check. |
| R16 | **Privacy.** Location is sent only to Open-Meteo. Only the two location slots are stored on the device. No accounts, analytics or cookies. | In dev tools, network requests go only to Open-Meteo and the site's own host, and `localStorage` holds only the location data. |
| R17 | **Deployment.** The app is served over HTTPS from GitHub Pages. | The public URL loads on a real phone and a laptop. |

## Recommendation state and data flow

Define the weather inputs, recommendation categories, coded rules, and shared state. Weather values must come from the provider, and rules must follow the weather guidance cited in `research.md`. The selected location, date, and live weather data must produce one recommendation state that drives every visual and written output.

**Outfit groups.** These use feels-like (apparent) temperature from Open-Meteo, following the NWS wind-chill guidance cited in `research.md`. The cut-offs are a product decision by the Developer, not a cited standard.

| Group | Feels-like °F | Example outfit |
|---|---|---|
| Hot | 80 and above | Tee, shorts, sneakers |
| Warm | 65–79 | Tee or light top, jeans or shorts |
| Mild | 55–64 | Long sleeves or light layer, jeans |
| Cool | 40–54 | Sweater or hoodie, jacket, jeans |
| Cold | below 40 | Heavy coat, hat, boots |

Every day, today included, uses the daily maximum feels-like temperature to choose the group. **Layer note:** if the lower of the current and daily-minimum feels-like temperatures falls in a colder group than the chosen one, the clothing description adds a short note to bring a layer, for example "Cool morning, bring a layer." On forecast days only the daily minimum is used.

**Reminders.**

| Reminder | Trigger | Input (today / forecast day) | Basis |
|---|---|---|---|
| Umbrella | Rain chance 40% or higher | Highest hourly precipitation probability from now to midnight / daily maximum precipitation probability | Product decision; there is no official cut-off (`research.md`) |
| Sunscreen | UV index 3 or higher | Daily maximum UV index (both) | EPA UV Index scale: Moderate and above (`research.md`) |
| Hydration | Feels-like 80°F or higher, or UV index 8 or higher | Daily maximum feels-like and daily maximum UV index (both) | Product decision; there is no cited standard (`research.md`) |

## Content variation

Define at least three outfit variations for each recommendation category and at least three wording variations for each reminder type. Define how outfit and reminder variations are chosen independently at random, and how a previously selected date keeps the same variations, including whether they persist after the page reloads.

**Selection.** Each output picks its variation independently at random from the eligible options: the outfit (within its group), the wording for each active reminder, and the wording for the layer note. Outfits and reminders are never paired.

**Memory.** Picks are remembered in memory for each location and date during the current visit, so going back to a date shows the same variations. Nothing is written to storage. A page reload picks fresh variations (Developer decision).

**Outfits** (approved by the Developer). Each outfit is one character image. The text becomes the clothing description.

| Group | ID | Outfit |
|---|---|---|
| Hot | hot-1 | Graphic tee, athletic shorts, slide sandals |
| Hot | hot-2 | Tank top, denim shorts, low-top sneakers, sunglasses |
| Hot | hot-3 | Loose linen button-up, chino shorts, canvas sneakers, cap |
| Warm | warm-1 | Plain tee, light jeans, white sneakers |
| Warm | warm-2 | Polo shirt, chino shorts, canvas sneakers |
| Warm | warm-3 | Striped tee, joggers, running shoes |
| Mild | mild-1 | Long-sleeve tee, jeans, sneakers |
| Mild | mild-2 | Flannel shirt open over a tee, chinos, sneakers |
| Mild | mild-3 | Light crewneck sweatshirt, joggers, sneakers |
| Cool | cool-1 | Hoodie, denim jacket, jeans, sneakers |
| Cool | cool-2 | Knit sweater, light puffer vest, chinos, boots |
| Cool | cool-3 | Quarter-zip pullover, bomber jacket, jeans, sneakers |
| Cold | cold-1 | Long puffer coat, beanie, scarf, jeans, winter boots |
| Cold | cold-2 | Wool peacoat, knit hat, gloves, thick sweater, boots |
| Cold | cold-3 | Parka with hood, fleece layer, joggers, insulated boots |

**Reminder and note wordings** (approved by the Developer).

| Type | Wording 1 | Wording 2 | Wording 3 |
|---|---|---|---|
| Umbrella | Rain's likely. Grab an umbrella. | Umbrella day. Don't get caught between classes. | Showers in the forecast. Pack an umbrella. |
| Sunscreen | UV is up. Put on sunscreen (SPF 30+). | Sunscreen before you head out. | Strong sun today. SPF 30+ is a good call. |
| Hydration | Big sun and heat today. Bring a water bottle. | Stay hydrated. Fill up your bottle. | Heat's on. Keep water with you. |
| Layer note | Cooler at the start or end of the day. Bring a layer. | It'll feel colder for part of the day. Pack an extra layer. | Chilly hours ahead. Throw a layer in your bag. |

## Assets

List every art and graphical asset: the character, each outfit variation, icons, and any other visuals. For each, note where it appears, its format, and whether it will be created, generated, or licensed, with its credit or license.

DRAFT.

| Asset | Count | Where | Format | Source |
|---|---|---|---|---|
| Character in each outfit (IDs in Content variation) | 15 | Main screen | PNG or WebP, transparent background | AI-generated (tool still to be chosen; credited in R11) |
| Weather icons: clear, partly cloudy, cloudy, fog, rain, snow, thunderstorm | 7 | Weather card, day strip | SVG | *(open)* |
| Reminder icons: umbrella, sunscreen, water, layer | 4 | Reminder row | SVG | *(open)* |
| UI icons: edit ✎, location crosshair, close ×, checkmark | 4 | Controls | SVG | *(open)* |

## Out of scope

Record features intentionally excluded from this project.

DRAFT.

- Locations outside the US.
- °C and other unit options (°F only).
- Hourly forecast view, and forecasts beyond 7 days.
- Accounts, a backend, analytics.
- Push notifications.
- The User's own wardrobe or clothing preferences.
- Keeping variation picks after a reload.
- Offline use beyond showing the last loaded data during a visit.

## Revisions

After implementation or testing, record requirement changes and the evidence that prompted them. Update the screen drawings when a material layout or interaction changes.

## Approval

The Developer reviews and explicitly approves this specification and its screen designs before planning begins.

## Saving the transcript

After the Developer approves the specification, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
