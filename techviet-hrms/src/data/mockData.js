export const candidates = [
  { id: 1, name: "Nguyen Thi Lan", role: "Frontend Developer", department: "Engineering", university: "PTIT", location: "Hanoi", appliedDate: "May 8, 2026", aiScore: 86, status: "applied", avatar: "NL" },
  { id: 2, name: "Le Anh Tuan", role: "DevOps Engineer", department: "Engineering", university: "FPT", location: "Hanoi", appliedDate: "May 8, 2026", aiScore: 89, status: "applied", avatar: "LA" },
  { id: 3, name: "Tran Quoc Bao", role: "QA Engineer", department: "Engineering", university: "UET", location: "Hanoi", appliedDate: "May 7, 2026", aiScore: 72, status: "applied", avatar: "TB" },
  { id: 4, name: "Pham Hoang Yen", role: "HR Intern", department: "HR", university: "FTU", location: "Hanoi", appliedDate: "May 7, 2026", aiScore: 65, status: "applied", avatar: "PY" },
  { id: 5, name: "Do Van Hau", role: "Marketing Manager", department: "Marketing", university: "NEU", location: "Hanoi", appliedDate: "May 6, 2026", aiScore: 45, status: "applied", avatar: "DH" },
  { id: 6, name: "Hoang Thi Mai", role: "UX Designer", department: "Design", university: "HUFA", location: "HCM", appliedDate: "May 6, 2026", aiScore: 83, status: "screened", avatar: "HM" },
  { id: 7, name: "Tran Van Minh", role: "Data Analyst", department: "BOS", university: "NEU", location: "Hanoi", appliedDate: "May 5, 2026", aiScore: 91, status: "screened", avatar: "TM" },
  { id: 8, name: "Le Thi Hoa", role: "Frontend Developer", department: "Engineering", university: "UET", location: "Hanoi", appliedDate: "May 5, 2026", aiScore: 89, status: "screened", avatar: "LH" },
  { id: 9, name: "Pham Van Long", role: "Backend Developer", department: "Engineering", university: "HUST", location: "Hanoi", appliedDate: "May 4, 2026", aiScore: 87, status: "tech_test", avatar: "PL" },
  { id: 10, name: "Nguyen Van Tuan", role: "Backend Developer", department: "Engineering", university: "HUST", location: "Hanoi", appliedDate: "May 4, 2026", aiScore: 94, status: "interview", avatar: "NT" },
  { id: 11, name: "Tran Thi Linh", role: "Product Manager", department: "Product", university: "NEU", location: "Hanoi", appliedDate: "May 3, 2026", aiScore: 90, status: "interview", avatar: "TL" },
  { id: 12, name: "Le Van Cuong", role: "Frontend Developer", department: "Engineering", university: "UET", location: "Hanoi", appliedDate: "May 3, 2026", aiScore: 88, status: "interview", avatar: "LC" },
  { id: 13, name: "Pham Thi Anh", role: "Senior Backend Developer", department: "Engineering", university: "HUST", location: "Hanoi", appliedDate: "May 2, 2026", aiScore: 96, status: "offered", avatar: "PA" },
  { id: 14, name: "Nguyen Van Hung", role: "Data Analyst", department: "BOS", university: "NEU", location: "Hanoi", appliedDate: "May 2, 2026", aiScore: 93, status: "offered", avatar: "NH" },
  { id: 15, name: "Nguyen Van Duc", role: "Backend Developer", department: "Engineering", university: "HUST", location: "Hanoi", appliedDate: "Apr 28, 2026", aiScore: 92, status: "hired", avatar: "ND" },
  { id: 16, name: "Tran Thi Huong", role: "Data Analyst", department: "BOS", university: "NEU", location: "Hanoi", appliedDate: "Apr 27, 2026", aiScore: 85, status: "hired", avatar: "TH" },
  { id: 17, name: "Le Minh Quan", role: "Frontend Developer", department: "Engineering", university: "UET", location: "Hanoi", appliedDate: "Apr 26, 2026", aiScore: 88, status: "hired", avatar: "LM" },
  { id: 18, name: "Pham Thi Nhi", role: "UX Designer", department: "Design", university: "UEH", location: "HCM", appliedDate: "Apr 25, 2026", aiScore: 78, status: "hired", avatar: "PN" },
  { id: 19, name: "Le Quoc An", role: "Data Analyst", department: "BOS", university: "NEU", location: "Hanoi", appliedDate: "Apr 24, 2026", aiScore: 82, status: "hired", avatar: "LQ" },
  { id: 20, name: "Vo Hoang Khai", role: "Product Manager", department: "Product", university: "HCMUT", location: "HCM", appliedDate: "Apr 23, 2026", aiScore: 81, status: "hired", avatar: "VK" }
]

