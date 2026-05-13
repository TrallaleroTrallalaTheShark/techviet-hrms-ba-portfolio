# Business Requirements Document — HR Management System

**Project:** TechViet HRMS  
**Version:** 1.3 Final Portfolio Sync  
**Prepared for:** IT Business Analyst Portfolio  
**Company Context:** TechViet JSC — mid-sized technology company, 200–500 employees  

---

## 1. Executive Summary

TechViet JSC is a mid-sized technology company experiencing rapid organizational growth. The company currently manages core HR operations through fragmented tools such as Excel spreadsheets, email, and Zalo. These fragmented processes create data silos, delayed hiring cycles, inconsistent onboarding follow-up, and limited visibility into performance management.

The HRMS project aims to consolidate Recruitment, Onboarding, Employee Directory, and Performance Management into a single web-based platform. The solution will improve operational efficiency, reduce manual HR workload, improve data accuracy, and provide real-time insights to HR Managers and Hiring Managers.

A key enhancement retained in Version 1.3 is the inclusion of an **AI-driven Applicant Tracking System (ATS)** capability to automate CV parsing, JD matching, candidate scoring, and workflow routing while preserving HR oversight for high-risk decisions.

---

## 2. Business Problems

| Problem ID | Current Problem | Business Impact |
|---|---|---|
| BP-01 | CVs are received and tracked manually via email/Excel | Delayed screening, missing candidate data, duplicated effort |
| BP-02 | Hiring Managers depend on HR to forward CVs | Slow feedback loop and poor recruitment transparency |
| BP-03 | Interview scheduling is manually coordinated | Room/time conflicts and poor candidate experience |
| BP-04 | Onboarding tasks and documents are tracked manually | Missing documents, unclear ownership, Day-1 readiness risk |
| BP-05 | Performance reviews are Excel/file-based | Lack of historical visibility, inconsistent review process |
| BP-06 | HR lacks consolidated dashboards | Leadership cannot make timely workforce decisions |
| BP-07 | Employee information and reporting lines are hard to navigate at scale | HR and managers lose time finding employee context, direct reports, and ownership |

---

## 3. Business Objectives and Success Metrics

| Objective ID | Objective | KPI / Success Metric | Timeline |
|---|---|---|---|
| OBJ-01 | Reduce Time-to-Hire using automated CV screening and AI-driven ATS | 40% Time-to-Hire reduction; 90% reduction in manual CV screening effort | Month 1–6 |
| OBJ-02 | Achieve complete onboarding document tracking | 100% required onboarding documents tracked digitally | Month 1–3 |
| OBJ-03 | Digitize performance review process | 100% performance reviews completed in system after launch | Month 3–6 |
| OBJ-04 | Provide real-time hiring dashboards | 100% Hiring Manager adoption for candidate dashboard | Month 1–2 |
| OBJ-05 | Improve IT provisioning visibility | 95% new hires marked Day-1 Ready before start date | Month 1–3 |
| OBJ-06 | Improve employee data visibility with role-based directory and org chart | 100% employee records searchable; managers can find team/reporting structure within 1 minute | Month 2–4 |

---

## 4. Stakeholder Analysis

| Stakeholder | Role | RACI | Influence | Key Responsibility |
|---|---|---|---|---|
| HR Manager | Product Owner / Process Owner | Responsible | High | Define HR workflows, manage recruitment/onboarding/performance, approve reports |
| Hiring Manager | Key User | Consulted | High | Review candidates, provide interview feedback, conduct team appraisals |
| IT Admin | System / Provisioning Admin | Responsible | Medium | Manage user access, provision equipment/accounts, update readiness status |
| New Employee | End User | Informed | Low | Upload onboarding documents, complete checklist, submit self-assessment |
| Leadership | Sponsor | Accountable | High | Approve budget, monitor KPI outcomes, support adoption |

---

## 5. Project Scope

### 5.1 In-Scope — Phase 1

**Module 1 — Recruitment / ATS**
- Job posting creation, editing, duplication, archiving
- CV upload, parsing, searchable candidate database
- AI CV extraction and JD match scoring
- Candidate routing based on match score
- Hiring Manager candidate dashboard scoped by department
- Interview scheduling, conflict detection, interview feedback
- Recruitment conversion report

