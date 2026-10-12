# HospitalPlus Learn

**Challenge Track:** Engagement & Staying in the Learning Journey  
**Cross-track:** Access & Discovery of Learning Resources; Guidance, Pathways & Opportunity

HospitalPlus Learn is a proposed learning extension of HospitalPlus, an electronic medical record platform, designed to help nursing, medical, and allied health students build practical digital healthcare skills. It connects learning resources with simulated hospital activities, allowing students to practise patient registration, vital-sign documentation, consultation notes, investigation requests, and patient handovers using fictional patient records.

Learners can follow structured practice pathways, access instructor-curated resources, complete scenario-based exercises, and review feedback on their work. Each activity connects a learning objective to a practical task, helping students understand how classroom knowledge applies within a digital hospital environment. Short exercises, saved progress, and opportunities to retry help learners maintain momentum and return to areas where they need more practice.

HospitalPlus Learn also supports instructors and clinical educators. They can organise approved resources around specific skills, assign fictional scenarios, review completed exercises, and identify learners who need additional guidance. A learning portfolio records completed activities and instructor feedback, giving students evidence of their progress to discuss with placement supervisors. These records support preparation for supervised practice without claiming professional certification or clinical competence.

The proof of concept would focus on nursing students preparing for outpatient placements, with a small set of exercises covering observations, documentation, and handover. Resources would display their sources and review dates, while instructors would align activities with local training expectations. Lightweight pages and downloadable lessons would support limited connectivity, alongside accessible navigation, flexible pacing, and reviewed multilingual content.

A separate training environment would keep fictional scenarios apart from live patient records, while role-based access would protect learner information. By making practical learning easier to access, progress visible, and feedback actionable, HospitalPlus Learn would help healthcare students remain engaged and connect their learning to preparation for clinical placements.

## Project status

Milestones 1 and 2 are implemented as a dependency-free browser prototype: three lessons and fictional exercises (observations, traceable documentation, structured handover), scenario-specific checklist feedback and retries, separate device-local drafts, suggested next steps, progress portfolio, and downloads. Existing milestone-1 progress migrates automatically. A versioned service worker caches all learning screens for offline access after the first successful online visit.

## Run locally

Requires Node.js 24 or later (built-in SQLite). From this folder:

```sh
npm start
```

Open http://localhost:3100. Run automated checks with `npm test`.

## Prototype limitations

Guest practice remains device-local. Milestone 3 adds learner registration/sign-in, server progress, exercise submissions, instructor assignments and feedback. Training data is stored in `data/learn.sqlite`, ignored by Git and separate from HospitalPlus V2. Passwords are scrypt-hashed; sessions use HttpOnly/SameSite cookies and expire after eight hours. Sessions are lost on server restart; account records remain.

Create an instructor locally with `node scripts/create-instructor.mjs your_username`. The command prints a random password once; keep it private. Public registration always creates a learner regardless of requested role. Instructors see submissions only for learner/exercise pairs they assigned. Guest-imported summaries are not instructor-reviewable submissions; submit while signed in for review.

Up to 50 recent progress summaries are retained; reviewable submissions remain in the training database. Guest imports are explicit replacements of account progress. Account saves use revision checks; conflicts stop saving and ask you to export your draft and reload account progress. Failed account saves remain in memory, with a Retry save action. Do not close or reload before saving or exporting unsaved work. Offline durable account queues, automated merges, password recovery, account deletion and HTTPS deployment are not implemented. The local server listens only on loopback, so account access across physical devices requires a future hosting setup.

Offline guest use requires a successful initial load and service-worker installation; account APIs and external reading links require the server/internet as applicable. Authenticated API responses are excluded from service-worker caching.

The three lessons, scenarios, and rubrics await qualified instructor review. Checklists assess source-fact selections, transcription accuracy, and free-text presence, not clinical reasoning, free-text meaning, or note quality. Instructor review tools are implemented; demo feedback is not educator approval. There are no real patient records, clinical recommendations, or certifications. Institution-specific content, reviewed translations, consent-based external sharing, and real learner validation remain future work. Feedback currently stores one latest review per submission.

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
