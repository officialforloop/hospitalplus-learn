# HospitalPlus Learn

**Challenge Track:** Engagement & Staying in the Learning Journey  
**Cross-track:** Access & Discovery of Learning Resources; Guidance, Pathways & Opportunity

HospitalPlus Learn is a proposed learning extension of HospitalPlus, an electronic medical record platform, designed to help nursing, medical, and allied health students build practical digital healthcare skills. It connects learning resources with simulated hospital activities, allowing students to practise patient registration, vital-sign documentation, consultation notes, investigation requests, and patient handovers using fictional patient records.

Learners can follow structured practice pathways, access instructor-curated resources, complete scenario-based exercises, and review feedback on their work. Each activity connects a learning objective to a practical task, helping students understand how classroom knowledge applies within a digital hospital environment. Short exercises, saved progress, and opportunities to retry help learners maintain momentum and return to areas where they need more practice.

HospitalPlus Learn also supports instructors and clinical educators. They can organise approved resources around specific skills, assign fictional scenarios, review completed exercises, and identify learners who need additional guidance. A learning portfolio records completed activities and instructor feedback, giving students evidence of their progress to discuss with placement supervisors. These records support preparation for supervised practice without claiming professional certification or clinical competence.

The proof of concept would focus on nursing students preparing for outpatient placements, with a small set of exercises covering observations, documentation, and handover. Resources would display their sources and review dates, while instructors would align activities with local training expectations. Lightweight pages and downloadable lessons would support limited connectivity, alongside accessible navigation, flexible pacing, and reviewed multilingual content.

A separate training environment would keep fictional scenarios apart from live patient records, while role-based access would protect learner information. By making practical learning easier to access, progress visible, and feedback actionable, HospitalPlus Learn would help healthcare students remain engaged and connect their learning to preparation for clinical placements.

## Project status

Implemented: three lessons and fictional exercises, checklist feedback and retries, guest drafts and portfolio exports, learner/instructor accounts with isolated SQLite storage, account lifecycle controls, assignments and feedback, resource discovery, language/reading preferences, and voluntary local pilot records. The buildless app has no third-party runtime dependencies. A versioned service worker caches learning and pilot screens after the first successful online visit; account APIs require the learning server.

Lessons and rubrics remain draft material awaiting qualified instructor review. Pilot tools are ready for a walkthrough; a real learner pilot, reviewed translations and institutional curriculum alignment have not been completed.

## Screenshots by build phase

Captured on 14 October 2026 from the current application using fictional preview accounts and an isolated in-memory database. These are current layouts grouped by the phase that introduced each feature, not historical screenshots. Later shared navigation and account features may appear in earlier-phase views. Desktop viewport: 1366 × 900; mobile viewport: 390 × 844. Images show complete pages, except the language modal, which uses the viewport. Click a thumbnail for the full-size image.

<details>
<summary>Phase 1 — first learning journey</summary>

| Layout | Desktop | Mobile |
| --- | --- | --- |
| Overview and pathway | <a href="docs/screenshots/phase-1-overview-desktop.jpg"><img src="docs/screenshots/phase-1-overview-desktop.jpg" width="420" alt="Desktop overview and learning pathway"></a> | <a href="docs/screenshots/phase-1-overview-mobile.jpg"><img src="docs/screenshots/phase-1-overview-mobile.jpg" width="120" alt="Mobile overview and learning pathway"></a> |
| Lesson and source attribution | <a href="docs/screenshots/phase-1-lesson-desktop.jpg"><img src="docs/screenshots/phase-1-lesson-desktop.jpg" width="420" alt="Desktop lesson with attribution and draft rubric"></a> | <a href="docs/screenshots/phase-1-lesson-mobile.jpg"><img src="docs/screenshots/phase-1-lesson-mobile.jpg" width="120" alt="Mobile lesson with attribution and draft rubric"></a> |
| Observations and checklist feedback | <a href="docs/screenshots/phase-1-observations-desktop.jpg"><img src="docs/screenshots/phase-1-observations-desktop.jpg" width="420" alt="Desktop fictional observations exercise and checklist feedback"></a> | <a href="docs/screenshots/phase-1-observations-mobile.jpg"><img src="docs/screenshots/phase-1-observations-mobile.jpg" width="120" alt="Mobile fictional observations exercise and checklist feedback"></a> |
| Portfolio and practice history | <a href="docs/screenshots/phase-1-portfolio-desktop.jpg"><img src="docs/screenshots/phase-1-portfolio-desktop.jpg" width="420" alt="Desktop portfolio with fictional practice history"></a> | <a href="docs/screenshots/phase-1-portfolio-mobile.jpg"><img src="docs/screenshots/phase-1-portfolio-mobile.jpg" width="120" alt="Mobile portfolio with fictional practice history"></a> |

