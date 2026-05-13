# TechViet HRMS — IT BA Portfolio Prototype

TechViet HRMS is an interactive React prototype for an IT Business Analyst portfolio case study. It demonstrates how a mid-sized technology company can centralize fragmented HR processes across Recruitment, Onboarding, Employee Directory, and Performance Management.

This repository should be presented together with the BA documentation pack in:

`../BA_PORTFOLIO_PACK`

---

## Business Problem

TechViet JSC currently manages HR work through Excel, email, and Zalo. This creates:

- Slow hiring cycles and manual CV screening
- Limited Hiring Manager visibility into candidate status
- Interview room/time conflicts
- Inconsistent onboarding follow-up and IT provisioning
- Hard-to-navigate employee information and reporting structure
- File-based performance reviews with weak historical visibility

---

## Prototype Scope

### 1. Dashboard

- Workforce and recruitment summary
- Candidate pipeline metrics
- Today's interviews
- Urgent HR actions
- Role-based dashboard behavior

### 2. Recruitment / ATS

- Job postings
- Applications box
- AI CV parsing and JD match score concept
- Suggested Rejection Queue requiring HR approval
- Recruitment pipeline Kanban
- Interview scheduling from candidate pipeline

### 3. Interviews Calendar

- Weekly interview calendar
- Same-room time-overlap conflict detection using interview duration
- Same-time different-room sessions displayed side-by-side
- Schedule/reschedule/cancel sync with recruitment pipeline

### 4. Onboarding

- New hire tracker
- Dynamic onboarding progress/tasks/documents
- IT provisioning queue
- Day-1 readiness concept
- Duplicate onboarding prevention by candidate/source candidate ID

### 5. Employee Directory / Org Chart

- Searchable employee directory
- Employee profile modal
- Role-based profile visibility
- Manager chain
- Scalable org chart focus mode
- IT asset context

### 6. Performance Management

- KPI/OKR framework view
- HR Manager KPI/OKR creation flow
- KPI metadata: owner, weight, target, actual/current value, unit, direction, frequency, source, linked goal
- Review cycle selector
- Continuous check-ins
- Historical review snapshots by exact period ID
- 9-box calibration concept
- RBAC-scoped views for HR, Hiring Manager, and New Employee

---

## BA Artifacts

The main BA deliverables are stored in `../BA_PORTFOLIO_PACK`:

- BRD
- User Stories and Acceptance Criteria
- Requirements Traceability Matrix
- Business Rules and RBAC Matrix
- Data Model and Data Dictionary
- UAT Test Cases
- RAID Log and Change Log
- Demo Script and CV Bullets
- Final Audit and Sync Report
- BPMN and Use Case diagrams
- DOCX exports

---

## How to Run

```bash
npm install
npm run dev
```

For verification:

```bash
npm run lint
npm run build
```

Latest verification: lint passed and production build passed. Vite may show a chunk-size warning because this portfolio prototype is bundled as a single-page demo.

---

## Portfolio Positioning

This is an interactive BA validation prototype, not a production HRMS.

It uses mock data and frontend state to demonstrate:

- Business workflow understanding
- Requirement traceability
- RBAC thinking
- Data/state consistency
- Edge case handling
- Stakeholder pain point resolution

Production implementation would require backend APIs, database design, authentication/authorization, audit logs, file storage, and security hardening.
