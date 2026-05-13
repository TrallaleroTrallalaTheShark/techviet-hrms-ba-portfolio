# Demo Script and CV Bullets — TechViet HRMS

## 1. 60-second Project Pitch

TechViet HRMS is an IT Business Analyst portfolio project for a mid-sized technology company with 200–500 employees. The company currently manages Recruitment, Onboarding, Employee Directory, and Performance Management through Excel, Zalo, and email, causing data silos, slow hiring cycles, and limited visibility.

I analyzed the business problems, defined measurable objectives, created BRD, user stories, functional/non-functional requirements, BPMN/use case diagrams, RTM, RBAC matrix, data model, UAT test cases, RAID log, final audit report, and a React-based prototype.

The key highlight is an AI-driven ATS workflow that parses CVs, calculates JD match scores, and routes candidates based on score while preserving HR approval for rejection decisions to reduce AI governance risk.

---

## 2. 5-minute Demo Flow

### Step 1 — Business Problem
Show BRD Executive Summary and Objectives.

Say:
> The current HR process is fragmented across Excel, Zalo, and email. The main business impact is delayed hiring, inconsistent data, and lack of transparency. Therefore, I defined success metrics such as 40% Time-to-Hire reduction and 90% reduction in manual CV screening effort.

### Step 2 — Scope and Stakeholders
Show Scope and RACI.

Say:
> I divided the system into four modules: Recruitment, Onboarding, Employee Directory, and Performance Management. I also defined four main roles: HR Manager, Hiring Manager, IT Admin, and New Employee.

### Step 3 — Recruitment / ATS Prototype
Show Job Postings, Applications Box, Recruitment Pipeline.

Say:
> In the Recruitment module, HR can manage job postings, CVs are parsed and scored, and candidates are routed based on AI match score. I intentionally designed low-score candidates to go into a Suggested Rejection Queue instead of direct auto-rejection to reduce compliance and bias risk.

### Step 4 — Interview Calendar
Show Interviews screen.

Say:
> Hiring Managers can schedule interviews and the system detects room/time conflicts. This directly addresses the stakeholder pain point that interview schedules often conflict when managed manually.

### Step 5 — Onboarding
Show Onboarding and IT Provisioning.

Say:
> Once a candidate is hired, the onboarding record and role-based checklist are created. IT Admin receives provisioning tasks and HR can track Day-1 readiness.

### Step 6 — Employee Directory / Org Chart
Show Employee Directory and Org Chart.

Say:
> The Employee Directory supports role-based profile visibility, search, employee profile details, manager chain, and scalable Org Chart focus mode. This helps HR and managers find employee context without rendering the entire company tree.

### Step 7 — Performance Management
Show Performance screen.

Say:
> HR creates KPI/OKR items with owner, weight, target, actual value, source, frequency, and linked goal. Employees and managers use scoped review views, while HR can review historical cycles with period-specific snapshots and immutable records.

### Step 8 — BA Artifacts
Show RTM, Business Rules/RBAC, UAT.

Say:
> To make requirements testable and traceable, I created RTM, business rules, RBAC matrix, data model, and UAT test cases.

---

## 3. CV Bullets — English Version

**HR Management System — IT Business Analyst Portfolio Project**

- Analyzed HR pain points across Recruitment, Onboarding, Employee Directory, and Performance Management for a mid-sized technology company of 200–500 employees.
- Created BRD, user stories, BPMN, use case diagram, requirements traceability matrix, RBAC matrix, data dictionary, UAT test cases, and React-based prototype.
- Defined AI-driven ATS requirements including CV parsing, JD match scoring, candidate routing rules, and recruitment conversion dashboard.
- Designed role-based workflows for HR Manager, Hiring Manager, IT Admin, and New Employee across recruitment, onboarding, employee directory, and performance review processes.
- Proposed measurable business outcomes: 40% reduction in Time-to-Hire and 90% reduction in manual CV screening effort within 6 months.
- Identified AI governance risk and designed a human-approved Suggested Rejection Queue instead of fully automated candidate rejection.
- Added final prototype validation for interview overlap detection, recruitment-to-onboarding duplicate prevention, KPI/OKR creation, historical review snapshots, and RBAC-scoped employee directory views.

---

## 4. CV Bullets — Vietnamese Version

**HR Management System — Dự án Portfolio IT Business Analyst**

- Phân tích pain points trong quy trình Recruitment, Onboarding, Employee Directory và Performance Management cho công ty công nghệ quy mô 200–500 nhân viên.
- Xây dựng bộ tài liệu BA gồm BRD, user stories, BPMN, use case diagram, RTM, RBAC matrix, data dictionary, UAT test cases, RAID log và prototype bằng React.
- Định nghĩa yêu cầu AI-driven ATS gồm CV parsing, JD match scoring, candidate routing rules, recruitment conversion dashboard và Suggested Rejection Queue có HR approval.
- Thiết kế workflow theo vai trò HR Manager, Hiring Manager, IT Admin và New Employee, bao gồm phân quyền theo module và dữ liệu nhạy cảm.
- Bổ sung logic nghiệp vụ cho interview overlap detection, recruitment-to-onboarding duplicate prevention, dynamic onboarding progress, KPI/OKR creation và historical review snapshots.
- Đề xuất KPI kinh doanh: giảm 40% Time-to-Hire và giảm 90% thời gian screening CV thủ công trong 6 tháng.
- Nhận diện rủi ro AI bias/compliance và thiết kế AI như công cụ decision support thay vì tự động reject ứng viên.


## 5. Interview Q&A Prep

### Q1. Why did you include AI in the ATS?
Answer:
> Because manual CV screening was one of the biggest causes of delayed hiring. AI parsing and match scoring help prioritize candidates faster. However, I treated AI as decision support, not final decision-making, to reduce bias and compliance risk.

### Q2. How did you ensure requirements are traceable?
Answer:
> I created an RTM mapping business objectives to user stories, functional requirements, prototype screens, and UAT test cases. This ensures every requirement has business value and validation coverage.

### Q3. How did you manage scope?
Answer:
> I separated Phase 1 and Phase 2 clearly. Payroll, timekeeping, native mobile app, and external job board integration are out-of-scope for Phase 1. External job board sync is documented as a Phase 2 enhancement.

### Q4. What is the most important business rule?
Answer:
> For recruitment, the most important rule is AI score routing with HR oversight. Candidates below 50% should not be automatically rejected without HR approval, because hiring decisions have fairness and compliance implications.

### Q5. What would you improve next?
Answer:
> Next, I would add API specifications, detailed role-based wireframes, AS-IS/TO-BE process comparison, production-level ERD, and backend/API integration. The current prototype is positioned as an interactive BA validation prototype using mock data, not a production HRMS.

---

## 6. Final Show-off Checklist

Before sending to recruiter or adding to portfolio:

- [ ] Export BRD v1.2 to PDF.
- [ ] Export User Stories + AC to PDF.
- [ ] Export RTM to PDF or spreadsheet.
- [ ] Export Business Rules + RBAC matrix.
- [ ] Export UAT Test Cases.
- [ ] Add screenshots of key prototype screens.
- [x] Prototype lint/build verified before final packaging.
- [x] Clearly label external job board sync as Phase 2 if still visible in UI.
- [x] Sync documents with final prototype changes.
- [x] Regenerate DOCX exports after final sync.
- [ ] Prepare 60-second and 5-minute demo script.