</details>

<details>
<summary>Phase 2 — expanded practice</summary>

| Layout | Desktop | Mobile |
| --- | --- | --- |
| Traceable documentation | <a href="docs/screenshots/phase-2-notes-desktop.jpg"><img src="docs/screenshots/phase-2-notes-desktop.jpg" width="420" alt="Desktop traceable documentation exercise"></a> | <a href="docs/screenshots/phase-2-notes-mobile.jpg"><img src="docs/screenshots/phase-2-notes-mobile.jpg" width="120" alt="Mobile traceable documentation exercise"></a> |
| Structured handover | <a href="docs/screenshots/phase-2-handover-desktop.jpg"><img src="docs/screenshots/phase-2-handover-desktop.jpg" width="420" alt="Desktop structured handover exercise"></a> | <a href="docs/screenshots/phase-2-handover-mobile.jpg"><img src="docs/screenshots/phase-2-handover-mobile.jpg" width="120" alt="Mobile structured handover exercise"></a> |

</details>

<details>
<summary>Phase 3 — learner accounts and instructor support</summary>

| Layout | Desktop | Mobile |
| --- | --- | --- |
| Sign in / create learner account | <a href="docs/screenshots/phase-3-sign-in-desktop.jpg"><img src="docs/screenshots/phase-3-sign-in-desktop.jpg" width="420" alt="Desktop sign-in and learner registration form with empty credentials"></a> | <a href="docs/screenshots/phase-3-sign-in-mobile.jpg"><img src="docs/screenshots/phase-3-sign-in-mobile.jpg" width="120" alt="Mobile sign-in and learner registration form with empty credentials"></a> |
| Learner assignments and feedback | <a href="docs/screenshots/phase-3-learner-account-desktop.jpg"><img src="docs/screenshots/phase-3-learner-account-desktop.jpg" width="420" alt="Desktop demo learner account with assignments and demo feedback"></a> | <a href="docs/screenshots/phase-3-learner-account-mobile.jpg"><img src="docs/screenshots/phase-3-learner-account-mobile.jpg" width="120" alt="Mobile demo learner account with assignments and demo feedback"></a> |
| Instructor assignment and review | <a href="docs/screenshots/phase-3-instructor-desktop.jpg"><img src="docs/screenshots/phase-3-instructor-desktop.jpg" width="420" alt="Desktop instructor workspace with fictional submissions"></a> | <a href="docs/screenshots/phase-3-instructor-mobile.jpg"><img src="docs/screenshots/phase-3-instructor-mobile.jpg" width="120" alt="Mobile instructor workspace with fictional submissions"></a> |

</details>

<details>
<summary>Phase 4 — resource discovery and context metadata</summary>

| Layout | Desktop | Mobile |
| --- | --- | --- |
| Searchable resource library | <a href="docs/screenshots/phase-4-library-desktop.jpg"><img src="docs/screenshots/phase-4-library-desktop.jpg" width="420" alt="Desktop resource search, filters and source cards"></a> | <a href="docs/screenshots/phase-4-library-mobile.jpg"><img src="docs/screenshots/phase-4-library-mobile.jpg" width="120" alt="Mobile resource search, filters and source cards"></a> |
| Instructor resource curation | <a href="docs/screenshots/phase-4-resource-editor-desktop.jpg"><img src="docs/screenshots/phase-4-resource-editor-desktop.jpg" width="420" alt="Desktop instructor library with resource metadata editor"></a> | <a href="docs/screenshots/phase-4-resource-editor-mobile.jpg"><img src="docs/screenshots/phase-4-resource-editor-mobile.jpg" width="120" alt="Mobile instructor library with resource metadata editor"></a> |

The editor contains unsaved fictional metadata and a placeholder link; it does not represent an approved institutional resource.

</details>

<details>
<summary>Phase 5 — accessibility and language preferences</summary>

| Layout | Desktop | Mobile |
| --- | --- | --- |
| Language and reading modal | <a href="docs/screenshots/phase-5-language-reading-desktop.jpg"><img src="docs/screenshots/phase-5-language-reading-desktop.jpg" width="420" alt="Desktop language and reading preferences modal"></a> | <a href="docs/screenshots/phase-5-language-reading-mobile.jpg"><img src="docs/screenshots/phase-5-language-reading-mobile.jpg" width="120" alt="Mobile language and reading preferences modal"></a> |

