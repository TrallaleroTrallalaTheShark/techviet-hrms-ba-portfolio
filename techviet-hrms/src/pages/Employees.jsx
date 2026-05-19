import { useState, useRef, useEffect, useMemo } from "react"
import { Search, X, ZoomIn, ZoomOut, ChevronDown, ChevronUp, Mail, Phone, Lock, Building2, Monitor, TrendingUp } from "lucide-react"
import Avatar from "../components/Avatar"
import { ROLE_PROFILES } from "../rbac"
import { useLanguage } from "../context"

// MOCK DATA CƠ BẢN — đồng bộ với candidate/new hire/performance data
const baseEmployees = [
  { id: 1, name: "Nguyen Van Thanh", role: "Chief Executive Officer", department: "C-Suite", level: 1, managerId: null, avatar: "NT", status: "active", email: "thanh.nv@techviet.com", phone: "0901234567", salary: "$15,000", location: "Ho Chi Minh", employmentType: "Full-time", startDate: "2018-01-15" },
  { id: 2, name: "Nguyen Hoang Minh", role: "Chief Technology Officer", department: "Engineering", level: 2, managerId: 1, avatar: "NM", status: "active", email: "minh.nh@techviet.com", phone: "0901234568", salary: "$12,000", location: "Ho Chi Minh", employmentType: "Full-time", startDate: "2019-03-01" },
  { id: 3, name: "Tran Thi Lan", role: "Chief Operating Officer", department: "Operations", level: 2, managerId: 1, avatar: "TL", status: "on_leave", email: "lan.tt@techviet.com", phone: "0901234569", salary: "$11,500", location: "Hanoi", employmentType: "Full-time", startDate: "2019-05-20" },
  { id: 4, name: "Pham Quang Huy", role: "Engineering Manager", department: "Engineering", level: 3, managerId: 2, avatar: "PH", status: "active", email: "huy.pq@techviet.com", phone: "0901234570", salary: "$8,000", location: "Ho Chi Minh", employmentType: "Full-time", startDate: "2020-02-10" },
  { id: 5, name: "Vo Duc Kien", role: "Backend Engineering Manager", department: "Engineering", level: 3, managerId: 2, avatar: "VK", status: "active", email: "kien.vd@techviet.com", phone: "0901234571", salary: "$8,000", location: "Da Nang", employmentType: "Full-time", startDate: "2020-08-12" },
  { id: 6, name: "Bui Thi Mai", role: "Data Analytics Manager", department: "BOS", level: 3, managerId: 3, avatar: "BM", status: "active", email: "mai.bt@techviet.com", phone: "0901234572", salary: "$7,500", location: "Hanoi", employmentType: "Full-time", startDate: "2021-01-04" },
  { id: 7, name: "Nguyen Van Duc", role: "Backend Developer", department: "Engineering", level: 4, managerId: 5, avatar: "ND", status: "active", email: "duc.nv@techviet.com", phone: "0901234573", salary: "$3,500", location: "Da Nang", employmentType: "Full-time", startDate: "2022-03-14" },
  { id: 8, name: "Le Minh Quan", role: "Frontend Developer", department: "Engineering", level: 4, managerId: 4, avatar: "LM", status: "active", email: "quan.lm@techviet.com", phone: "0901234574", salary: "$3,500", location: "Ho Chi Minh", employmentType: "Full-time", startDate: "2022-04-20" },
  { id: 9, name: "Pham Thi Nhi", role: "UX Designer", department: "Design", level: 4, managerId: 3, avatar: "PN", status: "onboarding", email: "nhi.pt@techviet.com", phone: "0901234575", salary: "$3,000", location: "Ho Chi Minh", employmentType: "Probation", startDate: "2026-05-04" },
  { id: 10, name: "Vo Hoang Khai", role: "Product Manager", department: "Product", level: 4, managerId: 3, avatar: "VK", status: "active", email: "khai.vh@techviet.com", phone: "0901234576", salary: "$4,500", location: "Hanoi", employmentType: "Full-time", startDate: "2021-11-18" },
  { id: 11, name: "Tran Thi Huong", role: "Data Analyst", department: "BOS", level: 4, managerId: 6, avatar: "TH", status: "onboarding", email: "huong.tt@techviet.com", phone: "0901234577", salary: "$3,000", location: "Hanoi", employmentType: "Probation", startDate: "2026-05-04" },
  { id: 12, name: "Le Quoc An", role: "Data Analyst", department: "BOS", level: 4, managerId: 6, avatar: "LQ", status: "onboarding", email: "an.lq@techviet.com", phone: "0901234578", salary: "$3,000", location: "Hanoi", employmentType: "Probation", startDate: "2026-05-04" },
]

