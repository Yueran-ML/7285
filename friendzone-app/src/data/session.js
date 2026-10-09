// The in-person clock.
//
// It is simulated, like the calendar, so that a whole meetup can be shown in a
// minute: one real second counts as one minute together. A session closes
// itself after four hours so that a phone left on a table cannot keep counting.

export const MS_PER_SIM_MINUTE = 1000
export const SESSION_CAP_MIN = 240

// Minutes on a session's clock. Zero until the first tap, which is what starts it.
export function sessionMinutes(session, now = Date.now()) {
  if (!session || session.t0 == null) return 0
  const ticked = Math.floor((now - session.t0) / MS_PER_SIM_MINUTE)
  return Math.min(SESSION_CAP_MIN, Math.max(0, ticked) + session.skipped)
}
