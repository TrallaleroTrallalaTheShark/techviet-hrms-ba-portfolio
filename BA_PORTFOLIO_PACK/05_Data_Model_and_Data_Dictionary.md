# Conceptual Data Model and Data Dictionary — TechViet HRMS

## 1. Conceptual Entity Model

```text
Department 1 ── * User
Department 1 ── * JobPosting
JobPosting 1 ── * Application
Candidate 1 ── * Application
Application 1 ── * Interview
Application 0..1 ── 1 OnboardingRecord
OnboardingRecord 1 ── * OnboardingTask
OnboardingRecord 1 ── * EmployeeDocument
User 1 ── * EmployeeAsset
User 1 ── * PerformanceReview as Employee
User 1 ── * PerformanceReview as Manager
Department 1 ── * ReviewCycleSnapshot
Department 1 ── * KPITemplate
KPITemplate 1 ── * KPIItem
PerformanceReview 1 ── * ReviewCriterion
User 1 ── * AuditLog
```

## 2. Core Entities

### 2.1 User
Represents employees and system users.

| Field | Type | Required | Description |
|---|---|---|---|
| user_id | UUID | Yes | Unique user identifier |
| full_name | String | Yes | User full name |
| email | String | Yes | Login/contact email |
| role | Enum | Yes | HR_MANAGER, HIRING_MANAGER, IT_ADMIN, NEW_EMPLOYEE |
| department_id | UUID | Conditional | User department |
| manager_id | UUID | No | Direct manager; used for manager chain and org chart |
| status | Enum | Yes | ACTIVE, ON_LEAVE, INACTIVE |
| employee_code | String | Yes | Human-readable employee code such as EMP-001 |
| job_title | String | Yes | Employee job title |
| location | String | No | Work location or office |
| employment_type | Enum | Yes | FULL_TIME, PART_TIME, CONTRACT, INTERN |
| start_date | Date | Yes | Employment start date |

### 2.2 Department
| Field | Type | Required | Description |
|---|---|---|---|
| department_id | UUID | Yes | Unique department ID |
| department_name | String | Yes | Engineering, BOS, Product, Design, HR, etc. |
| head_id | UUID | No | Department head / Hiring Manager |

### 2.3 JobPosting
| Field | Type | Required | Description |
|---|---|---|---|
| job_id | UUID | Yes | Unique job posting ID |
| title | String | Yes | Job title |
| department_id | UUID | Yes | Hiring department |
| headcount | Integer | Yes | Number of vacancies |
| description | Text | Yes | Job description |
| deadline | Date | Yes | Application deadline |
| status | Enum | Yes | DRAFT, ACTIVE, CLOSED, ARCHIVED |
| created_by | UUID | Yes | HR user who created posting |
| created_at | DateTime | Yes | Creation timestamp |

### 2.4 Candidate
| Field | Type | Required | Description |
|---|---|---|---|
| candidate_id | UUID | Yes | Candidate identifier |
| full_name | String | Yes | Candidate full name |
| email | String | Yes | Candidate email |
| phone | String | No | Candidate phone |
| location | String | No | Candidate location |
| university | String | No | Candidate school |
| skills | Array/String | No | Parsed skills |
| cv_file_url | String | Yes | CV document path |

### 2.5 Application
| Field | Type | Required | Description |
|---|---|---|---|
| application_id | UUID | Yes | Application ID |
| candidate_id | UUID | Yes | Linked candidate |
| job_id | UUID | Yes | Applied job |
| applied_date | Date | Yes | Application date |
| ai_match_score | Number | No | 0–100% score |
| ai_confidence | Number | No | AI extraction confidence |
| status | Enum | Yes | APPLIED, SCREENED, HR_REVIEW, HM_REVIEW, TECH_TEST, INTERVIEW, OFFERED, HIRED, REJECTED |
| routing_reason | Text | No | AI/manual routing explanation |
| override_reason | Text | Conditional | Required if HR overrides AI route |

### 2.6 Interview
| Field | Type | Required | Description |
|---|---|---|---|
| interview_id | UUID | Yes | Interview ID |
| application_id | UUID | Yes | Related application |
| scheduled_date | Date | Yes | Interview date |
| scheduled_time | Time | Yes | Interview time |
| room | String | Yes | Room or online link |
| interviewer_id | UUID | Yes | Hiring Manager/interviewer |
| status | Enum | Yes | SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED |
| duration_mins | Integer | Yes | Interview duration used for time-overlap conflict detection; default 60 minutes |
| feedback | Text | No | Evaluation notes |
| rating | Number | No | Interview rating |

### 2.7 OnboardingRecord
| Field | Type | Required | Description |
|---|---|---|---|
| onboarding_id | UUID | Yes | Onboarding record ID |
| user_id | UUID | Yes | New employee user |
| application_id | UUID | Yes | Source application |
| source_candidate_id | UUID | Yes | Source candidate used to prevent duplicate onboarding records |
| start_date | Date | Yes | Employee start date |
| progress_percent | Number | Yes | 0–100% |
| it_status | Enum | Yes | PENDING, IN_PROGRESS, READY |
| day1_ready | Boolean | Yes | True when mandatory IT tasks completed before start date |

