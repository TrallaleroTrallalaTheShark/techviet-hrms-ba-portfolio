export const ACTIVE_INTERVIEW_STATUSES = ["scheduled", "in_progress"]

export const normalizeScheduleKey = ({ date, time, room }) => (
  `${String(date || "").trim()}|${String(time || "").trim()}|${String(room || "").trim().toLowerCase()}`
)

export const isActiveInterview = (interview) => ACTIVE_INTERVIEW_STATUSES.includes(interview.status)

const toMinutes = (time = "00:00") => {
  const [hour = "0", minute = "0"] = String(time).split(":")
  return Number(hour) * 60 + Number(minute)
}

const hasTimeOverlap = (a, b) => {
  const aStart = toMinutes(a.time)
  const bStart = toMinutes(b.time)
  const aEnd = aStart + Number(a.durationMins || 60)
  const bEnd = bStart + Number(b.durationMins || 60)
  return aStart < bEnd && bStart < aEnd
}

export const findRoomConflict = (interviews, schedule, excludeId = null) => {
  const targetRoom = String(schedule.room || "").trim().toLowerCase()
  const targetDate = String(schedule.date || "").trim()
  return interviews.find(iv => (
    iv.id !== excludeId &&
    isActiveInterview(iv) &&
    String(iv.date || "").trim() === targetDate &&
    String(iv.room || "").trim().toLowerCase() === targetRoom &&
    hasTimeOverlap(iv, schedule)
  ))
}

export const getSyncedActiveInterviews = (interviews, candidates = []) => {
  const hasCandidateScope = candidates.length > 0
  return interviews.filter(iv => {
    if (!isActiveInterview(iv)) return false
    if (!hasCandidateScope) return true
    const candidate = candidates.find(c => c.id === iv.candidateId || c.name === iv.candidate)
    return candidate?.status === "interview"
  })
}