**Module 2 — Onboarding**
- Role-based onboarding checklist
- New employee document upload portal
- Onboarding progress tracker
- IT provisioning notification
- IT readiness status / Day-1 readiness flag

**Module 3 — Employee Directory / Organization Structure**
- Searchable employee directory
- Employee profile with employment, reporting, location, and IT asset context
- Scalable Org Chart with focus mode, manager chain, and direct report drill-down
- Role-based visibility for HR, Hiring Manager, IT Admin, and New Employee

**Module 4 — Performance Management**
- KPI/OKR template setup by department
- Employee self-assessment
- Manager review
- HR approval/finalization
- Archived immutable review records

### 5.2 Out-of-Scope — Phase 1

- Payroll and benefits calculation
- Timekeeping and attendance / biometric integration
- External job board API integration such as LinkedIn/TopCV/Indeed
- Native mobile applications
- Fully automated AI hiring decisions without HR oversight

### 5.3 Phase 2 Candidates

- External job board auto-sync
- Advanced AI talent recommendations
- Payroll integration
- HR analytics forecasting
- Mobile app

---

## 6. Functional Requirements

### 6.1 Recruitment / ATS Module

| FR ID | User Story | Requirement | Acceptance Criteria |
|---|---|---|---|
| FR-01 | US-01 | System shall allow HR Manager to create, edit, duplicate, and archive job postings with Job Title, Department, Headcount, JD, and Deadline. | Mandatory fields validated; HR can create complete posting in <3 minutes. |
| FR-02 | US-02 | System shall parse uploaded CVs and store candidate records in a searchable database tagged by position and upload date. | CV stored within 30 seconds; HR can filter by position, date, and status. |
| FR-03 | US-03 | System shall provide Hiring Managers with a real-time candidate dashboard scoped to their department. | HM sees candidates for own department only; cross-department data hidden. |
| FR-04 | US-04 | System shall allow Hiring Managers to update interview status and add evaluation notes. | Updates visible to HR in real time; notes are timestamped and attributed. |
| FR-05 | US-05 | System shall generate recruitment conversion report across Applied → Screened → Interviewed → Offered → Hired. | Exportable to PDF/Excel; filterable by date range, department, and job title. |
| FR-06 | US-15 | System shall use AI engine to extract candidate profile data and calculate JD match score. | Extracts Name, Email, Phone, Skills from PDF/DOCX with target 95% accuracy; generates 0–100% match score within 30 seconds. |
| FR-07 | US-16 | System shall route candidates based on AI match score while preserving HR oversight for rejection decisions. | >80% shortlisted and HM notified; 50–80% sent to HR Manual Review; <50% moved to Suggested Rejection Queue for HR approval before email is sent. |
| FR-08 | US-17 | System shall detect interview room/time conflicts when scheduling or rescheduling interviews. | If another active interview overlaps the requested time range in the same room on the same date, system blocks save and displays conflict warning; same time in a different room is allowed. |

### 6.2 Onboarding Module

| FR ID | User Story | Requirement | Acceptance Criteria |
|---|---|---|---|
| FR-09 | US-06 | System shall allow HR to create role-based onboarding checklists with owners and due dates. | Checklist auto-assigned after candidate is confirmed as hired; each task shows owner and deadline. |
| FR-10 | US-07 | System shall provide document upload portal for new employees. | Employee sees required document list; upload confirmation shown immediately; HR notified. |
| FR-11 | US-08 | System shall display onboarding progress tracker for first 30 days. | Progress updates in real time; overdue tasks highlighted red. |
| FR-12 | US-12/US-13 | System shall notify IT Admin when candidate status changes to Ready to Onboard. | IT receives notification within 5 minutes with role-based equipment/access list. |
| FR-13 | US-14 | System shall allow IT Admin to update equipment/account provisioning status. | HR sees real-time IT readiness; Day-1 Ready flag appears on onboarding dashboard. |

### 6.3 Employee Directory / Organization Structure Module

