import { Bell, Search, ChevronDown } from "lucide-react"
import { ROLE_PROFILES } from "../rbac"
import { useLanguage } from "../context"

export default function Topbar({ role, setRole, roles }) {
  const profile = ROLE_PROFILES[role]
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-1">
        {["crm", "accounting", "inventory"].map(m => (
          <span key={m} className="text-sm text-gray-400 px-3 py-1 rounded hover:bg-gray-50 cursor-pointer">{t(`appModules.${m}`, m)}</span>
        ))}
        <span className="text-sm font-semibold text-white bg-brand px-3 py-1 rounded">{t("appModules.hrms", "HRMS")}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("topbar.search", "Search...")}
            className="pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg w-44 focus:outline-none focus:border-brand"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1" title={t("topbar.language", "Language")}>
          {["en", "vi"].map(code => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-2 py-0.5 rounded-md text-xs font-bold transition-colors ${language === code ? "bg-brand text-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        <button className="relative p-1.5 hover:bg-gray-50 rounded-lg">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative group">
          <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-brand transition-colors">
            <div className={`w-6 h-6 ${profile.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
              {profile.avatar}
            </div>
            <span className="text-sm text-gray-700 font-medium">{t(`roles.${role}.label`, profile.label)}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <p className="text-xs text-gray-400 font-medium px-3 pt-3 pb-1">{t("topbar.switchRole", "Switch Role / RBAC View")}</p>
            {Object.entries(roles).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setRole(key)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${role === key ? "text-brand font-medium" : "text-gray-700"}`}
              >
                <div className={`w-5 h-5 ${val.color} rounded-full flex items-center justify-center text-white text-[9px] font-bold`}>
                  {val.avatar}
                </div>
                <span className="flex-1 text-left">{t(`roles.${key}.label`, val.label)}</span>
                {role === key && <span className="ml-auto text-brand">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
