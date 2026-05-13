export default function Badge({ status }) {
  const styles = {
    active: "bg-green-100 text-green-700",
    draft: "bg-gray-100 text-gray-600",
    closed: "bg-red-100 text-red-600",
    verified: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    applied: "bg-gray-100 text-gray-600",
    screened: "bg-blue-100 text-blue-700",
    tech_test: "bg-indigo-100 text-indigo-700",
    interview: "bg-purple-100 text-purple-700",
    offered: "bg-amber-100 text-amber-700",
    hired: "bg-emerald-100 text-emerald-700",
    onboarding: "bg-cyan-100 text-cyan-700",
    rejected: "bg-red-100 text-red-600",
    missing: "bg-gray-100 text-gray-500",
    ready: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    scheduled: "bg-gray-100 text-gray-600",
    completed: "bg-green-100 text-green-700",
    in_review: "bg-yellow-100 text-yellow-700",
    on_track: "bg-green-100 text-green-700",
    at_risk: "bg-yellow-100 text-yellow-700",
    off_track: "bg-red-100 text-red-600",
  }

  const labels = {
    active: "Active", draft: "Draft", closed: "Closed",
    verified: "Verified", pending: "Pending Review",
    applied: "Applied", screened: "Screened", tech_test: "Technical Test",
    interview: "Interviewing", offered: "Offered", hired: "Hired", onboarding: "Onboarding",
    rejected: "Rejected", missing: "Missing", ready: "Ready",
    in_progress: "In Progress", scheduled: "Scheduled",
    completed: "Completed", in_review: "In Review",
    on_track: "On Track", at_risk: "At Risk", off_track: "Off Track",
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  )
}