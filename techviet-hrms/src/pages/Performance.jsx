import { useState } from "react"
import { X, ChevronDown, ChevronUp, BarChart3, Target, LayoutGrid, CheckCircle2, PartyPopper, MessageSquare, CalendarClock, History, Database, AlertTriangle, Lock, Plus, Save } from "lucide-react"
import { kpis, reviews, newHires } from "../data/mockData"
import { ROLE_PERMISSIONS, ROLE_PROFILES } from "../rbac"
import Avatar from "../components/Avatar"
import Badge from "../components/Badge"
import confetti from "canvas-confetti"
import { useLanguage } from "../context"

const reviewCycles = [
  { id: "q2-2026", label: "Q2 2026", status: "Active", range: "Apr 1 - Jun 30, 2026", completion: 62, avgScore: 3.8, reviewDue: "Jun 30, 2026" },
  { id: "q1-2026", label: "Q1 2026", status: "Closed", range: "Jan 1 - Mar 31, 2026", completion: 100, avgScore: 4.0, reviewDue: "Mar 31, 2026" },
  { id: "q4-2025", label: "Q4 2025", status: "Closed", range: "Oct 1 - Dec 31, 2025", completion: 100, avgScore: 3.7, reviewDue: "Dec 31, 2025" },
  { id: "annual-2025", label: "Annual 2025", status: "Archived", range: "Jan 1 - Dec 31, 2025", completion: 100, avgScore: 3.9, reviewDue: "Jan 15, 2026" },
]

const managerRoster = [
  { employee: "Bui Thi Mai", department: "BOS", role: "Data Analytics Manager", avatar: "BM", employeeType: "Active Employee", joinedOn: "2021-01-04" },
  { employee: "Pham Quang Huy", department: "Engineering", role: "Engineering Manager", avatar: "PH", employeeType: "Active Employee", joinedOn: "2020-02-10" },
  { employee: "Vo Duc Kien", department: "Engineering", role: "Backend Engineering Manager", avatar: "VK", employeeType: "Active Employee", joinedOn: "2020-08-12" },
  { employee: "Nguyen Hoang Minh", department: "Engineering", role: "Chief Technology Officer", avatar: "NM", employeeType: "Active Employee", joinedOn: "2019-03-01" },
]

const currentCycleRoster = [
  ...managerRoster,
  ...newHires.map(h => ({
    employee: h.name,
    department: h.department,
    role: h.role,
    avatar: h.avatar,
    employeeType: h.startDate.includes("May") ? "New Hire / Probation" : "Active Employee",
    joinedOn: h.startDate,
  })),
]

const historicalRosterByCycle = {
  "q2-2026": currentCycleRoster,
  "q1-2026": managerRoster,
  "q4-2025": managerRoster.filter(p => ["BOS", "Engineering"].includes(p.department)),
  "annual-2025": managerRoster.filter(p => ["BOS", "Engineering"].includes(p.department)),
}

const employeeDirectory = [...currentCycleRoster, ...managerRoster].reduce((acc, person) => {
  acc[person.employee] = person
  return acc
}, {})

const kpiMeta = {
  "Data Accuracy Rate": { owner: "Bui Thi Mai", frequency: "Monthly", source: "BI Data Quality Dashboard", goal: "Improve HR reporting trust" },
  "Report Delivery On Time": { owner: "Tran Thi Huong", frequency: "Weekly", source: "BI Request Tracker", goal: "Reduce report SLA breach" },
  "Automation Tasks Built": { owner: "Le Quoc An", frequency: "Monthly", source: "Manual check-in + GitHub", goal: "Automate recurring HR reports" },
  "Kaizen Proposals": { owner: "BOS Team", frequency: "Quarterly", source: "Continuous Improvement Log", goal: "Improve operating process" },
  "Sprint Velocity": { owner: "Pham Quang Huy", frequency: "Sprint", source: "Jira", goal: "Deliver product roadmap" },
  "Bug Escape Rate": { owner: "Vo Duc Kien", frequency: "Monthly", source: "QA Defect Tracker", goal: "Improve release quality" },
  "Code Review SLA": { owner: "Engineering Leads", frequency: "Weekly", source: "GitHub Pull Requests", goal: "Speed up engineering flow" },
  "Feature Delivery Rate": { owner: "Nguyen Hoang Minh", frequency: "Monthly", source: "Jira Release Report", goal: "Improve delivery predictability" },
}

