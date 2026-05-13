import { useState } from "react"
import { Search, X, Calendar, Send, Settings, Code, FileText, UserCheck, ChevronRight, MessageSquare, ClipboardCheck, Clock, MapPin, Trash2, AlertTriangle, PartyPopper } from "lucide-react"
import Avatar from "../components/Avatar"
import { useData } from "../context"
import { findRoomConflict } from "../utils/interviewScheduling"
import confetti from "canvas-confetti"

export default function Recruitment({ role }) {
  // LỖI NẰM Ở ĐÂY: Đã bổ sung interviewsData vào để không bị lỗi undefined nữa!
  const { candidatesData, setCandidatesData, interviewsData, setInterviewsData, newHiresData, setNewHiresData } = useData()
  
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [selectedCV, setSelectedCV] = useState(null)
  const [hmNote, setHmNote] = useState("")
  const [activeKit, setActiveKit] = useState(null)

  const [scheduleModal, setScheduleModal] = useState({ isOpen: false, candidate: null, prevStatus: null })
  const [scheduleForm, setScheduleForm] = useState({ date: new Date().toISOString().split('T')[0], time: "14:00", room: "Room 1" })

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: null, type: "danger" })
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: "", message: "", type: "success" })

  const departmentScope = role === "hiring_manager" ? "Engineering" : null
  const departments = departmentScope ? [departmentScope] : ["all", "Engineering", "BOS", "Design", "Product", "Marketing", "HR"]

  const getPipelineColumns = () => {
    const baseColumns = [
      { key: "screened", label: "Screened / HM Review", dot: "#3B82F6", color: "bg-blue-100 text-blue-600" },
      { key: "interview", label: "Interviewing", dot: "#8B5CF6", color: "bg-purple-100 text-purple-600" },
      { key: "offered", label: "Offered", dot: "#F59E0B", color: "bg-amber-100 text-amber-600" }
    ];
    const effectiveDept = departmentScope || deptFilter
    if (effectiveDept === "Engineering") {
      const techColumns = [...baseColumns];
      techColumns.splice(1, 0, { key: "tech_test", label: "Technical Test", dot: "#6366F1", color: "bg-indigo-100 text-indigo-600", isSpecial: true });
      return techColumns;
    }
    return baseColumns;
  }

  const activeColumns = getPipelineColumns();

  const getCandidateInterview = (candidate) => interviewsData.find(iv => (iv.candidateId === candidate.id || iv.candidate === candidate.name) && ["scheduled", "in_progress"].includes(iv.status))

  const filtered = candidatesData.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
    const effectiveDept = departmentScope || deptFilter
    const matchDept = effectiveDept === "all" || c.department === effectiveDept
    return matchSearch && matchDept && c.status !== "applied" && c.status !== "rejected" && c.status !== "hired"
  })

  const getByStatus = (status) => filtered.filter(c => c.status === status)

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("cardId", id)
    setTimeout(() => { e.target.style.opacity = "0.5" }, 0)
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    const id = parseInt(e.dataTransfer.getData("cardId"))
    const candidate = candidatesData.find(c => c.id === id)

    if (!candidate || candidate.status === newStatus) return; 

    if (newStatus === "interview") {
      setScheduleModal({ isOpen: true, candidate, prevStatus: candidate.status })
      return;
    }

    if (candidate.status === "interview" && newStatus !== "interview") {
      setInterviewsData(prev => prev.filter(iv => (iv.candidateId !== candidate.id && iv.candidate !== candidate.name) || !["scheduled", "in_progress"].includes(iv.status)))
    }

    setCandidatesData(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
  }

  const handleHire = (e, candidate) => {
    e.stopPropagation()
    setConfirmDialog({
      isOpen: true,
      type: "success",
      title: "Confirm Hire",
      message: `Are you sure you want to officially hire ${candidate.name}? They will be moved to the Onboarding module.`,
      onConfirm: () => {
        setCandidatesData(prev => prev.map(c => c.id === candidate.id ? { ...c, status: "hired" } : c))
        if (!newHiresData.find(h => h.sourceCandidateId === candidate.id || h.candidateId === candidate.id || h.name === candidate.name)) {
          const nextId = Math.max(0, ...newHiresData.map(h => Number(h.id) || 0)) + 1
          const newHire = {
            id: nextId, sourceCandidateId: candidate.id, candidateId: candidate.id, name: candidate.name, role: candidate.role, department: candidate.department,
            startDate: "Upcoming", progress: 0, itStatus: "pending", avatar: candidate.avatar, tasks: { done: 0, total: 20 }
          }
          setNewHiresData(prev => [newHire, ...prev])
        }
        setConfirmDialog({ isOpen: false })
        setAlertDialog({ isOpen: true, type: "success", title: "Candidate Hired!", message: `Successfully hired ${candidate.name} and synced to Onboarding.` })
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10B981', '#3B82F6', '#F59E0B'] });
      }
    })
  }

  const handleReject = (e, id) => {
    e.stopPropagation()
    setConfirmDialog({
      isOpen: true,
      type: "danger",
      title: "Reject Candidate",
      message: "Are you sure you want to reject this candidate? They will be permanently removed from the active pipeline.",
      onConfirm: () => {
        setCandidatesData(prev => prev.map(c => c.id === id ? { ...c, status: "rejected" } : c))
        setConfirmDialog({ isOpen: false })
      }
    })
  }

  const handleConfirmSchedule = () => {
    const { candidate } = scheduleModal;
    
    const dateObj = new Date(scheduleForm.date);
    const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${daysArr[dateObj.getDay()]} ${monthsArr[dateObj.getMonth()]} ${dateObj.getDate()}`;

    const isConflict = findRoomConflict(interviewsData, { date: formattedDate, time: scheduleForm.time, room: scheduleForm.room });

    if (isConflict) {
      setAlertDialog({ 
        isOpen: true, type: "danger", title: "Room Conflict Detected", 
        message: `⚠️ ${scheduleForm.room} overlaps with ${isConflict.candidate} at ${isConflict.time} on ${formattedDate}. Please select a different room or time.` 
      })
      return; 
    }

    setCandidatesData(prev => prev.map(c => c.id === candidate.id ? { ...c, status: "interview" } : c))
    setInterviewsData(prev => {
      const newIv = {
        id: Math.max(0, ...prev.map(iv => Number(iv.id) || 0)) + 1, candidateId: candidate.id, candidate: candidate.name, role: candidate.role, department: candidate.department,
        date: formattedDate, time: scheduleForm.time, durationMins: 60, room: scheduleForm.room, status: "scheduled",
        color: candidate.department === 'Engineering' ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
      }
      return [...prev.filter(iv => (iv.candidateId !== candidate.id && iv.candidate !== candidate.name) || !["scheduled", "in_progress"].includes(iv.status)), newIv]
    })
    
    setScheduleModal({ isOpen: false, candidate: null, prevStatus: null })
  }

  const handleOpenCV = (candidate) => {
    setSelectedCV(candidate)
    setHmNote("Candidate has strong fundamental skills. Looking forward to the deep dive interview.")
    setActiveKit(null)
  }

  const getScoreStyle = (score) => {
    if (score >= 90) return "bg-green-100 text-green-700"
    if (score >= 80) return "bg-blue-100 text-blue-700"
    if (score >= 70) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-600"
  }

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">Recruitment Pipeline</h1>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm"><Settings size={10} /> {(departmentScope || deptFilter) === "Engineering" ? "Technical Flow" : "Standard Flow"}</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">{role === 'hiring_manager' ? 'Hiring Manager Workspace' : 'Recruitment Overview'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates in pipeline..." className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:border-brand shadow-sm"/>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {departments.map(d => (
            <button key={d} onClick={() => setDeptFilter(d)} disabled={Boolean(departmentScope)} className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors whitespace-nowrap shadow-sm disabled:cursor-not-allowed ${deptFilter === d || departmentScope === d ? "bg-brand text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-brand"}`}>
              {d === "Engineering" ? <span className="flex items-center gap-1.5"><Code size={14}/> Engineering</span> : d}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-4 h-[calc(100vh-240px)] min-h-[500px]`} style={{ gridTemplateColumns: `repeat(${activeColumns.length}, minmax(0, 1fr))` }}>
        {activeColumns.map(col => {
          const items = getByStatus(col.key)
          return (
            <div key={col.key} className={`rounded-xl border flex flex-col transition-all shadow-sm ${col.isSpecial ? "bg-indigo-50/40 border-indigo-100" : "bg-gray-50/80 border-gray-100"}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, col.key)}>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white/90 backdrop-blur-sm sticky top-0 z-10 rounded-t-xl">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: col.dot }} /><span className="text-sm font-bold text-gray-700">{col.label}</span></div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${col.color}`}>{items.length}</span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {items.length === 0 && (<div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center px-4">No candidates here</div>)}
                {items.map(c => {
                  const candidateInterview = getCandidateInterview(c)
                  return (
                  <div key={c.id} draggable onDragStart={(e) => handleDragStart(e, c.id)} onDragEnd={(e) => { e.target.style.opacity = "1" }} onClick={() => handleOpenCV(c)} className="bg-white rounded-xl border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:border-brand hover:shadow-md transition-all group relative overflow-hidden">
                    {col.isSpecial && <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-100 rounded-bl-full flex items-start justify-end p-1.5 text-indigo-600"><Code size={10}/></div>}
                    <div className="flex items-start gap-3">
                      <Avatar initials={c.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate group-hover:text-brand transition-colors">{c.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{c.role}</p>
                      </div>
                    </div>
                    {col.key === "interview" && candidateInterview && (
                      <div className="mt-3 rounded-lg bg-purple-50 border border-purple-100 px-3 py-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-purple-700 truncate">{candidateInterview.date} · {candidateInterview.time}</p>
                          <p className="text-[10px] text-purple-500 truncate">{candidateInterview.room}</p>
                        </div>
                        {candidateInterview.status === "in_progress" && (
                          <span className="flex h-2.5 w-2.5 relative flex-shrink-0" title="Interview in progress">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${getScoreStyle(c.aiScore)}`}>AI {c.aiScore}%</span>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={e => { e.stopPropagation(); handleOpenCV(c); }} className="p-1.5 bg-gray-50 text-gray-600 rounded hover:bg-gray-100" title="View CV"><FileText size={12} /></button>
                        {c.status !== "interview" && c.status !== "offered" && (
                          <button onClick={e => { e.stopPropagation(); setScheduleModal({ isOpen: true, candidate: c, prevStatus: c.status }); }} className="p-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100" title="Schedule Interview"><Calendar size={12} /></button>
                        )}
                        {c.status === "offered" && (
                          <button onClick={(e) => handleHire(e, c)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100" title="Mark as Hired & Move to Onboarding"><UserCheck size={12} /></button>
                        )}
                        <button onClick={(e) => handleReject(e, c.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject Candidate"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {scheduleModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[55] backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-brand text-white flex items-center justify-between">
              <div className="flex items-center gap-2"><Calendar size={18} /><h3 className="font-bold text-lg">Schedule Interview</h3></div>
              <button onClick={() => setScheduleModal({ isOpen: false, candidate: null, prevStatus: null })} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                <Avatar initials={scheduleModal.candidate?.avatar} size="md" />
                <div><p className="text-sm font-bold text-brand">{scheduleModal.candidate?.name}</p><p className="text-xs text-blue-700">{scheduleModal.candidate?.role}</p></div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Select Date</label>
                  <input type="date" value={scheduleForm.date} onChange={e => setScheduleForm({...scheduleForm, date: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Clock size={12}/> Time</label>
                    <select value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none">
                      {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map(t => (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MapPin size={12}/> Room</label>
                    <select value={scheduleForm.room} onChange={e => setScheduleForm({...scheduleForm, room: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none">
                      <option value="Room 1">Room 1 (Large)</option><option value="Room 2">Room 2 (Small)</option><option value="Online (Teams)">Online</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setScheduleModal({ isOpen: false, candidate: null, prevStatus: null })} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button onClick={handleConfirmSchedule} className="flex-1 px-4 py-2 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark flex items-center justify-center gap-2"><Send size={14} /> Schedule & Sync</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${confirmDialog.type === 'danger' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'}`}>
              {confirmDialog.type === 'danger' ? <AlertTriangle size={24} /> : <UserCheck size={24} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-sm text-gray-500 mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDialog({ isOpen: false })} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDialog.onConfirm} className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-bold ${confirmDialog.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {alertDialog.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${alertDialog.type === 'danger' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'}`}>
              {alertDialog.type === 'danger' ? <AlertTriangle size={24} /> : <PartyPopper size={24} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{alertDialog.title}</h3>
            <p className="text-sm text-gray-500 mb-6">{alertDialog.message}</p>
            <button onClick={() => setAlertDialog({ isOpen: false })} className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black">Okay</button>
          </div>
        </div>
      )}

      {selectedCV && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-sm" onClick={() => setSelectedCV(null)}>
          <div className="bg-white w-[90%] max-w-6xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <Avatar initials={selectedCV.avatar} size="md" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedCV.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">{selectedCV.role} <ChevronRight size={12} /> <span className="font-bold text-brand uppercase">{selectedCV.status}</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedCV(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 bg-gray-100 p-6 overflow-y-auto border-r border-gray-200">
                <div className="bg-white min-h-[1000px] shadow-sm rounded-lg p-10 flex flex-col items-center border border-gray-200 relative">
                  <div className="absolute top-4 right-4 text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded border">CV_ORIGINAL.PDF</div>
                  <FileText size={64} className="text-gray-200 mt-20" />
                  <div className="w-full mt-10 space-y-4">
                    <div className="h-4 bg-gray-50 w-3/4 rounded"></div><div className="h-3 bg-gray-50 w-1/2 rounded"></div>
                    <div className="h-px bg-gray-100 w-full my-6"></div>
                    {[...Array(8)].map((_, i) => (<div key={i} className="space-y-2"><div className="h-2.5 bg-gray-50 w-full rounded"></div><div className="h-2.5 bg-gray-50 w-[90%] rounded"></div></div>))}
                  </div>
                </div>
              </div>

              <div className="w-1/2 bg-white overflow-y-auto flex flex-col">
                <div className="p-8 space-y-8 flex-1">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><MessageSquare size={14} /> HM Evaluation Notes</h3>
                    <div className={`p-4 rounded-xl border ${role === 'hiring_manager' ? 'border-brand/30 bg-brand/5' : 'border-gray-100 bg-gray-50'}`}>
                      {role === 'hiring_manager' ? (
                        <div className="space-y-3">
                          <textarea value={hmNote} onChange={(e) => setHmNote(e.target.value)} placeholder="Type your technical evaluation here..." className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 leading-relaxed min-h-[100px] resize-none" />
                          <div className="flex justify-end"><button className="text-[11px] bg-brand text-white px-3 py-1 rounded-md font-bold hover:bg-brand-dark transition-all">Save Note</button></div>
                        </div>
                      ) : (<p className="text-sm text-gray-600 italic">"{hmNote}"</p>)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><ClipboardCheck size={14} /> Interview Kit & Tooling</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setActiveKit(activeKit === 'eval' ? null : 'eval')} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${activeKit === 'eval' ? 'border-brand bg-brand/10 shadow-sm' : 'border-gray-100 hover:border-brand/50'}`}>
                        <ClipboardCheck size={24} className={activeKit === 'eval' ? 'text-brand' : 'text-gray-400'} /><span className="text-xs font-bold text-gray-700">Evaluation Form</span>
                      </button>
                      <button onClick={() => setActiveKit(activeKit === 'questions' ? null : 'questions')} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${activeKit === 'questions' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-gray-100 hover:border-purple-400'}`}>
                        <Code size={24} className={activeKit === 'questions' ? 'text-purple-600' : 'text-gray-400'} /><span className="text-xs font-bold text-gray-700">Tech Questions</span>
                      </button>
                    </div>

                    {activeKit === 'eval' && (
                      <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in duration-300">
                        <h4 className="text-xs font-bold text-gray-900 mb-4">Live Evaluation (1-5 Scale)</h4>
                        <div className="space-y-4">
                          {['Culture Fit', 'Technical Depth', 'System Design', 'Communication'].map(item => (
                            <div key={item} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">{item}</span>
                              <div className="flex gap-1">{[1, 2, 3, 4, 5].map(n => (<div key={n} className={`w-6 h-6 rounded border flex items-center justify-center text-[10px] cursor-pointer hover:bg-brand hover:text-white transition-colors ${n === 4 ? 'bg-brand text-white' : 'bg-white text-gray-400'}`}>{n}</div>))}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeKit === 'questions' && (
                      <div className="mt-4 p-5 bg-purple-50 rounded-xl border border-purple-100 animate-in fade-in duration-300">
                        <h4 className="text-xs font-bold text-purple-900 mb-4">Recommended Questions</h4>
                        <ul className="space-y-3">
                          <li className="text-xs text-purple-800 flex gap-2"><span className="font-bold">1.</span> Explain the difference between SQL and NoSQL in this architecture.</li>
                          <li className="text-xs text-purple-800 flex gap-2"><span className="font-bold">2.</span> How would you handle a sudden traffic spike in the current system?</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}