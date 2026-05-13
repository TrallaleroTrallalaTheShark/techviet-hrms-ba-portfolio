import { useState } from "react"
import { Search, Edit, Archive, X, Globe } from "lucide-react"
import Badge from "../components/Badge"
import StatCard from "../components/StatCard"
import { useData } from "../context"

export default function JobPostings({ role }) {
  const { jobPostingsData } = useData()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  
  // Quản lý trạng thái của Modal: type có thể là 'create', 'edit', hoặc 'view'
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null })

  const activePostings = jobPostingsData.filter(j => j.status === "active")
  const filtered = jobPostingsData.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || j.status === filter
    return matchSearch && matchFilter
  })

  const openModal = (type, data = null) => {
    setModalState({ isOpen: true, type, data })
  }

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Job Postings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all job openings</p>
        </div>
        {role === "hr_manager" && (
          <button
            onClick={() => openModal('create')}
            className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
          >
            + New Posting
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Active Postings" value={activePostings.length} />
        <StatCard label="Total Vacancies" value={jobPostingsData.reduce((sum, j) => sum + j.vacancies, 0)} />
        <StatCard label="Total Applicants" value={jobPostingsData.reduce((sum, j) => sum + j.applicants, 0)} />
        <StatCard label="Archived" value={jobPostingsData.filter(j => j.status === "archived").length} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or department..."
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:border-brand"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "active", "draft", "closed", "archived"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
                filter === f ? "bg-brand text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-brand"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">JOB TITLE</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">DEPARTMENT</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">STATUS</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">VACANCIES</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">DEADLINE</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">APPLICANTS</th>
              {role === "hr_manager" && (
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ACTIONS</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((job, i) => (
              <tr 
                key={job.id} 
                onClick={() => openModal('view', job)}
                className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-brand hover:underline">{job.title}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{job.department}</td>
                <td className="px-4 py-3"><Badge status={job.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-600">{job.vacancies} positions</td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-600">{job.deadline}</p>
                  <p className={`text-xs ${job.daysLeft <= 7 && job.daysLeft > 0 ? "text-red-500" : "text-gray-400"}`}>
                    {job.daysLeft > 0 ? `${job.daysLeft} days left` : "Expired"}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{job.applicants}</td>
                {role === "hr_manager" && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openModal('edit', job); }}
                        className="p-1.5 hover:bg-blue-100 rounded-lg text-gray-400 hover:text-brand transition-colors"
                        title="Edit Job"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); /* Logic archive sau này */ }}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Archive Job"
                      >
                        <Archive size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Showing {filtered.length} job postings</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full" />Active</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-300 rounded-full" />Draft</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" />Closed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-500 rounded-full" />Archived</span>
          </div>
        </div>
      </div>

      {/* Universal Modal cho View / Edit / Create */}
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {modalState.type === 'view' && "Job Description Details"}
                {modalState.type === 'edit' && "Edit Job Posting"}
                {modalState.type === 'create' && "Create New Job Posting"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* View Mode (Chỉ đọc) */}
            {modalState.type === 'view' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-brand">{modalState.data.title}</h3>
                  <p className="text-sm text-gray-500">{modalState.data.department} · {modalState.data.vacancies} Vacancies</p>
                </div>
                <div className="flex gap-2">
                  <Badge status={modalState.data.status} />
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                    Deadline: {modalState.data.deadline}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {modalState.data.description || "We are looking for a talented professional to join our team. The ideal candidate will have strong problem-solving skills, a collaborative mindset, and relevant industry experience. \n\nResponsibilities:\n- Manage daily operations\n- Collaborate with cross-functional teams\n- Drive continuous improvement (KAIZEN)"}
                  </p>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button onClick={closeModal} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Close
                  </button>
                  {role === "hr_manager" && (
                    <button 
                      onClick={() => openModal('edit', modalState.data)}
                      className="flex-1 bg-brand text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-dark"
                    >
                      Edit Posting
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Create / Edit Mode (Form nhập liệu) */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Job Title</label>
                    <input
                      defaultValue={modalState.data?.title || ""}
                      placeholder="e.g. Senior Data Analyst"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Department</label>
                    <input
                      defaultValue={modalState.data?.department || ""}
                      placeholder="e.g. BOS"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Headcount</label>
                    <input
                      defaultValue={modalState.data?.vacancies || ""}
                      type="number"
                      placeholder="e.g. 2"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Deadline</label>
                    <input
                      defaultValue={modalState.data?.deadline || ""}
                      placeholder="e.g. Jun 30, 2026"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Job Description</label>
                  <textarea
                    rows={10}
                    defaultValue={modalState.data?.description || ""}
                    placeholder="Describe the role and requirements..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none"
                  />
                </div>
                
                {/* Phase 2 scope note: external job board integration is deferred in BRD v1.2 */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start gap-3">
                  <div className="pt-0.5">
                    <input type="checkbox" id="sync" disabled className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand opacity-60" />
                  </div>
                  <div>
                    <label htmlFor="sync" className="text-sm font-medium text-slate-600 flex items-center gap-1.5 cursor-not-allowed">
                      <Globe size={14} /> Phase 2: Omnichannel Auto-Sync
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">External job board publishing (LinkedIn, TopCV, Indeed) is documented as Phase 2 and intentionally disabled for Phase 1 scope control.</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={closeModal}
                    className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-brand text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-dark"
                  >
                    {modalState.type === 'edit' ? 'Update Posting' : 'Create & Publish'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}