# HospitalPlus Learn

**Challenge Track:** Engagement & Staying in the Learning Journey  
**Cross-track:** Access & Discovery of Learning Resources; Guidance, Pathways & Opportunity

HospitalPlus Learn is a proposed learning extension of HospitalPlus, an electronic medical record platform, designed to help nursing, medical, and allied health students build practical digital healthcare skills. It connects learning resources with simulated hospital activities, allowing students to practise patient registration, vital-sign documentation, consultation notes, investigation requests, and patient handovers using fictional patient records.

Learners can follow structured practice pathways, access instructor-curated resources, complete scenario-based exercises, and review feedback on their work. Each activity connects a learning objective to a practical task, helping students understand how classroom knowledge applies within a digital hospital environment. Short exercises, saved progress, and opportunities to retry help learners maintain momentum and return to areas where they need more practice.

HospitalPlus Learn also supports instructors and clinical educators. They can organise approved resources around specific skills, assign fictional scenarios, review completed exercises, and identify learners who need additional guidance. A learning portfolio records completed activities and instructor feedback, giving students evidence of their progress to discuss with placement supervisors. These records support preparation for supervised practice without claiming professional certification or clinical competence.

The proof of concept would focus on nursing students preparing for outpatient placements, with a small set of exercises covering observations, documentation, and handover. Resources would display their sources and review dates, while instructors would align activities with local training expectations. Lightweight pages and downloadable lessons would support limited connectivity, alongside accessible navigation, flexible pacing, and reviewed multilingual content.

A separate training environment would keep fictional scenarios apart from live patient records, while role-based access would protect learner information. By making practical learning easier to access, progress visible, and feedback actionable, HospitalPlus Learn would help healthcare students remain engaged and connect their learning to preparation for clinical placements.

## Project status

Implemented: three lessons and fictional exercises, checklist feedback and retries, guest drafts and portfolio exports, learner/instructor accounts with isolated SQLite storage, assignments and feedback, resource discovery, language/reading preferences, and voluntary local pilot records. The buildless app has no third-party runtime dependencies. A versioned service worker caches learning and pilot screens after the first successful online visit; account APIs require the learning server.

Lessons and rubrics remain draft material awaiting qualified instructor review. Pilot tools are ready for a walkthrough; a real learner pilot, reviewed translations and institutional curriculum alignment have not been completed.

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

Up to 50 recent progress summaries are retained; reviewable submissions remain in the training database. Guest imports are explicit replacements of account progress. Account saves use revision checks; conflicts stop saving and ask you to export your draft and reload account progress. Failed account saves remain in memory, with a Retry save action. Do not close or reload before saving or exporting unsaved work. Offline durable account queues, automated merges, password recovery, account deletion and HTTPS deployment are not implemented. The local server listens only on loopback, so account access across physical devices requires a future hosting setup.

Offline guest use requires a successful initial load and service-worker installation; account APIs and external reading links require the server/internet as applicable. Authenticated API responses are excluded from service-worker caching.

The three lessons, scenarios, and rubrics await qualified instructor review. Checklists assess source-fact selections, transcription accuracy, and free-text presence, not clinical reasoning, free-text meaning, or note quality. Instructor review tools are implemented; demo feedback is not educator approval. There are no real patient records, clinical recommendations, or certifications. Institution-specific content, reviewed translations, consent-based external sharing, and real learner validation remain future work. Feedback currently stores one latest review per submission.

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
