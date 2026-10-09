import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Clock, Compass, Crown, MessageCircle, Nfc, Users } from 'lucide-react'
import Avatar from '../components/Avatar.jsx'
import { BOARD_WINDOW_DAYS, boardRows, fmtDuration, peopleLabel, ranked } from '../data/board.js'
import { useStore } from '../store/useStore.jsx'

const METRICS = [
  { id: 'minutes', label: 'Time together', Icon: Clock },
  { id: 'people', label: 'People met', Icon: Users },
]

// How many places are listed before the board folds down to the user's own
// neighbourhood.
const TOP = 10

const secondary = (row, metric) => (metric === 'minutes' ? peopleLabel(row.people) : fmtDuration(row.minutes))

// The figure the board is sorted by. A head-count gets its unit, since a bare
// "9" beside a duration could be read as anything.
function Figure({ row, metric }) {
  if (metric === 'minutes') return fmtDuration(row.minutes)
  return (
    <>
      {row.people}
      <span style={{ marginLeft: 3, fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800, letterSpacing: 0 }}>
        {row.people === 1 ? 'person' : 'people'}
      </span>
    </>
  )
}

// "32m behind Ravi", measured on whichever column the board is sorted by.
function gapTo(me, above, metric) {
  if (!above) return 'Top of the board.'
  const diff = above[metric] - me[metric]
  if (diff <= 0) return `Level with ${above.name}.`
  return `${metric === 'minutes' ? fmtDuration(diff) : peopleLabel(diff)} behind ${above.name}.`
}

const MEDAL = {
  1: { tint: 'var(--gold)', soft: 'var(--gold-soft)', deep: 'var(--gold-deep)', height: 62, avatar: 54 },
  2: { tint: '#b9bccb', soft: '#eceef4', deep: '#7c8096', height: 44, avatar: 44 },
  3: { tint: '#c48a6c', soft: '#f3e3d8', deep: '#9a6547', height: 32, avatar: 44 },
}

