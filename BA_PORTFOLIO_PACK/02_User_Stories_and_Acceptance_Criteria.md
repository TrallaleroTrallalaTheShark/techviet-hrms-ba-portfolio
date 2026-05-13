# User Stories and Acceptance Criteria — TechViet HRMS

## Module 1 — Recruitment / AI-driven ATS

### US-01 — Manage Job Postings
**As an** HR Manager,  
**I want to** create and manage job postings in one system,  
**so that** I do not need to manage multiple Excel files manually.

**Acceptance Criteria**
- Given HR Manager opens Job Posting module, when they create a posting, then mandatory fields must include Job Title, Department, Headcount, Job Description, and Deadline.
- Given mandatory fields are missing, when HR submits, then system shows validation messages.
- Given a job posting exists, when HR edits, duplicates, or archives it, then the status is updated and logged.

---

### US-02 — Auto-parse and Store CVs
**As an** HR Manager,  
**I want to** automatically classify and store candidate CVs by position,  
**so that** I can search and screen candidates faster instead of searching through emails.

**Acceptance Criteria**
- Given a CV is uploaded, when upload completes, then system creates a candidate profile within 30 seconds.
- Given candidate profiles exist, when HR filters by position/date/status, then matching candidates are displayed.
- Given parsing fails, when system cannot extract required data, then candidate is flagged for manual correction.

---

### US-03 — View Department Candidate Dashboard
**As a** Hiring Manager,  
**I want to** view candidate profiles for my department directly in the system,  
**so that** I can review faster without waiting for HR to forward emails.

**Acceptance Criteria**
- Given Hiring Manager logs in, when they open candidate dashboard, then only candidates under their department are visible.
- Given a candidate belongs to another department, when Hiring Manager searches, then candidate is not shown.
- Given candidate status changes, when dashboard refreshes, then the latest status is shown.

---

### US-04 — Update Interview Status and Feedback
**As a** Hiring Manager,  
**I want to** update interview status and add evaluation notes after interviews,  
**so that** HR and I can track candidate progress in real time.

**Acceptance Criteria**
- Given an interview is completed, when Hiring Manager submits feedback, then notes are saved with timestamp and reviewer name.
- Given candidate status is updated, when HR opens pipeline, then updated status is visible.
- Given required feedback is missing, when Hiring Manager submits, then system asks for completion.

---

### US-05 — Recruitment Conversion Report
**As an** HR Manager,  
**I want to** export conversion reports between recruitment stages,  
**so that** I can evaluate hiring process efficiency and optimize recruitment sources.

**Acceptance Criteria**
- Given recruitment data exists, when HR opens report, then funnel counts are displayed for Applied, Screened, Interviewed, Offered, and Hired.
- Given HR selects filters, when date range/department/job title changes, then report updates accordingly.
- Given HR clicks export, when export completes, then PDF/Excel file is generated.

---

### US-15 — AI CV Parsing and JD Match Score
**As an** HR Manager,  
**I want to** use AI to extract CV information and calculate match score against the job description,  
**so that** manual screening effort is reduced and candidates are prioritized consistently.

**Acceptance Criteria**
- Given a PDF/DOCX CV is uploaded, when AI parsing runs, then Name, Email, Phone, and Skills are extracted.
- Given a job description exists, when AI compares CV to JD, then a 0–100% match score is generated.
- Given AI confidence is below threshold, when profile is created, then the candidate is flagged for HR review.
- Given the AI score is shown, when HR views candidate details, then key matched/missing skills are displayed.

---

### US-16 — Candidate Routing by AI Score
**As an** HR Manager,  
**I want to** route candidates based on AI match score,  
**so that** I can focus manual review on borderline or high-value candidates.

**Acceptance Criteria**
- Given candidate AI score is >80%, when parsing completes, then candidate is marked Auto-Shortlisted and Hiring Manager is notified.
- Given score is 50–80%, when parsing completes, then candidate is placed in HR Manual Review queue.
- Given score is <50%, when parsing completes, then candidate is placed in Suggested Rejection Queue.
- Given candidate is in Suggested Rejection Queue, when HR approves rejection, then rejection email can be sent.
- Given HR disagrees with AI route, when HR manually changes status, then override reason is required.

---

### US-17 — Interview Conflict Detection
**As an** HR Manager or Hiring Manager,  
**I want to** detect room/time conflicts when scheduling interviews,  
**so that** interview sessions do not overlap and candidate experience is improved.

**Acceptance Criteria**
- Given an interview is scheduled in Room 1 from 10:00 to 11:00 on May 8, when another active interview is scheduled in Room 1 from 10:30 to 11:30, then system blocks scheduling due to overlapping time range.
- Given an interview is scheduled at the same date/time in a different room, when the user saves, then system allows scheduling and displays sessions side-by-side in calendar view.
- Given a conflict exists, when user views calendar, then conflict is highlighted clearly.
- Given user changes room/time, when conflict no longer exists, then system allows saving.

---

## Module 2 — Onboarding

### US-06 — Role-based Onboarding Checklist
**As an** HR Manager,  
**I want to** set onboarding checklists by role,  
**so that** onboarding is standardized and no task is missed.

**Acceptance Criteria**
- Given HR creates checklist template, when role is selected, then default tasks, owners, and due dates are shown.
- Given a candidate becomes hired, when onboarding starts, then checklist is auto-assigned.
- Given a task is overdue, when dashboard loads, then overdue task is highlighted.

---

### US-07 — Document Upload Portal
**As a** New Employee,  
**I want to** see required documents and upload them online,  
**so that** I know what to prepare and avoid submitting hard copies manually.

