# Business Rules and RBAC Matrix — TechViet HRMS

## 1. Business Rules

### Recruitment / ATS

| Rule ID | Business Rule | Rationale |
|---|---|---|
| BR-REC-01 | A job posting cannot be published unless Job Title, Department, Headcount, JD, and Deadline are completed. | Ensures complete candidate-facing job information. |
| BR-REC-02 | Only HR Manager can create, edit, duplicate, close, or archive job postings. | Maintains HR control over official recruitment content. |
| BR-REC-03 | Hiring Managers can view only candidates assigned to their department/open roles. | Enforces department-level confidentiality. |
| BR-REC-04 | AI match score >80% routes candidate to Auto-Shortlisted and notifies Hiring Manager. | Accelerates review of strong candidates. |
| BR-REC-05 | AI match score 50–80% routes candidate to HR Manual Review. | Borderline candidates require human review. |
| BR-REC-06 | AI match score <50% routes candidate to Suggested Rejection Queue; rejection email requires HR approval. | Reduces AI bias/compliance risk. |
| BR-REC-07 | HR can override AI routing, but override reason must be captured. | Supports auditability and human accountability. |
| BR-REC-08 | Interview cannot be scheduled if another active interview overlaps the requested time range in the same room on the same date. | Prevents realistic scheduling conflicts; same time in different rooms is allowed. |
| BR-REC-09 | Candidate status changes must be timestamped and attributed to the user. | Supports audit trail. |

### Onboarding

| Rule ID | Business Rule | Rationale |
|---|---|---|
| BR-ONB-01 | Onboarding record is created only after candidate is marked Hired or Ready to Onboard. | Prevents premature onboarding. |
| BR-ONB-02 | Checklist template is assigned based on role/department. | Standardizes onboarding process. |
| BR-ONB-03 | Required documents must be submitted before onboarding can be marked complete. | Ensures compliance and HR record completeness. |
| BR-ONB-04 | Rejected documents must include rejection reason. | Helps employee correct submission. |
| BR-ONB-05 | IT provisioning notification must be sent within 5 minutes after Ready to Onboard. | Supports Day-1 readiness. |
| BR-ONB-06 | Day-1 Ready flag is shown only when all mandatory IT tasks are marked ready before start date. | Gives HR clear readiness signal. |
| BR-ONB-07 | A candidate can create only one onboarding record; duplicate prevention must use candidate_id/source_candidate_id, not only candidate name. | Prevents duplicate new hire records for candidates with similar names or repeated actions. |

### Performance Management

| Rule ID | Business Rule | Rationale |
|---|---|---|
| BR-PER-01 | KPI/OKR items must include metric name, owner, target, actual/current value, weight, department, unit, direction, frequency, evidence source, linked goal, and review period. | Ensures measurable, auditable performance criteria. |
| BR-PER-02 | Employee self-assessment is allowed only during open review window. | Protects review cycle governance. |
| BR-PER-03 | Manager review cannot be submitted without required feedback and rating. | Ensures complete evaluation records. |
| BR-PER-04 | Finalized performance reviews are immutable. | Protects integrity of official review history. |
| BR-PER-05 | Review records must be retained for at least 3 years. | Supports audit and historical tracking. |
| BR-PER-06 | Historical cycles must use exact period_id and employee snapshot; employees who joined later must not appear in earlier review periods. | Protects audit trail integrity. |
| BR-PER-07 | 9-box calibration and manager review data must be scoped by role and department/team. | Prevents unauthorized access to sensitive performance data. |
| BR-PER-08 | Department KPI total weight should be visible to HR during setup and should be reviewed before publishing. | Helps validate KPI framework completeness and weighting. |


### Employee Directory / Organization Structure

| Rule ID | Business Rule | Rationale |
|---|---|---|
| BR-EMP-01 | Employee Directory must support search by name, department, role, employee code, and status. | Reduces time spent finding employee information. |
| BR-EMP-02 | HR Manager can view full employee profile data; Hiring Manager can view team/public data; IT Admin can view IT asset data; New Employee can view public directory data only. | Enforces privacy and least-privilege access. |
| BR-EMP-03 | Manager insight is shown only when the selected employee belongs to the Hiring Manager's department/team scope. | Prevents cross-team performance or management data leakage. |
| BR-EMP-04 | Org Chart should use focus mode, search, manager chain, and limited direct report rendering instead of rendering the entire organization at once. | Supports scalability for 1,000+ employees. |

---

## 2. RBAC Matrix

Legend:  
- **C** = Create  
- **R** = Read/View  
- **U** = Update  
- **D** = Delete/Archive  
- **A** = Approve/Finalize  
- **N/A** = No access

| Function / Data | HR Manager | Hiring Manager | IT Admin | New Employee |
|---|---|---|---|---|
| Job Posting | C/R/U/D | R own department/open roles | N/A | R public/internal only |
| Candidate Profile | R all / U status | R own department / U feedback | N/A | N/A |
| AI Score & CV Parsing Result | R all / U override | R own department | N/A | N/A |
| Suggested Rejection Queue | R/U/A | N/A | N/A | N/A |
| Recruitment Report | R all / Export | R own department summary | N/A | N/A |
| Interview Schedule | C/R/U/D all | C/R/U own interviews | N/A | N/A |
| Interview Feedback | R all | C/R/U own feedback | N/A | N/A |
| Onboarding Checklist Template | C/R/U/D | R if involved | N/A | R assigned tasks |
| New Hire Onboarding Tracker | R all / U HR tasks | R direct reports | R IT tasks | R own tracker / U own tasks |
| Document Upload | R/Verify/Reject | N/A | N/A | C/R/U own documents |
| IT Provisioning Status | R all | R direct reports | R/U assigned provisioning | R own readiness |
| Employee Directory | R all / U HR data | R team/public data only | R IT asset data only | R public directory only |
| Org Chart / Manager Chain | R all | R team/public structure | R public structure / IT context | R public structure only |
| KPI/OKR Template | C/R/U/D | R team KPIs | N/A | R assigned KPIs |
| Self-assessment | R after submission | R direct reports | N/A | C/R/U own before deadline |
| Manager Performance Review | R all | C/R/U direct reports | N/A | R own finalized review |
| Finalize Review | A | Submit to HR | N/A | N/A |
| Audit Logs | R HR-related | R own actions only | R system/provisioning logs | N/A |

---

## 3. Notes for Recruiter Presentation

When showing this section, emphasize:
- You understand access control and data privacy.
- AI scoring is treated as decision support, not a fully automated hiring decision.
- HR retains accountability for candidate rejection and final performance records.
- Directory, Org Chart, KPI setup, and historical review archive are governed by the same RBAC and auditability principles as recruitment/onboarding.
