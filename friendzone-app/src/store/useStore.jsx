import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { GROUPS, GROUP_MAP } from '../data/groups.js'
import { BADGES } from '../data/badges.js'
import { emptyProfile } from '../data/profile.js'
import { sessionMinutes } from '../data/session.js'

const KEY = 'friendzone-state-v1'

// Simulated calendar. The prototype advances "days" with a demo control so the
// daily-point and post-meetup-bonus mechanics can be shown in a single session.
export const BONUS_WINDOW_DAYS = 7
export const BONUS_AMOUNT = 3
export const DAILY_AMOUNT = 1

export const initialState = {
  onboarded: false,
  name: '',
  interests: [],
  // Optional. Everything here is user-declared and may stay blank.
  profile: emptyProfile,
  day: 1,
  // Circles the user started. Same shape as the seed circles, so every screen
  // and the matcher treat them identically.
  customGroups: [],
  joinedGroups: [],
  // groupId -> the day you joined. Drives how personal the prompts get, so a
  // circle you just walked into opens with something light.
  joinedOn: {},
  messages: {}, // groupId -> [{ id, from, text, day, mine }]
  points: 0,
  pointLog: [], // { day, groupId, amount, reason }
  checkIns: {}, // groupId -> last day earned
  meetups: {}, // groupId -> { rsvpDay, attendedDay }
  // Set while the user is physically at a circle's meetup. The clock starts on
  // the first tap (t0), and each person's time runs from the minute they were
  // tapped. { id, groupId, t0, skipped, taps: [{ name, atMin }] }
  tapSession: null,
  // One entry per person per finished session. The in-person board is built
  // from these and from nothing else. { id, sessionId, groupId, name, day, minutes }
  encounters: [],
  sessionSummary: null, // { sessionId, groupId, minutes, before } shown once after a session
  unlockedBadges: [],
  pendingBadges: [],
  lastEarned: null, // { id, amount, reason, groupId }
}

let seq = 1
const uid = () => `${Date.now().toString(36)}-${seq++}`

function seedMessages(groupId, day) {
  const g = GROUP_MAP[groupId]
  if (!g) return []
  return g.seed.map((m) => ({ id: uid(), from: m.from, text: m.text, day, mine: false, minsAgo: m.minsAgo }))
}

export function bonusActive(state, groupId) {
  const m = state.meetups[groupId]
  if (!m || m.attendedDay == null) return false
  return state.day > m.attendedDay && state.day <= m.attendedDay + BONUS_WINDOW_DAYS
}

export function bonusDaysLeft(state, groupId) {
  const m = state.meetups[groupId]
  if (!m || m.attendedDay == null) return 0
  return Math.max(0, m.attendedDay + BONUS_WINDOW_DAYS - state.day + 1)
}

