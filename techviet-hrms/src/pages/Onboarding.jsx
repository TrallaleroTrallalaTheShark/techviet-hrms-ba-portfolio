import { useState } from "react"
import { Search, Bell, FileText, Circle, X, CheckCircle2 } from "lucide-react"
import { onboardingChecklist, documents } from "../data/mockData"
import Avatar from "../components/Avatar"
import Badge from "../components/Badge"
import ProgressBar from "../components/ProgressBar"

// IMPORT GLOBAL STATE
import { useData, useLanguage } from "../context"

export default function Onboarding({ role }) {
  // Lấy danh sách nhân viên mới từ Global State
  const { newHiresData, setNewHiresData } = useData()
  const { t } = useLanguage()

  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState("tracker") 

  const filtered = newHiresData.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.role.toLowerCase().includes(search.toLowerCase())
  )

  // Tính toán số liệu thống kê động dựa trên dữ liệu thật
  const totalHires = newHiresData.length;
  const readyCount = newHiresData.filter(h => h.itStatus === 'ready').length;
  const avgProgress = totalHires > 0 
    ? Math.round(newHiresData.reduce((acc, curr) => acc + curr.progress, 0) / totalHires) 
    : 0;

  if (role === "new_employee") {
    const myHire = newHiresData.find(h => h.name === "Le Quoc An") || newHiresData[0]
    const requiredDocs = documents.filter(doc => doc.required)
    const verifiedDocs = requiredDocs.filter(doc => doc.status === "verified").length
    const pendingDocs = requiredDocs.length - verifiedDocs

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t("pages.onboarding.myTitle", "My Onboarding")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("pages.onboarding.mySubtitle", "Track your onboarding progress and complete required tasks")}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">Overall Progress</p>
            <p className="text-2xl font-semibold text-gray-900">{myHire?.progress || 0}%</p>
            <ProgressBar value={myHire?.progress || 0} />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">Tasks Completed</p>
            <p className="text-2xl font-semibold text-gray-900">{myHire?.tasks?.done || 0}/{myHire?.tasks?.total || 20}</p>
            <p className="text-xs text-gray-400 mt-1">{Math.max((myHire?.tasks?.total || 20) - (myHire?.tasks?.done || 0), 0)} tasks remaining</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">Documents</p>
            <p className="text-2xl font-semibold text-gray-900">{verifiedDocs}/{requiredDocs.length}</p>
            <p className="text-xs text-orange-500 mt-1">{pendingDocs} pending</p>
          </div>
        </div>

        <div className="flex gap-2">
          {["tracker", "documents"].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                view === v ? "bg-brand text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-brand"
              }`}
            >
              {v === "tracker" ? "Checklist" : "Documents"}
            </button>
          ))}
        </div>

        {view === "tracker" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Onboarding Checklist</h3>
              <p className="text-xs text-gray-500 mt-0.5">Complete all required tasks within your first 30 days</p>
            </div>
            <div className="divide-y divide-gray-50">
              {onboardingChecklist.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    {item.done
                      ? <CheckCircle2 size={20} className="text-green-500" />
                      : <Circle size={20} className="text-gray-300" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${item.done ? "text-gray-400 line-through" : "text-gray-900"}`}>
                      {item.task}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400">{item.owner}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">Due: {item.dueDate}</span>
                    </div>
                  </div>
                  {item.link && (
                    <button className="text-xs text-brand hover:underline font-medium flex items-center gap-1">
                      <FileText size={12} />
                      {item.link}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "documents" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Document Upload Portal</h3>
                <p className="text-xs text-gray-500 mt-0.5">Submit all required documents online</p>
              </div>
              <button className="bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-brand-dark shadow-sm">
                Upload Document
              </button>
            </div>
            <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
              <p className="text-xs text-blue-700 font-medium">{verifiedDocs}/{requiredDocs.length} required documents verified — {pendingDocs} pending action</p>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">DOCUMENT</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">REQUIRED</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">STATUS</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">UPLOADED</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{doc.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${doc.required ? "text-red-500" : "text-gray-400"}`}>
                        {doc.required ? "Required" : "Optional"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <Badge status={doc.status} />
                        {doc.status === "rejected" && doc.reason && (
                          <p className="text-xs text-red-400 mt-0.5">{doc.reason}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{doc.uploadedDate || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {doc.uploadedDate && (
                          <button className="text-xs text-brand hover:underline font-medium">View</button>
                        )}
                        {doc.status === "rejected" && (
                          <button className="text-xs text-orange-500 hover:underline font-medium">Re-upload</button>
                        )}
                        {doc.status === "missing" && (
                          <button className="text-xs text-brand hover:underline font-medium">Upload</button>
                        )}
                        {doc.uploadedDate && (
                          <button className="text-xs text-red-400 hover:underline font-medium">Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  if (role === "it_admin") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t("pages.onboarding.itTitle", "IT Provisioning")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("pages.onboarding.itSubtitle", "Manage equipment and account setup for new hires")}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Pending Setup</p>
            <p className="text-2xl font-semibold text-orange-500">{totalHires - readyCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Ready</p>
            <p className="text-2xl font-semibold text-green-500">{readyCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total New Hires</p>
            <p className="text-2xl font-semibold text-gray-900">{totalHires}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">EMPLOYEE</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ROLE</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">START DATE</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">EQUIPMENT NEEDED</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">IT STATUS</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {newHiresData.map(h => (
                <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={h.avatar} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{h.name}</p>
                        <p className="text-xs text-gray-400">{h.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{h.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{h.startDate}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">Laptop, Badge, Accounts</td>
                  <td className="px-4 py-3">
                    <Badge status={h.itStatus === "ready" ? "ready" : "pending"} />
                  </td>
                  <td className="px-4 py-3">
                    {h.itStatus === "pending" ? (
                      <button onClick={() => setNewHiresData(prev => prev.map(item => item.id === h.id ? { ...item, itStatus: "ready" } : item))} className="text-xs bg-brand text-white px-3 py-1.5 rounded-lg hover:bg-brand-dark transition-colors shadow-sm">
                        Mark Ready
                      </button>
                    ) : (
                      <span className="text-xs text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t("pages.onboarding.trackerTitle", "Onboarding Tracker")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("pages.onboarding.trackerSubtitle", "Monitor new hire onboarding progress and task completion")}</p>
        </div>
        {role === "hr_manager" && (
          <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark shadow-sm">
            + Add New Hire
          </button>
        )}
      </div>

      {/* Stats - Now dynamic */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total New Hires</p>
          <p className="text-2xl font-semibold text-gray-900">{totalHires}</p>
          <p className="text-xs text-brand font-medium mt-1">Currently in onboarding</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Avg. Completion</p>
          <p className="text-2xl font-semibold text-gray-900">{avgProgress}%</p>
          <ProgressBar value={avgProgress} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Day 1 Ready</p>
          <p className="text-2xl font-semibold text-gray-900">{readyCount}/{totalHires}</p>
          <p className="text-xs text-orange-500 font-medium mt-1">{totalHires - readyCount} pending IT setup</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search new hires..."
          className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:border-brand shadow-sm"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">EMPLOYEE</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ROLE</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">START DATE</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">PROGRESS</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">IT STATUS</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8 text-gray-500 text-sm">No new hires found.</td></tr>
            ) : filtered.map(h => (
              <tr
                key={h.id}
                className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelected(h)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={h.avatar} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{h.name}</p>
                      <p className="text-xs text-gray-400">{h.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{h.role}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{h.startDate}</td>
                <td className="px-4 py-3 w-48">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700">{h.progress}%</span>
                    <span className="text-[10px] text-gray-400 font-medium">{h.tasks?.done || 0}/{h.tasks?.total || 20} tasks</span>
                  </div>
                  <ProgressBar value={h.progress} />
                </td>
                <td className="px-4 py-3">
                  <Badge status={h.itStatus === "ready" ? "ready" : "pending"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(h) }}
                      className="text-xs text-brand hover:underline font-bold"
                    >
                      View
                    </button>
                    {h.progress < 100 && (
                      <button
                        onClick={e => e.stopPropagation()}
                        className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-md hover:bg-orange-100 flex items-center gap-1 font-medium transition-colors"
                      >
                        <Bell size={11} /> Remind
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-4 text-[11px] text-gray-500 font-medium bg-gray-50/50">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 shadow-sm" />80%+ Complete</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 shadow-sm" />50-79%</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400 shadow-sm" />30-49%</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 shadow-sm" />&lt;30%</span>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <Avatar initials={selected.avatar} size="lg" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                  <p className="text-sm text-brand font-medium">{selected.role} <span className="text-gray-400 font-normal">· Started {selected.startDate}</span></p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-900 bg-white p-2 rounded-full shadow-sm border border-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                    <span>Onboarding Progress</span>
                    <span className="text-brand">{selected.progress}% ({selected.tasks?.done || 0}/{selected.tasks?.total || 20} tasks)</span>
                  </div>
                  <ProgressBar value={selected.progress} />
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">IT Setup</span>
                  <Badge status={selected.itStatus === "ready" ? "ready" : "pending"} />
                </div>
              </div>

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Required Tasks Checklist</h3>
              <div className="space-y-1 max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
                {onboardingChecklist.map(item => (
                  <div key={item.id} className="flex items-start gap-3 py-2.5 px-3 hover:bg-gray-50 rounded-lg transition-colors group">
                    {item.done
                      ? <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                      : <Circle size={16} className="text-gray-300 mt-0.5 group-hover:text-gray-400" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${item.done ? "text-gray-400 line-through" : "text-gray-900"}`}>
                        {item.task}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.owner} · Due: <span className={item.done ? "" : "text-orange-500 font-medium"}>{item.dueDate}</span></p>
                    </div>
                    {item.link && (
                      <button className="text-[11px] bg-brand/10 text-brand px-2 py-1 rounded hover:bg-brand hover:text-white font-medium transition-colors">
                        Open Link
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-2xl">
              <button onClick={() => setSelected(null)} className="flex-1 border border-gray-200 text-gray-700 bg-white py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                Close Details
              </button>
              <button className="flex-1 bg-orange-50 text-orange-600 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors flex items-center justify-center gap-2 shadow-sm border border-orange-100">
                <Bell size={16} /> Send Email Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
