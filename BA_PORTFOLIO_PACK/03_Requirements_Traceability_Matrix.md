# Requirements Traceability Matrix — TechViet HRMS

## Purpose
This RTM shows traceability from business objectives to user stories, functional requirements, prototype screens, and UAT coverage.

## RTM

| Objective | User Story | FR ID | Requirement Summary | Prototype / Screen | UAT Case |
|---|---|---|---|---|---|
| OBJ-01 | US-01 | FR-01 | Manage job postings | Job Postings | UAT-01 |
| OBJ-01 | US-02 | FR-02 | Parse and store CVs | Applications Box | UAT-02 |
| OBJ-04 | US-03 | FR-03 | Hiring Manager candidate dashboard | Recruitment Pipeline / Applications | UAT-03 |
| OBJ-01 | US-04 | FR-04 | Update interview status and notes | Recruitment Pipeline / Interviews | UAT-04 |
| OBJ-01 / OBJ-04 | US-05 | FR-05 | Recruitment conversion report | Dashboard | UAT-05 |
| OBJ-01 | US-15 | FR-06 | AI CV parsing and JD match score | Applications Box / CV Drawer | UAT-06 |
| OBJ-01 | US-16 | FR-07 | Candidate routing by AI score | Applications Box / Pipeline | UAT-07 |
| OBJ-01 | US-17 | FR-08 | Interview conflict detection | Interviews Calendar | UAT-08 |
| OBJ-02 | US-06 | FR-09 | Role-based onboarding checklist | Onboarding | UAT-09 |
| OBJ-02 | US-07 | FR-10 | Document upload portal | Onboarding Documents | UAT-10 |
| OBJ-02 | US-08 | FR-11 | Onboarding progress tracker | Onboarding Dashboard | UAT-11 |
| OBJ-05 | US-12/US-13 | FR-12 | Notify IT Admin for provisioning | IT Provisioning | UAT-12 |
| OBJ-05 | US-14 | FR-13 | IT readiness status update | IT Provisioning / Onboarding | UAT-13 |
| OBJ-03 | US-09 | FR-14 | KPI/OKR templates | Performance Management | UAT-14 |
| OBJ-03 | US-11 | FR-15 | Employee self-assessment | My Performance Review | UAT-15 |
| OBJ-03 | US-10 | FR-16 | Manager performance review | Team Performance | UAT-16 |
| OBJ-03 | US-09/US-10/US-20 | FR-17 | HR approval and period-specific finalized archive | Performance Review Modal / Historical Cycle View | UAT-17 |
| OBJ-06 | US-18 | FR-18 | Searchable role-based employee directory | Employee Directory | UAT-18 |
| OBJ-06 | US-19 | FR-19 | Scalable org chart with focus mode and manager chain | Employee Directory / Org Chart | UAT-19 |
| OBJ-06 / NFR-01 | US-18/US-19 | FR-20 | Employee directory RBAC and scoped manager insight | Employee Profile Modal / Manager View | UAT-20 |

## NFR Traceability

| NFR ID | Category | Related Areas | Validation Method |
|---|---|---|---|
| NFR-01 | Security / RBAC | All modules, candidate data, employee data, documents | Permission testing, security review |
| NFR-02 | Availability | All business-hour operations | Uptime monitoring |
| NFR-03 | Performance | Dashboard, search, CV processing, employee directory | Load test, page load test |
| NFR-04 | Usability | All role-based screens | UAT survey, task completion timing |
| NFR-05 | Scalability | Candidate DB, employee directory, reports | Architecture review |
| NFR-06 | Auditability | Status changes, reviews, document verification, historical review snapshots | Audit log review and period snapshot review |
| NFR-07 | AI Governance | AI scoring, candidate routing, rejection queue | Explainability and HR approval checks |

## Traceability Gaps Closed in v1.2

| Previous Gap | Resolution |
|---|---|
| FR-06 and FR-07 had no User Story mapping | Added US-15 and US-16 |
| User Story artifact stopped at US-11 | Added US-12 to US-17 |
| AI auto-rejection created compliance risk | Changed to Suggested Rejection Queue requiring HR approval |
| External job board sync conflicted with out-of-scope | Clarified as Phase 2 / future enhancement |
| IT provisioning FR referenced US-12/13/14 but stories were missing | Added US-12, US-13, US-14 |
| Employee Directory and Org Chart existed in prototype but were under-documented | Added OBJ-06, FR-18 to FR-20, US-18 to US-19, UAT-18 to UAT-20 |
| Interview conflict rule only checked exact same time | Updated FR/BR/UAT wording to same-room overlapping time range using duration |
| Performance history could be misread as relabeled records | Added US-20 and clarified period-specific snapshots and immutable archive |
| KPI creation prototype has richer metadata than v1.2 docs | Expanded FR-14, US-09, BR-PER-01, Data Dictionary, and UAT-14 |