function withBadges(state) {
  const newly = BADGES.filter((b) => !state.unlockedBadges.includes(b.id) && b.test(state)).map((b) => b.id)
  if (!newly.length) return state
  return {
    ...state,
    unlockedBadges: [...state.unlockedBadges, ...newly],
    pendingBadges: [...state.pendingBadges, ...newly],
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.name }

    case 'TOGGLE_INTEREST': {
      const has = state.interests.includes(action.id)
      return { ...state, interests: has ? state.interests.filter((i) => i !== action.id) : [...state.interests, action.id] }
    }

    case 'COMPLETE_ONBOARDING':
      return { ...state, onboarded: true }

    case 'SET_PROFILE_FIELD':
      // Tapping the selected option again clears it, so a choice is never final.
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.field]: state.profile[action.field] === action.value ? null : action.value,
        },
      }

    case 'SET_BIO':
      return { ...state, profile: { ...state.profile, bio: action.text } }

    case 'TOGGLE_PROFILE_TAG': {
      const list = state.profile[action.field] || []
      const has = list.includes(action.id)
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.field]: has ? list.filter((t) => t !== action.id) : [...list, action.id],
        },
      }
    }

    case 'CLEAR_PROFILE':
      return { ...state, profile: emptyProfile }

    case 'JOIN_GROUP': {
      if (state.joinedGroups.includes(action.groupId)) return state
      const messages = state.messages[action.groupId]
        ? state.messages
        : { ...state.messages, [action.groupId]: seedMessages(action.groupId, state.day) }
      return withBadges({
        ...state,
        joinedGroups: [...state.joinedGroups, action.groupId],
        joinedOn: { ...state.joinedOn, [action.groupId]: state.day },
        messages,
      })
    }

    case 'CREATE_GROUP': {
      const g = action.group
      // Starting a circle joins you to it. You are its first member.
      return withBadges({
        ...state,
        customGroups: [...state.customGroups, g],
        joinedGroups: [...state.joinedGroups, g.id],
        joinedOn: { ...state.joinedOn, [g.id]: state.day },
        messages: { ...state.messages, [g.id]: [] },
      })
    }

    case 'LEAVE_GROUP':
      return { ...state, joinedGroups: state.joinedGroups.filter((g) => g !== action.groupId) }

    case 'SEND_MESSAGE': {
      const { groupId, text } = action
      const msg = { id: uid(), from: state.name || 'You', text, day: state.day, mine: true, at: Date.now() }
      const messages = { ...state.messages, [groupId]: [...(state.messages[groupId] || []), msg] }
      let next = { ...state, messages }

      const alreadyToday = state.checkIns[groupId] === state.day
      if (!alreadyToday) {
        const bonus = bonusActive(state, groupId)
        const amount = bonus ? BONUS_AMOUNT : DAILY_AMOUNT
        const reason = bonus ? 'bonus' : 'daily'
        next = {
          ...next,
          points: state.points + amount,
          pointLog: [...state.pointLog, { day: state.day, groupId, amount, reason }],
          checkIns: { ...state.checkIns, [groupId]: state.day },
          lastEarned: { id: uid(), amount, reason, groupId },
        }
      }
      return withBadges(next)
    }

    case 'RECEIVE_MESSAGE': {
      const { groupId, from, text } = action
      const msg = { id: uid(), from, text, day: state.day, mine: false, at: Date.now() }
      return { ...state, messages: { ...state.messages, [groupId]: [...(state.messages[groupId] || []), msg] } }
    }

    case 'RSVP_MEETUP':
      return { ...state, meetups: { ...state.meetups, [action.groupId]: { ...(state.meetups[action.groupId] || {}), rsvpDay: state.day } } }

    case 'ATTEND_MEETUP':
      return withBadges({
        ...state,
        meetups: { ...state.meetups, [action.groupId]: { ...(state.meetups[action.groupId] || {}), attendedDay: state.day } },
      })

    case 'START_SESSION':
      if (state.tapSession) return state
      return { ...state, tapSession: { id: uid(), groupId: action.groupId, t0: null, skipped: 0, taps: [] } }

    case 'TAP_PERSON': {
      const s = state.tapSession
      if (!s || s.taps.some((t) => t.name === action.name)) return state
      const at = action.at ?? Date.now()
      const t0 = s.t0 ?? at
      const atMin = sessionMinutes({ ...s, t0 }, at)
      return { ...state, tapSession: { ...s, t0, taps: [...s.taps, { name: action.name, atMin }] } }
    }

    // Prototype control: jump the session clock forward.
    case 'SKIP_SESSION_TIME': {
      const s = state.tapSession
      if (!s || s.t0 == null) return state
      return { ...state, tapSession: { ...s, skipped: s.skipped + action.minutes } }
    }

    case 'END_SESSION': {
      const s = state.tapSession
      if (!s) return state
      // No tap, no meetup. Opening the screen is not proof of having been there.
      if (!s.taps.length) return { ...state, tapSession: null }
      const endMin = sessionMinutes(s, action.at ?? Date.now())
      const fresh = s.taps.map((t) => ({
        id: uid(),
        sessionId: s.id,
        groupId: s.groupId,
        name: t.name,
        day: state.day,
        minutes: Math.max(0, endMin - t.atMin),
      }))
      // A tap is what marks attendance. The post-meetup bonus window starts
      // from this day.
      const m = state.meetups[s.groupId] || {}
      const meetups =
        m.attendedDay != null
          ? state.meetups
          : { ...state.meetups, [s.groupId]: { ...m, attendedDay: state.day } }
      return withBadges({
        ...state,
        tapSession: null,
        encounters: [...state.encounters, ...fresh],
        meetups,
        sessionSummary: { sessionId: s.id, groupId: s.groupId, minutes: endMin, before: action.before || null },
      })
    }

    case 'CLEAR_SESSION_SUMMARY':
      return { ...state, sessionSummary: null }

    case 'ADVANCE_DAY':
      return { ...state, day: state.day + 1 }

    case 'DISMISS_BADGE':
      return { ...state, pendingBadges: state.pendingBadges.slice(1) }

    case 'CLEAR_EARNED':
      return { ...state, lastEarned: null }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    // meetupMode belonged to the in-person mode that iteration 3 replaced.
    const { meetupMode: _retired, ...parsed } = JSON.parse(raw)
    return {
      ...initialState,
      ...parsed,
      // Saves from iteration 1 have no profile; merge so a partial one is safe too.
      profile: { ...emptyProfile, ...(parsed.profile || {}) },
      customGroups: parsed.customGroups || [],
      joinedOn: parsed.joinedOn || {},
      tapSession: parsed.tapSession || null,
      encounters: parsed.encounters || [],
      sessionSummary: null,
      lastEarned: null,
      pendingBadges: [],
    }
  } catch {
    return initialState
  }
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      // Transient UI state (burst, badge queue, session summary) is deliberately not persisted.
      const { lastEarned: _burst, pendingBadges: _queue, sessionSummary: _summary, ...persist } = state
      localStorage.setItem(KEY, JSON.stringify(persist))
    } catch {
      /* ignore */
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

// derived helpers

// Seed circles plus anything the user started. Every screen reads circles
// through these two so a created circle behaves exactly like a built-in one.
export function allGroups(state) {
  return state.customGroups?.length ? [...GROUPS, ...state.customGroups] : GROUPS
}

export function findGroup(state, id) {
  return GROUP_MAP[id] || state.customGroups?.find((g) => g.id === id) || null
}

// How long you have been in a circle, in simulated days.
export function daysInCircle(state, groupId) {
  const since = state.joinedOn?.[groupId]
  if (since == null) return state.day - 1 // saves from before this field existed
  return Math.max(0, state.day - since)
}

// Which disclosure level of prompts a circle offers. Time in the circle is the
// only input: nothing here is earned, and nothing is taken away.
export const PROMPT_LEVEL_LABELS = {
  1: 'Light openers for now. These get more personal as the circle gets older.',
  2: 'A bit more personal, now that you have been here a few days.',
  3: 'The deeper prompts are open.',
}

export function promptLevel(state, groupId) {
  const days = daysInCircle(state, groupId)
  if (days >= 4) return 3
  if (days >= 2) return 2
  return 1
}

export function streakDays(state) {
  const days = new Set(state.pointLog.map((p) => p.day))
  let n = 0
  for (let d = state.day; d >= 1; d--) {
    if (days.has(d)) n++
    else if (d !== state.day) break
    // today not yet earned doesn't break the streak
  }
  return n
}

export function pointsToday(state) {
  return state.pointLog.filter((p) => p.day === state.day).reduce((a, p) => a + p.amount, 0)
}

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export function dayLabel(day) {
  return DAY_NAMES[(day - 1) % 7]
}
