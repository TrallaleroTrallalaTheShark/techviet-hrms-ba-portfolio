import { getSyncedActiveInterviews } from "./interviewScheduling"

export const COMPANY_HEADCOUNT = 206

export const PIPELINE_STAGES = [
  { key: "applied", label: "Applied" },
  { key: "screened", label: "Screened" },
  { key: "tech_test", label: "Technical Test" },
  { key: "interview", label: "Interviewed" },
  { key: "offered", label: "Offered" },
  { key: "hired", label: "Hired" },
]

export const getCandidateScope = (candidates, role, departmentScope) => {
  if (role === "hiring_manager" && departmentScope) {
    return candidates.filter(c => c.department === departmentScope)
  }
  return candidates
}

export const getPipelineCounts = (candidates) => PIPELINE_STAGES.reduce((acc, stage) => {
  acc[stage.key] = candidates.filter(c => c.status === stage.key).length
  return acc
}, {})

export const getActivePipelineCount = (candidates) => candidates.filter(c => !["applied", "rejected", "hired"].includes(c.status)).length

export const getTodaysInterviews = (interviews, role, departmentScope, candidates = []) => {
  const activeSynced = getSyncedActiveInterviews(interviews, candidates)
  const scoped = role === "hiring_manager" && departmentScope
    ? activeSynced.filter(iv => iv.department === departmentScope)
    : activeSynced
  return scoped.filter(iv => iv.date === "Fri May 8")
}

export const getPendingInterviewFeedback = (interviews, role, departmentScope) => {
  const scoped = role === "hiring_manager" && departmentScope
    ? interviews.filter(iv => iv.department === departmentScope)
    : interviews
  return scoped.filter(iv => iv.status === "completed").length
}

export const getSuggestedRejectionQueue = (candidates) => candidates.filter(c => c.aiScore < 50 && c.status === "applied")

export const getOnboardingDocStats = (documents) => {
  const required = documents.filter(d => d.required)
  const verified = required.filter(d => d.status === "verified").length
  const actionRequired = required.filter(d => ["missing", "rejected", "pending"].includes(d.status)).length
  return { required: required.length, verified, actionRequired }
}

export const getConversionByDepartment = (candidates) => {
  const departments = [...new Set(candidates.map(c => c.department))]
  return departments.map(dept => {
    const deptCandidates = candidates.filter(c => c.department === dept)
    const applied = deptCandidates.length
    const hired = deptCandidates.filter(c => c.status === "hired").length
    return {
      dept,
      applied,
      screened: deptCandidates.filter(c => ["screened", "tech_test", "interview", "offered", "hired"].includes(c.status)).length,
      interviewed: deptCandidates.filter(c => ["interview", "offered", "hired"].includes(c.status)).length,
      offered: deptCandidates.filter(c => ["offered", "hired"].includes(c.status)).length,
      hired,
      rate: applied ? `${((hired / applied) * 100).toFixed(1)}%` : "0.0%",
    }
  })
}

export const getOverallFunnel = (candidates) => {
  const counts = getPipelineCounts(candidates)
  return [
    { stage: "Applied", count: candidates.length, color: "bg-blue-100 text-blue-800", width: "100%" },
    { stage: "Screened+", count: counts.screened + counts.tech_test + counts.interview + counts.offered + counts.hired, color: "bg-blue-200 text-blue-900", width: "78%" },
    { stage: "Interviewed+", count: counts.interview + counts.offered + counts.hired, color: "bg-blue-400 text-white", width: "55%" },
    { stage: "Offered+", count: counts.offered + counts.hired, color: "bg-blue-600 text-white", width: "34%" },
    { stage: "Hired", count: counts.hired, color: "bg-blue-800 text-white", width: "24%" },
  ]
}

export const getRoleUrgentActions = ({ role, candidates, interviews, newHires, documents, departmentScope }) => {
  const rejectionQueue = getSuggestedRejectionQueue(candidates)
  const pendingIT = newHires.filter(h => h.itStatus === "pending")
  const todaysInterviews = getTodaysInterviews(interviews, role, departmentScope, candidates)
  const pendingFeedback = getPendingInterviewFeedback(interviews, role, departmentScope)
  const docStats = getOnboardingDocStats(documents)

  if (role === "hr_manager") {
    return [
      { label: `${rejectionQueue.length} suggested rejection${rejectionQueue.length === 1 ? "" : "s"} need HR review`, page: "applications", show: rejectionQueue.length > 0 },
      { label: `${pendingFeedback} completed interview feedback${pendingFeedback === 1 ? "" : "s"} to close`, page: "interviews", show: pendingFeedback > 0 },
      { label: `${pendingIT.length} new hire${pendingIT.length === 1 ? "" : "s"} pending IT setup`, page: "onboarding", show: pendingIT.length > 0 },
    ].filter(a => a.show)
  }

  if (role === "hiring_manager") {
    return [
      { label: `${todaysInterviews.length} Engineering interview${todaysInterviews.length === 1 ? "" : "s"} today`, page: "interviews", show: todaysInterviews.length > 0 },
      { label: `${pendingFeedback} Engineering feedback${pendingFeedback === 1 ? "" : "s"} pending`, page: "interviews", show: pendingFeedback > 0 },
    ].filter(a => a.show)
  }

  if (role === "new_employee") {
    return [
      { label: `${docStats.actionRequired} onboarding document/task action${docStats.actionRequired === 1 ? "" : "s"} required`, page: "onboarding", show: docStats.actionRequired > 0 },
    ].filter(a => a.show)
  }

  if (role === "it_admin") {
    return [
      { label: `${pendingIT.length} provisioning setup${pendingIT.length === 1 ? "" : "s"} pending`, page: "onboarding", show: pendingIT.length > 0 },
    ].filter(a => a.show)
  }

  return []
}
