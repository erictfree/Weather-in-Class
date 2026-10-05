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

Forecast days use the daily maximum feels-like temperature.

## Content variation

Define at least three outfit variations for each recommendation category and at least three wording variations for each reminder type. Define how outfit and reminder variations are chosen independently at random, and how a previously selected date keeps the same variations, including whether they persist after the page reloads.

## Assets

List every art and graphical asset: the character, each outfit variation, icons, and any other visuals. For each, note where it appears, its format, and whether it will be created, generated, or licensed, with its credit or license.

## Out of scope

Record features intentionally excluded from this project.

## Revisions

After implementation or testing, record requirement changes and the evidence that prompted them. Update the screen drawings when a material layout or interaction changes.

## Approval

The Developer reviews and explicitly approves this specification and its screen designs before planning begins.

## Saving the transcript

After the Developer approves the specification, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