// KỸ THUẬT SCALING: TỰ ĐỘNG SINH THÊM NHÂN VIÊN ĐỂ DEMO ORG CHART KHI CÔNG TY LỚN DẦN
const generateMassiveData = () => {
  const data = baseEmployees.map(emp => ({ ...emp, employeeCode: `TV-${String(emp.id).padStart(4, "0")}` }))
  const managers = [4, 5, 6, 7, 8, 9, 10, 11, 12]
  const locations = ["Ho Chi Minh", "Hanoi", "Da Nang", "Remote"]

  for (let i = 13; i <= 206; i++) {
    const randomManager = managers[i % managers.length]
    const isEng = i % 2 === 0
    data.push({
      id: i,
      employeeCode: `TV-${String(i).padStart(4, "0")}`,
      name: `Staff Member ${i}`,
      role: isEng ? "Software Engineer" : "Business Analyst",
      department: isEng ? "Engineering" : "BOS",
      level: 5,
      managerId: randomManager,
      avatar: "SM",
      status: i % 15 === 0 ? "on_leave" : "active",
      email: `staff${i}@techviet.com`,
      phone: `0900${100000 + i}`,
      salary: "$2,000",
      location: locations[i % locations.length],
      employmentType: i % 7 === 0 ? "Contractor" : "Full-time",
      startDate: `202${i % 6}-0${(i % 9) + 1}-15`,
    })
  }
  return data
}

const employees = generateMassiveData()

const deptColors = {
  "C-Suite": "bg-purple-100 text-purple-700 border-purple-200",
  "Engineering": "bg-blue-100 text-blue-700 border-blue-200",
  "Operations": "bg-green-100 text-green-700 border-green-200",
  "BOS": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Design": "bg-pink-100 text-pink-700 border-pink-200",
  "Product": "bg-orange-100 text-orange-700 border-orange-200",
}

const findManager = (emp) => employees.find(e => e.id === emp.managerId)
const findChildren = (empId) => employees.filter(e => e.managerId === empId)

const canViewEmployee = (emp, role) => {
  if (role === "hr_manager" || role === "it_admin") return true
  if (role === "hiring_manager") return emp.department === ROLE_PROFILES.hiring_manager.department || emp.id === 2
  if (role === "new_employee") return emp.name === ROLE_PROFILES.new_employee.name || [1, 2, 3].includes(emp.id)
  return false
}

const canViewManagerInsight = (emp, role) => role === "hiring_manager" && emp.department === ROLE_PROFILES.hiring_manager.department

const getManagerChain = (emp) => {
  const chain = []
  let current = emp
  while (current?.managerId) {
    current = employees.find(e => e.id === current.managerId)
    if (current) chain.unshift(current)
  }
  return chain
}

