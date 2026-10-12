# HospitalPlus Learn implementation milestones

## Completed: first learning journey

- Responsive dashboard and pathway navigation.
- Draft lesson with attribution, review status, and independent reading link.
- Fictional outpatient observation scenario with six supplied measurements.
- Deterministic checklist feedback, retries, and automatic draft saving.
- Device-local attempt history and downloadable portfolio.
- Downloadable lesson and paper exercise.
- Cached application shell for offline use after first successful visit.

## Next: validate content and expand practice

Interview three to five learners and an instructor. Confirm priority skills and review the current lesson and checklist. Add observation-note and structured-handover scenarios with explicit assessment rubrics. Retain flexible access and untimed retries.

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
