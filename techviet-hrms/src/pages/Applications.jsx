import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, Info, FileText, X, Send, UserCheck, CheckCircle2, XCircle } from "lucide-react"
import Avatar from "../components/Avatar"
import { useData, useLanguage } from "../context"

export default function Applications() {
  const { candidatesData, setCandidatesData } = useData()
  const { t } = useLanguage()
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCV, setSelectedCV] = useState(null)
  
  // State quản lý việc tích chọn ứng viên (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState([])

  const departments = ["all", "Engineering", "BOS", "Design", "Product", "Marketing", "HR"]
  const itemsPerPage = 10

  const realFiltered = candidatesData.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === "all" || c.department === deptFilter
    return matchSearch && matchDept
  })

  const totalItems = realFiltered.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const safePage = currentPage > totalPages ? totalPages : currentPage

  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayItems = realFiltered.slice(startIndex, endIndex).map(c => ({ ...c, uniqueId: String(c.id) }));

  // Logic xử lý Checkbox Bulk Action
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(displayItems.map(c => c.uniqueId));
    } else {
      setSelectedIds([]);
    }
  }

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  }

  // Reset selection khi đổi trang hoặc filter để tránh lỗi data
  const handleFilterChange = (action, value) => {
    if (action === 'search') setSearch(value);
    if (action === 'dept') setDeptFilter(value);
    if (action === 'page') setCurrentPage(value);
    setSelectedIds([]); // Xóa chọn khi luồng data thay đổi
  }

  const getScoreStyle = (score) => {
    if (score >= 90) return "bg-green-100 text-green-700"
    if (score >= 80) return "bg-blue-100 text-blue-700"
    if (score >= 70) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-600"
  }

  const getRouting = (score) => {
    if (score >= 80) return { label: "Auto-shortlisted", style: "text-green-600 font-semibold" }
    if (score >= 50) return { label: "Manual review", style: "text-yellow-600 font-medium" }
    return { label: "Suggested rejection", style: "text-red-500 font-medium" }
  }

  const updateCandidateStatus = (ids, status) => {
    const idSet = new Set(ids.map(id => Number(id)))
    setCandidatesData(prev => prev.map(candidate => (
      idSet.has(candidate.id) ? { ...candidate, status } : candidate
    )))
    if (selectedCV && idSet.has(selectedCV.id)) {
      setSelectedCV(prev => prev ? { ...prev, status } : prev)
    }
    setSelectedIds([])
  }

  const routeCandidate = (candidate, status) => {
    updateCandidateStatus([candidate.id], status)
  }

  const renderPagination = () => {
    if (totalPages <= 5) {
      return [...Array(totalPages)].map((_, i) => (
        <button key={i + 1} onClick={() => handleFilterChange('page', i + 1)} className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center transition-colors ${safePage === i + 1 ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-200"}`}>
          {i + 1}
        </button>
      ));
    }
    return (
      <>
        {[1, 2, 3].map(p => (
          <button key={p} onClick={() => handleFilterChange('page', p)} className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center transition-colors ${safePage === p ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-200"}`}>{p}</button>
        ))}
        <span className="text-gray-400 text-xs px-1">...</span>
        <button onClick={() => handleFilterChange('page', totalPages)} className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center transition-colors ${safePage === totalPages ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-200"}`}>
          {totalPages}
        </button>
      </>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t("pages.applications.title", "Applications Box")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("pages.applications.subtitle", "Review and route candidates from all ATS sources")}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> {t("pages.applications.aiActive", "AI Screening Active")}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => handleFilterChange('search', e.target.value)}
            placeholder="Search candidate or role..."
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:border-brand shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {departments.map(d => (
            <button key={d} onClick={() => handleFilterChange('dept', d)}
              className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors whitespace-nowrap shadow-sm ${deptFilter === d ? "bg-brand text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-brand"}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
                    checked={displayItems.length > 0 && selectedIds.length === displayItems.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 px-2 py-3">CANDIDATE</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">APPLIED ROLE</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">DEPARTMENT</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">AI MATCH</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                  <div className="flex items-center gap-1 group relative cursor-help">
                    ROUTING <Info size={14} className="text-gray-400" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-[11px] p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 font-normal leading-relaxed">
                      <strong>AI Rules:</strong><br/>
                      &gt;80%: Auto-shortlisted + HM notified<br/>
                      50-79%: HR manual review<br/>
                      &lt;50%: Suggested rejection queue; HR approval required
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">NEXT ACTION</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.length > 0 ? (
                displayItems.map((c) => {
                  const routing = getRouting(c.aiScore)
                  const isSelected = selectedIds.includes(c.uniqueId)
                  return (
                    <tr key={c.uniqueId} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}>
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(e, c.uniqueId)}
                        />
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={c.avatar} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 hover:text-brand cursor-pointer" onClick={() => setSelectedCV(c)}>{c.name}</p>
                            <p className="text-xs text-gray-400">{c.university} · {c.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c.role}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c.department}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getScoreStyle(c.aiScore)}`}>
                          {c.aiScore}% Match
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${routing.style} flex items-center gap-1.5`}>
                          {c.aiScore >= 80 ? <CheckCircle2 size={14}/> : c.aiScore < 50 ? <XCircle size={14}/> : <Info size={14}/>}
                          {routing.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedCV(c)} className="text-xs text-gray-600 hover:text-brand bg-white border border-gray-200 px-2.5 py-1.5 rounded-md hover:border-brand transition-colors font-medium">
                            View CV
                          </button>
                          
                          {c.aiScore >= 80 && (
                            <>
                              <button onClick={() => routeCandidate(c, "screened")} className="text-xs text-white bg-brand hover:bg-brand-dark px-2.5 py-1.5 rounded-md transition-colors font-medium flex items-center gap-1">
                                <Send size={12} /> HM Review
                              </button>
                              <button onClick={() => routeCandidate(c, "tech_test")} className="text-xs text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1.5 rounded-md transition-colors font-medium">
                                Send Test
                              </button>
                            </>
                          )}
                          
                          {c.aiScore >= 50 && c.aiScore < 80 && (
                            <>
                              <button onClick={() => routeCandidate(c, "screened")} className="text-xs text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 px-2.5 py-1.5 rounded-md transition-colors font-medium flex items-center gap-1">
                                <UserCheck size={12} /> Shortlist
                              </button>
                              <button onClick={() => routeCandidate(c, "rejected")} className="text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-md transition-colors font-medium">
                                Move to Rejection Queue
                              </button>
                            </>
                          )}

                          {c.aiScore < 50 && (
                            <button onClick={() => routeCandidate(c, "rejected")} className="text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-md transition-colors font-medium flex items-center gap-1">
                              <Send size={12} /> Review Rejection
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-gray-400 text-sm italic">
                    No candidates found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium text-gray-900">{totalItems === 0 ? 0 : startIndex + 1}</span> to <span className="font-medium text-gray-900">{endIndex}</span> of <span className="font-medium text-gray-900">{totalItems}</span> applications
          </p>
          <div className="flex items-center gap-1">
            <button disabled={safePage === 1} onClick={() => handleFilterChange('page', safePage - 1)} className="p-1 rounded-md text-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            {renderPagination()}
            <button disabled={safePage === totalPages} onClick={() => handleFilterChange('page', safePage + 1)} className="p-1 rounded-md text-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-5 z-40 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-brand rounded-full flex items-center justify-center text-xs font-bold">
              {selectedIds.length}
            </span>
            <span className="text-sm font-medium text-gray-300">Selected</span>
          </div>
          
          <div className="w-px h-5 bg-gray-700"></div>
          
          <button onClick={() => updateCandidateStatus(selectedIds, "screened")} className="text-sm font-medium hover:text-brand-light flex items-center gap-1.5 transition-colors">
            <Send size={14} /> Send to HM
          </button>
          <button onClick={() => updateCandidateStatus(selectedIds, "tech_test")} className="text-sm font-medium hover:text-purple-300 flex items-center gap-1.5 transition-colors">
            <FileText size={14} /> Send Tests
          </button>
          <button onClick={() => updateCandidateStatus(selectedIds, "rejected")} className="text-sm font-medium hover:text-red-400 flex items-center gap-1.5 transition-colors">
            <XCircle size={14} /> Send to Rejection Queue
          </button>
          
          <div className="w-px h-5 bg-gray-700"></div>
          
          <button onClick={() => setSelectedIds([])} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors" title="Clear selection">
            <X size={16} />
          </button>
        </div>
      )}

      {/* CV Viewer Side Drawer (Giữ nguyên) */}
      {selectedCV && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end transition-opacity backdrop-blur-sm" onClick={() => setSelectedCV(null)}>
          <div 
            className="bg-white w-3/4 max-w-5xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedCV.name}</h2>
                <p className="text-sm text-gray-500">Applied for {selectedCV.role} · {selectedCV.appliedDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreStyle(selectedCV.aiScore)}`}>
                  {selectedCV.aiScore}% Match
                </span>
                <button onClick={() => setSelectedCV(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Split Screen Content */}
            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 bg-gray-200 p-6 overflow-y-auto border-r border-gray-200">
                <div className="bg-white min-h-[800px] shadow-sm rounded-lg p-10 flex flex-col items-center justify-center border border-gray-300 relative group">
                  <div className="absolute top-4 right-4 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Page 1 of 2</div>
                  <FileText size={64} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">Original CV Document</p>
                  <p className="text-xs text-gray-400 mt-1">CV_{selectedCV.name.replace(/\s+/g, '_')}.pdf</p>
                  <div className="w-full mt-12 space-y-4 opacity-30">
                    <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
                    <div className="h-3 bg-gray-300 w-1/4 rounded"></div>
                    <div className="h-px bg-gray-300 w-full my-4"></div>
                    <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
                    <div className="h-3 bg-gray-300 w-full rounded"></div>
                    <div className="h-3 bg-gray-300 w-full rounded"></div>
                    <div className="h-3 bg-gray-300 w-5/6 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 bg-white overflow-y-auto p-8 space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">AI Sourcing Summary</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-brand mb-2">Recommendation</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Candidate possesses strong technical foundation from {selectedCV.university}. Experience level aligns well with the {selectedCV.role} requirements. Recommended for immediate technical screening.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Extracted Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {["React.js", "Node.js", "PostgreSQL", "AWS", "Agile/Scrum", "System Design"].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                        {skill}
                      </span>
                    ))}
                    <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 line-through" title="Missing from CV">
                      GraphQL
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Experience Match</h3>
                  <div className="space-y-4">
                    <div className="relative pl-6 border-l-2 border-brand">
                      <div className="absolute w-3 h-3 bg-brand rounded-full -left-[7px] top-1"></div>
                      <h4 className="text-sm font-semibold text-gray-900">Software Engineer</h4>
                      <p className="text-xs text-gray-500">Tech Solutions Inc. · 2023 - Present</p>
                      <p className="text-sm text-gray-600 mt-2">Developed and maintained scalable microservices. Improved system performance by 30%.</p>
                    </div>
                    <div className="relative pl-6 border-l-2 border-gray-200">
                      <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1"></div>
                      <h4 className="text-sm font-semibold text-gray-900">Junior Developer</h4>
                      <p className="text-xs text-gray-500">StartUp XYZ · 2021 - 2023</p>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex gap-3">
                  <button onClick={() => routeCandidate(selectedCV, "screened")} className="flex-1 bg-brand text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                    Forward to Manager
                  </button>
                  <button onClick={() => routeCandidate(selectedCV, "tech_test")} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Schedule Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
