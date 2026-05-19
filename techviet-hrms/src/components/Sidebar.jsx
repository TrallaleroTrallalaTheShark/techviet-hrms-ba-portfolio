import { NAV_ITEMS } from "../rbac"
import { useLanguage } from "../context"

const sectionKey = (section) => section.toLowerCase().replace(/\s+/g, "_")

export default function Sidebar({ role, page, setPage }) {
  const items = NAV_ITEMS[role] || NAV_ITEMS.hr_manager
  const { t } = useLanguage()

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-40">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand/20">
            T
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-tight">TechViet</p>
            <p className="text-[10px] font-bold text-brand uppercase tracking-widest leading-tight">HRMS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        {items.map((item, i) => {
          if (item.section) {
            return (
              <p key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-5 pb-2">
                {t(`sections.${sectionKey(item.section)}`, item.section)}
              </p>
            )
          }
          const Icon = item.icon
          const isActive = page === item.key
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                isActive
                  ? "bg-brand/10 text-brand shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} className={isActive ? "text-brand" : "text-gray-400"} />
              {t(`nav.${item.key}`, item.label)}
              {isActive && <div className="ml-auto w-1 h-4 bg-brand rounded-full"></div>}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
