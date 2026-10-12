# HospitalPlus module implementation inventory

Reviewed: 12 October 2026. Method: source inspection of routes, shared UI, server actions, API services, Prisma schema, and the V2 implementation plan. No V2 application build, live database validation, deployment validation, or clinical/security acceptance testing was performed for this inventory.

**Implemented source** means identifiable UI and supporting behavior exist, not that all requirements are complete. **Partial** means some planned behavior exists with identifiable gaps or unverified prerequisites. **Not found** means no implementation was located in the reviewed application source; it is not proof that another repository or service lacks it.

## HospitalPlus V2

Paths below are relative to the parent V2 workspace.

| Module | Source evidence / implemented behavior | Status and remaining work |
| --- | --- | --- |
| Dashboard | `apps/web/src/app/(dashboard)/dashboard/page.tsx`: Prisma counts, recent appointments, workflow links. | Implemented source. Live data accuracy, branch scoping, and dashboard promises need runtime verification. |
| Patients and records | Patient pages and `apps/web/src/actions/patient-actions.ts`: registration, search, details, updates, status, quick appointments. | Implemented source. Validate duplicate handling, permissions, branch scope, and encounter history with a test database. |
| Front desk / appointments | Appointment pages, form/check-in modals, `appointment-actions.ts`, API appointment service. | Implemented source. Verify booking → payment/coverage → check-in → queue progression. |
| Nurses / observations | Vitals and taken-vitals pages; `nurses-actions.ts`: triage queue, recording and history. | Implemented source. Verify clearance prerequisites, validation, branch access, and clinical thresholds. |
| Doctor clinic | Clinic pages, consultation and request modals; `clinic-actions.ts`: SOAP signing, diagnoses, prescriptions, investigations, services, specialist referrals, quick admission. | Implemented source. Verify request creation, sign-off, billing effects, and downstream workflow. Local AI assistant not found. |
| Inpatient | Admissions, discharge, dynamic `[view]` pages; `inpatient-actions.ts`: ward/bed and consultant allocation, dossier, rounds, drug chart/administration, care plans, handover, observations, discharge. | Implemented source. Wards/nursery/maternity/ICU share the dynamic view route; dedicated specialty workflows are not established by that route alone. Validate bed concurrency, administration, and discharge clearance. |
| Queue management | QMS hub, console, TV display; `qms-actions.ts`; API QMS service/gateway. Ticket creation, manual call/complete, station CRUD, broadcasts, TV polling and browser speech exist. | Partial against the plan: reviewed call paths select waiting tickets and update state; automatic room-vacancy sensing/automatic doctor-next calling was not found. Verify concurrency, payment gating, browser audio, and alignment of API and server-action paths. |
| Billing and cashier | Billing, billed items, invoices, claims, receipts, wallet/refund pages; `billing-actions.ts`: payments, bill items, claims, voids, refunds, wallet credits. | Implemented source. Financial reconciliation, authorization, atomicity, item-level clearance, and cashier-session behavior need verification. Accounting export integration not found. |
| Pharmacy | Dispensary/history/formulary/report pages; `pharmacy-actions.ts`: clearance calculation, dispensing, batch deduction, movement creation and history. | Partial for enforcement: reviewed `dispensePrescription` mutation has no explicit session/role check or repeat clearance check; stock deduction, movement creation, and prescription update are separate writes. Review server authorization, positive quantity, batch ownership/expiry, duplicate dispensing, payment gate, and transaction/concurrency safety before treating as complete. |
| Laboratory | Laboratory UI, result entry/view/print; `investigation-actions.ts`: worklists, parameter retrieval, results, PIN sign-off. | Implemented source. Confirm payment/coverage enforcement on mutations, specimen collection lifecycle, result revision/audit, and branch authorization. External partner workflow is separate and not found. |
| Imaging / radiology | Imaging worklist/catalog, upload/view components, upload route; imaging report actions. | Implemented source. Verify upload authorization/file validation, storage access, and report signing. External DICOM partner ingestion not found. |
| Stock inventory | Category/overview/stores pages; `stock-actions.ts`: batches, locations, transfers, approvals/rejections; API stock module. | Partial for operational readiness: reads call `ensureStockSeed`, which can create sample catalog items/batches. Separate explicit development seed behavior from live reads. Verify FEFO enforcement, expiry, transfer authorization, branch scope, and atomic inventory updates. |
| HMO and tariffs | Provider/tariff pages and actions, import UI; workflow approvals page uses `processHmoApprovalAction`. | Implemented source. Local directory, tariff and approval workflows exist; live insurer eligibility/claim integration not found in reviewed source. Validate payer calculations, imports and authorization. |
| Organization / catalogs | Organization, branches, specialties, services, diagnoses, drugs, labs, imaging, wards, rooms/beds administration and actions. | Implemented source. Verify CRUD permissions, branch isolation, catalog constraints and ICD-10 synchronization/fallback behavior. |
| Staff / departments / roles | Staff, department, role/profile pages; corresponding actions; role/permission Prisma models and API guards. | Partial for authorization assurance: RBAC structures exist, but reviewed role-permission update action checks sign-in without an explicit admin permission check. Audit every privileged mutation rather than relying on sidebar filtering. |
| Authentication / profile | `apps/web/src/auth.ts`, auth routes/components/actions, profile actions, inactivity tracking, security questions, password and clinical PIN functions; API JWT/role/permission guards. | Implemented source. Perform server-action authorization, session, recovery and branch-access testing. Does not establish overall security/compliance. |
| Reporting and statistics | Dashboard counts, pharmacy report, billing/invoice/claim/receipt views. | Partial. Dedicated broad clinical-quality, turnaround, morbidity/mortality and hospital BI reporting suite not found. Existing operational reports should not be marked absent. |
| External diagnostic partner portal | Specified in parent `IMPLEMENTATION_PLAN.md`, Module 4. | Not found: partner accounts/portal, referral-specific six-digit PIN/QR access, partner upload and notification ingestion. Internal specialist referral and internal imaging upload are different existing features. |
| Biometric enrollment / verification | Specified in plan, Module 5. | Not found: enrollment route, scanner bridge, fingerprint templates and verification workflow. |
| Local Ollama AI | Specified in plan, Module 6. | Not found in reviewed app/API source: local inference integration, clinical note summarization and voice-to-SOAP assistant. Plan privacy/compliance claims are not validation evidence. |
| Third-party integrations | Specified in plan, Module 7. | Not found in reviewed app/API source: planned accounting, lab interoperability and telehealth adapters. Do not mistake WebSockets or internal APIs for completed external integrations. |

