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

## Then: accounts and instructor support

Introduce server-enforced learner and instructor roles, a separate training database, lesson assignment, instructor comments, and consent-based portfolio sharing. Replace browser-only state with authenticated storage and design offline synchronization, conflict handling, and duplicate-submission prevention before claiming cross-device support.

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

These checks do not replace instructor review or real learner validation. Accounts and instructor support are the next implementation milestone.
