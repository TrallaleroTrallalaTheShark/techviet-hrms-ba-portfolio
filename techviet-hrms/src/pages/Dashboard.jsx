import { AlertTriangle, TrendingUp, Users, Briefcase, UserCheck, Star, Download, ArrowRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import StatCard from "../components/StatCard"
import Badge from "../components/Badge"
import { useData, useLanguage } from "../context"
import { ROLE_PROFILES, ROLE_PERMISSIONS } from "../rbac"
import { documents, onboardingChecklist } from "../data/mockData"
import {
  COMPANY_HEADCOUNT,
  getActivePipelineCount,
  getConversionByDepartment,
  getOverallFunnel,
  getPipelineCounts,
  getRoleUrgentActions,
  getTodaysInterviews,
} from "../utils/hrMetrics"

const headcountData = [
  { month: "Jan", count: 192 },
  { month: "Feb", count: 196 },
  { month: "Mar", count: 200 },
  { month: "Apr", count: 203 },
  { month: "May", count: COMPANY_HEADCOUNT },
]

const formatTime = (time) => {
  const [hour, minute] = time.split(":")
  const h = Number(hour)
  return `${h > 12 ? h - 12 : h}:${minute} ${h >= 12 ? "PM" : "AM"}`
}

export default function Dashboard({ role, setPage }) {
  const { candidatesData, interviewsData, newHiresData, jobPostingsData } = useData()
  const { t } = useLanguage()
  const profile = ROLE_PROFILES[role]
  const permissions = ROLE_PERMISSIONS[role] || {}
  const departmentScope = permissions.departmentScope

  const scopedCandidates = departmentScope ? candidatesData.filter(c => c.department === departmentScope) : candidatesData
  const pipelineCounts = getPipelineCounts(scopedCandidates)
  const todaysInterviews = getTodaysInterviews(interviewsData, role, departmentScope, candidatesData)
  const activeJobs = jobPostingsData.filter(j => j.status === "active")
  const pendingIT = newHiresData.filter(h => h.itStatus === "pending")
  const myHire = newHiresData.find(h => h.name === profile.candidateName) || newHiresData.find(h => h.name === "Le Quoc An")
  const urgentActions = getRoleUrgentActions({ role, candidates: candidatesData, interviews: interviewsData, newHires: newHiresData, documents, departmentScope })

  const statsByRole = {
    hr_manager: [
      { label: "Total Headcount", value: COMPANY_HEADCOUNT, sub: `${newHiresData.length} in onboarding`, icon: <Users size={18} /> },
      { label: "Active Pipeline", value: getActivePipelineCount(candidatesData), sub: `${todaysInterviews.length} interviews today · ${pipelineCounts.interview} interviewing`, icon: <UserCheck size={18} /> },
      { label: "Interviews Today", value: todaysInterviews.length, sub: "Synced with Calendar + Kanban", icon: <Star size={18} /> },
      { label: "Open Roles", value: activeJobs.length, sub: `${activeJobs.reduce((sum, j) => sum + j.vacancies, 0)} vacancies`, icon: <Briefcase size={18} /> },
    ],
    hiring_manager: [
      { label: "My Open Roles", value: activeJobs.filter(j => j.department === departmentScope).length, icon: <Briefcase size={18} /> },
      { label: "Candidates in Scope", value: scopedCandidates.length, sub: departmentScope, icon: <Users size={18} /> },
      { label: "Interviews Today", value: todaysInterviews.length, icon: <UserCheck size={18} /> },
      { label: "Team Reviews Due", value: "1", icon: <Star size={18} /> },
    ],
    new_employee: [
      { label: "Onboarding Progress", value: `${myHire?.progress || 0}%`, icon: <UserCheck size={18} /> },
      { label: "Tasks Completed", value: `${myHire?.tasks?.done || 0}/${myHire?.tasks?.total || 20}`, icon: <TrendingUp size={18} /> },
      { label: "Start Date", value: myHire?.startDate || "—", icon: <Users size={18} /> },
      { label: "Documents Pending", value: documents.filter(d => d.required && ["missing", "rejected", "pending"].includes(d.status)).length, icon: <Briefcase size={18} />, color: "text-orange-500" },
    ],
    it_admin: [
      { label: "Pending Setups", value: pendingIT.length, icon: <Users size={18} />, color: "text-orange-500" },
      { label: "Ready", value: newHiresData.length - pendingIT.length, icon: <UserCheck size={18} /> },
      { label: "Total New Hires", value: newHiresData.length, icon: <Briefcase size={18} /> },
      { label: "Equipment Requests", value: pendingIT.length, sub: "Laptop, Badge, Accounts", icon: <Star size={18} /> },
    ],
  }

  const conversionTable = getConversionByDepartment(candidatesData)
  const funnel = getOverallFunnel(candidatesData)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{t(`roles.${role}.greeting`, profile.greeting)}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {role === "hr_manager" && t("pages.dashboard.hr", "Dashboard summarizes Job Postings, Applications, Pipeline, Interviews, Onboarding and Directory data.")}
          {role === "hiring_manager" && t("pages.dashboard.hiring", "Engineering-scoped recruitment and team view based on your RBAC permissions.")}
          {role === "new_employee" && t("pages.dashboard.employee", "Your onboarding and review workspace.")}
          {role === "it_admin" && t("pages.dashboard.it", "Provisioning queue synced from new hires in Onboarding.")}
        </p>
      </div>

      {urgentActions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">{t("pages.dashboard.urgent", "Urgent Actions Required")}</p>
            <div className="grid md:grid-cols-3 gap-2 mt-2">
              {urgentActions.map((a, i) => (
                <button key={i} onClick={() => setPage(a.page)} className="text-left bg-white/70 border border-amber-200 rounded-lg px-3 py-2 hover:bg-white hover:shadow-sm transition-all group">
                  <span className="block text-sm text-amber-800 font-medium">{a.label}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-brand font-bold group-hover:underline">{t("pages.dashboard.goToIssue", "Go to issue")} <ArrowRight size={12} /></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {statsByRole[role].map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {role === "hr_manager" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Headcount Growth Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={headcountData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[180, 215]} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#185FA5" strokeWidth={2} dot={{ fill: "#185FA5" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {(role === "hr_manager" || role === "hiring_manager") && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Today's Interviews</h3>
              <button onClick={() => setPage("interviews")} className="text-xs text-brand font-bold hover:underline">Open calendar</button>
            </div>
            <div className="space-y-3">
              {todaysInterviews.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No interviews scheduled today.</p>
              ) : todaysInterviews.map(iv => (
                <div key={iv.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs font-medium text-brand w-16 flex-shrink-0 pt-0.5">{formatTime(iv.time)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{iv.candidate}</p>
                    <p className="text-xs text-gray-500">{iv.role} · {iv.room}</p>
                  </div>
                  <Badge status={iv.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {role === "hr_manager" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Recruitment Conversion Report</h3>
                <p className="text-xs text-gray-500 mt-0.5">Calculated from the same candidates used by Applications and Pipeline.</p>
              </div>
              <button className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Download size={14} /> Export PDF
              </button>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Overall Funnel</h4>
                <div className="space-y-3 relative">
                  {funnel.map((step, i) => (
                    <div key={i} className="flex justify-center relative w-full group">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 w-24">{step.stage}</div>
                      <div className={`h-8 ${step.color} rounded-md flex items-center justify-center text-xs font-bold shadow-sm`} style={{ width: step.width, minWidth: "40px" }}>{step.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Conversion by Department</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="pb-2 font-medium">Department</th>
                        <th className="pb-2 font-medium text-center">Applied</th>
                        <th className="pb-2 font-medium text-center">Hired</th>
                        <th className="pb-2 font-medium text-right">Conv. Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {conversionTable.map(row => (
                        <tr key={row.dept} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-2.5 font-medium text-gray-900">{row.dept}</td>
                          <td className="py-2.5 text-center text-gray-600">{row.applied}</td>
                          <td className="py-2.5 text-center text-gray-600">{row.hired}</td>
                          <td className="py-2.5 text-right font-medium text-brand">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {role === "new_employee" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">My Onboarding Checklist</h3>
            {onboardingChecklist.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-green-100 text-green-600" : "border border-gray-300"}`}>{item.done && <span className="text-xs">✓</span>}</div>
                <span className={`text-sm ${item.done ? "text-gray-400 line-through" : "text-gray-700"}`}>{item.task}</span>
              </div>
            ))}
            <button onClick={() => setPage("onboarding")} className="mt-3 text-sm text-brand font-medium hover:underline">View full checklist →</button>
          </div>
        )}

        {role === "it_admin" && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Provisioning Queue</h3>
              <button onClick={() => setPage("onboarding")} className="text-xs text-brand font-bold hover:underline">Open IT Provisioning</button>
            </div>
            {pendingIT.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.role} · Day 1: {item.startDate}</p>
                </div>
                <Badge status="pending" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