const baseJobs = [
  { id: 1, title: "Frontend Developer", department: "Engineering", status: "active", vacancies: 2, deadline: "May 20, 2026", daysLeft: 12, applicants: 4 },
  { id: 2, title: "Product Manager", department: "Product", status: "active", vacancies: 1, deadline: "May 15, 2026", daysLeft: 7, applicants: 2 },
  { id: 3, title: "Data Analyst", department: "BOS", status: "active", vacancies: 3, deadline: "May 25, 2026", daysLeft: 17, applicants: 4 },
  { id: 4, title: "Backend Developer", department: "Engineering", status: "active", vacancies: 2, deadline: "May 18, 2026", daysLeft: 10, applicants: 4 },
  { id: 5, title: "UX Designer", department: "Design", status: "draft", vacancies: 1, deadline: "Jun 1, 2026", daysLeft: 24, applicants: 2 },
  { id: 6, title: "DevOps Engineer", department: "Engineering", status: "active", vacancies: 1, deadline: "May 22, 2026", daysLeft: 14, applicants: 1 },
  { id: 7, title: "Marketing Manager", department: "Marketing", status: "closed", vacancies: 1, deadline: "Apr 30, 2026", daysLeft: 0, applicants: 1 },
  { id: 8, title: "QA Engineer", department: "Engineering", status: "active", vacancies: 2, deadline: "May 28, 2026", daysLeft: 20, applicants: 1 },
  { id: 9, title: "HR Intern", department: "HR", status: "archived", vacancies: 1, deadline: "Mar 15, 2026", daysLeft: 0, applicants: 1 }
];

export const jobPostings = baseJobs.map(job => ({
  ...job,
  description: `ABOUT THE ROLE:\nWe are looking for a passionate and talented ${job.title} to join our ${job.department} team at TechViet. You will play a crucial role in driving our core initiatives and delivering high-quality results.\n\nKEY RESPONSIBILITIES:\n• Take full ownership of tasks related to the ${job.title} position.\n• Collaborate closely with cross-functional teams to ensure seamless delivery.\n• Identify bottlenecks and propose KAIZEN (continuous improvement) ideas.\n• Mentor junior team members and share knowledge.\n\nREQUIREMENTS:\n• 3+ years of hands-on experience in a similar role.\n• Strong analytical, problem-solving, and communication skills.\n• Ability to thrive in a fast-paced, dynamic environment.\n• Good English proficiency (IELTS 6.0+ is a strong plus).\n\nBENEFITS & PERKS:\n• Competitive salary package + 13th-month bonus.\n• Premium Bao Viet healthcare insurance for you and your family.\n• Flexible hybrid working model (2 days WFH/week).\n• Provided with a MacBook Pro and external monitor.\n• Annual company trip and team-building activities.`
}));

export const newHires = [
  { id: 1, name: "Nguyen Van Duc", department: "Engineering", role: "Backend Developer", startDate: "May 1, 2026", progress: 85, tasks: { done: 17, total: 20 }, itStatus: "ready", avatar: "ND" },
  { id: 2, name: "Tran Thi Huong", department: "BOS", role: "Data Analyst", startDate: "May 3, 2026", progress: 60, tasks: { done: 12, total: 20 }, itStatus: "pending", avatar: "TH" },
  { id: 3, name: "Le Minh Quan", department: "Engineering", role: "Frontend Developer", startDate: "May 5, 2026", progress: 75, tasks: { done: 15, total: 20 }, itStatus: "ready", avatar: "LM" },
  { id: 4, name: "Pham Thi Nhi", department: "Design", role: "UX Designer", startDate: "May 6, 2026", progress: 40, tasks: { done: 8, total: 20 }, itStatus: "pending", avatar: "PN" },
  { id: 5, name: "Le Quoc An", department: "BOS", role: "Data Analyst", startDate: "May 7, 2026", progress: 65, tasks: { done: 13, total: 20 }, itStatus: "pending", avatar: "LQ" },
  { id: 6, name: "Vo Hoang Khai", department: "Product", role: "Product Manager", startDate: "May 8, 2026", progress: 90, tasks: { done: 18, total: 20 }, itStatus: "ready", avatar: "VK" },
]

export const onboardingChecklist = [
  { id: 1, task: "Sign employment contract", owner: "HR Manager", ownerRole: "hr", done: true, dueDate: "Day 1", link: "View Contract" },
  { id: 2, task: "Submit ID & degree documents", owner: "New Employee", ownerRole: "employee", done: true, dueDate: "Day 1", link: null },
  { id: 3, task: "IT account & laptop provisioned", owner: "IT Admin", ownerRole: "it", done: true, dueDate: "Day 1", link: null },
  { id: 4, task: "Complete orientation training", owner: "New Employee", ownerRole: "employee", done: false, dueDate: "Day 3", link: null },
  { id: 5, task: "1-on-1 with direct manager", owner: "Hiring Manager", ownerRole: "hiring", done: false, dueDate: "Day 5", link: null },
  { id: 6, task: "Set 30-day goals with manager", owner: "Hiring Manager", ownerRole: "hiring", done: false, dueDate: "Day 7", link: null },
  { id: 7, task: "Complete IT security training", owner: "New Employee", ownerRole: "employee", done: false, dueDate: "Day 10", link: null },
  { id: 8, task: "HR policy acknowledgement", owner: "New Employee", ownerRole: "employee", done: false, dueDate: "Day 14", link: "View Policy" },
]