Only English content is available. Other language choices remain explicitly marked translation pending.

</details>

<details>
<summary>Phase 6 — voluntary pilot and demonstration</summary>

| Layout | Desktop | Mobile |
| --- | --- | --- |
| Pilot opt-in and walkthrough | <a href="docs/screenshots/phase-6-pilot-start-desktop.jpg"><img src="docs/screenshots/phase-6-pilot-start-desktop.jpg" width="420" alt="Desktop voluntary pilot opt-in and walkthrough guide"></a> | <a href="docs/screenshots/phase-6-pilot-start-mobile.jpg"><img src="docs/screenshots/phase-6-pilot-start-mobile.jpg" width="120" alt="Mobile voluntary pilot opt-in and walkthrough guide"></a> |
| Active pilot record | <a href="docs/screenshots/phase-6-pilot-active-desktop.jpg"><img src="docs/screenshots/phase-6-pilot-active-desktop.jpg" width="420" alt="Desktop active pilot with fictional demonstration notes"></a> | <a href="docs/screenshots/phase-6-pilot-active-mobile.jpg"><img src="docs/screenshots/phase-6-pilot-active-mobile.jpg" width="120" alt="Mobile active pilot with fictional demonstration notes"></a> |

The record shown is a screenshot demonstration, not evidence of a real learner pilot.

</details>

<details>
<summary>Phase 7 — account lifecycle</summary>

| Layout | Desktop | Mobile |
| --- | --- | --- |
| Export, password change and learner deletion | <a href="docs/screenshots/phase-7-account-lifecycle-desktop.jpg"><img src="docs/screenshots/phase-7-account-lifecycle-desktop.jpg" width="420" alt="Desktop account export and expanded password/deletion safeguards"></a> | <a href="docs/screenshots/phase-7-account-lifecycle-mobile.jpg"><img src="docs/screenshots/phase-7-account-lifecycle-mobile.jpg" width="120" alt="Mobile account export and expanded password/deletion safeguards"></a> |

Password and confirmation fields are empty. No password changes or account deletions were performed to make these screenshots.

</details>

## Run locally

Requires Node.js 24 or later (built-in SQLite). From this folder:

```sh
npm start
```

Open http://localhost:3100. Run automated checks with `npm test`.

## Language and reading preferences

On the first visit, a language-selection modal suggests the first supported browser language. Use **Language / Reading** to change it later, enlarge reading text, or increase line spacing. Preferences are saved on this browser separately from learning work and are available after offline installation. If storage is blocked, changes apply only for the current visit and a message explains the failure.

English is currently the only interface and lesson language. Yoruba, Hausa, Igbo, French, Portuguese, Arabic and Swahili selections record a preference and explicitly show translation pending; they do not translate lessons. Reviewed translations, local curriculum alignment and assistive-technology validation remain pending.

## Prototype limitations

Guest practice remains device-local. Milestone 3 adds learner registration/sign-in, server progress, exercise submissions, instructor assignments and feedback. Training data is stored in `data/learn.sqlite`, ignored by Git and separate from HospitalPlus V2. Passwords are scrypt-hashed; sessions use HttpOnly/SameSite cookies and expire after eight hours. Sessions are lost on server restart; account records remain.

Create an instructor locally with `node scripts/create-instructor.mjs your_username`. The command prints a random password once; keep it private. Public registration always creates a learner regardless of requested role. Instructors see submissions only for learner/exercise pairs they assigned. Guest-imported summaries are not instructor-reviewable submissions; submit while signed in for review.

Up to 50 recent progress summaries are retained; reviewable submissions remain in the training database until learner-account deletion. Guest imports are explicit replacements of account progress. Account saves use revision checks; conflicts stop saving and ask you to export your draft and reload account progress. Failed account saves remain in memory, with a Retry save action. Do not close or reload before saving or exporting unsaved work. Offline durable account queues, automated merges, email/self-service password recovery, instructor-account deletion and HTTPS deployment are not implemented. The local server listens only on loopback, so account access across physical devices requires a future hosting setup.

Offline guest use requires a successful initial load and service-worker installation; account APIs and external reading links require the server/internet as applicable. Authenticated API responses are excluded from service-worker caching.

The three lessons, scenarios, and rubrics await qualified instructor review. Checklists assess source-fact selections, transcription accuracy, and free-text presence, not clinical reasoning, free-text meaning, or note quality. Instructor review tools are implemented; demo feedback is not educator approval. There are no real patient records, clinical recommendations, or certifications. Institution-specific content, reviewed translations, consent-based external sharing, and real learner validation remain future work. Feedback currently stores one latest review per submission.

