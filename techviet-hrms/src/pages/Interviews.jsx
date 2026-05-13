import { useState } from "react"
import { ChevronLeft, ChevronRight, Video, ClipboardCheck, Users, MapPin, Printer, Filter, Edit3, Trash2, Clock, Send, AlertTriangle, X } from "lucide-react"
import { useData } from "../context"
import { findRoomConflict } from "../utils/interviewScheduling"

const days = [
  { label: "MON", date: 4 },
  { label: "TUE", date: 5 },
  { label: "WED", date: 6 },
  { label: "THU", date: 7 },
  { label: "FRI", date: 8, today: true },
]

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
const demoNow = { slot: "09:00", label: "09:30" }

const toIsoDate = (displayDate) => {
  const [, month, day] = displayDate.split(" ")
  const monthMap = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" }
  return `2026-${monthMap[month] || "05"}-${String(day).padStart(2, "0")}`
}

export default function Interviews({ role }) {
  const { interviewsData, setInterviewsData, setCandidatesData } = useData()

  const [selected, setSelected] = useState(null)
  const [deptFilter, setDeptFilter] = useState("all")
  const [actionView, setActionView] = useState(null) 
  
  const [editForm, setEditForm] = useState({ date: "", time: "", room: "" })

  const filteredInterviews = interviewsData.filter(iv => {
    if (role === "hiring_manager") return iv.department === "Engineering"
    return deptFilter === "all" || iv.department === deptFilter
  })

  const getInterviewsForSlot = (date, time) => {
    return filteredInterviews.filter(iv => {
      const ivDate = parseInt(iv.date.split(" ")[2])
      return ivDate === date && iv.time === time
    })
  }

  const handleOpenModal = (iv) => {
    setSelected(iv)
    setEditForm({ date: iv.date, time: iv.time, room: iv.room })
    setActionView(null)
  }

  const handleReschedule = () => {
    // Tự động dịch định dạng nếu người dùng đổi ngày
    let formattedDate = editForm.date;
    if (editForm.date.includes("-")) {
      const dateObj = new Date(editForm.date);
      const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      formattedDate = `${daysArr[dateObj.getDay()]} ${monthsArr[dateObj.getMonth()]} ${dateObj.getDate()}`;
    }

    const isConflict = findRoomConflict(interviewsData, { date: formattedDate, time: editForm.time, room: editForm.room }, selected.id);

    if (isConflict) {
      alert(`⚠️ CONFLICT DETECTED: ${editForm.room} is already booked by ${isConflict.candidate} at ${editForm.time} on ${formattedDate}. Please choose a different room or time.`);
      return;
    }

    const updatedIv = { ...selected, ...editForm, date: formattedDate };
    setInterviewsData(prev => prev.map(iv => iv.id === selected.id ? updatedIv : iv))
    setCandidatesData(prev => prev.map(c => c.id === selected.candidateId || c.name === selected.candidate ? { ...c, status: "interview" } : c))
    setSelected(updatedIv)
    setActionView(null)
  }

  const handleCancelInterview = () => {
    if(window.confirm("Cancel this interview? The candidate will be moved back to the 'Screened' stage in the Recruitment Pipeline.")) {
      setInterviewsData(prev => prev.filter(iv => iv.id !== selected.id))
      const hasOtherActiveSession = interviewsData.some(iv => iv.id !== selected.id && (iv.candidateId === selected.candidateId || iv.candidate === selected.candidate) && ["scheduled", "in_progress"].includes(iv.status))
      if (!hasOtherActiveSession) {
        setCandidatesData(prev => prev.map(c => c.id === selected.candidateId || c.name === selected.candidate ? { ...c, status: "screened" } : c))
      }
      setSelected(null)
    }
  }

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Interviews Calendar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{role === 'hiring_manager' ? "Your personalized interview schedule" : "Company-wide interview coordination"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm">
            <Printer size={16} /> Print Kits
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
            <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"><ChevronLeft size={16}/></button>
            <span className="text-sm font-bold px-2 text-gray-700">May 4 – 8, 2026</span>
            <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"><ChevronRight size={16}/></button>
          </div>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={role === 'hiring_manager' ? "Engineering" : deptFilter} onChange={(e) => setDeptFilter(e.target.value)} disabled={role === 'hiring_manager'} className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-gray-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              <option value="all">All Departments</option><option value="Engineering">Engineering</option><option value="BOS">BOS</option><option value="Product">Product</option>
              <option value="Design">Design</option><option value="Marketing">Marketing</option><option value="HR">HR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
        <div className="grid border-b border-gray-100 bg-gray-50/50" style={{ gridTemplateColumns: "100px repeat(5, 1fr)" }}>
          <div className="p-4"></div>
          {days.map(d => (
            <div key={d.date} className={`p-4 text-center border-l border-gray-100 ${d.today ? "bg-brand/5" : ""}`}>
              <p className={`text-[10px] font-bold tracking-widest ${d.today ? "text-brand" : "text-gray-400"}`}>{d.label}</p>
              <p className={`text-xl font-black mt-1 ${d.today ? "text-brand" : "text-gray-700"}`}>{d.date}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {timeSlots.map(time => (
            <div key={time} className="grid border-b border-gray-50 last:border-0 min-h-[80px] relative" style={{ gridTemplateColumns: "100px repeat(5, 1fr)" }}>
              {time === demoNow.slot && (
                <div className="absolute left-[100px] right-0 top-1/2 z-20 pointer-events-none flex items-center">
                  <span className="ml-2 -translate-y-1/2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm tracking-wider">NOW {demoNow.label}</span>
                  <div className="h-px bg-red-500 flex-1 shadow-[0_0_0_1px_rgba(239,68,68,0.12)]" />
                </div>
              )}
              <div className="p-4 text-right">
                <span className="text-xs font-bold text-gray-400">{time}</span>
              </div>
              {days.map(d => {
                const ivs = getInterviewsForSlot(d.date, time)
                return (
                  <div key={d.date} className={`p-2 border-l border-gray-50 relative gap-2 ${ivs.length > 1 ? "grid grid-cols-2 auto-rows-min" : "flex flex-col"} ${d.today ? "bg-brand/[0.02]" : ""}`}>
                    {ivs.map(iv => {
                      // BỘ QUÉT XUNG ĐỘT (CONFLICT SCANNER)
                      // Kiểm tra xem trong cùng ô giờ này, có ai khác đang chiếm chung phòng không
                      const isConflict = ivs.some(otherIv => otherIv.id !== iv.id && otherIv.room === iv.room);
                      
                      return (
                        <button 
                          key={iv.id}
                          onClick={() => handleOpenModal(iv)}
                          className={`w-full min-w-0 text-left ${ivs.length > 1 ? "p-2" : "p-2.5"} rounded-xl transition-all hover:scale-[1.02] hover:shadow-md border-l-4 flex flex-col justify-between shadow-sm ${
                            isConflict ? "bg-red-50 border-red-500 text-red-900 ring-1 ring-red-500/20" : `${iv.color} border-current/20`
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold text-[11px] uppercase tracking-tight flex items-center gap-1 ${isConflict ? "text-red-600" : ""}`}>
                                {iv.time}
                                {isConflict && <AlertTriangle size={12} className="text-red-500 animate-pulse" />}
                              </span>
                              {iv.status === 'in_progress' && !isConflict && (
                                <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                              )}
                            </div>
                            <p className="font-bold text-sm leading-tight truncate">{iv.candidate}</p>
                            <p className={`text-[10px] opacity-80 font-medium truncate mt-0.5 ${isConflict ? "text-red-500" : ""}`}>{iv.role}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 mt-2 pt-2 border-t ${isConflict ? "border-red-200" : "border-black/5"}`}>
                             <MapPin size={10} className={isConflict ? "text-red-500" : ""} />
                             <span className={`text-[10px] font-bold truncate ${isConflict ? "text-red-600" : ""}`}>
                               {iv.room} {isConflict && "(Conflict)"}
                             </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative min-h-[400px]" onClick={e => e.stopPropagation()}>
            
            <div className={`p-6 ${selected.color.includes('bg-red') ? 'bg-red-50 text-red-900' : selected.color} flex items-center justify-between transition-colors duration-300`}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  {actionView === 'edit' ? <Edit3 size={24} /> : <Users size={24} />}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{actionView === 'edit' ? "Edit Schedule" : "Interview Session"}</h2>
                  <p className="text-xs font-medium opacity-90">{selected.candidate}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8">
              {!actionView && (
                <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Schedule</p>
                      <p className="text-sm font-bold text-gray-900">{selected.date} @ {selected.time}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><MapPin size={14}/> {selected.room}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pb-5 border-b border-gray-100">
                    <button onClick={() => setActionView('edit')} className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 flex items-center justify-center gap-2">
                      <Edit3 size={14}/> Reschedule
                    </button>
                    <button onClick={handleCancelInterview} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-2">
                      <Trash2 size={14}/> Cancel Session
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-brand hover:text-white transition-all group">
                      <ClipboardCheck size={16} className="text-gray-500 group-hover:text-white transition-colors"/> Open Kit
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-brand text-white py-3 rounded-xl text-xs font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand/20">
                      <Video size={16}/> Join Virtual
                    </button>
                  </div>
                </div>
              )}

              {actionView === 'edit' && (
                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Change Date</label>
                      {/* Đã đồng bộ sang input Date Picker xịn */}
                      <input 
                        type="date" 
                        value={editForm.date.includes("-") ? editForm.date : toIsoDate(editForm.date)}
                        onChange={e => setEditForm({...editForm, date: e.target.value})} 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Clock size={12}/> Time</label>
                        <select value={editForm.time} onChange={e => setEditForm({...editForm, time: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand outline-none">
                          {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map(t => (<option key={t} value={t}>{t}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MapPin size={12}/> Room</label>
                        <select value={editForm.room} onChange={e => setEditForm({...editForm, room: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand outline-none">
                          <option value="Room 1">Room 1</option>
                          <option value="Room 2">Room 2</option>
                          <option value="Online (Teams)">Online</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button onClick={() => setActionView(null)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">Back</button>
                    <button onClick={handleReschedule} className="flex-1 px-4 py-2 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark flex items-center justify-center gap-2"><Send size={14} /> Update</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}