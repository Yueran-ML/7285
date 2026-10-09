import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Trophy, Users } from 'lucide-react'
import Avatar from '../components/Avatar.jsx'
import { fmtDuration, myRanks, peopleLabel } from '../data/board.js'
import { findGroup, useStore } from '../store/useStore.jsx'

// "new on the board", "up 12 places", or nothing worth saying.
function movement(before, after) {
  if (after == null) return ''
  if (before == null) return 'new on the board'
  if (before > after) return `up ${before - after} place${before - after === 1 ? '' : 's'}`
  if (before < after) return `down ${after - before} place${after - before === 1 ? '' : 's'}`
  return 'same place'
}

function Place({ Icon, label, rank, total, note }) {
  return (
    <div style={{ flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: 16, background: 'var(--cream-deep)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)' }}>
        <Icon size={12} strokeWidth={2.6} /> {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, lineHeight: 1 }}>#{rank}</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)' }}>of {total}</span>
      </div>
      <div style={{ marginTop: 4, fontSize: 11.5, fontWeight: 800, color: 'var(--sage-deep)' }}>{note}</div>
    </div>
  )
}

// Shown once, straight after a meetup ends: who you were with, for how long,
// and where that leaves you on the board.
export default function SessionSummary({ onSeeBoard }) {
  const { state, dispatch } = useStore()
  const summary = state.sessionSummary
  const close = () => dispatch({ type: 'CLEAR_SESSION_SUMMARY' })

  const group = summary ? findGroup(state, summary.groupId) : null
  const people = summary ? state.encounters.filter((e) => e.sessionId === summary.sessionId) : []
  const after = summary ? myRanks(state) : null
  const before = summary?.before

  return (
    <AnimatePresence>
      {summary && (
        <motion.div
          key={summary.sessionId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 55,
            display: 'flex',
            alignItems: 'flex-end',
            background: 'rgba(47,49,71,0.45)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <motion.div
            role="dialog"
            aria-label="Meetup logged"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              background: 'var(--paper)',
              borderRadius: '28px 28px 0 0',
              padding: '24px 20px calc(20px + env(safe-area-inset-bottom))',
              boxShadow: 'var(--shadow-float)',
            }}
          >
            <div className="eyebrow" style={{ color: 'var(--sage-deep)' }}>
              Meetup logged
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginTop: 8 }}>
              {fmtDuration(summary.minutes)} with {peopleLabel(people.length)}.
            </h2>
            {group && (
              <p style={{ marginTop: 6, fontSize: 13.5, color: 'var(--ink-soft)' }}>
                {group.emoji} {group.name} · {group.meetup.place}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {people.map((e) => {
                const member = group?.members.find((m) => m.name === e.name)
                return (
                  <span
                    key={e.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '5px 12px 5px 5px',
                      borderRadius: 999,
                      border: '1px solid var(--line)',
                      fontSize: 12.5,
                      fontWeight: 800,
                    }}
                  >
                    <Avatar name={e.name} color={member?.color || 'var(--sage)'} size={24} />
                    {e.name}
                    <span style={{ color: 'var(--muted)', fontWeight: 700 }}>{fmtDuration(e.minutes)}</span>
                  </span>
                )
              })}
            </div>

            {after && after.minutes != null && (
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Place
                  Icon={Clock}
                  label="Time together"
                  rank={after.minutes}
                  total={after.total}
                  note={movement(before?.minutes, after.minutes)}
                />
                <Place
                  Icon={Users}
                  label="People met"
                  rank={after.people}
                  total={after.total}
                  note={movement(before?.people, after.people)}
                />
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={() => {
                close()
                onSeeBoard()
              }}
              style={{ width: '100%', marginTop: 18 }}
            >
              <Trophy size={16} /> See the board
            </button>
            <button className="btn btn-ghost" onClick={close} style={{ width: '100%', marginTop: 10 }}>
              Back to the circle
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
