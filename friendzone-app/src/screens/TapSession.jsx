import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, FastForward, Nfc } from 'lucide-react'
import Avatar from '../components/Avatar.jsx'
import { fmtDuration, myRanks, peopleLabel } from '../data/board.js'
import { SESSION_CAP_MIN, sessionMinutes } from '../data/session.js'
import { findGroup, useStore } from '../store/useStore.jsx'

// How long two phones have to stay together before the tap counts. Real NFC
// needs a moment of contact as well, and the pause is what makes this read as
// a touch rather than a swipe past.
const DWELL_MS = 650
const FLY_MS = 420
// Two phones are touching once mine covers this much of theirs. It does not
// matter which part of my phone is being held.
const OVERLAP = 0.25

const overlapArea = (a, b) =>
  Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
  Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))

// The contactless symbol, drawn as rings clipped to their top half so they
// leave the top edge of the phone, where the antenna sits.
function Waves({ hot }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '100%',
        width: 108,
        height: 54,
        marginLeft: -54,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="tap-motion"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -54,
            width: 108,
            height: 108,
            borderRadius: '50%',
            border: `2px solid ${hot ? 'var(--gold)' : 'rgba(255,255,255,0.75)'}`,
            opacity: 0,
            animation: `nfc-wave ${hot ? 0.9 : 1.9}s ease-out ${i * (hot ? 0.3 : 0.63)}s infinite`,
          }}
        />
      ))}
    </span>
  )
}

// Fills while my phone rests against theirs.
function DwellRing() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 44 44"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 44,
        height: 44,
        margin: '-22px 0 0 -22px',
        transform: 'rotate(-90deg)',
        pointerEvents: 'none',
      }}
    >
      <circle
        className="tap-motion"
        cx="22"
        cy="22"
        r="19"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        style={{ animation: `dwell-fill ${DWELL_MS}ms linear forwards` }}
      />
    </svg>
  )
}

// The moment of contact.
function Burst() {
  return [0, 1, 2].map((i) => (
    <motion.span
      key={i}
      aria-hidden
      initial={{ scale: 0.4, opacity: 0.95 }}
      animate={{ scale: 2.7, opacity: 0 }}
      transition={{ duration: 0.85, delay: i * 0.13, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 46,
        height: 46,
        margin: '-23px 0 0 -23px',
        borderRadius: '50%',
        border: '2px solid var(--gold)',
        pointerEvents: 'none',
      }}
    />
  ))
}