const checkIns = [
  { id: 1, periodId: "q2-2026", employee: "Le Quoc An", avatar: "LQ", department: "BOS", role: "Data Analyst", date: "May 12, 2026", linkedGoal: "Automation Tasks Built", progress: 67, status: "at_risk", source: "Manual check-in", update: "Completed payroll variance prototype and waiting for HR validation data.", blocker: "Need confirmed business rule for probation payroll adjustment.", managerComment: "Good progress; clarify rule with HR Operations before final automation." },
  { id: 2, periodId: "q2-2026", employee: "Tran Thi Huong", avatar: "TH", department: "BOS", role: "Data Analyst", date: "May 11, 2026", linkedGoal: "Report Delivery On Time", progress: 100, status: "on_track", source: "BI Request Tracker", update: "All weekly headcount and onboarding dashboards delivered within SLA.", blocker: "None", managerComment: "Consistent delivery. Next step: document dashboard ownership." },
  { id: 3, periodId: "q2-2026", employee: "Nguyen Van Duc", avatar: "ND", department: "Engineering", role: "Backend Developer", date: "May 10, 2026", linkedGoal: "Bug Escape Rate", progress: 93, status: "on_track", source: "Jira + QA Defect Tracker", update: "Closed three payroll API defects before UAT and added integration tests.", blocker: "UAT feedback from Finance pending.", managerComment: "Strong ownership. Keep QA loop tight before release freeze." },
  { id: 4, periodId: "q2-2026", employee: "Le Minh Quan", avatar: "LM", department: "Engineering", role: "Frontend Developer", date: "May 9, 2026", linkedGoal: "Feature Delivery Rate", progress: 88, status: "at_risk", source: "Jira", update: "Recruitment Kanban UI completed; interview conflict flow still needs polish.", blocker: "Design confirmation for calendar side-by-side layout.", managerComment: "Prioritize conflict state clarity before adding new UI states." },
  { id: 5, periodId: "q1-2026", employee: "Bui Thi Mai", avatar: "BM", department: "BOS", role: "Data Analytics Manager", date: "Mar 20, 2026", linkedGoal: "Data Accuracy Rate", progress: 98, status: "on_track", source: "BI Data Quality Dashboard", update: "Closed duplicate employee master data issue and improved validation checks.", blocker: "None", managerComment: "Strong governance improvement for HR reporting." },
  { id: 6, periodId: "q1-2026", employee: "Pham Quang Huy", avatar: "PH", department: "Engineering", role: "Engineering Manager", date: "Mar 18, 2026", linkedGoal: "Sprint Velocity", progress: 95, status: "on_track", source: "Jira Sprint Report", update: "Two sprint commitments closed with no critical carry-over.", blocker: "Need earlier dependency confirmation from Product.", managerComment: "Good delivery discipline; improve cross-team dependency planning." },
  { id: 7, periodId: "q4-2025", employee: "Vo Duc Kien", avatar: "VK", department: "Engineering", role: "Backend Engineering Manager", date: "Dec 19, 2025", linkedGoal: "Code Review SLA", progress: 90, status: "on_track", source: "GitHub Pull Requests", update: "Reduced median code review time through reviewer rotation.", blocker: "None", managerComment: "Sustainable engineering process improvement." },
]

const historicalReviews = [
  {
    id: "q1-bm",
    periodId: "q1-2026",
    employee: "Bui Thi Mai",
    department: "BOS",
    role: "Data Analytics Manager",
    period: "Q1 2026",
    status: "completed",
    avatar: "BM",
    criteria: [
      { name: "Data Governance", max: 5, selfScore: 4, managerScore: 5, selfNote: "Improved validation and reporting governance.", managerNote: "Strong ownership of HR analytics quality." },
      { name: "Stakeholder Management", max: 5, selfScore: 4, managerScore: 4, selfNote: "Worked closely with HR and Operations.", managerNote: "Clear communication with business stakeholders." },
      { name: "Leadership", max: 5, selfScore: 4, managerScore: 4, selfNote: "Coached analysts on dashboard quality.", managerNote: "Reliable team leadership." },
    ],
  },
  {
    id: "q1-ph",
    periodId: "q1-2026",
    employee: "Pham Quang Huy",
    department: "Engineering",
    role: "Engineering Manager",
    period: "Q1 2026",
    status: "completed",
    avatar: "PH",
    criteria: [
      { name: "Delivery Management", max: 5, selfScore: 4, managerScore: 4, selfNote: "Maintained sprint delivery discipline.", managerNote: "Good predictability and team coordination." },
      { name: "Quality Ownership", max: 5, selfScore: 4, managerScore: 4, selfNote: "Reduced defect leakage through reviews.", managerNote: "Quality trend is positive." },
      { name: "People Management", max: 5, selfScore: 4, managerScore: 3, selfNote: "Supported team growth.", managerNote: "Needs more structured coaching plans." },
    ],
  },
  {
    id: "q4-vk",
    periodId: "q4-2025",
    employee: "Vo Duc Kien",
    department: "Engineering",
    role: "Backend Engineering Manager",
    period: "Q4 2025",
    status: "completed",
    avatar: "VK",
    criteria: [
      { name: "Engineering Quality", max: 5, selfScore: 4, managerScore: 4, selfNote: "Improved backend release quality and reviewer rotation.", managerNote: "Sustainable process improvement with measurable impact." },
      { name: "Team Enablement", max: 5, selfScore: 4, managerScore: 4, selfNote: "Supported backend developers during release hardening.", managerNote: "Strong coaching and reliable execution." },
      { name: "Risk Management", max: 5, selfScore: 4, managerScore: 5, selfNote: "Reduced late-cycle defect risk.", managerNote: "Excellent production risk awareness." },
    ],
  },
  {
    id: "annual-nm",
    periodId: "annual-2025",
    employee: "Nguyen Hoang Minh",
    department: "Engineering",
    role: "Chief Technology Officer",
    period: "Annual 2025",
    status: "completed",
    avatar: "NM",
    criteria: [
      { name: "Strategic Delivery", max: 5, selfScore: 4, managerScore: 4, selfNote: "Aligned engineering delivery with company growth targets.", managerNote: "Strong technology leadership across 2025." },
      { name: "People Leadership", max: 5, selfScore: 4, managerScore: 4, selfNote: "Developed engineering managers and standards.", managerNote: "Good leadership bench development." },
      { name: "Operational Excellence", max: 5, selfScore: 4, managerScore: 5, selfNote: "Improved release governance and delivery visibility.", managerNote: "Excellent operational maturity." },
    ],
  },
]

