# HospitalPlus Learn agent instructions

## Read first

Read `README.md`, `IMPLEMENTATION_PLAN.md`, and `docs/MODULE_STATUS.md` before implementing a module. The status document also records the HospitalPlus V2 source review. Re-check source rather than assuming the inventory remains current.

This is an independent educational prototype. Keep fictional scenarios, learner progress, and future learning accounts separate from live HospitalPlus clinical records.

## Preserve this exact theme for every learning module

The visual source of truth is `public/styles.css`. Reuse `public/index.html` for the application shell and `public/app.js` for current screen patterns. Extend the shared stylesheet rather than creating a different visual system for individual modules.

| Role | Current value |
| --- | --- |
| App background | `#F6F7F3` |
| Main text | `#203B34` |
| Primary action / link | `#164E40` (`--green`) |
| Hero, logo, notification | `#123F36` |
| Secondary text | `#61756E` (`--muted`) |
| Standard border | `#DFE6DF` (`--border`) |
| Card surface | `#FFFFFF` |
| Hero action surface | `#EEF3DD` |
| Training banner | background `#F2EDDF`, text `#685839` |
| Positive feedback | background `#EDF4E9`, text `#365D36` |
| Retry feedback | background `#FAF1DF`, text `#775523` |
| Focus outline | `#B7782F`, 3px with 4px offset |

- Body: Arial/Helvetica/sans-serif, 15px, line-height 1.6. Main titles and hero headings: Georgia/serif. Desktop h1: 39px; mobile h1: 31px. Do not introduce external font downloads.
- Desktop shell: 244px white sidebar, 78px topbar, full-width training banner, centered main content with 1200px maximum width and 40px/42px padding.
- At 1050px: sidebar 205px, main padding 28px, exercise columns stack. At 700px: static full-width navigation, main padding 26px/20px, single-column forms and statistics, hero illustration hidden.
- Reuse `.panel`, `.button`, `.secondary`, `.pill`, `.tag`, `.callout`, `.section-title`, `.form-grid`, `.input-wrap`, `.feedback`, and `.table-scroll` for equivalent elements. Keep panels at 12px radius, hero at 15px, buttons at 7px, with subtle borders.
- Preserve the green hero, warm cream highlights, quiet backgrounds, serif headings, compact labels, and generous spacing across lesson, practice, portfolio, and future instructor modules.
- Do not import the blue/red V2 theme into Learn unless explicitly requested. Learn does not currently implement dark mode; do not claim it does.
- Preserve the training banner on every screen, fictional patient labels, skip link, semantic navigation, visible keyboard focus, form labels, and live feedback announcements.

## Behavior and architecture

- Current stack: buildless HTML/CSS/JavaScript with a Node static server; no third-party runtime dependencies. Run `npm start` at port 3100 and `npm test` for checks.
- Do not imply authentication, instructor approval, a database, cross-device synchronization, or professional certification when these are absent.
- Store only fictional exercise work locally. Preserve draft recovery, explicit storage-failure messages, retries, and voluntary exports. History currently retains 50 recent attempts.
- Escape learner content before rendering HTML. Validate stored data and handle blocked/corrupted storage. Future server features must enforce authorization independently of the UI.
- Keep lesson attribution and review status visible. Current content is draft material awaiting instructor review; external reading is not endorsement or a local curriculum standard.
- Checklist scoring covers supplied measurements, selected source facts, record/time transcription, and free-text presence. Do not claim it assesses clinical reasoning, free-text meaning, or note quality. Keep each scenario’s rubric and assessment limits visible.
- Avoid external assets needed for core learning. For new offline screens/assets, update `public/sw.js` and its versioned cache together; verify first-load installation and subsequent unavailable-server loading.
- Accounts, additional scenarios, instructor review, translations, and synchronization belong to subsequent milestones. Implement required data protections and real behavior before showing them as available.

## Before finishing a module

Run meaningful tests for changed behavior; inspect desktop and mobile layouts; verify save/reload and applicable offline paths. Update `IMPLEMENTATION_PLAN.md` and `docs/MODULE_STATUS.md` with evidence and remaining gaps. Report local commits and remote publication separately.