function Podium({ rows, metric }) {
  // Second, first, third: the tallest step stands in the middle.
  const order = [rows[1], rows[0], rows[2]].filter(Boolean)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10, marginTop: 22 }}>
      {order.map((r) => {
        const m = MEDAL[r.rank]
        return (
          <motion.div
            key={r.id}
            layout="position"
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            style={{ flex: 1, minWidth: 0, textAlign: 'center' }}
          >
            <div style={{ height: 18, display: 'grid', placeItems: 'center' }}>
              {r.rank === 1 && <Crown size={17} color="var(--gold-deep)" fill="var(--gold)" />}
            </div>
            <div style={{ display: 'grid', placeItems: 'center', marginTop: 4 }}>
              <Avatar name={r.name} color={r.color} size={m.avatar} ring={r.you} />
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 13.5,
                fontWeight: 800,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {r.you ? `${r.name} (you)` : r.name}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: m.deep, lineHeight: 1.25 }}>
              <Figure row={r} metric={metric} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>{secondary(r, metric)}</div>
            <div
              style={{
                height: m.height,
                marginTop: 8,
                borderRadius: '14px 14px 0 0',
                background: `linear-gradient(to bottom, ${m.soft}, rgba(255,253,249,0))`,
                borderTop: `3px solid ${m.tint}`,
                display: 'grid',
                placeItems: 'start center',
                paddingTop: 6,
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 600,
                color: m.deep,
              }}
            >
              {r.rank}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function Row({ row, metric, first }) {
  return (
    <motion.div
      layout="position"
      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: row.you ? '10px 12px' : '10px 2px',
        margin: row.you ? '4px -10px' : 0,
        borderRadius: row.you ? 16 : 0,
        background: row.you ? 'var(--terracotta-soft)' : 'transparent',
        borderTop: !row.you && !first ? '1px solid var(--line)' : 'none',
      }}
    >
      <span
        style={{
          width: 24,
          flexShrink: 0,
          textAlign: 'right',
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color: row.you ? 'var(--terracotta-deep)' : 'var(--muted)',
        }}
      >
        {row.rank}
      </span>
      <Avatar name={row.name} color={row.color} size={32} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <span
            style={{ fontSize: 14.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {row.you ? `${row.name} (you)` : row.name}
          </span>
          {row.met && (
            <span
              title="You tapped phones with them in the last 7 days"
              style={{
                flexShrink: 0,
                padding: '1px 7px',
                borderRadius: 999,
                background: 'var(--sage-soft)',
                color: 'var(--sage-deep)',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              MET
            </span>
          )}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 12,
            color: row.you ? 'var(--terracotta-deep)' : 'var(--muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row.you ? 'Your last 7 days' : `${row.emoji} ${row.circle}`}
        </span>
      </span>
      <span style={{ flexShrink: 0, textAlign: 'right' }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 600,
            lineHeight: 1.2,
            fontVariantNumeric: 'tabular-nums',
            color: row.you ? 'var(--terracotta-deep)' : 'var(--ink)',
          }}
        >
          <Figure row={row} metric={metric} />
        </span>
        <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>
          {secondary(row, metric)}
        </span>
      </span>
    </motion.div>
  )
}

export default function Leaderboard({ onOpenCircles, onDiscover }) {
  const { state } = useStore()
  const [metric, setMetric] = useState('minutes')
  const [expanded, setExpanded] = useState(false)

  const rows = useMemo(() => boardRows(state), [state])
  const list = useMemo(() => ranked(rows, metric), [rows, metric])
  const me = list.find((r) => r.you) || null

  const podium = list.slice(0, 3)
  const rest = expanded ? list.slice(3) : list.slice(3, TOP)
  // Below the fold, show the user between the two people either side of them.
  const around = !expanded && me && me.rank > TOP ? list.slice(Math.max(TOP, me.rank - 2), me.rank + 1) : []
  const hasCircles = state.joinedGroups.length > 0
  // Someone who was on the board and aged out of it is told so, not told "yet".
  const lapsed = !me && (state.encounters || []).length > 0

  return (
    <div className="scroll" style={{ position: 'absolute', inset: 0, padding: '58px 18px 110px' }}>
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="eyebrow">Last {BOARD_WINDOW_DAYS} days</div>
        <h1 style={{ fontSize: 32, marginTop: 8, fontWeight: 500 }}>Met in person.</h1>
        <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14.5 }}>
          Only a tap between two phones counts here. Messages, points and good intentions do not.
        </p>
      </motion.header>

      {/* which column the board is sorted by */}
      <div
        role="tablist"
        aria-label="Rank by"
        style={{ display: 'flex', marginTop: 18, padding: 4, borderRadius: 999, background: 'var(--cream-deep)' }}
      >
        {METRICS.map(({ id, label, Icon }) => {
          const on = metric === id
          return (
            <button
              key={id}
              role="tab"
              aria-selected={on}
              onClick={() => setMetric(id)}
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '9px 0',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                color: on ? 'var(--ink)' : 'var(--ink-soft)',
                zIndex: 1,
              }}
            >
              {on && (
                <motion.span
                  layoutId="board-metric"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                    borderRadius: 999,
                    background: 'var(--paper)',
                    boxShadow: '0 4px 12px -6px rgba(47,49,71,0.35)',
                  }}
                />
              )}
              <Icon size={14} strokeWidth={2.4} /> {label}
            </button>
          )
        })}
      </div>

      {/* where the user stands */}
      {me ? (
        <motion.section
          className="card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          style={{ marginTop: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <div style={{ flexShrink: 0 }}>
            <div className="eyebrow">Your place</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 44,
                  fontWeight: 600,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {me.rank}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)' }}>of {list.length}</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0, borderLeft: '1px solid var(--line)', paddingLeft: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--terracotta)', lineHeight: 1.15 }}>
              {metric === 'minutes' ? fmtDuration(me.minutes) : peopleLabel(me.people)}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 2 }}>
              {metric === 'minutes' ? `with ${peopleLabel(me.people)}` : `over ${fmtDuration(me.minutes)}`}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, fontWeight: 700 }}>
              {gapTo(me, list[me.rank - 2], metric)}
            </div>
          </div>
        </motion.section>
      ) : (
        <motion.section
          className="card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          style={{
            marginTop: 16,
            padding: 18,
            borderStyle: 'dashed',
            borderColor: 'var(--line-strong)',
            background: 'transparent',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: 13,
                background: 'var(--cream-deep)',
                color: 'var(--terracotta)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Nfc size={20} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14.5 }}>
                {lapsed ? 'You have dropped off the board.' : 'You are not on the board yet.'}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>
                {lapsed
                  ? `Your last tap was more than ${BOARD_WINDOW_DAYS} days ago. Tap phones at a meetup and you are back on it.`
                  : 'Nobody is listed until their phone has touched someone else’s. Go to a meetup, tap phones, and you are on it.'}
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={hasCircles ? onOpenCircles : onDiscover}
            style={{ marginTop: 14 }}
          >
            {hasCircles ? <MessageCircle size={14} /> : <Compass size={14} />}
            {hasCircles ? 'Open my circles' : 'Find a circle'}
          </button>
        </motion.section>
      )}

      <Podium rows={podium} metric={metric} />

      <section className="card" style={{ marginTop: 0, padding: '4px 16px', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        {rest.map((r, i) => (
          <Row key={r.id} row={r} metric={metric} first={i === 0} />
        ))}
        {around.length > 0 && (
          <>
            <div
              aria-hidden
              style={{ textAlign: 'center', color: 'var(--muted)', letterSpacing: '0.4em', fontWeight: 800, padding: '2px 0 4px' }}
            >
              ···
            </div>
            {around.map((r, i) => (
              <Row key={r.id} row={r} metric={metric} first={i === 0} />
            ))}
          </>
        )}
      </section>

      {list.length > TOP && (
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            width: '100%',
            marginTop: 12,
            padding: 8,
            fontSize: 12.5,
            fontWeight: 800,
            color: 'var(--terracotta)',
          }}
        >
          {expanded ? 'Show the top 10' : `Show all ${list.length}`}
          <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      )}

      <p style={{ marginTop: 10, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5, textAlign: 'center' }}>
        {list.length} people tapped phones with someone in the last {BOARD_WINDOW_DAYS} days. Anything older has dropped
        off, so nobody starts a week behind.
      </p>
    </div>
  )
}