const lowerIsBetterKPIs = ["Bug Escape Rate", "Code Review SLA"]
const departmentOptions = ["BOS", "Engineering", "Operations"]

const getPeriodAdjustment = (periodId, kpiId) => {
  if (periodId === "q1-2026") return kpiId % 2 === 0 ? 1.04 : 0.96
  if (periodId === "q4-2025") return kpiId % 2 === 0 ? 0.92 : 0.98
  if (periodId === "annual-2025") return kpiId % 2 === 0 ? 1.01 : 0.94
  return 1
}

const getPeriodKpis = (periodId, kpiSource) => kpiSource.map(kpi => ({
  ...kpi,
  ...kpiMeta[kpi.name],
  owner: kpi.owner || kpiMeta[kpi.name]?.owner || "Unassigned",
  frequency: kpi.frequency || kpiMeta[kpi.name]?.frequency || "Monthly",
  source: kpi.source || kpiMeta[kpi.name]?.source || "Manual update",
  goal: kpi.goal || kpiMeta[kpi.name]?.goal || "Department goal alignment",
  actual: Math.round(kpi.actual * getPeriodAdjustment(periodId, kpi.id) * 10) / 10,
}))

const getTrafficLight = (actual, target, lowerIsBetter = false) => {
  const ratio = lowerIsBetter ? target / Math.max(actual, 0.01) : actual / target
  if (ratio >= 0.95) return { status: "on_track", label: "On Track", color: "text-emerald-600", bg: "bg-emerald-100" }
  if (ratio >= 0.80) return { status: "at_risk", label: "At Risk", color: "text-amber-600", bg: "bg-amber-100" }
  return { status: "off_track", label: "Off Track", color: "text-red-600", bg: "bg-red-100" }
}

const getBarWidth = (actual, target, lowerIsBetter = false) => {
  if (lowerIsBetter) return Math.min((target / Math.max(actual, 0.01)) * 100, 100)
  return Math.min((actual / target) * 100, 100)
}

const canSeePerson = (person, role) => {
  const permissions = ROLE_PERMISSIONS[role] ?? {}
  if (role === "hr_manager") return true
  if (role === "new_employee") return person.employee === ROLE_PROFILES.new_employee.name
  if (permissions.departmentScope) return person.department === permissions.departmentScope
  return false
}

const getCycleRoster = (cycleId, role) => (historicalRosterByCycle[cycleId] ?? []).filter(person => canSeePerson(person, role))

const getCycleReviews = (cycleId, localReviews, role) => {
  const source = cycleId === "q2-2026"
    ? localReviews.map(r => ({ ...r, period: "Q2 2026" }))
    : historicalReviews.filter(r => r.periodId === cycleId).map(r => ({ ...r, status: "completed" }))

  return source.filter(review => canSeePerson(review, role))
}

function EmptyState({ title, description }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
      <Lock size={18} className="mx-auto text-gray-300 mb-2" />
      <p className="font-bold text-gray-700">{title}</p>
      <p className="text-xs mt-1">{description}</p>
    </div>
  )
}

