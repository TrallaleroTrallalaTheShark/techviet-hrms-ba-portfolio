# UAT Test Cases — TechViet HRMS

## Purpose
These UAT scenarios validate whether the HRMS meets business needs from the perspective of HR Manager, Hiring Manager, IT Admin, and New Employee.

## UAT Test Cases

| Test ID | Related FR | Scenario | Role | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| UAT-01 | FR-01 | Create complete job posting | HR Manager | HR logged in | Open Job Postings → Click New Posting → Fill mandatory fields → Submit | Job posting created as Draft/Active; validation passes | High |
| UAT-02 | FR-02 | Upload and store CV | HR Manager | Active job posting exists | Upload PDF/DOCX CV | Candidate profile created within 30 seconds and searchable | High |
| UAT-03 | FR-03 | Hiring Manager views scoped candidates | Hiring Manager | Candidates exist in multiple departments | Login as Engineering HM → Open dashboard | Only Engineering candidates are visible | High |
| UAT-04 | FR-04 | Submit interview feedback | Hiring Manager | Interview exists | Open candidate/interview → Add rating and notes → Submit | Feedback saved with timestamp and reviewer | High |
| UAT-05 | FR-05 | Export recruitment conversion report | HR Manager | Candidate statuses exist across stages | Open Dashboard/Report → Apply filters → Export PDF/Excel | Report generated with correct funnel data | Medium |
| UAT-06 | FR-06 | AI parses CV and generates match score | HR Manager | JD exists | Upload CV with skills | Name, Email, Phone, Skills extracted; score generated | High |
| UAT-07 | FR-07 | AI routes candidate based on score | HR Manager | Candidate scored by AI | Check candidates with scores <50, 50–80, >80 | Candidates routed to Suggested Rejection, HR Review, Shortlisted respectively | High |
| UAT-08 | FR-08 | Prevent interview room overlap conflict | HR/HM | Interview exists in Room 1 from 10:00-11:00 | Schedule another active interview in Room 1 from 10:30-11:30 | System blocks save and shows overlap conflict warning; same time in another room is allowed | High |
| UAT-09 | FR-09 | Auto-assign onboarding checklist | HR Manager | Candidate marked Hired | Mark candidate Ready to Onboard | Onboarding record created with role-based checklist | High |
| UAT-10 | FR-10 | Upload onboarding document | New Employee | Employee has onboarding account | Open Documents → Upload required document | Upload confirmation shown; status Pending Review | High |
| UAT-11 | FR-11 | Track onboarding progress | New Employee | Checklist assigned | Complete one task | Progress percentage updates | Medium |
| UAT-12 | FR-12 | Notify IT provisioning | IT Admin | Candidate is Ready to Onboard | HR changes status | IT receives notification within 5 minutes | High |
| UAT-13 | FR-13 | Update IT readiness | IT Admin | Provisioning tasks exist | Mark laptop/account ready | HR sees IT status Ready; Day-1 Ready if all mandatory tasks complete | High |
| UAT-14 | FR-14 | Create KPI/OKR item with metadata | HR Manager | HR logged in and active review cycle exists | Open Performance → Create KPI/OKR → Fill metric, department, owner, weight, target, actual/current value, unit, direction, frequency, source, linked goal → Save | KPI appears in department framework; department total weight updates; scoped users can view assigned KPI | High |
| UAT-15 | FR-15 | Submit self-assessment | New Employee | Review window open | Fill self-assessment → Submit | Submission saved and locked after deadline | Medium |
| UAT-16 | FR-16 | Manager submits performance review | Hiring Manager | Employee submitted self-assessment | Open review → Add scores/comments → Submit | Review sent to HR approval | High |
| UAT-17 | FR-17 | HR finalizes review and preserves historical archive | HR Manager | Manager review submitted | Open review → Approve/finalize → Switch to historical cycle | Review becomes immutable; historical view uses exact period ID and employee snapshot | High |
| UAT-18 | FR-18 | Search employee directory with RBAC | HR/HM/IT/New Employee | Employees exist across departments | Login as each role → Search employees → Open profile | Visible employees and profile fields match RBAC permissions | High |
| UAT-19 | FR-19 | Navigate org chart focus mode | HR/HM | Employee hierarchy exists | Open Employee Directory → Select employee → Focus org chart → View manager chain/direct reports | Org Chart focuses on selected employee, shows manager chain, and limits large direct report rendering | Medium |
| UAT-20 | FR-20 | Hiring Manager manager insight is scoped | Hiring Manager | Employees exist in Engineering and other departments | Login as Engineering HM → Open Engineering employee and non-Engineering employee | Manager insight appears only for Engineering/team-scope employee; other department data hidden | High |

## Negative / Edge Test Cases

| Test ID | Scenario | Expected Result |
|---|---|---|
| NEG-01 | HR submits job posting with missing mandatory fields | System shows validation errors and blocks submit |
| NEG-02 | Hiring Manager tries to view another department’s candidate | Access denied or candidate hidden |
| NEG-03 | AI fails to parse CV field | Candidate flagged for manual correction |
| NEG-04 | HR tries to send rejection email for <50% candidate without approval | System blocks sending until HR approval step completed |
| NEG-05 | Employee uploads rejected document again | Status changes to Pending Review and previous rejection reason remains in history |
| NEG-06 | Employee tries self-assessment after deadline | System blocks submission |
| NEG-07 | User tries to edit finalized performance review | System blocks edit and shows immutable record message |
| NEG-08 | HR schedules same room with overlapping time range | System blocks scheduling even if start time is not exactly the same |
| NEG-09 | HR attempts to create duplicate onboarding record for same candidate | System blocks duplicate using candidate_id/source_candidate_id |
| NEG-10 | New employee joined in Q2 appears in Q1 historical review | System excludes employee from Q1 snapshot |

## UAT Exit Criteria

UAT can be considered passed when:
- 100% High priority test cases pass.
- At least 90% Medium priority test cases pass.
- No unresolved Severity 1 or Severity 2 defects remain.
- Business owners sign off Recruitment, Onboarding, and Performance modules.

## Sample Defect Log Format

| Defect ID | Test Case | Severity | Description | Expected | Actual | Owner | Status |
|---|---|---|---|---|---|---|---|
| DEF-001 | UAT-08 | High | Room overlap conflict not blocked | System blocks same-room overlapping time range | Interview saved successfully | Dev Team | Resolved in prototype final sync |