export default function TapSession() {
  const { state, dispatch } = useStore()
  const session = state.tapSession
  const group = findGroup(state, session?.groupId)

  const [now, setNow] = useState(() => Date.now())
  const [drag, setDrag] = useState(null) // { dx, dy } while my phone is being carried
  const [auto, setAuto] = useState(null) // { dx, dy } while it travels to someone by itself
  const [near, setNear] = useState(null) // whose phone mine is resting against
  const [burst, setBurst] = useState(null) // { name, key } at the moment of contact

  // On a short screen everything on the table is drawn smaller, so that my
  // phone never ends up sitting on top of somebody's name.
  const [compact, setCompact] = useState(false)
  const rootRef = useRef(null)
  const meRef = useRef(null)
  const targetRefs = useRef(new Map())
  const geom = useRef(null) // measurements taken when a drag starts
  const dwell = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(
    () => () => {
      clearTimeout(dwell.current)
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(() => setCompact(el.clientHeight < 680))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!session || !group) return null

  const members = group.members
  const tapped = new Set(session.taps.map((t) => t.name))
  const mins = sessionMinutes(session, now)
  const running = session.t0 != null
  const capped = mins >= SESSION_CAP_MIN
  const minutesWith = (name) => {
    const tap = session.taps.find((t) => t.name === name)
    return tap ? Math.max(0, mins - tap.atMin) : 0
  }

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  const connect = (name) => {
    if (tapped.has(name)) return
    dispatch({ type: 'TAP_PERSON', name })
    setNear(null)
    setBurst((b) => ({ name, key: (b ? b.key : 0) + 1 }))
    later(() => setBurst((b) => (b && b.name === name ? null : b)), 1300)
    if (geom.current) {
      geom.current.near = null
      geom.current.targets = geom.current.targets.filter((t) => t.name !== name)
    }
    try {
      navigator.vibrate?.([16, 50, 26])
    } catch {
      /* no haptics on this device */
    }
  }

  // Carrying my phone onto theirs.
  const startDrag = (e) => {
    if (auto || e.button > 0) return
    try {
      // Keeps the drag alive when the pointer leaves the phone's outline.
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* the drag still works while the pointer stays over the phone */
    }
    const me = meRef.current.getBoundingClientRect()
    geom.current = {
      x0: e.clientX,
      y0: e.clientY,
      // Where my phone sits at rest; a drag only ever shifts this.
      me: { left: me.left, top: me.top, right: me.right, bottom: me.bottom },
      near: null,
      targets: members
        .filter((m) => !tapped.has(m.name))
        .map((m) => {
          const r = targetRefs.current.get(m.name)?.getBoundingClientRect()
          return r ? { name: m.name, left: r.left, top: r.top, right: r.right, bottom: r.bottom, area: r.width * r.height } : null
        })
        .filter(Boolean),
    }
    setDrag({ dx: 0, dy: 0 })
  }

  const moveDrag = (e) => {
    const g = geom.current
    if (!g) return
    const dx = e.clientX - g.x0
    const dy = e.clientY - g.y0
    setDrag({ dx, dy })

    const mine = { left: g.me.left + dx, top: g.me.top + dy, right: g.me.right + dx, bottom: g.me.bottom + dy }
    let best = null
    for (const t of g.targets) {
      const covered = overlapArea(mine, t) / t.area
      if (covered >= OVERLAP && (!best || covered > best.covered)) best = { name: t.name, covered }
    }
    const name = best ? best.name : null
    if (name === g.near) return
    g.near = name
    clearTimeout(dwell.current)
    setNear(name)
    if (name) dwell.current = setTimeout(() => connect(name), DWELL_MS)
  }

  const endDrag = () => {
    const g = geom.current
    if (!g) return
    clearTimeout(dwell.current)
    // Letting go while the phones are still touching counts as well.
    if (g.near) connect(g.near)
    geom.current = null
    setDrag(null)
    setNear(null)
  }

  // Tapping a person sends my phone over to theirs. Same contact, same
  // animation, and it works from a keyboard.
  const flyTo = (name) => {
    if (auto || geom.current || tapped.has(name)) return
    const me = meRef.current?.getBoundingClientRect()
    const r = targetRefs.current.get(name)?.getBoundingClientRect()
    if (!me || !r) {
      connect(name)
      return
    }
    setAuto({ dx: r.left + r.width / 2 - (me.left + me.width / 2), dy: r.top + r.height * 0.62 - me.top })
    later(() => setNear(name), FLY_MS)
    later(() => connect(name), FLY_MS + DWELL_MS)
    later(() => setAuto(null), FLY_MS + DWELL_MS + 380)
  }

  const end = () => dispatch({ type: 'END_SESSION', before: myRanks(state) })

  const carried = drag || auto
  const touching = Boolean(near)
  const n = members.length

  let caption
  if (!n) caption = 'Nobody else from this circle is here yet.'
  else if (capped) caption = 'This meetup closed itself at four hours, so a forgotten phone cannot keep counting.'
  else if (near) caption = `Hold it against ${near}’s phone…`
  else if (burst) caption = `Connected with ${burst.name}. ${tapped.size === 1 ? 'The clock is running.' : 'They are on the clock too.'}`
  else if (tapped.size === n) caption = 'Everyone here is on the clock.'
  else if (!tapped.size) caption = 'Drag your phone onto someone else’s, or tap them. That is the two phones touching.'
  else caption = 'Tap phones with anyone else who is here.'

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
        background:
          'radial-gradient(900px 500px at 20% 0%, rgba(217,108,79,0.30), transparent 62%), radial-gradient(700px 500px at 90% 100%, rgba(127,169,143,0.28), transparent 60%), #24263a',
        color: '#fff',
        padding: '52px 20px calc(16px + env(safe-area-inset-bottom))',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{group.emoji}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              display: 'block',
              fontSize: 14.5,
              fontWeight: 800,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {group.name}
          </span>
          <span
            style={{
              display: 'block',
              fontSize: 11.5,
              color: 'rgba(255,255,255,0.55)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {group.meetup.activity} · {group.meetup.place}
          </span>
        </span>
        <span
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 11px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.1)',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.1em',
          }}
        >
          <Nfc size={13} /> IN PERSON
        </span>
      </header>

      {/* the clock */}
      <div style={{ flexShrink: 0, marginTop: compact ? 8 : 16, textAlign: 'center' }}>
        <div
          aria-label={`${fmtDuration(mins)} together`}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: compact ? 38 : 50,
            fontWeight: 500,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            opacity: running ? 1 : 0.32,
            transition: 'opacity 300ms ease',
          }}
        >
          {fmtDuration(mins)}
        </div>
        <div style={{ marginTop: compact ? 4 : 7, fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
          {running ? `together with ${peopleLabel(tapped.size)}` : 'The clock starts when two phones touch.'}
        </div>
      </div>

      {/* the table: everyone else's phone, and mine */}
      <div style={{ position: 'relative', flex: '1 0 auto', minHeight: compact ? 236 : 300 }}>
        {/* Up to six phones share one row and narrow to fit it. More than that wraps. */}
        <div
          style={{
            display: 'flex',
            flexWrap: n > 6 ? 'wrap' : 'nowrap',
            justifyContent: 'center',
            gap: n > 6 ? '16px 8px' : n > 4 ? 4 : 8,
            paddingTop: compact ? 10 : 22,
          }}
        >
          {members.map((m, i) => {
            const isTapped = tapped.has(m.name)
            const isNear = near === m.name && !isTapped
            const bursting = burst && burst.name === m.name
            // Up to six phones sit in a shallow fan facing mine.
            const mid = (n - 1) / 2
            const off = n > 1 && n <= 6 ? (i - mid) / mid : 0
            const drop = Math.round(off * off * (compact ? 10 : 20))
            const fan = n <= 6 ? `translateY(${drop}px) rotate(${(off * 7).toFixed(1)}deg)` : 'none'
            return (
              <button
                key={m.name}
                onClick={() => flyTo(m.name)}
                aria-disabled={isTapped}
                aria-label={
                  isTapped ? `${m.name}, together for ${fmtDuration(minutesWith(m.name))}` : `Tap phones with ${m.name}`
                }
                style={{
                  flex: '0 1 52px',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  transform: fan,
                  cursor: isTapped ? 'default' : 'pointer',
                }}
              >
                <span
                  ref={(el) => {
                    if (el) targetRefs.current.set(m.name, el)
                    else targetRefs.current.delete(m.name)
                  }}
                  className="tap-motion"
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 46,
                    aspectRatio: '46 / 78',
                    borderRadius: 12,
                    display: 'grid',
                    placeItems: 'center',
                    border: `1.5px solid ${isTapped ? 'rgba(168,220,187,0.9)' : isNear ? 'var(--gold)' : 'rgba(255,255,255,0.3)'}`,
                    background: isTapped
                      ? 'linear-gradient(160deg, rgba(127,169,143,0.55), rgba(93,138,111,0.32))'
                      : 'rgba(255,255,255,0.08)',
                    boxShadow: isNear
                      ? '0 0 0 4px rgba(233,185,73,0.25), 0 0 26px rgba(233,185,73,0.5)'
                      : isTapped
                        ? '0 0 22px -4px rgba(127,169,143,0.75)'
                        : 'none',
                    transform: isNear ? 'scale(1.1)' : 'none',
                    transition: 'transform 160ms ease, box-shadow 200ms ease, background 300ms ease, border-color 200ms ease',
                    animation: bursting ? 'tap-bump 520ms ease-out' : 'none',
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: 5,
                      width: 14,
                      height: 3,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.3)',
                    }}
                  />
                  <Avatar name={m.name} color={m.color} size={28} />
                  {isNear && <DwellRing />}
                  {bursting && <Burst key={burst.key} />}
                  {isTapped && (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        right: -6,
                        bottom: -6,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'var(--sage)',
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: '0 0 0 2px #24263a',
                      }}
                    >
                      <Check size={12} strokeWidth={3.4} />
                    </span>
                  )}
                </span>
                <span
                  style={{
                    maxWidth: '100%',
                    fontSize: 11.5,
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {m.name}
                </span>
                <span
                  style={{
                    marginTop: -3,
                    fontSize: 10.5,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: isTapped ? '#a8dcbb' : 'rgba(255,255,255,0.42)',
                  }}
                >
                  {isTapped ? fmtDuration(minutesWith(m.name)) : 'not yet'}
                </span>
              </button>
            )
          })}
        </div>

        {/* my phone */}
        {n > 0 && (
          <div
            ref={meRef}
            role="img"
            aria-label="Your phone. Drag it onto someone else’s phone to tap."
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: compact ? 4 : 10,
              width: compact ? 60 : 74,
              height: compact ? 98 : 122,
              marginLeft: compact ? -30 : -37,
              zIndex: carried ? 6 : 2,
              transform: carried ? `translate(${carried.dx}px, ${carried.dy}px)` : 'none',
              transition: drag
                ? 'none'
                : auto
                  ? `transform ${FLY_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
                  : 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              touchAction: 'none',
              cursor: drag ? 'grabbing' : 'grab',
            }}
          >
            <div
              className="tap-motion"
              style={{ width: '100%', height: '100%', animation: carried ? 'none' : 'tap-bob 2.6s ease-in-out infinite' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: 18,
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  border: `2px solid ${touching ? 'var(--gold)' : '#fff'}`,
                  boxShadow: touching
                    ? '0 0 30px rgba(233,185,73,0.55), 0 24px 40px -18px rgba(0,0,0,0.75)'
                    : '0 24px 40px -18px rgba(0,0,0,0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: compact ? 3 : 6,
                  transform: `rotate(${touching ? -10 : carried ? -4 : 0}deg)`,
                  transition: 'transform 180ms ease, box-shadow 200ms ease, border-color 200ms ease',
                }}
              >
                <Waves hot={touching} />
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 7,
                    width: 20,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--line-strong)',
                  }}
                />
                <Avatar name={state.name || 'You'} color="var(--terracotta)" size={compact ? 28 : 34} />
                <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.1em', color: 'var(--ink-soft)' }}>YOU</span>
                <Nfc size={compact ? 13 : 15} color={touching ? 'var(--gold-deep)' : 'var(--muted)'} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ flexShrink: 0 }}>
        <p
          aria-live="polite"
          style={{
            minHeight: 38,
            marginBottom: compact ? 8 : 12,
            fontSize: 13,
            lineHeight: 1.45,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.74)',
          }}
        >
          {caption}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn"
            onClick={() => dispatch({ type: 'SKIP_SESSION_TIME', minutes: 30 })}
            disabled={!running || capped}
            title="Prototype control: jump the clock forward"
            style={{
              flexShrink: 0,
              padding: '14px 16px',
              fontSize: 13,
              border: '1.5px dashed rgba(255,255,255,0.32)',
              color: 'rgba(255,255,255,0.85)',
              opacity: !running || capped ? 0.38 : 1,
              cursor: !running || capped ? 'not-allowed' : 'pointer',
            }}
          >
            <FastForward size={14} /> Skip 30 min
          </button>
          <button className="btn btn-primary" onClick={end} style={{ flex: 1 }}>
            {tapped.size ? 'End meetup' : 'Leave'}
          </button>
        </div>
        <p style={{ marginTop: 11, fontSize: 11, lineHeight: 1.4, textAlign: 'center', color: 'rgba(255,255,255,0.42)' }}>
          Prototype: the drag stands in for an NFC tap, and one second here is one minute.
        </p>
      </div>
    </motion.div>
  )
}
