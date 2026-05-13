# RAID Log and Change Log — TechViet HRMS

## 1. Risk Log

| Risk ID | Risk | Impact | Probability | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | AI CV screening may introduce bias or incorrect rejection | High | Medium | Use AI as recommendation only; HR approval required for rejection; show match/missing skills | HR Manager / BA |
| R-02 | Existing Excel data is inconsistent or incomplete | High | High | Data cleansing template and migration validation before UAT | HR Manager |
| R-03 | Hiring Managers may not adopt dashboard | Medium | Medium | UAT involvement, short training, dashboard tailored by department | HR Manager |
| R-04 | Interview scheduling conflicts affect candidate experience | Medium | Medium | Add conflict detection rule and calendar validation | Product/Dev Team |
| R-05 | New employees may upload invalid/unclear documents | Medium | Medium | Document validation status, rejection reason, re-upload flow | HR Manager |
| R-06 | Performance review data is sensitive | High | Medium | RBAC, audit logs, encryption, immutable finalized records | IT Admin |
| R-07 | 3-month UAT timeline may be tight | Medium | Medium | Prioritize MVP scope; defer external job board integration to Phase 2 | Sponsor / PM |
| R-08 | Page performance may degrade with large employee/candidate data | Medium | Medium | Pagination, indexing, lazy loading, org chart focus mode, performance testing | Dev Team |
| R-09 | Employee profile and performance data may be exposed across departments | High | Medium | RBAC matrix, scoped manager views, field-level visibility, permission testing | HR Manager / IT Admin |
| R-10 | Historical performance data may be corrupted by current employee master data changes | High | Low | Period-specific review snapshots and immutable finalized archive | HR Manager / BA |

## 2. Assumption Log

| Assumption ID | Assumption | Validation Method |
|---|---|---|
| A-01 | All users use modern browsers and stable internet | Confirm during stakeholder interview / IT policy |
| A-02 | HR Manager owns data migration from Excel | Confirm during project kickoff |
| A-03 | IT Admin can provision accounts and manage access rights | Confirm with IT team |
| A-04 | Stakeholders are available for UAT within project timeline | Confirm UAT calendar |
| A-05 | AI matching accuracy target of 95% is technically feasible for core fields | Validate with proof-of-concept and sample CV set |
| A-06 | External job board integration is not required for Phase 1 | Confirm scope sign-off |
| A-07 | Prototype uses mock data and frontend RBAC to demonstrate logic, not production security | Clarify in portfolio/demo disclaimer |
| A-08 | Employee Directory is required for portfolio completeness and HR visibility, although not the first MVP pain point | Confirm as supporting module for HR operations |

## 3. Issue Log Template

| Issue ID | Description | Severity | Impacted Module | Owner | Target Resolution | Status |
|---|---|---|---|---|---|---|
| I-001 | User Story document missing US-12 to US-17 | Medium | Documentation | BA | v1.2 update | Resolved |
| I-002 | Prototype displays Phase 2 job board sync while BRD marks it out-of-scope | Medium | Recruitment | BA/Dev | Add Phase 2 label or remove from Phase 1 UI | Resolved |
| I-003 | Prototype lint/build verification required before live demo | Low | Frontend | Dev | Before demo | Resolved — lint/build passed with only Vite chunk-size warning |
| I-004 | Documentation did not fully reflect Employee Directory, Org Chart, KPI creation metadata, and historical snapshot logic | Medium | Documentation | BA | v1.3 final sync | Resolved |

## 4. Change Log

| Version | Date | Change Summary | Reason |
|---|---|---|---|
| v1.0 | Initial | Created HRMS BRD with Recruitment, Onboarding, Performance scope | Baseline BA artifact |
| v1.1 | 2026 | Added AI-driven ATS objective and AI parsing/routing requirements | Strengthen recruitment automation and portfolio value |
| v1.2 | 2026 | Added US-12 to US-17, RTM update, business rules, RBAC, UAT cases, AI governance note | Make project portfolio-ready and close traceability/risk gaps |
| v1.3 | 2026-05-13 | Synced documentation with final prototype: Employee Directory/Org Chart, interview overlap validation, KPI creation metadata, historical review snapshots, onboarding duplicate guard, dynamic onboarding metrics, and final DOCX export | Close final audit gaps before recruiter-ready packaging |

## 5. Scope Control Notes

### Confirmed Phase 1
- Job Posting Management
- CV Parsing and AI Match Score
- Candidate Pipeline and Interviews
- Onboarding Checklist/Documents/IT Provisioning
- Employee Directory and Org Chart
- KPI/OKR and Performance Reviews

### Deferred to Phase 2
- External job board API integration
- Payroll and benefits
- Timekeeping and attendance
- Native mobile app
- Advanced predictive workforce analytics

## 6. Portfolio Talking Point

If asked about AI risk, say:

> I intentionally changed the design from fully automated rejection to a Suggested Rejection Queue requiring HR approval. This balances efficiency with fairness, compliance, and human accountability.