export const documents = [
  { id: 1, name: "National ID (CCCD)", required: true, status: "verified", uploadedDate: "May 1, 2026" },
  { id: 2, name: "University Degree", required: true, status: "verified", uploadedDate: "May 1, 2026" },
  { id: 3, name: "Passport Photo", required: true, status: "pending", uploadedDate: "May 2, 2026" },
  { id: 4, name: "Bank Account Info", required: true, status: "missing", uploadedDate: null },
  { id: 5, name: "Employment Contract (Signed)", required: true, status: "rejected", uploadedDate: "May 2, 2026", reason: "Signature unclear" },
  { id: 6, name: "Health Certificate", required: false, status: "missing", uploadedDate: null },
  { id: 7, name: "Reference Letter", required: false, status: "verified", uploadedDate: "May 3, 2026" },
]

export const kpis = [
  { id: 1, name: "Data Accuracy Rate", department: "BOS", weight: 30, target: 98, actual: 97.2, unit: "%" },
  { id: 2, name: "Report Delivery On Time", department: "BOS", weight: 25, target: 100, actual: 100, unit: "%" },
  { id: 3, name: "Automation Tasks Built", department: "BOS", weight: 25, target: 3, actual: 2, unit: "tasks" },
  { id: 4, name: "Kaizen Proposals", department: "BOS", weight: 20, target: 2, actual: 0, unit: "proposals" },
  { id: 5, name: "Sprint Velocity", department: "Engineering", weight: 30, target: 40, actual: 42, unit: "pts" },
  { id: 6, name: "Bug Escape Rate", department: "Engineering", weight: 25, target: 2, actual: 1.4, unit: "%" },
  { id: 7, name: "Code Review SLA", department: "Engineering", weight: 25, target: 24, actual: 28, unit: "hrs" },
  { id: 8, name: "Feature Delivery Rate", department: "Engineering", weight: 20, target: 90, actual: 88, unit: "%" },
]

export const reviews = [
  {
    id: 1,
    employee: "Le Quoc An",
    department: "BOS",
    role: "Data Analyst",
    period: "Q2 2026",
    status: "in_review",
    avatar: "LQ",
    criteria: [
      { name: "Job Knowledge", max: 5, selfScore: 3, managerScore: 2, selfNote: "I have learned a lot about HR analytics and onboarding data.", managerNote: "Still getting familiar with internal HRMS processes." },
      { name: "Problem Solving", max: 5, selfScore: 3, managerScore: 2, selfNote: "I try to approach problems systematically.", managerNote: "Needs improvement in proactive problem identification." },
      { name: "Communication", max: 5, selfScore: 4, managerScore: 3, selfNote: "I communicate well with team members.", managerNote: "Good communication but needs to improve cross-team follow-up." },
      { name: "Willingness to Learn", max: 5, selfScore: 5, managerScore: 5, selfNote: "Always eager to learn new things.", managerNote: "Outstanding learning attitude." },
      { name: "Sense of Responsibility", max: 5, selfScore: 4, managerScore: 4, selfNote: "I take ownership of my tasks.", managerNote: "Reliable and responsible team member." },
    ]
  },
  {
    id: 2,
    employee: "Nguyen Van Duc",
    department: "Engineering",
    role: "Backend Developer",
    period: "Q2 2026",
    status: "completed",
    avatar: "ND",
    criteria: [
      { name: "Technical Skills", max: 5, selfScore: 4, managerScore: 5, selfNote: "Strong in backend development.", managerNote: "Exceptional technical skills." },
      { name: "Problem Solving", max: 5, selfScore: 4, managerScore: 4, selfNote: "Good at solving complex issues.", managerNote: "Consistently delivers good solutions." },
      { name: "Communication", max: 5, selfScore: 3, managerScore: 3, selfNote: "Working on improving communication.", managerNote: "Adequate but room for improvement." },
      { name: "Teamwork", max: 5, selfScore: 5, managerScore: 5, selfNote: "Love working with the team.", managerNote: "Excellent team player." },
      { name: "Initiative", max: 5, selfScore: 4, managerScore: 4, selfNote: "Proactively suggest improvements.", managerNote: "Shows good initiative." },
    ]
  }
]

export const interviews = [
  { id: 1, candidateId: 10, candidate: "Nguyen Van Tuan", role: "Backend Developer", department: "Engineering", date: "Fri May 8", time: "09:00", room: "Room 1", status: "in_progress", color: "bg-green-100 text-green-800" },
  { id: 2, candidateId: 11, candidate: "Tran Thi Linh", role: "Product Manager", department: "Product", date: "Fri May 8", time: "10:00", room: "Room 2", status: "scheduled", color: "bg-blue-100 text-blue-800" },
  { id: 3, candidateId: 12, candidate: "Le Van Cuong", role: "Frontend Developer", department: "Engineering", date: "Fri May 8", time: "11:00", room: "Room 1", status: "scheduled", color: "bg-green-100 text-green-800" },
]
