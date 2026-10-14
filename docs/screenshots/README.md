# Screenshot capture notes

Captured 14 October 2026 from the current HospitalPlus Learn build. The main README embeds all 30 JPEGs as desktop/mobile pairs for 15 layouts, grouped by the milestone introducing the feature. These are not historical builds; later shell and account features are visible in earlier-phase screenshots.

- Desktop viewport override: 1366 × 900. Mobile: 390 × 844. Most captures cover the full page; the language dialog uses the viewport. Browser capture bounds exclude scrollbar gutters, so most images are 1351px/375px wide. Full-page heights vary.
- Browser screenshots are unedited. No images were generated or used as substitutes for the running application.
- Source was a temporary loopback preview at port 3103, using the real application files and backend with an in-memory SQLite database. It did not open `data/learn.sqlite` or alter existing learner accounts.
- `demo_learner` and `demo_educator`, submissions, assignments and demo feedback are fictional fixtures. Password fields were empty during capture. No passwords, hashes, cookies, tokens or account exports appear in the images.
- Resource-editor metadata is an unsaved fictional example with an `example.org` placeholder and pending review. No resource was published or declared approved.
- Pilot recording was explicitly started for the screenshot demonstration and finished afterwards. It does not represent a learner study or validation result.

| Filename prefix | Route / state | Introduced in phase |
| --- | --- | --- |
| `phase-1-overview` | `#dashboard`, guest overview | 1 |
| `phase-1-lesson` | `#lesson/vitals`, lesson, rubric and attribution | 1 |
| `phase-1-observations` | `#practice/vitals`, fictional values and checklist feedback | 1 |
| `phase-1-portfolio` | `#portfolio`, fictional recent practice history | 1 |
| `phase-2-notes` | `#practice/notes`, fictional documentation draft | 2 |
| `phase-2-handover` | `#practice/handover`, fictional handover draft | 2 |
| `phase-3-sign-in` | `#account`, signed out with empty fields | 3 |
| `phase-3-learner-account` | `#account`, assigned exercises and demo feedback | 3 |
| `phase-3-instructor` | `#instructor`, assigned fictional submissions | 3 |
| `phase-4-library` | `#resources`, filters and starter catalogue | 4 |
| `phase-4-resource-editor` | `#resources`, instructor view with unsaved metadata | 4 |
| `phase-5-language-reading` | First-visit language/reading modal | 5 |
| `phase-6-pilot-start` | `#pilot`, before opting in | 6 |
| `phase-6-pilot-active` | `#pilot`, active demonstration record | 6 |
| `phase-7-account-lifecycle` | `#account`, expanded password/deletion controls, empty credentials | 7 |

Every prefix has `-desktop.jpg` and `-mobile.jpg`. To refresh a pair, use a separate fictional preview, navigate to the named route/state, capture both viewport sizes with the browser screenshot API, inspect the results and check the main README links. Preserve draft-review notices and training labels. Documentation images are not core offline assets and are not added to the service-worker cache.
