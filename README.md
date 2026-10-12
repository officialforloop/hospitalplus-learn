# HospitalPlus Learn

**Challenge Track:** Engagement & Staying in the Learning Journey  
**Cross-track:** Access & Discovery of Learning Resources; Guidance, Pathways & Opportunity

HospitalPlus Learn is a proposed learning extension of HospitalPlus, an electronic medical record platform, designed to help nursing, medical, and allied health students build practical digital healthcare skills. It connects learning resources with simulated hospital activities, allowing students to practise patient registration, vital-sign documentation, consultation notes, investigation requests, and patient handovers using fictional patient records.

Learners can follow structured practice pathways, access instructor-curated resources, complete scenario-based exercises, and review feedback on their work. Each activity connects a learning objective to a practical task, helping students understand how classroom knowledge applies within a digital hospital environment. Short exercises, saved progress, and opportunities to retry help learners maintain momentum and return to areas where they need more practice.

HospitalPlus Learn also supports instructors and clinical educators. They can organise approved resources around specific skills, assign fictional scenarios, review completed exercises, and identify learners who need additional guidance. A learning portfolio records completed activities and instructor feedback, giving students evidence of their progress to discuss with placement supervisors. These records support preparation for supervised practice without claiming professional certification or clinical competence.

The proof of concept would focus on nursing students preparing for outpatient placements, with a small set of exercises covering observations, documentation, and handover. Resources would display their sources and review dates, while instructors would align activities with local training expectations. Lightweight pages and downloadable lessons would support limited connectivity, alongside accessible navigation, flexible pacing, and reviewed multilingual content.

A separate training environment would keep fictional scenarios apart from live patient records, while role-based access would protect learner information. By making practical learning easier to access, progress visible, and feedback actionable, HospitalPlus Learn would help healthcare students remain engaged and connect their learning to preparation for clinical placements.

## Project status

Milestone 1 is implemented as a dependency-free browser prototype: dashboard, documentation lesson, fictional observation exercise, checklist feedback, retries, automatic device-local drafts, progress portfolio, and downloads. A service worker caches the learning screens for offline access after the first successful online visit.

## Run locally

Requires Node.js 20 or later. From this folder:

```sh
npm start
```

Open http://localhost:3100. Run automated checks with `npm test`.

## Prototype limitations

This version uses a demo learner without sign-in or server storage. Progress is saved only in the current browser on the current device; it does not synchronize across devices. Up to 50 recent attempts are retained. Export your portfolio before clearing local data. Offline use requires a successful initial load and service-worker installation; external reading links still require internet access.

The original lesson and scenario await qualified instructor review. The checklist checks transcription accuracy and note presence, not clinical reasoning or note quality. There are no real patient records, instructor accounts, clinical recommendations, or certifications. Accounts, additional scenarios, instructor review, institution-specific content, and reviewed translations are future milestones.

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