| FR ID | User Story | Requirement | Acceptance Criteria |
|---|---|---|---|
| FR-18 | US-18 | System shall provide a searchable employee directory with role-based field visibility. | HR sees all employee profile data; Hiring Manager sees team/public data; IT Admin sees IT asset context; New Employee sees public directory data only. |
| FR-19 | US-19 | System shall provide a scalable Org Chart with focus mode and manager chain navigation. | User can search an employee, focus the chart on that person, view manager chain, and expand limited direct reports without rendering the whole company at once. |
| FR-20 | US-18/US-19 | System shall apply RBAC consistently to employee directory and org chart insights. | Hiring Manager manager insights are shown only for employees in their department/team scope. |

### 6.4 Performance Management Module

| FR ID | User Story | Requirement | Acceptance Criteria |
|---|---|---|---|
| FR-14 | US-09 | System shall allow HR to create KPI/OKR items by department and review cycle. | KPI setup supports metric name, owner, department, weight, target, actual/current value, unit, direction, frequency, evidence source, linked goal, and review period. |
| FR-15 | US-11 | System shall provide self-assessment form linked to assigned KPIs. | Employee can submit only during open review window; submission locked after deadline. |
| FR-16 | US-10 | System shall allow Hiring Managers to conduct performance reviews for scoped employees. | Manager view is scoped to direct reports/department; self-assessment, check-ins, KPI evidence, and historical ratings are visible where authorized. |
| FR-17 | US-09/US-10/US-20 | System shall allow HR to approve and finalize review results with period-specific archive integrity. | Finalized reviews are immutable; historical cycles preserve original period ID and employee snapshot; employees who joined after a period are not retroactively included. |

---

## 7. Non-Functional Requirements

| NFR ID | Category | Requirement | Measurement |
|---|---|---|---|
| NFR-01 | Security | Data encrypted at rest using AES-256 and in transit using TLS 1.2+. RBAC is mandatory. | Security review passed before UAT. |
| NFR-02 | Availability | 99.5% uptime during business hours, Mon–Fri 8AM–6PM. | Monitored monthly via uptime dashboard. |
| NFR-03 | Performance | Page load <3 seconds under normal load; support up to 1,000 concurrent users. | Load test before go-live. |
| NFR-04 | Usability | Web-responsive UI requiring <1 hour onboarding training. | Validated by UAT satisfaction survey. |
| NFR-05 | Scalability | Architecture supports scaling to 2,000 users without major re-engineering. | Architecture review by tech lead. |
| NFR-06 | Auditability | Key actions such as status change, review submission, and document verification must be logged. | Audit logs available for HR/Admin review. |
| NFR-07 | AI Governance | AI recommendations must be explainable and must not make final rejection/hiring decisions without human oversight. | AI score explanation visible; HR approval required for rejection queue. |

---

## 8. Key Assumptions

- Users have reliable internet and modern browsers.
- HR owns initial data migration from Excel.
- IT Admin can configure accounts and integrations.
- Stakeholders are available for UAT within 3-month timeline.
- AI scoring is used as decision support, not final decision-making.

---

## 9. Constraints

- UAT readiness required within 3 months.
- Budget excludes external job board API integration in Phase 1.
- Web-based only for Phase 1.
- Existing HR data may be inconsistent and require cleansing before migration.

---

## 10. Business Rules Summary

Detailed rules are maintained in `04_Business_Rules_and_RBAC.md`.

Core examples:
- Hiring Managers can view only candidates and employees under their department/team.
- Employee Directory and Org Chart must respect RBAC for profile fields, manager insights, and IT asset data.
- AI score below 50% routes candidate to Suggested Rejection Queue, not direct rejection email.
- Finalized performance reviews cannot be edited.
- Historical review records must preserve original review period and employee snapshot.
- KPI/OKR items must carry target, actual/current value, owner, weight, source, frequency, and direction metadata.
- IT readiness must be completed before employee start date to be considered Day-1 Ready.

---

## 11. Portfolio Notes

This BRD is designed for BA portfolio demonstration. It should be presented together with:
- User Story document
- BPMN / Use Case Diagram
- RTM
- Business Rules + RBAC Matrix
- UAT test cases
- Prototype screenshots or live demo
- Final audit/sync report