### 2.8 OnboardingTask
| Field | Type | Required | Description |
|---|---|---|---|
| task_id | UUID | Yes | Task ID |
| onboarding_id | UUID | Yes | Linked onboarding record |
| task_name | String | Yes | Task description |
| owner_role | Enum | Yes | HR, IT, MANAGER, EMPLOYEE |
| due_date | Date | Yes | Due date |
| status | Enum | Yes | NOT_STARTED, IN_PROGRESS, DONE, OVERDUE |

### 2.9 EmployeeDocument
| Field | Type | Required | Description |
|---|---|---|---|
| document_id | UUID | Yes | Document ID |
| onboarding_id | UUID | Yes | Linked onboarding record |
| document_type | Enum | Yes | ID, DEGREE, PHOTO, BANK_INFO, CONTRACT, etc. |
| required | Boolean | Yes | Required or optional |
| file_url | String | Conditional | Uploaded file path |
| status | Enum | Yes | MISSING, PENDING_REVIEW, VERIFIED, REJECTED |
| rejection_reason | Text | Conditional | Required if rejected |

### 2.10 EmployeeAsset
| Field | Type | Required | Description |
|---|---|---|---|
| asset_id | UUID | Yes | Assigned IT asset ID |
| user_id | UUID | Yes | Employee owning/using the asset |
| asset_type | Enum | Yes | LAPTOP, MONITOR, PHONE, ACCESS_CARD, SOFTWARE_LICENSE |
| serial_number | String | No | Asset serial number |
| status | Enum | Yes | ASSIGNED, PENDING, RETURNED, LOST |
| assigned_at | DateTime | No | Assignment timestamp |

### 2.11 KPITemplate and KPIItem
| Field | Type | Required | Description |
|---|---|---|---|
| template_id | UUID | Yes | KPI template ID |
| department_id | UUID | Yes | Department using template |
| period | String | Yes | Q1 2026, H1 2026, etc. |
| metric_name | String | Yes | KPI item name |
| weight | Number | Yes | Weight % |
| target_value | Number/Text | Yes | Target |
| unit | String | No | %, tasks, hours, days, rating, etc. |
| owner_id | UUID | No | KPI owner or accountable manager/HR |
| actual_value | Number/Text | No | Current measured value |
| direction | Enum | Yes | HIGHER_IS_BETTER or LOWER_IS_BETTER |
| frequency | Enum | No | WEEKLY, MONTHLY, QUARTERLY, ANNUAL |
| evidence_source | String | No | Source system or evidence reference, e.g., Jira, BI dashboard, HR tracker |
| linked_goal | String | No | Related company/department goal |

### 2.12 ReviewCycleSnapshot
| Field | Type | Required | Description |
|---|---|---|---|
| snapshot_id | UUID | Yes | Snapshot ID |
| period_id | String | Yes | Review period ID such as q1-2026 |
| employee_id | UUID | Yes | Employee included in the cycle snapshot |
| department_id | UUID | Yes | Employee department at snapshot time |
| manager_id | UUID | Yes | Manager at snapshot time |
| included_at | DateTime | Yes | Timestamp when employee was included in the review cycle |

### 2.13 PerformanceReview
| Field | Type | Required | Description |
|---|---|---|---|
| review_id | UUID | Yes | Review ID |
| employee_id | UUID | Yes | Reviewed employee |
| manager_id | UUID | Yes | Reviewer manager |
| period_id | String | Yes | Exact review period ID for audit integrity |
| period_label | String | Yes | Human-readable review period label |
| status | Enum | Yes | NOT_STARTED, SELF_ASSESSMENT, MANAGER_REVIEW, HR_APPROVAL, FINALIZED |
| self_score | Number | No | Average self score |
| manager_score | Number | No | Average manager score |
| final_rating | String/Number | No | Final result |
| finalized_at | DateTime | No | Finalization timestamp |

### 2.14 AuditLog
| Field | Type | Required | Description |
|---|---|---|---|
| log_id | UUID | Yes | Log ID |
| actor_id | UUID | Yes | User performing action |
| action | String | Yes | Action type |
| entity_type | String | Yes | Entity changed |
| entity_id | UUID | Yes | Target entity |
| old_value | JSON | No | Previous value |
| new_value | JSON | No | New value |
| timestamp | DateTime | Yes | Action time |

## 3. Portfolio Notes

This conceptual data model is not a full database design, but it is enough to show:
- You understand core business objects.
- You can connect requirements to data.
- You can discuss RBAC, reporting, status transitions, time-overlap validation, employee/org data, KPI evidence, historical snapshots, and auditability with developers.
