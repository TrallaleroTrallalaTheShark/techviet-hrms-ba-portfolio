import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function Layout({ role, setRole, page, setPage, roles, children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role={role} page={page} setPage={setPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar role={role} setRole={setRole} roles={roles} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}