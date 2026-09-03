import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { GROUP_MAP } from '../data/groups.js'
import { BADGES } from '../data/badges.js'

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
  day: 1,
  joinedGroups: [],
  messages: {}, // groupId -> [{ id, from, text, day, mine }]
  points: 0,
  pointLog: [], // { day, groupId, amount, reason }
  checkIns: {}, // groupId -> last day earned
  meetups: {}, // groupId -> { rsvpDay, attendedDay }
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

    case 'JOIN_GROUP': {
      if (state.joinedGroups.includes(action.groupId)) return state
      const messages = state.messages[action.groupId]
        ? state.messages
        : { ...state.messages, [action.groupId]: seedMessages(action.groupId, state.day) }
      return withBadges({ ...state, joinedGroups: [...state.joinedGroups, action.groupId], messages })
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
    const parsed = JSON.parse(raw)
    return { ...initialState, ...parsed, lastEarned: null, pendingBadges: [] }
  } catch {
    return initialState
  }
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      // Transient UI state (burst + badge queue) is deliberately not persisted.
      const { lastEarned: _burst, pendingBadges: _queue, ...persist } = state
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