## Account lifecycle (milestone 7)

Sign in and open **Account → Manage your account**:

- **Download account data** exports your server-saved progress, submissions, assignments, feedback and resource metadata you authored. It excludes password hashes, passwords and session cookies. Guest work, reading preferences and pilot records have separate storage/exports. Keep downloaded files private and review them before sharing.
- **Change password** requires your current password and a matching new password of 10–128 characters. All sessions, including the current one, are signed out. Sessions are also checked against the stored credential on every request, so operator resets revoke existing sessions on their next request.
- **Delete learner account** requires the current password and the exact phrase `DELETE your_username`. It permanently removes that learner’s account, progress, submissions, linked reviews and assignments in one database transaction. It does not erase browser-local guest/pilot data, backups, downloaded/shared files, instructor accounts or other learners. Instructor self-deletion is unavailable because shared resource/feedback ownership requires operator review.

Lifecycle controls wait for pending account saves; resolve save conflicts or export your current draft before proceeding. These controls require the server and never use cached API responses. Password-confirmation failures are rate limited. There is no email or self-service recovery.

For a forgotten password, a trusted local operator with access to the learning server can run:

```sh
node scripts/reset-password.mjs your_username --confirm-local-reset
```

Verify the account owner before resetting. The command prints a random temporary password once; deliver it privately and ask the owner to change it in Account. It preserves progress and does not send email. It does not implement identity verification, recovery codes or a hosted recovery service.

## Resource library (milestone 4)

Open `#resources` to search six starter entries by title, topic, publisher and context, and filter by skill, language, review status, institution and offline availability. Three entries are the cached learning lessons; three link to verified publisher pages (NMC, WHO and OpenLearn). No external article/course content is redistributed. Publisher references are not institution-approved lessons, and language filtering does not translate content.

Signed-in instructors can add and edit their own resource metadata: source URL, publisher, related skill, language, institutional context, local relevance and review status. Institution links are visible to all signed-in accounts on this local learning server. A declared review records the instructor username and date; the application does not independently verify their qualifications or approve a curriculum. The demo placement entry remains pending review.

Institution filtering includes that context’s resources alongside general references. Related-practice links connect discovery to the existing three-exercise pathway. Formal institution-specific curricula and qualified approval remain pending. Guest/offline use includes starter metadata and cached lessons, while instructor-curated metadata and external pages need connectivity.

## Pilot and demonstration workspace (milestone 6 foundation)

Open **Pilot / Demo** (`#pilot`) and tick the voluntary recording checkbox, then start a session. Follow the linked walkthrough: read a lesson, find/open a resource, complete and retry a fictional exercise, inspect the portfolio, mark an interruption and reload. Return to Pilot / Demo to finish and export a JSON or readable text report.

Recording is off until started. It stores event types, timestamps, scenario IDs and checklist counts, plus optional notes, on this browser only. It excludes usernames, search terms, credentials and exercise answers. Notes should contain fictional details only. Pilot records are separate from guest/account progress and visible to other people using this browser. There is no analytics upload or automatic instructor sharing.

Up to 20 recent sessions and 200 events per session are retained. Consecutive search/filter actions are grouped. Retries mean additional checks of the same scenario within one session; missed checks are summed across attempts. Return counts mean page reloads during recording, not confirmed recovery. Time includes interruptions. These metrics do not assess clinical competence or establish pilot success.

Use **Finish session** to stop recording; **Mark an interruption** only adds a marker. Failed saves retain the current page's record in memory with a storage warning and retry/export options. Export before closing if saving fails. After initial caching, guest pilot tools work with the server unavailable. See [the pilot guide](docs/PILOT_GUIDE.md) for preparation, observation prompts and evidence limits.

## Initial proof of concept

- Three fictional outpatient scenarios covering observations, documentation, and handover.
- A small resource library with source attribution and instructor review.
- Checklist-based feedback, retries, and saved progress.
- A learner portfolio and instructor review view.
- Downloadable lessons and an offline exercise, with progress synchronization when connectivity returns.

## Development principles

- Use fictional patient data only and keep training separate from live HospitalPlus care workflows.
- Collect minimal learner information and make portfolio sharing voluntary.
- Provide accessible navigation, plain language, and flexible pacing.
- Review educational content and translations with qualified instructors.
- Validate the learning problem and prototype with students and educators.

## Relationship to HospitalPlus

HospitalPlus provides the workflow foundation for this proposal. This is a separate project; no existing EMR source files, database dumps, credentials, or patient records are included.
