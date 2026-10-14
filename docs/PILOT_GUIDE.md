# HospitalPlus Learn pilot and demonstration guide

Prepared 14 October 2026. This is a protocol for a future pilot, not evidence that learners or educators have validated the prototype.

## Prepare

- Invite three to five learners and a qualified educator. Explain the draft status, fictional cases and checklist limits. Participation and exports are voluntary; agree how any shared reports will be handled before collecting them.
- Use pseudonyms for learning accounts and fictional information only. The local pilot recorder has no participant identity field. Optional notes and shared-browser storage can still identify someone if personal details are typed; avoid doing so.
- Ask the educator to review the three lessons and rubrics against local expectations. Record suggested changes separately; using the app does not confer approval.
- Ask which languages and devices learners actually use. Language preferences currently record a choice; only English interface/lessons are available.
- Start the local server with `npm start`, open the app and wait for Offline copy ready. Accounts need this server. Check guest use and a small-screen device separately.

## Run a voluntary walkthrough

1. Open Pilot / Demo. Explain what is stored, confirm the learner wants to record, tick the checkbox and start. Recording continues across screens/reloads on this browser until Finish session.
2. Read the observations lesson and mark it read. Ask the learner to explain where supplied facts and assessment limits are shown.
3. Find a resource by search/filter and open its lesson or publisher link. Ask the learner to identify the source and review status. External pages require connectivity.
4. Complete the fictional observations exercise. For a demonstration, use a deliberately incorrect pulse, inspect focused feedback and retry using the source value. Passing the checklist does not assess note meaning or clinical reasoning.
5. Open the portfolio, inspect history and optionally export it. Pilot exports and learning portfolios are different records.
6. In Pilot / Demo, mark an interruption, then return to a draft and reload. Ask whether the draft recovered and whether the save message is understandable. For unavailable-server testing, use guest work and stop only a test server you control after initial caching.
7. Return to Pilot / Demo. Write fictional, non-identifying observations about barriers, finish the session, and optionally export JSON/text. Discuss whether the learner wishes to share the export. The app does not send it anywhere.

## Interpret the report

| Metric | Meaning and limit |
| --- | --- |
| Lesson-read actions | Button activations; does not prove comprehension or unique lessons read. |
| Search/filter actions | Consecutive actions grouped; no terms retained and no proof a useful resource was found. |
| Resource opens | Clicks on primary resource links; excludes related-practice links and does not prove external content loaded. |
| Exercise checks / retries | Successful checklist evaluations; retries count checks beyond the first for each scenario in that session. |
| Missed checks | Sum of total minus score across attempts; describes supplied-fact/presence checks, not clinical errors. |
| Portfolio visits | Visits grouped while consecutive; not proof of export or reflection. |
| Interruption markers / returns | Explicit markers and page loads during an active session; not proof of successful recovery or distinct learners returning. |
| Elapsed minutes | Start to finish/latest event, rounded; includes time away and is not active task time. |
| Event limit | At 200 events further events are not recorded. A flagged session is incomplete. Up to 20 recent sessions remain. |

Exports include optional notes and local timestamps. They contain no account identity or exercise answers by design. Learners should inspect them before sharing. The app does not aggregate participants, calculate real retention, claim educator approval or issue credentials.

## Discuss and follow up

Ask what was easy to find, what wording caused uncertainty, how errors and recovery felt, which language would help, and what support is needed before supervised practice. Capture content-review decisions, accessibility barriers and implementation issues separately from checklist scores. Test with assistive technology and real mobile devices; browser layout inspection alone is not an accessibility conformance assessment.

Export before closing when a storage warning is shown. Retry saving when available. Clear pilot records using the separate pilot control after following the agreed retention process; this leaves learning progress separate. Account lifecycle controls now provide password change, account export and learner deletion; instructor deletion, email/self-service recovery, durable offline account queues, reviewed translations and hosting across physical devices remain future work.