**Acceptance Criteria**
- Given new employee logs in, when opening Documents tab, then required/optional documents are listed.
- Given employee uploads a file, when upload succeeds, then confirmation is shown.
- Given document is rejected, when employee views status, then rejection reason and re-upload option are shown.

---

### US-08 — Onboarding Progress Tracking
**As a** New Employee,  
**I want to** track onboarding progress during the first 30 days,  
**so that** I know what to do next and integrate faster.

**Acceptance Criteria**
- Given onboarding tasks exist, when tasks are completed, then progress percentage updates.
- Given task due date passed, when task is incomplete, then task is marked overdue.
- Given employee opens dashboard, when progress is available, then completed/remaining tasks are displayed.

---

### US-12 — Mark Candidate Ready to Onboard
**As an** HR Manager,  
**I want to** mark a hired candidate as Ready to Onboard,  
**so that** onboarding and IT provisioning can start immediately.

**Acceptance Criteria**
- Given candidate status is Hired, when HR marks Ready to Onboard, then onboarding record is created.
- Given onboarding record is created, when system processes it, then IT Admin receives provisioning notification.

---

### US-13 — IT Provisioning Notification
**As an** IT Admin,  
**I want to** receive notification when a new hire requires equipment and account setup,  
**so that** I can prepare before the start date.

**Acceptance Criteria**
- Given new hire is Ready to Onboard, when status changes, then notification is sent to IT within 5 minutes.
- Given notification is opened, then role-based equipment/account list is visible.

---

### US-14 — Update IT Readiness
**As an** IT Admin,  
**I want to** update provisioning status for each new hire,  
**so that** HR can monitor Day-1 readiness.

**Acceptance Criteria**
- Given provisioning task exists, when IT marks equipment/account ready, then status updates to Ready.
- Given all required IT tasks are ready before start date, then Day-1 Ready flag is shown.
- Given IT status is pending, when HR opens onboarding dashboard, then pending setup is visible.

---

## Module 3 — Performance Management

### US-09 — KPI/OKR Framework Setup
**As an** HR Manager,  
**I want to** set KPI/OKR templates by department,  
**so that** performance evaluation is based on measurable criteria.

**Acceptance Criteria**
- Given HR creates a KPI/OKR item, when department and cycle are selected, then metric name, owner, weight, target, actual/current value, unit, direction, frequency, evidence source, linked goal, and period can be defined.
- Given KPI/OKR setup is saved, when employee or manager opens Performance module, then assigned/scoped KPIs are visible based on RBAC.
- Given KPI weights are configured, when HR views department KPI framework, then total weight by department is displayed for validation.

---

### US-10 — Manager Performance Review
**As a** Hiring Manager,  
**I want to** evaluate direct reports every 6 months,  
**so that** I can track employee development over time.

**Acceptance Criteria**
- Given review cycle is open, when manager opens an employee review within their scope, then self-assessment, KPI progress, check-ins, and authorized historical ratings are visible.
- Given manager submits review, when required fields are complete, then review is routed to HR for approval.

---

### US-11 — Employee Self-assessment
**As a** New Employee,  
**I want to** self-assess my work results,  
**so that** I can discuss achievements and career goals with my manager.

**Acceptance Criteria**
- Given review window is open, when employee submits self-assessment, then submission is saved and locked after deadline.
- Given deadline has passed, when employee tries to submit, then system blocks submission.

---


---

## Module 4 — Employee Directory / Organization Structure

### US-18 — Search Employee Directory
**As an** HR Manager or authorized user,  
**I want to** search employee records and open employee profiles,  
**so that** I can quickly find employment context, department, manager, location, and relevant role-based information.

**Acceptance Criteria**
- Given HR Manager opens Employee Directory, when they search by name, department, role, or employee code, then matching employees are displayed.
- Given Hiring Manager opens Employee Directory, when employees from other departments exist, then only team/public data within allowed scope is visible.
- Given IT Admin opens an employee profile, when asset data exists, then IT asset information is visible without exposing HR-only compensation/private fields.
- Given New Employee opens directory, when they view employee profiles, then only public directory information is shown.

---

### US-19 — Navigate Org Chart and Manager Chain
**As a** Hiring Manager or HR Manager,  
**I want to** navigate the org chart using focus mode and manager chain,  
**so that** I can understand reporting relationships without rendering the entire company tree at once.

**Acceptance Criteria**
- Given an employee is selected, when user clicks focus, then Org Chart centers on that employee and relevant direct reports.
- Given the employee has a manager chain, when profile opens, then chain from leadership to employee is visible.
- Given an employee has many direct reports, when Org Chart renders, then system limits visible nodes and allows drill-down/search instead of rendering all employees.

---

### US-20 — Preserve Historical Performance Snapshots
**As an** HR Manager,  
**I want to** preserve review history by period-specific employee snapshot,  
**so that** historical performance records remain auditable and do not change when new employees join later.

**Acceptance Criteria**
- Given Q1 2026 review archive exists, when an employee joins in Q2 2026, then that employee is not shown in Q1 historical review snapshot.
- Given HR selects a historical review cycle, when records load, then reviews are filtered by exact period ID and displayed as read-only.
- Given finalized review exists, when any user attempts to edit it, then system blocks changes and preserves audit integrity.

## Notes for Portfolio

- US-15 to US-17 were added to close gaps created by the updated AI ATS and interview conflict requirements.
- US-12 to US-14 close the onboarding IT provisioning traceability gap.
- US-18 to US-20 align documentation with the final prototype additions: Employee Directory, scalable Org Chart, and historical performance snapshot integrity.
- Use these stories together with RTM and UAT test cases during interviews.