## HospitalPlus Learn

Paths below are relative to this learning repository.

| Module / capability | Current state | Remaining work |
| --- | --- | --- |
| Shared shell / theme | Implemented in `public/index.html` and `public/styles.css`; desktop/mobile inspected. | Preserve exact green/cream theme; additional assistive-technology testing. |
| Dashboard / pathway | Implemented in `public/app.js`: lesson progress, attempts, best result and navigation. | Multiple pathways, assignment and learner-specific server state. |
| Lesson / resource access | Milestone 4: searchable six-entry starter library, compound queries, skill/language/context/review/offline filters; three draft lessons and publisher references; instructor-curated context links with server ownership and reviewer metadata. | Qualified content review, verified local curriculum alignment, formal institution pathways, reviewed multilingual resources and licensing review for future redistribution. |
| Practice lab | Three fictional scenarios: measurements, traceable notes and structured handover; `public/scenarios.js` defines source facts and draft rubrics. | Educator approval and review of free-text quality; additional local cases after validation. |
| Feedback / retry | Deterministic scenario-specific assessment (7, 8, and 7 checks); browser verified notes 8/8 and handover 7/7. Next-step suggestions remain optional. | Instructor assessment of clinical/documentation quality; richer approved feedback. |
| Drafts / portfolio | Separate guest drafts; account progress persists to isolated SQLite with revision checks; explicit guest import, recent 50 summaries, JSON/text exports. Reviewable submissions are scored separately on the server. | External sharing consent, durable offline account queues, automatic conflict merging and hosting for physical-device access. |
| Offline access | Service worker caches core screens; downloaded lesson; unavailable-server reload verified. | Version/update lifecycle testing, synchronization/conflicts after server storage is introduced. No server synchronization exists today. |
| Learner / instructor accounts | Milestone 3: registration/sign-in, scrypt password hashes, expiring HttpOnly sessions, separate SQLite database; server-enforced roles; provisioned instructor assignment/review tools and learner feedback. Account HTTP isolation/authorization tests pass. | Recovery/deletion, HTTPS hosting, external sharing consent, account lifecycle validation and institutional governance. Demo comments are not educator approval. |
| Multilingual content | Not implemented; English only. | Learner-selected languages, reviewed translations and localization. |
| Validation / opportunity | 23 tests and browser checks recorded in `IMPLEMENTATION_PLAN.md`, including account/resource authorization, metadata, search and offline library use. Portfolio suggests instructor follow-up. | Student interviews, educator review, learner pilot, placement partnerships and real opportunity guidance. No certification. |

## Recommended sequence

1. Review V2 privileged server actions, dispensing atomicity/clearance, and sample stock seeding before calling those modules operationally complete.
2. Trace and verify one V2 outpatient journey against real test data, including alternate HMO and failure paths.
3. Validate all three implemented Learn scenarios and draft rubrics with an instructor and learners; preserve the same theme during revisions.
4. Accounts/instructor review now exist with isolated training storage. Next address account lifecycle, durable synchronization and multilingual content; preserve existing role and ownership checks.
5. Treat partner referrals, biometrics, local AI, external integrations, automatic vacancy calling and broader analytics as distinct scoped work items.

Keep this document current: name changed files, describe actual behavior, record checks performed, and leave unverified requirements explicit. Do not convert this source inventory into a blanket completion claim.
