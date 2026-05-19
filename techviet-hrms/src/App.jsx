import { useState } from "react"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import JobPostings from "./pages/JobPostings"
import Applications from "./pages/Applications"
import Recruitment from "./pages/Recruitment"
import Interviews from "./pages/Interviews"
import Onboarding from "./pages/Onboarding"
import Employees from "./pages/Employees"
import Performance from "./pages/Performance"

import { RoleContext, DataContext, LanguageContext } from "./context"
import { ROLE_PROFILES, canAccessPage } from "./rbac"
import { candidates as initialCandidates, interviews as initialInterviews, newHires as initialNewHires, jobPostings as initialJobPostings } from "./data/mockData"
import { getTranslation } from "./i18n"

export default function App() {
  const [role, setRole] = useState("hr_manager")
  const [page, setPage] = useState("dashboard")
  const [language, setLanguage] = useState("en")

  const [candidatesData, setCandidatesData] = useState(initialCandidates)
  const [interviewsData, setInterviewsData] = useState(initialInterviews)
  const [newHiresData, setNewHiresData] = useState(initialNewHires)
  const [jobPostingsData, setJobPostingsData] = useState(initialJobPostings)

  const safePage = canAccessPage(role, page) ? page : "dashboard"

  const renderPage = () => {
    switch (safePage) {
      case "dashboard": return <Dashboard role={role} setPage={setPage} />
      case "job_postings": return <JobPostings role={role} />
      case "applications": return <Applications role={role} />
      case "recruitment": return <Recruitment role={role} />
      case "interviews": return <Interviews role={role} />
      case "onboarding": return <Onboarding role={role} setPage={setPage} />
      case "employees": return <Employees role={role} />
      case "performance": return <Performance role={role} />
      default: return <Dashboard role={role} setPage={setPage} />
    }
  }

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t: (key, fallback) => getTranslation(language, key, fallback),
    }}>
      <RoleContext.Provider value={{ role, setRole, roles: ROLE_PROFILES }}>
        <DataContext.Provider value={{ 
          candidatesData, setCandidatesData, 
          interviewsData, setInterviewsData,
          newHiresData, setNewHiresData,
          jobPostingsData, setJobPostingsData,
        }}>
          <Layout role={role} setRole={setRole} page={safePage} setPage={setPage} roles={ROLE_PROFILES}>
            {renderPage()}
          </Layout>
        </DataContext.Provider>
      </RoleContext.Provider>
    </LanguageContext.Provider>
  )
}