function KPISection({ dept, kpiList }) {
  const [expanded, setExpanded] = useState(true)
  const deptKPIs = kpiList.filter(k => k.department === dept)

  if (deptKPIs.length === 0) return null

  const avgScore = Math.round(
    deptKPIs.reduce((sum, k) => {
      const ratio = k.direction === "lower" || lowerIsBetterKPIs.includes(k.name) ? k.target / Math.max(k.actual, 0.01) : k.actual / k.target
      return sum + Math.min(ratio * 100, 100)
    }, 0) / deptKPIs.length
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4 transition-all">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-gray-900">{dept} Team KPIs / OKRs</h3>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${avgScore >= 95 ? "bg-emerald-100 text-emerald-700" : avgScore >= 80 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>Avg {avgScore}%</span>
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {expanded && (
        <div className="divide-y divide-gray-50 bg-white">
          {deptKPIs.map(kpi => {
            const lib = kpi.direction === "lower" || lowerIsBetterKPIs.includes(kpi.name)
            const tl = getTrafficLight(kpi.actual, kpi.target, lib)
            const barW = getBarWidth(kpi.actual, kpi.target, lib)
            return (
              <div key={kpi.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-6 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-800">{kpi.name}</span>
                      <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">Weight {kpi.weight}%</span>
                      <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${tl.bg} ${tl.color}`}>{tl.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Goal: {kpi.goal}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">Owner: {kpi.owner}</span>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">Frequency: {kpi.frequency}</span>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg flex items-center gap-1"><Database size={10}/> Source: {kpi.source}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400 font-medium">Target: {kpi.target}{kpi.unit}</p>
                    <p className={`text-sm font-black ${tl.color}`}>Actual: {kpi.actual}{kpi.unit}</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${tl.status === "on_track" ? "bg-emerald-400" : tl.status === "at_risk" ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${barW}%` }} /></div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review, onSelect, isHistorical }) {
  const avgSelf = Math.round(review.criteria.reduce((s, c) => s + c.selfScore, 0) / review.criteria.length * 10) / 10
  const avgManager = Math.round(review.criteria.reduce((s, c) => s + c.managerScore, 0) / review.criteria.length * 10) / 10
  const gap = Math.round((avgSelf - avgManager) * 10) / 10

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:border-brand hover:shadow-md transition-all group relative overflow-hidden" onClick={() => onSelect(review)}>
      {(review.status === "completed" || isHistorical) && <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-50 rounded-bl-full flex justify-end p-1.5"><CheckCircle2 size={12} className="text-emerald-500"/></div>}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3"><Avatar initials={review.avatar} size="md" /><div><p className="text-sm font-bold text-gray-900 group-hover:text-brand transition-colors">{review.employee}</p><p className="text-[11px] font-medium text-gray-500 mt-0.5">{review.role} · <span className="text-brand">{review.department}</span></p></div></div>
        <Badge status={isHistorical ? "completed" : review.status} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center bg-blue-50/50 border border-blue-100/50 rounded-xl p-3"><p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Self</p><p className="text-lg font-black text-brand">{avgSelf}/5</p></div>
        <div className="text-center bg-purple-50/50 border border-purple-100/50 rounded-xl p-3"><p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Manager</p><p className="text-lg font-black text-purple-600">{avgManager}/5</p></div>
        <div className={`text-center rounded-xl p-3 border ${Math.abs(gap) > 1 ? "bg-red-50/50 border-red-100" : "bg-emerald-50/50 border-emerald-100"}`}><p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${Math.abs(gap) > 1 ? "text-red-400" : "text-emerald-500"}`}>Gap</p><p className={`text-lg font-black ${Math.abs(gap) > 1 ? "text-red-500" : "text-emerald-600"}`}>{gap > 0 ? "+" : ""}{gap}</p></div>
      </div>
    </div>
  )
}

function CheckInsPanel({ selectedCycle, role }) {
  const visibleCheckIns = checkIns.filter(c => c.periodId === selectedCycle.id && canSeePerson(c, role))

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-6">
        <div><h3 className="text-sm font-black text-gray-900">Continuous Check-ins</h3><p className="text-xs text-gray-500 mt-1 max-w-2xl">HRMS tracks progress summaries, blockers, manager feedback, and evidence source. Detailed task execution remains in Jira, CRM, BI, or team tools.</p></div>
        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">{selectedCycle.label}</span>
      </div>

      {visibleCheckIns.length === 0 ? <EmptyState title="No check-ins in this scope" description="This cycle has no visible check-ins for the current role, department, or employee snapshot." /> : (
        <div className="grid grid-cols-2 gap-4">
          {visibleCheckIns.map(item => {
            const tl = item.status === "on_track" ? { bg: "bg-emerald-100", color: "text-emerald-700", label: "On Track" } : { bg: "bg-amber-100", color: "text-amber-700", label: "At Risk" }
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><Avatar initials={item.avatar} size="md" /><div><p className="text-sm font-bold text-gray-900">{item.employee}</p><p className="text-[11px] text-gray-500 font-medium">{item.role} · {item.department}</p></div></div><span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase ${tl.bg} ${tl.color}`}>{tl.label}</span></div>
                <div className="space-y-3">
                  <div><div className="flex items-center justify-between mb-1"><p className="text-xs font-bold text-gray-500">Linked Goal: <span className="text-brand">{item.linkedGoal}</span></p><p className="text-xs font-black text-gray-900">{item.progress}%</p></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${item.status === "on_track" ? "bg-emerald-400" : "bg-amber-400"}`} style={{ width: `${item.progress}%` }} /></div></div>
                  <div className="bg-gray-50 rounded-xl border border-gray-100 p-3"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">Weekly Update</p><p className="text-sm text-gray-700 font-medium leading-relaxed">{item.update}</p></div>
                  <div className="bg-amber-50 rounded-xl border border-amber-100 p-3"><p className="text-[10px] font-black text-amber-500 uppercase mb-1 flex items-center gap-1"><AlertTriangle size={11}/> Blocker</p><p className="text-sm text-gray-700 font-medium leading-relaxed">{item.blocker}</p></div>
                  <div className="bg-purple-50 rounded-xl border border-purple-100 p-3"><p className="text-[10px] font-black text-purple-500 uppercase mb-1">Manager Comment</p><p className="text-sm text-gray-700 font-medium leading-relaxed">{item.managerComment}</p></div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 pt-1"><span>{item.date}</span><span>Source: {item.source}</span></div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function NineBoxMatrix({ selectedCycle, role }) {
  const namesForCycle = new Set(getCycleRoster(selectedCycle.id, role).map(p => p.employee))
  const boxes = [
    { title: "Future Leader", bg: "bg-emerald-100 border-emerald-200", text: "text-emerald-800", emps: ["Vo Hoang Khai"] },
    { title: "Growth Employee", bg: "bg-green-50 border-green-200", text: "text-green-800", emps: ["Nguyen Van Duc", "Le Minh Quan", "Pham Quang Huy"] },
    { title: "High Performer", bg: "bg-blue-50 border-blue-200", text: "text-blue-800", emps: ["Tran Thi Huong", "Bui Thi Mai"] },
    { title: "Enigma", bg: "bg-purple-50 border-purple-200", text: "text-purple-800", emps: ["Pham Thi Nhi"] },
    { title: "Core Employee", bg: "bg-gray-50 border-gray-200", text: "text-gray-800", emps: ["Vo Duc Kien"] },
    { title: "Effective", bg: "bg-gray-50 border-gray-200", text: "text-gray-800", emps: ["Nguyen Hoang Minh"] },
    { title: "Dilemma", bg: "bg-amber-50 border-amber-200", text: "text-amber-800", emps: [] },
    { title: "Inconsistent", bg: "bg-orange-50 border-orange-200", text: "text-orange-800", emps: ["Le Quoc An"] },
    { title: "Underperformer", bg: "bg-red-50 border-red-200", text: "text-red-800", emps: [] },
  ].map(box => ({ ...box, emps: box.emps.filter(e => namesForCycle.has(e)) }))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
      <div className="flex justify-between items-center mb-6"><div><h3 className="text-lg font-bold text-gray-900">9-Box Talent Matrix</h3><p className="text-xs text-gray-500 mt-1">Calibration mapping for {selectedCycle.label} using that period's employee snapshot</p></div><div className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">RBAC-SCOPED VIEW</div></div>
      <div className="relative pl-8 pb-8"><div className="absolute left-0 top-0 bottom-8 w-8 flex items-center justify-center"><span className="transform -rotate-90 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Potential</span></div><div className="grid grid-cols-3 grid-rows-3 gap-2 h-[450px]">{boxes.map((box, idx) => <div key={idx} className={`p-3 rounded-xl border flex flex-col ${box.bg}`}><h4 className={`text-[11px] font-black uppercase tracking-wider mb-2 ${box.text}`}>{box.title}</h4><div className="flex-1 flex flex-wrap content-start gap-1">{box.emps.map(e => <span key={e} className="inline-flex items-center px-2 py-1 rounded bg-white/60 text-[10px] font-bold shadow-sm border border-black/5 text-gray-800">{e}</span>)}</div></div>)}</div><div className="absolute bottom-0 left-8 right-0 h-8 flex items-center justify-center"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</span></div></div>
    </div>
  )
}

export default function Performance({ role }) {
  const { t } = useLanguage()
  const [tab, setTab] = useState(role === "new_employee" ? "review" : "kpi")
  const [selectedCycleId, setSelectedCycleId] = useState("q2-2026")
  const [selected, setSelected] = useState(null)
  const [localReviews, setLocalReviews] = useState(reviews.map(r => ({ ...r, period: "Q2 2026" })))
  const [localKpis, setLocalKpis] = useState(kpis)
  const [showKpiModal, setShowKpiModal] = useState(false)
  const [kpiForm, setKpiForm] = useState({ name: "", department: "BOS", weight: 10, target: 95, actual: 0, unit: "%", owner: "", frequency: "Monthly", source: "Manual update", goal: "", direction: "higher" })
  const [alertDialog, setAlertDialog] = useState(false)

  const permissions = ROLE_PERMISSIONS[role] ?? {}
  const selectedCycle = reviewCycles.find(c => c.id === selectedCycleId) || reviewCycles[0]
  const isHistorical = selectedCycle.status !== "Active"
  const scopedDepartments = permissions.departmentScope ? departmentOptions.filter(dept => dept === permissions.departmentScope) : departmentOptions
  const periodKpis = getPeriodKpis(selectedCycle.id, localKpis)
  const cycleRoster = getCycleRoster(selectedCycle.id, role)
  const displayReviews = getCycleReviews(selectedCycle.id, localReviews, role)
  const reviewsDue = isHistorical ? 0 : displayReviews.filter(r => r.status !== "completed").length
  const visibleTabs = role === "new_employee" ? [] : [
    { id: "kpi", label: "KPI / OKR Framework", icon: <Target size={14}/> },
    { id: "checkins", label: "Continuous Check-ins", icon: <MessageSquare size={14}/> },
    { id: "review", label: "Performance Reviews", icon: <BarChart3 size={14}/> },
    ...(permissions.canViewPerformanceCalibration || permissions.canManageTeamReviews ? [{ id: "9box", label: "9-Box Matrix", icon: <LayoutGrid size={14}/> }] : []),
  ]

  const totalWeightByDepartment = (dept) => periodKpis.filter(k => k.department === dept).reduce((sum, k) => sum + Number(k.weight || 0), 0)

  const handleCreateKpi = (e) => {
    e.preventDefault()
    const newKpi = {
      id: Math.max(0, ...localKpis.map(k => Number(k.id) || 0)) + 1,
      name: kpiForm.name.trim(),
      department: kpiForm.department,
      weight: Number(kpiForm.weight),
      target: Number(kpiForm.target),
      actual: Number(kpiForm.actual),
      unit: kpiForm.unit,
      owner: kpiForm.owner.trim() || "Unassigned",
      frequency: kpiForm.frequency,
      source: kpiForm.source.trim() || "Manual update",
      goal: kpiForm.goal.trim() || "Department goal alignment",
      direction: kpiForm.direction || "higher",
    }
    if (!newKpi.name || newKpi.weight <= 0 || newKpi.target <= 0) return
    setLocalKpis(prev => [newKpi, ...prev])
    setKpiForm({ name: "", department: kpiForm.department, weight: 10, target: 95, actual: 0, unit: "%", owner: "", frequency: "Monthly", source: "Manual update", goal: "", direction: "higher" })
    setShowKpiModal(false)
  }

  const handleFinalize = () => {
    setLocalReviews(prev => prev.map(r => r.id === selected.id ? { ...r, status: "completed" } : r))
    setSelected(null)
    setAlertDialog(true)
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#8B5CF6", "#10B981", "#F59E0B"] })
  }

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div><h1 className="text-xl font-bold text-gray-900">{role === "new_employee" ? t("pages.performance.mine", "My Performance Review") : role === "hiring_manager" ? t("pages.performance.team", "Team Performance") : t("pages.performance.management", "Performance Management")}</h1><p className="text-sm font-medium text-gray-500 mt-0.5">{selectedCycle.label} · {selectedCycle.range} · {selectedCycle.status}</p></div>
        <div className="flex items-center gap-2">{role === "hr_manager" && !isHistorical && <button onClick={() => setShowKpiModal(true)} className="bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-600 transition-colors flex items-center gap-2"><Plus size={15}/> Create KPI</button>}<div className="relative"><History size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><select value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} className="pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 shadow-sm focus:outline-none focus:border-brand">{reviewCycles.map(c => <option key={c.id} value={c.id}>{c.label} - {c.status}</option>)}</select></div>{role === "hr_manager" && !isHistorical && <button className="bg-brand text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-brand-dark transition-colors flex items-center gap-2">Start Review Cycle</button>}</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between"><div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reviews Due</p><p className="text-3xl font-black text-gray-900">{reviewsDue}</p></div><div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-brand"><Target size={24}/></div></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between"><div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Completion</p><p className="text-3xl font-black text-emerald-600">{selectedCycle.completion}%</p></div><div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><CheckCircle2 size={24}/></div></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between"><div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Visible People</p><p className="text-3xl font-black text-gray-900">{cycleRoster.length}</p></div><div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500"><BarChart3 size={24}/></div></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between"><div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Review Due</p><p className="text-lg font-black text-gray-900">{selectedCycle.reviewDue}</p></div><div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"><CalendarClock size={24}/></div></div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">Cycle Employee Snapshot</span>
        {cycleRoster.map(person => <span key={`${selectedCycle.id}-${person.employee}`} className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{person.employee} · {person.employeeType}</span>)}
        {cycleRoster.length === 0 && <span className="text-xs text-gray-400">No visible employees for this role and cycle.</span>}
      </div>

      {isHistorical && <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 flex items-center gap-3 text-sm text-slate-600"><History size={18} className="text-slate-400" /><span><strong className="text-slate-800">Historical lookback mode:</strong> cycle data is locked and uses that period&apos;s employee snapshot, so new hires from later periods are not shown retroactively.</span></div>}

      {visibleTabs.length > 0 && <div className="flex bg-gray-100 rounded-lg p-1 w-max border border-gray-200">{visibleTabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${tab === t.id ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{t.icon} {t.label}</button>)}</div>}

      {tab === "kpi" && <div className="space-y-4 animate-in fade-in duration-300"><div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4"><div><h3 className="text-sm font-black text-gray-900">Goal Alignment Model</h3><p className="text-xs text-gray-500 mt-1">Company goals cascade to department KPIs and employee check-ins. Department-specific execution tasks stay in source systems; HRMS stores performance evidence and review decisions. This view is scoped by RBAC.</p></div>{role === "hr_manager" && !isHistorical && <button onClick={() => setShowKpiModal(true)} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-2 rounded-xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-colors flex items-center gap-1.5"><Plus size={14}/> Add KPI/OKR</button>}</div>{scopedDepartments.map(dept => <div key={dept} className="space-y-2"><div className="flex justify-end"><span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${totalWeightByDepartment(dept) === 100 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>Total weight: {totalWeightByDepartment(dept)}%</span></div><KPISection dept={dept} kpiList={periodKpis} /></div>)}</div>}

      {tab === "checkins" && <CheckInsPanel selectedCycle={selectedCycle} role={role} />}

      {tab === "review" && <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">{displayReviews.length === 0 ? <div className="col-span-2"><EmptyState title="No reviews in this cycle" description="The selected cycle has no review records visible for this role. This prevents later new hires from appearing in earlier historical periods." /></div> : displayReviews.map(r => <ReviewCard key={r.id} review={r} onSelect={setSelected} isHistorical={isHistorical} />)}</div>}

      {tab === "9box" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-300"><NineBoxMatrix selectedCycle={selectedCycle} role={role} /></div>}


      {showKpiModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm p-4" onClick={() => setShowKpiModal(false)}>
          <form onSubmit={handleCreateKpi} className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 bg-emerald-500 text-white flex items-center justify-between">
              <div><h3 className="text-lg font-black">Create KPI / OKR</h3><p className="text-xs text-emerald-50 mt-0.5">HR Manager setup flow aligned with BRD: KPI/OKR framework setup.</p></div>
              <button type="button" onClick={() => setShowKpiModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={18}/></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <label className="col-span-2 text-xs font-black text-gray-500 uppercase tracking-wider">KPI Name<input required value={kpiForm.name} onChange={e => setKpiForm({...kpiForm, name: e.target.value})} placeholder="e.g. Employee Data Completeness" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand" /></label>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Department<select value={kpiForm.department} onChange={e => setKpiForm({...kpiForm, department: e.target.value})} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand"><option>BOS</option><option>Engineering</option><option>Operations</option></select></label>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Owner<input value={kpiForm.owner} onChange={e => setKpiForm({...kpiForm, owner: e.target.value})} placeholder="Owner / team" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand" /></label>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Weight %<input required type="number" min="1" max="100" value={kpiForm.weight} onChange={e => setKpiForm({...kpiForm, weight: e.target.value})} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand" /></label>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Target<input required type="number" min="0.01" step="0.1" value={kpiForm.target} onChange={e => setKpiForm({...kpiForm, target: e.target.value})} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand" /></label>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Current Actual<input type="number" min="0" step="0.1" value={kpiForm.actual} onChange={e => setKpiForm({...kpiForm, actual: e.target.value})} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand" /></label>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Unit<input value={kpiForm.unit} onChange={e => setKpiForm({...kpiForm, unit: e.target.value})} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand" /></label>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Direction<select value={kpiForm.direction || "higher"} onChange={e => setKpiForm({...kpiForm, direction: e.target.value})} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand"><option value="higher">Higher is better</option><option value="lower">Lower is better</option></select></label>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Frequency<select value={kpiForm.frequency} onChange={e => setKpiForm({...kpiForm, frequency: e.target.value})} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand"><option>Weekly</option><option>Monthly</option><option>Quarterly</option></select></label>
              <label className="col-span-2 text-xs font-black text-gray-500 uppercase tracking-wider">Evidence Source<input value={kpiForm.source} onChange={e => setKpiForm({...kpiForm, source: e.target.value})} placeholder="BI dashboard / Jira / HRMS / Manual update" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand" /></label>
              <label className="col-span-2 text-xs font-black text-gray-500 uppercase tracking-wider">Linked Goal<textarea rows={3} value={kpiForm.goal} onChange={e => setKpiForm({...kpiForm, goal: e.target.value})} placeholder="Which business / department goal does this KPI support?" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand resize-none" /></label>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowKpiModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 flex items-center gap-2"><Save size={15}/> Save KPI</button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50"><div className="flex items-center gap-4"><Avatar initials={selected.avatar} size="lg" /><div><h2 className="text-lg font-black text-gray-900">{selected.employee}</h2><p className="text-xs font-bold text-brand uppercase tracking-wider mt-0.5">{selected.role} · <span className="text-gray-400">{selected.period}</span></p><p className="text-[11px] text-gray-400 mt-1">Snapshot: {employeeDirectory[selected.employee]?.employeeType ?? "Historical Employee"}</p></div></div><button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-200 bg-white border border-gray-200 rounded-full text-gray-500 transition-colors"><X size={18} /></button></div>
            <div className="px-8 py-6 border-b border-gray-100 bg-white"><div className="flex items-center gap-2">{["Self Assessment", "Manager Review", "1-on-1 Meeting", "Finalized"].map((step, i) => { let status = "pending"; if (selected.status === "completed") status = "done"; else if (selected.status === "in_review") { if (i === 0) status = "done"; if (i === 1) status = "active" } return <div key={step} className="flex items-center gap-2 flex-1"><div className="flex flex-col items-center flex-1"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-sm ${status === "done" ? "bg-emerald-500 text-white" : status === "active" ? "bg-brand text-white ring-4 ring-brand/20" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>{status === "done" ? "✓" : i + 1}</div><p className={`text-[10px] font-bold uppercase tracking-wider mt-2 text-center ${status === "active" ? "text-brand" : status === "done" ? "text-emerald-600" : "text-gray-400"}`}>{step}</p></div>{i < 3 && <div className={`flex-1 h-1 rounded-full ${status === "done" ? "bg-emerald-400" : "bg-gray-100"} -mt-4`} />}</div> })}</div></div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50/30"><h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Performance Evaluation Scores</h3><div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm mb-8"><table className="w-full"><thead className="bg-gray-50 border-b border-gray-100"><tr><th className="text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3">Criteria</th><th className="text-center text-[11px] font-black text-gray-400 uppercase tracking-wider px-4 py-3">Max</th><th className="text-center text-[11px] font-black text-blue-500 uppercase tracking-wider px-4 py-3 bg-blue-50/50">Self</th><th className="text-center text-[11px] font-black text-purple-500 uppercase tracking-wider px-4 py-3 bg-purple-50/50">Manager</th><th className="text-center text-[11px] font-black text-gray-400 uppercase tracking-wider px-4 py-3">Gap</th></tr></thead><tbody className="divide-y divide-gray-50">{selected.criteria.map((c, i) => { const gap = c.selfScore - c.managerScore; return <tr key={i} className="hover:bg-gray-50 transition-colors"><td className="px-5 py-4 text-sm font-bold text-gray-700">{c.name}</td><td className="px-4 py-4 text-sm text-center font-medium text-gray-400">{c.max}</td><td className="px-4 py-4 text-center bg-blue-50/30"><span className="text-base font-black text-brand">{c.selfScore}</span></td><td className="px-4 py-4 text-center bg-purple-50/30"><span className="text-base font-black text-purple-600">{c.managerScore}</span></td><td className="px-4 py-4 text-center"><span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${Math.abs(gap) > 1 ? "bg-red-100 text-red-600" : gap === 0 ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>{gap > 0 ? "+" : ""}{gap}</span></td></tr> })}</tbody></table></div><div className="grid grid-cols-2 gap-6"><div><h4 className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><MessageSquare size={14}/> Employee Reflection</h4><div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed font-medium">&quot;{selected.criteria[0].selfNote}&quot;</div></div><div><h4 className="text-[11px] font-black text-purple-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><MessageSquare size={14}/> Manager Feedback</h4><div className="bg-purple-50/80 border border-purple-100 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed font-medium">{selected.status === "completed" ? `"${selected.criteria[0].managerNote}"` : <span className="italic text-gray-400">Waiting for manager&apos;s final review...</span>}</div></div></div>{(role === "hiring_manager" || role === "hr_manager") && selected.status === "in_review" && !isHistorical && <div className="mt-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"><label className="text-[11px] font-black text-gray-900 uppercase tracking-widest block mb-3">Manager Overall Comment <span className="text-red-500">*</span></label><textarea rows={4} defaultValue={selected.criteria[0].managerNote} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors resize-none font-medium text-gray-700" /></div>}</div>
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-between items-center"><button onClick={() => setSelected(null)} className="border-2 border-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Close</button>{(role === "hiring_manager" || role === "hr_manager") && selected.status === "in_review" && !isHistorical && <div className="flex gap-3"><button className="text-brand bg-brand/10 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand hover:text-white transition-colors">Save Draft</button><button onClick={handleFinalize} className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"><CheckCircle2 size={16}/> Finalize Review</button></div>}</div>
          </div>
        </div>
      )}

      {alertDialog && <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm"><div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center"><div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-emerald-100 text-emerald-500"><PartyPopper size={32} /></div><h3 className="text-xl font-black text-gray-900 mb-2">Review Finalized!</h3><p className="text-sm font-medium text-gray-500 mb-6">The performance review has been successfully submitted and locked for {selectedCycle.label}.</p><button onClick={() => setAlertDialog(false)} className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black shadow-lg">Okay</button></div></div>}
    </div>
  )
}
