import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CalendarCheck, Lightbulb, RefreshCw, Send, Sparkles, Users } from 'lucide-react'
import { GROUP_MAP } from '../data/groups.js'
import { promptsFor } from '../data/prompts.js'
import Avatar from '../components/Avatar.jsx'
import PointBurst from '../components/PointBurst.jsx'
import { useStore, bonusActive, bonusDaysLeft, BONUS_AMOUNT } from '../store/useStore.jsx'

function TypingDots({ member }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      style={{ display: 'flex', gap: 8, alignItems: 'flex-end', paddingLeft: 2 }}
    >
      <Avatar name={member.name} color={member.color} size={26} />
      <div
        style={{
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          borderRadius: '18px 18px 18px 6px',
          padding: '10px 14px',
          display: 'flex',
          gap: 4,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--muted)',
              animation: `typing-dot 1.2s ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function MeetupBanner({ group, state, dispatch }) {
  const m = state.meetups[group.id] || {}
  const bonus = bonusActive(state, group.id)
  const left = bonusDaysLeft(state, group.id)

  if (bonus) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          margin: '10px 16px 0',
          padding: '12px 14px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #fbf0d0, #f6d27a)',
          color: '#5a3d00',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 10px 24px -14px rgba(200,150,31,0.6)',
        }}
      >
        <Sparkles size={18} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5 }}>You met in person. Keep the thread going.</div>
          <div style={{ fontSize: 12.5, opacity: 0.85 }}>
            +{BONUS_AMOUNT} per day for {left} more day{left === 1 ? '' : 's'}
          </div>
        </div>
      </motion.div>
    )
  }

  if (m.attendedDay != null) {
    return null
  }

  if (m.rsvpDay != null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          margin: '10px 16px 0',
          padding: '12px 14px',
          borderRadius: 16,
          background: 'var(--sage-soft)',
          color: 'var(--sage-deep)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <CalendarCheck size={18} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5 }}>You’re going · {group.meetup.activity}</div>
          <div style={{ fontSize: 12.5, opacity: 0.9 }}>
            {group.meetup.day} {group.meetup.time} · {group.meetup.place}
          </div>
        </div>
        <button
          className="btn btn-sage btn-sm"
          onClick={() => dispatch({ type: 'ATTEND_MEETUP', groupId: group.id })}
          title="Demo: mark this meetup as attended"
        >
          I went
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        margin: '10px 16px 0',
        padding: '12px 14px',
        borderRadius: 16,
        background: 'var(--paper)',
        border: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 22 }}>📍</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 13.5 }}>{group.meetup.activity}</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
          {group.meetup.day} {group.meetup.time} · {group.meetup.place} · {group.members.length} going
        </div>
      </div>
      <button className="btn btn-primary btn-sm" onClick={() => dispatch({ type: 'RSVP_MEETUP', groupId: group.id })}>
        I’m in
      </button>
    </motion.div>
  )
}

export default function Chat({ groupId, onBack }) {
  const { state, dispatch } = useStore()
  const group = GROUP_MAP[groupId]
  const messages = state.messages[groupId] || []
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(null)
  const [promptIdx, setPromptIdx] = useState(0)
  const [promptOpen, setPromptOpen] = useState(true)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timers = useRef([])

  const prompts = useMemo(() => promptsFor(group?.tags), [group])
  const prompt = prompts[promptIdx % prompts.length]
  const doneToday = state.checkIns[groupId] === state.day
  const bonus = bonusActive(state, groupId)
  const earned = state.lastEarned && state.lastEarned.groupId === groupId ? state.lastEarned : null

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length, typing])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (!earned) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_EARNED' }), 1800)
    return () => clearTimeout(t)
  }, [earned, dispatch])

  if (!group) return null

  const send = () => {
    const t = text.trim()
    if (!t) return
    dispatch({ type: 'SEND_MESSAGE', groupId, text: t })
    setText('')
    setPromptOpen(false)

    // Simulated reply from a circle member so the prototype feels alive.
    const member = group.members[Math.floor(Math.random() * group.members.length)]
    const reply = group.replies[Math.floor(Math.random() * group.replies.length)]
    const t1 = setTimeout(() => setTyping(member), 700 + Math.random() * 500)
    const t2 = setTimeout(() => {
      setTyping(null)
      dispatch({ type: 'RECEIVE_MESSAGE', groupId, from: member.name, text: reply })
    }, 2000 + Math.random() * 1200)
    timers.current.push(t1, t2)
  }

  const usePrompt = () => {
    setText(prompt)
    inputRef.current?.focus()
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <header
        style={{
          padding: '52px 14px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--cream)',
          borderBottom: '1px solid var(--line)',
          zIndex: 2,
        }}
      >
        <button onClick={onBack} aria-label="Back" style={{ padding: 6, color: 'var(--ink-soft)' }}>
          <ArrowLeft size={22} />
        </button>
        <div style={{ width: 40, height: 40, borderRadius: 13, background: 'var(--cream-deep)', display: 'grid', placeItems: 'center', fontSize: 21 }}>
          {group.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.name}</h2>
          <div
            style={{
              fontSize: 12,
              color: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Users size={12} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {group.members.length + 1} members · {group.place}
            </span>
          </div>
        </div>
        <div
          style={{
            padding: '5px 10px',
            borderRadius: 999,
            background: doneToday ? 'var(--sage-soft)' : 'var(--gold-soft)',
            color: doneToday ? 'var(--sage-deep)' : 'var(--gold-deep)',
            fontSize: 11.5,
            fontWeight: 800,
            whiteSpace: 'nowrap',
          }}
        >
          {doneToday ? '✓ today' : `+${bonus ? BONUS_AMOUNT : 1} today`}
        </div>
      </header>

      <MeetupBanner group={group} state={state} dispatch={dispatch} />

      {/* messages */}
      <div ref={listRef} className="scroll" style={{ flex: 1, padding: '14px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', fontWeight: 700, margin: '4px 0 6px' }}>
          Day {state.day}
        </div>
        {messages.map((m, i) => {
          const prev = messages[i - 1]
          const sameAuthor = prev && prev.from === m.from && prev.mine === m.mine
          const member = group.members.find((x) => x.name === m.from)
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-end',
                justifyContent: m.mine ? 'flex-end' : 'flex-start',
                marginTop: sameAuthor ? -4 : 0,
              }}
            >
              {!m.mine && (
                <div style={{ width: 26, flexShrink: 0 }}>
                  {!sameAuthor && <Avatar name={m.from} color={member?.color || 'var(--sage)'} size={26} />}
                </div>
              )}
              <div style={{ maxWidth: '76%' }}>
                {!m.mine && !sameAuthor && (
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--ink-soft)', margin: '0 0 3px 4px' }}>{m.from}</div>
                )}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: m.mine ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
                    background: m.mine ? 'var(--terracotta)' : 'var(--paper)',
                    color: m.mine ? '#fff' : 'var(--ink)',
                    border: m.mine ? 'none' : '1px solid var(--line)',
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    boxShadow: m.mine ? '0 8px 18px -10px var(--terracotta-glow)' : 'none',
                    wordBreak: 'break-word',
                  }}
                >
                  {m.text}
                </div>
              </div>
            </motion.div>
          )
        })}
        <AnimatePresence>{typing && <TypingDots key="typing" member={typing} />}</AnimatePresence>
      </div>

      {/* prompt card */}
      <AnimatePresence initial={false}>
        {promptOpen ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 12, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '0 16px', overflow: 'hidden' }}
          >
            <div
              style={{
                background: 'var(--paper)',
                border: '1.5px dashed var(--line-strong)',
                borderRadius: 18,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 800, color: 'var(--terracotta)', letterSpacing: '0.06em' }}>
                <Lightbulb size={13} /> NEED A NUDGE?
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={promptIdx}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontFamily: 'var(--font-display)', fontSize: 16.5, fontWeight: 500, lineHeight: 1.35 }}
                >
                  “{prompt}”
                </motion.p>
              </AnimatePresence>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={usePrompt}>
                  Use this
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setPromptIdx((i) => i + 1)}>
                  <RefreshCw size={13} /> Another
                </button>
                <button onClick={() => setPromptOpen(false)} style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--muted)', fontWeight: 700 }}>
                  Hide
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="prompt-collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '0 16px' }}>
            <button
              onClick={() => setPromptOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 800, color: 'var(--terracotta)', padding: '4px 2px' }}
            >
              <Lightbulb size={13} /> Show a prompt
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* composer */}
      <div style={{ padding: '10px 14px calc(14px + env(safe-area-inset-bottom))', position: 'relative' }}>
        <PointBurst earned={earned} />
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            background: 'var(--paper)',
            border: '1.5px solid var(--line-strong)',
            borderRadius: 26,
            padding: '6px 6px 6px 16px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={doneToday ? 'Message the circle…' : 'Say anything to show up today'}
            rows={1}
            style={{
              flex: 1,
              resize: 'none',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 15,
              lineHeight: 1.4,
              padding: '9px 0',
              maxHeight: 96,
              minWidth: 0,
            }}
          />
          <button
            className="btn btn-primary"
            onClick={send}
            disabled={!text.trim()}
            aria-label="Send"
            style={{ width: 42, height: 42, padding: 0, borderRadius: '50%' }}
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
