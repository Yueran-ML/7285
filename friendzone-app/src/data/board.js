// The in-person board.
//
// Nothing on it is typed in or self-reported. A person's numbers only move when
// their phone has touched someone else's at a meetup, and the board only looks
// back seven days, so somebody who arrived last week is not competing against
// somebody who arrived last year.
//
// The people in the seed circles are fictional, so what each of them did on a
// given day is generated from their name and the day. That keeps the board
// identical across reloads while still letting it shift when the day advances.

import { GROUPS, WEEK_DAYS } from './groups.js'

export const BOARD_WINDOW_DAYS = 7
export const YOU = '__you'

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// One draw of mulberry32, in [0, 1).
function unit(seed) {
  let t = (seed + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const draw = (name, day, salt) => unit(hash(`${name}|${day}|${salt}`))

// What one seeded person did on one day, or null if they stayed in.
//
// Everyone has a fixed sociability between 0 and 1. It decides how reliably
// they turn up to their own circle's weekly meetup and how often they see
// someone outside it, which is what spreads the board out instead of leaving
// each circle tied with itself.
function seededDay(member, group, day) {
  const sociable = draw(member.name, 0, 'sociable')
  const weekday = (((day - 1) % 7) + 7) % 7 // 0 is Monday, as in dayLabel()
  const others = Math.max(1, group.members.length - 1)

  if (WEEK_DAYS.indexOf(group.meetup.day) === weekday) {
    if (draw(member.name, day, 'go') > 0.5 + 0.45 * sociable) return null
    return {
      minutes: 60 + Math.floor(draw(member.name, day, 'length') * 91),
      circle: 1 + Math.floor(draw(member.name, day, 'who') * others),
      extra: 0,
    }
  }

  if (draw(member.name, day, 'casual') > 0.04 + 0.4 * sociable * sociable) return null
  return {
    minutes: 30 + Math.floor(draw(member.name, day, 'length') * 81),
    circle: 0,
    extra: 1 + Math.floor(draw(member.name, day, 'who') * (1 + 2 * sociable)),
  }
}

function seededWindow(member, group, today) {
  let minutes = 0
  let circle = 0
  let extra = 0
  for (let day = today - BOARD_WINDOW_DAYS + 1; day <= today; day++) {
    const did = seededDay(member, group, day)
    if (!did) continue
    minutes += did.minutes
    // Circle-mates are the same few people every week, so they count once.
    circle = Math.max(circle, did.circle)
    extra += did.extra
  }
  return { minutes, people: circle + extra }
}

// The user's own last seven days, read from the taps they actually made.
//
// Time is counted once per meetup, from the first tap to the end, rather than
// once per person. An hour with four people is an hour, not four.
export function myWindow(state) {
  const from = state.day - BOARD_WINDOW_DAYS + 1
  const sessions = new Map()
  const byPerson = new Map()
  for (const e of state.encounters || []) {
    if (e.day < from || e.day > state.day) continue
    sessions.set(e.sessionId, Math.max(sessions.get(e.sessionId) || 0, e.minutes))
    const seen = byPerson.get(e.name) || { minutes: 0, times: 0 }
    byPerson.set(e.name, { minutes: seen.minutes + e.minutes, times: seen.times + 1 })
  }
  let minutes = 0
  for (const m of sessions.values()) minutes += m
  return { minutes, people: byPerson.size, meetups: sessions.size, byPerson }
}

// Everyone with at least one tap in the window. A tap is mutual, so time the
// user spent with someone is added to that person's row as well as their own.
// People with no taps are left off rather than listed at the bottom.
export function boardRows(state) {
  const mine = myWindow(state)
  const rows = []
  for (const group of GROUPS) {
    for (const member of group.members) {
      const seeded = seededWindow(member, group, state.day)
      const withMe = mine.byPerson.get(member.name)
      rows.push({
        id: member.name,
        name: member.name,
        color: member.color,
        circle: group.name,
        emoji: group.emoji,
        minutes: seeded.minutes + (withMe ? withMe.minutes : 0),
        people: seeded.people + (withMe ? 1 : 0),
        met: Boolean(withMe),
        you: false,
      })
    }
  }
  if (mine.people > 0) {
    rows.push({
      id: YOU,
      name: state.name || 'You',
      color: 'var(--terracotta)',
      circle: null,
      emoji: null,
      minutes: mine.minutes,
      people: mine.people,
      met: false,
      you: true,
    })
  }
  return rows.filter((r) => r.people > 0)
}

// metric is 'minutes' or 'people'. Ties fall back to the other measure.
export function ranked(rows, metric) {
  const other = metric === 'minutes' ? 'people' : 'minutes'
  return [...rows]
    .sort(
      (a, b) =>
        b[metric] - a[metric] ||
        b[other] - a[other] ||
        Number(b.you) - Number(a.you) ||
        a.name.localeCompare(b.name),
    )
    .map((row, i) => ({ ...row, rank: i + 1 }))
}

// Where the user stands on each measure, or null while they are not on the board.
export function myRanks(state) {
  const rows = boardRows(state)
  const place = (metric) => {
    const me = ranked(rows, metric).find((r) => r.you)
    return me ? me.rank : null
  }
  return { minutes: place('minutes'), people: place('people'), total: rows.length }
}

export function fmtDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}

export const peopleLabel = (n) => `${n} ${n === 1 ? 'person' : 'people'}`
