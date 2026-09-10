import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Hand, MessageCircleQuestion, Shuffle } from 'lucide-react'
import { meetupPromptsFor } from '../data/prompts.js'
import { findGroup, useStore } from '../store/useStore.jsx'

// Deterministic-enough shuffle so the deck does not feel scripted, drawn once
// per session rather than per render.
function shuffled(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const KIND = {
  ask: { label: 'ASK THE GROUP', Icon: MessageCircleQuestion, accent: '#7fa98f', soft: 'rgba(127,169,143,0.16)' },
  do: { label: 'TRY THIS', Icon: Hand, accent: '#e09a7a', soft: 'rgba(224,154,122,0.16)' },
}

export default function MeetupMode() {
  const { state, dispatch } = useStore()
  const group = findGroup(state, state.meetupMode)
  const deck = useMemo(() => shuffled(meetupPromptsFor(group?.tags)), [group])
  const [i, setI] = useState(0)

  if (!group || !deck.length) return null

  const card = deck[i % deck.length]
  const kind = KIND[card.kind] || KIND.ask
  const next = () => setI((n) => n + 1)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(900px 500px at 20% 0%, rgba(217,108,79,0.30), transparent 62%), radial-gradient(700px 500px at 90% 100%, rgba(127,169,143,0.28), transparent 60%), #24263a',
        color: '#fff',
        padding: '52px 20px calc(20px + env(safe-area-inset-bottom))',
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
        <button
          onClick={() => dispatch({ type: 'EXIT_MEETUP_MODE' })}
          style={{
            flexShrink: 0,
            padding: '8px 14px',
            borderRadius: 999,
            border: '1.5px solid rgba(255,255,255,0.28)',
            color: 'rgba(255,255,255,0.9)',
            fontSize: 12.5,
            fontWeight: 800,
          }}
        >
          I’m off
        </button>
      </header>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          flexShrink: 0,
          marginTop: 22,
          fontSize: 13.5,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.62)',
        }}
      >
        You’re here, so the rest of the app is switched off. No chat, no points, nothing to keep up with. Just something
        to open with if the table goes quiet.
      </motion.p>

      {/* the card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 0, padding: '10px 0' }}>
        {/* Keyed remount rather than AnimatePresence: the next card must appear
            the instant it is asked for, with no exit animation to wait on. */}
        <motion.button
          key={i}
          onClick={next}
          aria-live="polite"
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            textAlign: 'left',
            background: 'var(--paper)',
            color: 'var(--ink)',
            borderRadius: 26,
            padding: '24px 22px 26px',
            boxShadow: '0 30px 60px -28px rgba(0,0,0,0.65)',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 11px',
              borderRadius: 999,
              background: kind.soft,
              color: kind.accent,
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: '0.12em',
            }}
          >
            <kind.Icon size={12} strokeWidth={2.6} />
            {kind.label}
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 25,
              lineHeight: 1.3,
              fontWeight: 500,
              marginTop: 16,
            }}
          >
            {card.text}
          </span>
          <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 18, fontWeight: 700 }}>
            Tap for another
          </span>
        </motion.button>
      </div>

      {/* footer */}
      <div style={{ flexShrink: 0 }}>
        <button
          onClick={next}
          className="btn"
          style={{ width: '100%', background: 'rgba(255,255,255,0.14)', color: '#fff', backdropFilter: 'blur(4px)' }}
        >
          <Shuffle size={16} /> Something else
        </button>
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 14,
            fontSize: 11.5,
            color: 'rgba(255,255,255,0.45)',
            textAlign: 'center',
          }}
        >
          <Check size={12} strokeWidth={3} />
          Nothing here earns points. Put the phone down.
        </p>
      </div>
    </motion.div>
  )
}
