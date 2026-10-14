# HospitalPlus Learn implementation milestones

## Completed: first learning journey

- Responsive dashboard and pathway navigation.
- Draft lesson with attribution, review status, and independent reading link.
- Fictional outpatient observation scenario with six supplied measurements.
- Deterministic checklist feedback, retries, and automatic draft saving.
- Device-local attempt history and downloadable portfolio.
- Downloadable lesson and paper exercise.
- Cached application shell for offline use after first successful visit.

## Completed: expanded practice (milestone 2)

- Three independent lessons and fictional scenarios: measurements, traceable documentation, and structured handover.
- Visible draft rubrics, source sheets, and explicit assessment limits.
- Scenario-specific drafts, lesson-read state, attempt history, and suggested next lesson without access restrictions.
- Migration of existing vitals drafts, lesson status, and attempts into version-2 progress.
- Downloadable lesson/exercise packs for each scenario and JSON/text portfolio exports.
- Version-2 offline cache including the new scenario module.

## Pending: learner and instructor validation

Interview three to five learners and an instructor. Confirm priority skills and review all three draft lessons and rubrics. The documentation and handover exercises are implemented, but clinical quality requires qualified review. Retain flexible access and untimed retries.

## Completed: accounts and instructor support (milestone 3)

Learner registration/sign-in, provisioned instructors, hashed passwords, expiring cookie sessions, separate SQLite training storage, server progress, assignments, instructor comments, and account review screens are implemented. Source-fact scoring runs on the server for reviewable submissions. Guest practice remains separate and import is explicit. Revisions prevent silent overwrite; submission identifiers support idempotent retries within the current page session.

Pending: consent-based external portfolio sharing, durable offline account queues, automatic conflict resolution, account recovery/deletion, and HTTPS hosting for access across physical devices. Unsent account edits remain in memory; export before closing if save is pending.

## Then: local relevance and inclusion

Align material to a partner institution, add one reviewed language selected with learners, and test with assistive technology and basic mobile devices. Assess content licensing and version review information.

## Finally: pilot and demonstration

Measure task completion, omissions, resource discovery, repeat participation, and interruption recovery. Document findings, limitations, and a complete demonstration from lesson through feedback and portfolio.

## Verification completed for milestone 1

- Six Node test cases pass: blank entries, correct entries, focused transcription feedback, whitespace notes, corrupted storage, and history limits.
- Browser journey: mark lesson read, submit an incorrect pulse, receive 6/7, correct pulse, receive 7/7, reload, and retain both attempts and the saved draft.
- Offline fallback: stop the local HTTP server and reload the portfolio successfully from the service-worker cache.
- Desktop and 390px mobile layout visually inspected.

Instructor review, screen-reader testing, multilingual validation, and a real learner pilot remain outstanding. This milestone has no authentication or server synchronization.

## Verification completed for milestone 2

- 15 automated tests pass, covering source-fact checks, missing fields, focused errors, migration, separate drafts, invalid history entries, and next-step suggestions.
- Browser: original 6/7 and 7/7 vitals history retained; notes submitted at 8/8; handover submitted at 7/7; all attempts and drafts retained after reload.
- Readable portfolio downloaded successfully through the browser.
- With the HTTP server stopped, portfolio reload and handover navigation worked using the version-2 cache.
- New handover form visually checked at 390px width; existing visual theme retained.

These checks do not replace instructor review or real learner validation.

## Verification completed for milestone 3

- 17 automated tests pass, including HTTP tests for unauthorized access, learner isolation, forced learner registration, same-origin mutation checks, revision conflict detection, server scoring, duplicate submission identifiers, assigned-instructor access, feedback visibility and logout.
- SQLite reopen test verifies hashed credentials and persisted progress.
- Browser: create a learner, submit supplied vitals (7/7), sign out, sign in as a locally provisioned instructor, assign the exercise, inspect source answers and save demo feedback.
- Instructor and learner accounts remain separate from the original guest history.
- Browser learner sign-in confirmed delivery of the assigned exercise and demo instructor feedback; account layout inspected at 390px width.

## Completed: resource discovery and context metadata (milestone 4)

- Searchable starter catalogue with three offline lessons and three publisher references.
- Skill, language, institution, review-status and offline filters, explicit empty states and reset controls.
- Visible source, context, access limits, recorded date, review status and reviewer/date where declared.
- Instructor-created/edited institution links, validated HTTPS URLs, server ownership checks, and SQLite persistence. Institution links are shared across signed-in accounts on this local learning server.
- Related lessons/practice connect resources to the existing pathway; general references remain visible when selecting an institution context.

## Verification completed for milestone 4

- 23 automated tests pass. Resource checks cover compound queries, combined filters, offline classification, language empty states, contextual inclusion, URL validation, instructor permission, author ownership and reviewer metadata.
- Browser search `WHO handover` returned one reference; French filtering returned a truthful empty state.
- Instructor saved a clearly labeled demo placement resource with review pending, and the form reset successfully.
- Server stopped: cached library loaded and offline-only filtering returned three lessons. Mobile layout checked at 390px.
- Publisher reference destinations checked on 12 October 2026. External content was linked, not copied.