function OrgNode({ emp, onSelect, searchQuery, isFocusRoot = false }) {
  const [isExpanded, setIsExpanded] = useState(emp.level < 2 || isFocusRoot)
  const [showAllReports, setShowAllReports] = useState(false)
  const children = findChildren(emp.id)
  const directReportLimit = 10
  const visibleChildren = showAllReports ? children : children.slice(0, directReportLimit)

  const hasSearch = searchQuery.trim().length > 0
  const isMatch = !hasSearch || emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.role.toLowerCase().includes(searchQuery.toLowerCase()) || emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
  const opacity = isMatch ? "opacity-100" : "opacity-35 grayscale"

  return (
    <div className={`flex flex-col items-center transition-opacity duration-300 ${opacity}`}>
      <div className="relative flex flex-col items-center">
        <button
          onClick={() => onSelect(emp)}
          className={`bg-white border-2 rounded-2xl p-4 w-48 hover:border-brand hover:shadow-xl transition-all text-center group z-10 relative ${isFocusRoot ? "border-brand shadow-lg ring-4 ring-brand/10" : "border-gray-100"} ${emp.status === "on_leave" ? "border-dashed bg-gray-50" : ""}`}
        >
          {emp.status === "on_leave" && (
            <span className="absolute -top-2 -right-2 bg-yellow-100 text-yellow-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-yellow-200 shadow-sm z-20">On Leave</span>
          )}
          {isFocusRoot && (
            <span className="absolute -top-2 -left-2 bg-brand text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm z-20">Focus</span>
          )}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Avatar initials={emp.avatar} size="lg" />
              <div className={`absolute -inset-1 rounded-full border-2 ${emp.level === 1 ? "border-purple-400" : emp.level === 2 ? "border-brand" : "border-transparent"}`}></div>
            </div>
          </div>
          <p className="text-sm font-bold text-gray-900 leading-tight truncate w-full">{emp.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5 font-bold">{emp.employeeCode}</p>
          <p className="text-[11px] text-gray-500 mt-1 leading-tight font-medium h-8 overflow-hidden">{emp.role}</p>
          <span className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${deptColors[emp.department] || "bg-gray-100 text-gray-600"}`}>
            {emp.department}
          </span>
          {children.length > 0 && (
            <p className="text-[10px] text-gray-400 font-bold mt-2">{children.length} direct reports</p>
          )}
        </button>

        {children.length > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
            className={`absolute -bottom-3 z-20 bg-white border rounded-full px-2.5 h-6 flex items-center justify-center text-[10px] font-bold shadow-sm transition-colors ${isExpanded ? "text-brand border-brand bg-brand/5" : "text-gray-500 border-gray-200 hover:text-brand hover:border-brand"}`}
          >
            {children.length} {isExpanded ? <ChevronUp size={12} className="ml-1" /> : <ChevronDown size={12} className="ml-1" />}
          </button>
        )}
      </div>

      <div className={`transition-all duration-500 origin-top ${isExpanded ? "scale-y-100 opacity-100 max-h-[5000px]" : "scale-y-0 opacity-0 max-h-0 overflow-hidden"}`}>
        {children.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-px h-8 bg-gray-300" />
            <div className="flex items-start gap-6 relative">
              {visibleChildren.length > 1 && (
                <div className="absolute top-0 left-[50%] right-[50%] h-px bg-gray-300" style={{ width: `calc(100% - ${100 / visibleChildren.length}%)`, transform: "translateX(-50%)" }} />
              )}
              {visibleChildren.map((child) => (
                <div key={child.id} className="flex flex-col items-center relative pt-4">
                  <div className="absolute top-0 w-px h-4 bg-gray-300" />
                  <OrgNode emp={child} onSelect={onSelect} searchQuery={searchQuery} />
                </div>
              ))}
              {!showAllReports && children.length > directReportLimit && (
                <div className="flex flex-col items-center relative pt-4">
                  <div className="absolute top-0 w-px h-4 bg-gray-300" />
                  <button
                    onClick={() => setShowAllReports(true)}
                    className="w-44 h-[152px] rounded-2xl border-2 border-dashed border-gray-300 bg-white/70 hover:border-brand hover:text-brand transition-colors text-sm font-bold text-gray-500"
                  >
                    +{children.length - directReportLimit} more reports<br />
                    <span className="text-[10px] font-medium">Click to load in chart</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Employees({ role }) {
  const { t } = useLanguage()
  const [view, setView] = useState("list")
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [selected, setSelected] = useState(null)
  const [focusEmployeeId, setFocusEmployeeId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(20)
  const [scale, setScale] = useState(1)
  const orgContainerRef = useRef(null)

  const visibleEmployees = useMemo(() => employees.filter(e => canViewEmployee(e, role)), [role])
  const departments = ["all", ...new Set(visibleEmployees.map(e => e.department).filter(d => d !== "C-Suite"))]
  const ceo = employees.find(e => e.managerId === null)
  const focusEmployee = visibleEmployees.find(e => e.id === focusEmployeeId) || (canViewEmployee(ceo, role) ? ceo : visibleEmployees[0])
  const focusChain = focusEmployee ? getManagerChain(focusEmployee) : []
  const focusReports = focusEmployee ? findChildren(focusEmployee.id) : []

  const filtered = useMemo(() => visibleEmployees.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.employeeCode.toLowerCase().includes(q)
    const matchDept = deptFilter === "all" || e.department === deptFilter
    return matchSearch && matchDept
  }), [search, deptFilter, visibleEmployees])

  const searchMatches = search.trim() ? filtered.slice(0, 5) : []

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 100
    if (bottom && visibleCount < filtered.length) {
      setVisibleCount(prev => Math.min(prev + 20, filtered.length))
    }
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5))
  const handleResetZoom = () => setScale(1)

  useEffect(() => {
    const container = orgContainerRef.current
    if (!container) return undefined
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        setScale(prev => e.deltaY < 0 ? Math.min(prev + 0.1, 1.5) : Math.max(prev - 0.1, 0.5))
      }
    }
    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [view])

  return (
    <div className="space-y-5 pb-10 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t("pages.employees.title", "Employee Directory")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("pages.employees.subtitle", "Search employees, view reporting lines, and inspect role-based profile details. Views are scoped by RBAC.")}</p>
        </div>
        <div className="flex items-center gap-2">
          {role === "hr_manager" && (
            <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark shadow-sm transition-all">
              + Add Employee
            </button>
          )}
          {role !== "new_employee" && (
            <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
              Export Directory
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        {[
          { label: "Visible Headcount", value: visibleEmployees.length, dot: "bg-green-400" },
          { label: "On Leave", value: visibleEmployees.filter(e => e.status === "on_leave").length, dot: "bg-yellow-400" },
          { label: "Departments", value: new Set(visibleEmployees.map(e => e.department)).size, dot: "bg-blue-400" },
          { label: "Vacant Positions", value: 16, dot: "bg-gray-400" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <span className={`w-2.5 h-2.5 ${item.dot} rounded-full shadow-sm`} />
            <div>
              <p className="text-xs text-gray-500 font-medium">{item.label}</p>
              <p className="text-lg font-black text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
          {[
            ["list", "List View"],
            ["org", "Org Chart"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => {
                setView(value)
                setVisibleCount(20)
              }}
              className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${view === value ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setVisibleCount(20)
            }}
            placeholder="Search name, ID or role..."
            className="pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:border-brand shadow-sm"
          />
        </div>

        {(view === "list" || view === "org") && (
          <div className="flex gap-2 overflow-x-auto custom-scrollbar">
            {departments.map(d => (
              <button
                key={d}
                onClick={() => {
                  setDeptFilter(d)
                  setVisibleCount(20)
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shadow-sm ${deptFilter === d ? "bg-brand text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-brand"}`}
              >
                {d === "all" ? "All Departments" : d}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === "org" && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-inner flex-1 relative overflow-hidden group">
          <div className="absolute top-4 right-4 z-30 flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
            <button onClick={handleZoomIn} className="p-3 hover:bg-gray-50 text-gray-600 hover:text-brand border-b border-gray-100 transition-colors" title="Zoom In"><ZoomIn size={18} /></button>
            <button onClick={handleResetZoom} className="p-3 hover:bg-gray-50 text-gray-600 hover:text-brand border-b border-gray-100 transition-colors font-bold text-xs" title="Reset Zoom">{(scale * 100).toFixed(0)}%</button>
            <button onClick={handleZoomOut} className="p-3 hover:bg-gray-50 text-gray-600 hover:text-brand transition-colors" title="Zoom Out"><ZoomOut size={18} /></button>
          </div>

          <div className="absolute top-4 left-4 z-30 w-[360px] space-y-3">
            <div className="bg-white/90 backdrop-blur px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black text-gray-900">Scalable Org Chart</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Collapsed by default · focus mode · lazy report loading</p>
                </div>
                {focusEmployeeId && (
                  <button onClick={() => setFocusEmployeeId(null)} className="text-[11px] font-bold text-brand hover:text-brand-dark">Reset</button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {focusChain.map(person => (
                  <button key={person.id} onClick={() => setFocusEmployeeId(person.id)} className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-brand/10 hover:text-brand">
                    {person.name.split(" ").slice(-2).join(" ")}
                  </button>
                ))}
                {focusEmployee && (
                  <span className="text-[10px] font-black px-2 py-1 rounded-full bg-brand text-white">{focusEmployee.name}</span>
                )}
              </div>
            </div>

            {searchMatches.length > 0 && (
              <div className="bg-white/95 backdrop-blur rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 pt-3">Jump to employee</p>
                {searchMatches.map(emp => (
                  <button key={emp.id} onClick={() => setFocusEmployeeId(emp.id)} className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors">
                    <Avatar initials={emp.avatar} size="sm" />
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-gray-900 truncate">{emp.name}</span>
                      <span className="block text-[10px] text-gray-500 truncate">{emp.role}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 z-30 bg-white/90 backdrop-blur rounded-xl border border-gray-200 shadow-sm p-3 text-xs text-gray-500 max-w-sm">
            <p><strong className="text-gray-700">Focus context:</strong> {focusReports.length} direct reports. Use search or department filters instead of rendering the whole company at once.</p>
          </div>

          <div
            ref={orgContainerRef}
            className="w-full h-full overflow-auto custom-scrollbar cursor-grab active:cursor-grabbing p-10 pt-40 flex justify-center items-start"
          >
            <div style={{ transform: `scale(${scale})`, transformOrigin: "top center", transition: "transform 0.1s ease-out" }} className="pb-40">
              {focusEmployee && <OrgNode emp={focusEmployee} onSelect={setSelected} searchQuery={search} isFocusRoot />}
            </div>
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="overflow-auto custom-scrollbar flex-1" onScroll={handleScroll}>
            <table className="w-full text-left relative">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Employee</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Contact</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Department & Role</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Location / Type</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Reports To</th>
                  {role === "hr_manager" && <th className="text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.slice(0, visibleCount).map(emp => {
                  const manager = findManager(emp)
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/80 cursor-pointer transition-colors" onClick={() => setSelected(emp)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar initials={emp.avatar} size="md" />
                            <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${emp.status === "active" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Building2 size={10}/> {emp.employeeCode} · Level {emp.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600 flex items-center gap-1.5"><Mail size={12} className="text-gray-400"/> {emp.email}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1.5"><Phone size={12} className="text-gray-400"/> {emp.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800 font-medium mb-1">{emp.role}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${deptColors[emp.department] || "bg-gray-100 text-gray-600"}`}>
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-800">{emp.location}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{emp.employmentType} · Start {emp.startDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        {manager ? (
                          <div className="flex items-center gap-2">
                            <Avatar initials={manager.avatar} size="sm" />
                            <span className="text-sm font-medium text-gray-700">{manager.name}</span>
                          </div>
                        ) : (<span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded">Board of Directors</span>)}
                      </td>
                      {role === "hr_manager" && (
                        <td className="px-6 py-4">
                          <button className="text-xs font-bold text-brand hover:text-brand-dark bg-brand/5 hover:bg-brand/10 px-3 py-1.5 rounded-lg transition-colors">Edit Profile</button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {visibleCount < filtered.length && (
              <div className="py-4 text-center text-xs font-bold text-gray-400 animate-pulse">Scroll to load more...</div>
            )}
          </div>
        </div>
      )}

      {selected && (
        <EmployeeProfileModal
          selected={selected}
          role={role}
          onClose={() => setSelected(null)}
          onFocusOrg={(emp) => {
            setFocusEmployeeId(emp.id)
            setView("org")
            setSelected(null)
          }}
        />
      )}
    </div>
  )
}

function EmployeeProfileModal({ selected, role, onClose, onFocusOrg }) {
  const manager = findManager(selected)
  const directReports = findChildren(selected.id)
  const managerChain = getManagerChain(selected)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Avatar initials={selected.avatar} size="xl" />
              <span className={`absolute bottom-0 right-1 w-4 h-4 border-2 border-white rounded-full ${selected.status === "active" ? "bg-green-500" : "bg-yellow-500"}`}></span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-gray-900">{selected.name}</h2>
                <span className="text-[10px] font-black px-2 py-1 rounded-full bg-gray-100 text-gray-500">{selected.employeeCode}</span>
              </div>
              <p className="text-sm font-medium text-brand">{selected.role}</p>
              <p className="text-xs text-gray-500 mt-1">{selected.department} · {selected.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"><X size={18} /></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <section className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Overview</h3>
            {[
              { label: "Department", value: selected.department },
              { label: "Location", value: selected.location },
              { label: "Status", value: selected.status.replace("_", " ") },
              { label: "Employment Type", value: selected.employmentType },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center text-sm gap-4">
                <span className="text-gray-500 font-medium">{item.label}</span>
                <span className="font-bold text-gray-900 text-right capitalize">{item.value}</span>
              </div>
            ))}
          </section>

          <section className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Contact</h3>
            <div className="flex justify-between items-center text-sm gap-4">
              <span className="flex items-center gap-2 text-gray-500 font-medium"><Mail size={14}/> Email</span>
              <span className="font-bold text-gray-900 text-right break-all">{selected.email}</span>
            </div>
            <div className="flex justify-between items-center text-sm gap-4">
              <span className="flex items-center gap-2 text-gray-500 font-medium"><Phone size={14}/> Phone</span>
              <span className="font-bold text-gray-900 text-right">{selected.phone}</span>
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reporting Line</h3>
              <button onClick={() => onFocusOrg(selected)} className="text-[11px] font-bold text-brand hover:text-brand-dark">Focus in Org Chart</button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {managerChain.map(person => (
                <span key={person.id} className="px-2 py-1 rounded-full bg-white border border-gray-200 font-bold text-gray-600">{person.name}</span>
              ))}
              <span className="text-gray-300">→</span>
              <span className="px-2 py-1 rounded-full bg-brand text-white font-black">{selected.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Manager</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{manager?.name || "Board of Directors"}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Direct Reports</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{directReports.length} team members</p>
              </div>
            </div>
          </section>

          {role === "hr_manager" && (
            <section className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-3 relative overflow-hidden col-span-2">
              <Lock size={80} className="absolute -right-4 -top-4 text-emerald-100 opacity-50" />
              <h3 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1 relative z-10"><Lock size={10}/> HR-only data · restricted by RBAC</h3>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-white/60 rounded-xl p-3">
                  <p className="text-xs text-emerald-700 font-medium">Contract Status</p>
                  <p className="font-bold text-emerald-900 uppercase mt-1">{selected.employmentType}</p>
                </div>
                <div className="bg-white/60 rounded-xl p-3">
                  <p className="text-xs text-emerald-700 font-medium">Base Salary</p>
                  <p className="font-black text-emerald-900 mt-1">{selected.salary} / mo</p>
                </div>
              </div>
            </section>
          )}

          {canViewManagerInsight(selected, role) && (
            <section className="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-3 relative overflow-hidden col-span-2">
              <TrendingUp size={80} className="absolute -right-4 -top-4 text-purple-100 opacity-50" />
              <h3 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-2 flex items-center gap-1 relative z-10"><TrendingUp size={10}/> Manager view · restricted by RBAC</h3>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-white/60 rounded-xl p-3"><p className="text-xs text-purple-700 font-medium">Last Review</p><p className="font-bold text-purple-900 mt-1">Exceeds Expectations</p></div>
                <div className="bg-white/60 rounded-xl p-3"><p className="text-xs text-purple-700 font-medium">Flight Risk</p><p className="font-bold text-green-600 mt-1">Low</p></div>
              </div>
            </section>
          )}

          {role === "it_admin" && (
            <section className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-3 relative overflow-hidden col-span-2">
              <Monitor size={80} className="absolute -right-4 -top-4 text-blue-100 opacity-50" />
              <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1 relative z-10"><Monitor size={10}/> IT assets & access · restricted by RBAC</h3>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-white/60 rounded-xl p-3"><p className="text-xs text-blue-700 font-medium">Device</p><p className="font-bold text-blue-900 mt-1">MacBook Pro 16&quot; (M3)</p></div>
                <div className="bg-white/60 rounded-xl p-3"><p className="text-xs text-blue-700 font-medium">System Access</p><p className="font-bold text-blue-900 mt-1">AWS, GitHub, Jira</p></div>
              </div>
            </section>
          )}

          {role === "new_employee" && (
            <section className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 text-center col-span-2">
              <Lock size={16} className="mx-auto text-gray-300 mb-1" />
              <p className="text-xs text-gray-400 font-medium">Private HR, performance, and IT access details are restricted by RBAC.</p>
            </section>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-brand text-white py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"><Mail size={14}/> Send Email</button>
          <button onClick={() => onFocusOrg(selected)} className="px-4 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">View Org</button>
          {role === "hr_manager" && <button className="px-4 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">Edit File</button>}
        </div>
      </div>
    </div>
  )
}
