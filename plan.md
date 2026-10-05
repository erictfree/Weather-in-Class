# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved specification into an ordered, trackable build and verification plan.

## Instructions for the Developer

Set priorities, review the checklist, verify results rather than relying only on the Agent's report, and keep the project documents current as the work changes. Expect the build to take many rounds of testing and fixing; record material changes under Revisions.

To begin planning, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me create the Project 3 implementation plan.`

After approving the plan, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me implement the approved Project 3 plan in working checkpoints.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, `spec.md`, and this file, then inspect the relevant project files. Propose concrete tasks and checks without expanding the approved scope.

During implementation, follow the approved plan in working checkpoints and keep it current. Never mark approvals or items requiring Developer verification complete on the Developer's behalf.

## Approach

Summarize the structure, data flow, dependencies, task order, and main risks.

**Structure (Developer approved: plain files, no build step).** A static site with no build step: `index.html`, one stylesheet, and plain JavaScript modules. GitHub Pages serves the files as they are, so there is no bundler, `node_modules` or build output to manage. Modules:

- `weather.js`: calls Open-Meteo for forecast and geocoding and turns each response into one record per day. All times use the location's own timezone (`timezone=auto`).
- `rules.js`: pure functions for the outfit group, the layer note and the reminders, using the thresholds in `spec.md`. It has no DOM or network code, so the boundary values can be tested directly.
- `state.js`: builds the single recommendation state from the location, date and weather. It chooses variations and remembers them in memory for each location and date during the visit.
- `storage.js`: reads and writes the two location slots in `localStorage`. Nothing else is stored.
- `ui.js`: renders every output from the state and wires up the controls.
- `content.js`: outfit IDs and text, reminder and note wordings, and the map from WMO weather codes to the 7 weather icons.
- `tests/`: unit tests for `rules.js` and `state.js`, run with Node's built-in test runner (`node --test`), so there are no dependencies.

**Data flow.** The active location slot and the selected date go to `weather.js`, which returns day records. `rules.js` turns those into a group, reminders and a layer note. `state.js` adds the variation picks and produces one state object. `ui.js` draws everything from that object: the character image, weather icon, clothing description, reminders and alt text. For dev-tools checks (R8), the state is exposed as `window.appState`, and a `render()` hook redraws after it is edited.

**Dependencies.** Open-Meteo forecast and geocoding APIs (no key), the browser Geolocation API, and GitHub Pages. The AI image tool is still to be chosen.

**Task order.** The art starts first because it is the longest-running task, and placeholder art is used until it is ready. The layout is built from the v2 wireframe with fake data. Next come real weather data, then the rules and state, then date selection, location, error states and credits. After that come the accessibility and privacy passes, swapping in the final art, and deployment. Each checkpoint is tested against its spec requirements before the next one starts.

**Main risks.**

- **Device location naming (resolved).** Open-Meteo has no reverse geocoding, so "Use my location" is labelled "My location" and assumed to be in the US (R3 revised in `spec.md`).
- **Consistent character art.** All 15 outfit images must show the same character. Run a 2–3 image style test before committing to a tool.
- **Icon contrast.** The white and pale-grey icons (cloudy, fog, snow, partly cloudy) nearly vanish on a white background at 24px. The weather card and day strip need a tinted or darker background for the 3:1 contrast in R15. Settle this at CP1 and check it at CP10.
- **"Today" across timezones.** The date and the "now to midnight" rain window must use the location's timezone, not the device's. Test with a location in a different timezone.
- **Deployment branch.** Pages has to serve from `main` (or a Pages workflow), so finished work needs merging into `main`. That merge is the Developer's decision.

## Checklist

### Approvals

- [x] Research approved
- [x] Specification approved
- [x] Plan approved (Developer, 2026-10-05)

### Build

- [ ] Create or source the assets listed in `spec.md`, starting early
  - [ ] Developer chooses the AI image tool; style test of 2–3 character images and 2 icons, approved by the Developer
  - [x] Test character set: 15 outfits generated with ChatGPT, background removed, saved as WebP in `assets/characters/` (about 40 KB each)
  - [ ] Regenerate the character set to read as a college-age young adult (Developer), then reprocess
  - [x] 15 icons generated with ChatGPT, background removed, saved as 256×256 WebP in `assets/icons/` (7–19 KB each)
  - [ ] Final character set exported and saved in `assets/characters/`, and the tool recorded for credits
- [ ] **CP1 Layout shell:** `index.html` and CSS match the v2 wireframe with fake data and placeholder art. The phone layout is below 900px and the laptop layout is at 900px and above. Check: R13 at 375px and 1280px with no horizontal scroll, and R14 control placement and 44px targets.
- [ ] **CP2 Live weather:** `weather.js` fetches current, hourly and 7-day daily data in °F and mph and fills the weather card. Check: R1 against a raw API response for the same coordinates.
- [ ] **CP3 Rules:** `rules.js` and its unit tests cover the outfit groups, layer note, umbrella, sunscreen, hydration and the WMO-to-icon map. Check: R9 boundary tests pass (`node --test`), with output shown.
- [ ] **CP4 Recommendation state and variations:** `state.js` builds one state with independent random picks remembered per location and date. `ui.js` renders the character, description, reminders and alt text only from that state. Check: R8 (edit `window.appState` and every output changes) and R10 (picks vary across reloads and stay the same when you return to a date).
- [ ] **CP5 Date selection:** the 7-day strip (swipe on phone, full row on laptop) with a selected marker that does not rely on colour, plus the header date and the "Current conditions" / "Forecast" label. Check: R6, R7.
- [ ] **CP6 Location:** a bottom sheet on phone and a dropdown on laptop, with US-only city and ZIP search, "Use my location", the denied-permission message, two `localStorage` slots with a one-tap switch, and first-visit behaviour with "+ Add city". Check: R2, R3, R4, R5, R5a.
- [ ] **CP7 Loading and errors:** "Loading…", the plain-language error with Retry, "Last updated [time]", and recommendation content hidden until there is valid data. Check: R12 with network throttling and blocked requests.
- [ ] **CP8 Credits popup:** creator, Open-Meteo link and CC BY 4.0, methods and sources, privacy, and art credits. Focus is trapped and Esc closes it. Check: R11.
- [ ] **CP9 Accessibility and privacy pass:** axe or Lighthouse with no failures, a keyboard-only pass and a screen-reader spot check. In the network tab, requests go only to Open-Meteo and the site host, and `localStorage` holds only the location slots. Check: R15, R16.
- [ ] **CP10 Final art:** placeholders replaced with the generated images, legibility checked at 24px, and contrast checked at 3:1 or better.
- [ ] **CP11 Deploy:** GitHub Pages is enabled and the public HTTPS URL works. Check: R17.
- [ ] Use the approved screen drawings to guide layout and interaction work
- [ ] Keep one recommendation state driving every visual and written output
- [ ] Test and fix each checkpoint against the specification before starting the next
- [ ] Commit meaningful working checkpoints
- [ ] Deploy to a public HTTPS URL

### Verify and revise

- [ ] Check every specification requirement
- [ ] Test multiple locations, current and forecast dates, recommendation categories, outfit and reminder variations, and failure states
- [ ] Verify that eligible outfit and reminder variations are selected independently rather than as fixed pairs
- [ ] Verify that returning to a previously selected date shows the same variations
- [ ] Test the deployed app, independently of the local version, on a real phone and a laptop, including both screens, accessibility, and one-handed controls
- [ ] Prepare the usability test below
- [ ] Test with three peers and record each session
- [ ] Add the chosen improvement to this checklist, and update `spec.md` if the intended result changes
- [ ] Implement, verify, and redeploy at least one meaningful revision

### Deliver

- [ ] Confirm all brief deliverables, sources, privacy information, and asset credits
- [ ] Save all chat transcripts
- [ ] Complete the debrief

## Usability testing

Before testing, record the purpose, a few realistic tasks, non-leading prompts, and a consistent note format. For each session, use a non-identifying label and record the task, what the tester did or said, successes, barriers or questions, and possible changes. Keep observations separate from interpretations. After all three sessions, summarize the strongest findings and the improvement they support.

## Revisions

Record material plan changes and why they were made.

- **2026-10-05:** ChatGPT chosen as the image tool. The first character set is used as test art so the build isn't blocked; regeneration added to the asset tasks.
- **2026-10-05:** Checked Open-Meteo geocoding directly: "78701" finds Austin, TX, and `countryCode=US` limits "London" to US towns, so the ZIP-search risk is removed. Reverse geocoding is unavailable; resolved by the R3 revision in `spec.md`.

## Saving transcripts

At the end of planning, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.

At the end of every implementation chat, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/build-YYYY-MM-DD_HHMMSS.md` using the same formatting.