Pending: qualified content review, formal institution-specific pathways, real learner validation, reviewed multilingual resources and assistive-technology testing. Account lifecycle and durable synchronization remain explicit gaps.

## Implemented: accessibility and language preferences (milestone 5 foundation)

- `public/preferences.js`: suggest the first supported browser language on first visit and open an accessible native language-selection dialog. Eight language preferences are offered; only English content is available. Other choices explicitly say translation pending and do not change the content language or imply reviewed translations.
- Persist validated device-local preferences separately from guest/account exercise work. Learners can reopen Language / Reading, choose larger reading text and extra line spacing, or dismiss without saving. Blocked writes apply preferences for the visit and announce that they were not saved.
- `public/app.js`, `public/index.html`, `public/styles.css`: keyboard guidance, screen-specific document titles, source-sheet/return focus controls, repaired skip-link routing, keyboard-accessible portfolio scrolling, visible input-group focus and larger mobile controls. Shared green/cream theme retained.
- `public/sw.js`: version-5 cache includes the preferences module; authenticated API responses remain excluded.

### Verification on 13 October 2026

- All 26 Node tests pass, including three new tests covering regional language detection, unsupported-language fallback, malformed/unsupported preference recovery and preference serialization. Account HTTP tests required loopback permission outside the restricted shell sandbox.
- Browser: first visit showed the modal with English suggested; selected Yoruba (clearly marked translation pending), larger text and spacing. Saved, reloaded and reopened the modal: all selections retained.
- Source-sheet and return controls moved focus to the named source and exercise; Skip to content focused the current practice screen without changing its route. Escape closed the modal.
- Desktop at 1280px and mobile at 390px inspected; the mobile dialog scrolls and both actions remain reachable.
- On an isolated temporary static server at port 3101, first-load installation reached Offline copy ready. Saved fictional systolic value 118; stopped that server and reloaded successfully with the draft restored. Language / Reading remained usable from the cache. The normal server at port 3100 was not stopped.

Remaining: learner-selected translation priorities, qualified translation/content review, translated interface/lessons (including RTL where applicable), partner curriculum alignment, screen-reader and real-device testing, and a learner pilot. These improvements are not an accessibility conformance claim. No local commit or remote publication was made for this phase.

## Implemented: voluntary pilot and demonstration tools (milestone 6 foundation)

- `public/pilot.js`: optional, explicitly started local walkthrough records; start/finish, interruption markers, notes, JSON/text exports, retry saving and separate pilot-data clearing. Recording status stays visible in navigation. No analytics endpoint or automatic sharing.
- `public/app.js` and `public/library.js`: allowlisted events for lesson-read actions, grouped searches/filters, primary resource opens, checklist attempts/retries and portfolio visits. No usernames, search terms or exercise answers enter pilot events.
- Validate recovered records, retain 20 recent sessions/200 events each, escape notes, and preserve in-memory records with explicit storage warnings. Page reloads during an active session add return markers. Time includes interruptions; limits remain visible.
- `public/index.html`, `public/styles.css`, `public/sw.js`: shared-theme Pilot / Demo navigation and responsive screen, version-6 offline cache including the pilot module. API caching and account authorization remain unchanged.
- `docs/PILOT_GUIDE.md`: voluntary walkthrough protocol, educator/learner prompts, metric definitions, storage/privacy limits and pending real-world validation. README describes implemented milestones and pilot usage.

### Verification on 14 October 2026

- All 33 Node tests pass, including seven pilot tests: opt-in/start/stop boundaries, event privacy/validation, metrics, reload recovery, blocked saves/deletes and retry, corrupted storage, retention bounds and elapsed-time limits. Account HTTP tests passed with loopback permission outside the restricted shell sandbox.
- Browser walkthrough on isolated port 3101: opted in; added fictional notes; marked a lesson read; searched and opened a cached resource; submitted measurements at 6/7 then 7/7; visited the portfolio. Pilot summary correctly reported one lesson-read action, one grouped search/filter action, one resource open, two checks, one retry and one missed check.
- Marked an interruption and reloaded: notes, metrics and active recording recovered. Stopped the temporary server and reloaded again: pilot screen/session remained usable from the cache; finished offline. Main app server was not stopped.
- Readable pilot report downloaded through the browser and inspected: expected counts and fictional notes present, no account identity or exercise answers. Desktop (1280px) and mobile (390px) layouts inspected.

Remaining: conduct the voluntary learner/educator pilot, content and translation review, partner alignment, real-device/screen-reader testing, and agreed handling of voluntarily shared reports. Pilot tooling does not establish validation, clinical competence, active task time or real participant retention. Local commit and remote push status are reported separately in the delivery message.
