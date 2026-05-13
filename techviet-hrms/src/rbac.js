import { LayoutDashboard, Briefcase, FileText, Users, Calendar, UserCheck, BarChart3, Building2 } from "lucide-react"

export const ROLE_PROFILES = {
  hr_manager: { label: "HR Manager", color: "bg-blue-500", avatar: "HL", name: "Hoang Thi Lan", greeting: "Good morning, Lan!" },
  hiring_manager: { label: "Hiring Manager", color: "bg-purple-500", avatar: "PH", name: "Pham Quang Huy", department: "Engineering", greeting: "Good morning, Huy!" },
  new_employee: { label: "New Employee", color: "bg-green-500", avatar: "LQ", name: "Le Quoc An", candidateName: "Le Quoc An", greeting: "Welcome, Le Quoc An!" },
  it_admin: { label: "IT Admin", color: "bg-orange-500", avatar: "VA", name: "Vo Anh Tuan", greeting: "Good morning, Tuan!" },
}

export const ROLE_PERMISSIONS = {
  hr_manager: {
    canManageJobs: true,
    canReviewApplications: true,
    canViewAllCandidates: true,
    canScheduleInterviews: true,
    canManageOnboarding: true,
    canViewSalary: true,
    canViewPerformanceCalibration: true,
  },
  hiring_manager: {
    canViewOwnPipeline: true,
    canEvaluateCandidates: true,
    canScheduleInterviews: true,
    canViewTeamDirectory: true,
    canManageTeamReviews: true,
    departmentScope: "Engineering",
  },
  new_employee: {
    canViewOwnOnboarding: true,
    canUploadOwnDocuments: true,
    canViewOwnReview: true,
    directoryLimited: true,
  },
  it_admin: {
    canManageProvisioning: true,
    canViewDirectoryContact: true,
    canViewITAssets: true,
  },
}

export const NAV_ITEMS = {
  hr_manager: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { section: "Recruitment" },
    { key: "job_postings", label: "Job Postings", icon: Briefcase },
    { key: "applications", label: "Applications", icon: FileText },
    { key: "recruitment", label: "Pipeline", icon: Users },
    { key: "interviews", label: "Interviews", icon: Calendar },
    { section: "Workforce" },
    { key: "onboarding", label: "Onboarding", icon: UserCheck },
    { key: "employees", label: "Directory", icon: Building2 },
    { section: "Performance" },
    { key: "performance", label: "Performance", icon: BarChart3 },
  ],
  hiring_manager: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { section: "Recruitment" },
    { key: "recruitment", label: "My Pipeline", icon: Users },
    { key: "interviews", label: "My Interviews", icon: Calendar },
    { section: "Workforce" },
    { key: "employees", label: "Directory", icon: Building2 },
    { section: "Performance" },
    { key: "performance", label: "My Team", icon: BarChart3 },
  ],
  new_employee: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { section: "Onboarding" },
    { key: "onboarding", label: "My Onboarding", icon: UserCheck },
    { section: "Company" },
    { key: "employees", label: "Directory", icon: Building2 },
    { section: "Performance" },
    { key: "performance", label: "My Review", icon: BarChart3 },
  ],
  it_admin: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { section: "Onboarding" },
    { key: "onboarding", label: "IT Provisioning", icon: UserCheck },
    { section: "Company" },
    { key: "employees", label: "Directory", icon: Building2 },
  ],
}

export const canAccessPage = (role, page) => NAV_ITEMS[role]?.some(item => item.key === page) ?? false
