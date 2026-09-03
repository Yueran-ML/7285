import { motion } from 'framer-motion'
import { Flame, Lock, RotateCcw, SkipForward } from 'lucide-react'
import { BADGES } from '../data/badges.js'
import { GROUP_MAP } from '../data/groups.js'
import Avatar from '../components/Avatar.jsx'
import { useStore, streakDays, dayLabel } from '../store/useStore.jsx'

function Ring({ value, max, size = 132, stroke = 11 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, max ? value / max : 1)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--cream-deep)" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="url(#ring-grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - pct) }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6d27a" />
          <stop offset="100%" stopColor="#d96c4f" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Profile({ narrow }) {
  const { state, dispatch } = useStore()
  const streak = streakDays(state)
  const nextBadge = BADGES.find((b) => b.points != null && !state.unlockedBadges.includes(b.id))
  const nextTarget = nextBadge ? nextBadge.points : null
  const ringMax = nextTarget || Math.max(state.points, 1)

  // last 7 simulated days, oldest to newest
  const days = Array.from({ length: 7 }, (_, i) => state.day - 6 + i).filter((d) => d >= 1)
  const earnedDays = new Set(state.pointLog.map((p) => p.day))

  const perGroup = state.joinedGroups.map((id) => ({
    group: GROUP_MAP[id],
    pts: state.pointLog.filter((p) => p.groupId === id).reduce((a, p) => a + p.amount, 0),
  }))

  return (
    <div className="scroll" style={{ position: 'absolute', inset: 0, padding: '58px 18px 110px' }}>
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <Avatar name={state.name} color="var(--terracotta)" size={54} ring />
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 500 }}>{state.name}</h1>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>
            {state.joinedGroups.length} circle{state.joinedGroups.length === 1 ? '' : 's'} · day {state.day}
          </div>
        </div>
      </motion.header>

      {/* points hero */}
      <motion.section
        className="card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ marginTop: 20, padding: 20, display: 'flex', alignItems: 'center', gap: 18, position: 'relative', overflow: 'hidden' }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -60,
            top: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(233,185,73,0.25), transparent 65%)',
          }}
        />
        <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
          <Ring value={state.points} max={ringMax} />
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 600, lineHeight: 1 }}>{state.points}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.08em' }}>POINTS</div>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--terracotta)', fontWeight: 800, fontSize: 14 }}>
            <Flame size={16} /> {streak} day streak
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.45 }}>
            {nextBadge ? (
              <>
                <strong>{Math.max(0, nextTarget - state.points)}</strong> more to unlock <strong>{nextBadge.name}</strong> {nextBadge.emoji}
              </>
            ) : (
              'You’ve unlocked every point badge. Nice.'
            )}
          </p>
          <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>Points never reset. There’s no leaderboard.</p>
        </div>
      </motion.section>

      {/* week strip */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }} style={{ marginTop: 22 }}>
        <div className="eyebrow">This week</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          {days.map((d, i) => {
            const hit = earnedDays.has(d)
            const today = d === state.day
            return (
              <div key={d} style={{ textAlign: 'center', flex: 1 }}>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    width: 36,
                    height: 36,
                    margin: '0 auto',
                    borderRadius: 12,
                    display: 'grid',
                    placeItems: 'center',
                    background: hit ? 'var(--terracotta)' : 'var(--paper)',
                    border: `1.5px solid ${today ? 'var(--ink)' : hit ? 'var(--terracotta)' : 'var(--line-strong)'}`,
                    color: hit ? '#fff' : 'var(--muted)',
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {hit ? '✓' : d}
                </motion.div>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: today ? 'var(--ink)' : 'var(--muted)', marginTop: 5 }}>{dayLabel(d)}</div>
              </div>
            )
          })}
        </div>
      </motion.section>

      {/* badges */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.5 }} style={{ marginTop: 26 }}>
        <div className="eyebrow">Badges</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
          {BADGES.map((b, i) => {
            const on = state.unlockedBadges.includes(b.id)
            return (
              <motion.div
                key={b.id}
                className="card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                style={{
                  padding: '14px 8px 12px',
                  textAlign: 'center',
                  background: on ? 'var(--paper)' : 'var(--cream-deep)',
                  borderColor: on ? 'var(--gold)' : 'var(--line)',
                  boxShadow: on ? '0 10px 24px -14px rgba(200,150,31,0.5)' : 'none',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: 28, filter: on ? 'none' : 'grayscale(1) opacity(0.35)' }}>{b.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 800, marginTop: 6, color: on ? 'var(--ink)' : 'var(--muted)' }}>{b.name}</div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2, lineHeight: 1.3 }}>{on ? 'Unlocked' : b.hint}</div>
                {!on && <Lock size={11} style={{ position: 'absolute', top: 8, right: 8, color: 'var(--muted)' }} />}
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* per-circle */}
      {perGroup.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.5 }} style={{ marginTop: 26 }}>
          <div className="eyebrow">Your circles</div>
          <div className="card" style={{ marginTop: 12, padding: '4px 16px' }}>
            {perGroup.map(({ group, pts }, i) => (
              <div
                key={group.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderTop: i ? '1px solid var(--line)' : 'none',
                }}
              >
                <span style={{ fontSize: 22 }}>{group.emoji}</span>
                <span style={{ flex: 1, fontWeight: 700, fontSize: 14.5 }}>{group.name}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--terracotta)' }}>{pts}</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* demo controls on narrow screens only (desktop shows them beside the phone) */}
      {narrow && (
        <section style={{ marginTop: 28 }}>
          <div className="eyebrow" style={{ color: 'var(--sage-deep)' }}>
            Prototype controls
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button className="btn btn-sage btn-sm" onClick={() => dispatch({ type: 'ADVANCE_DAY' })}>
              <SkipForward size={14} /> Skip to tomorrow
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (confirm('Reset the prototype?')) dispatch({ type: 'RESET' })
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
