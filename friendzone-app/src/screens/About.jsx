import { motion } from 'framer-motion'
import { ArrowLeft, Check, Eraser } from 'lucide-react'
import { DISLIKES, LIKES, SOCIAL_STYLES, ZODIAC } from '../data/profile.js'
import { useStore } from '../store/useStore.jsx'

const BIO_MAX = 140

function Section({ title, hint, delay = 0, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      style={{ marginTop: 26 }}
    >
      <div className="eyebrow">{title}</div>
      {hint && <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.45 }}>{hint}</p>}
      <div style={{ marginTop: 12 }}>{children}</div>
    </motion.section>
  )
}

function TagChip({ on, emoji, label, tone = 'terracotta', onClick }) {
  const palette = {
    terracotta: { bg: 'var(--terracotta)', soft: 'var(--terracotta-soft)', glow: 'var(--terracotta-glow)' },
    sage: { bg: 'var(--sage)', soft: 'var(--sage-soft)', glow: 'rgba(127,169,143,0.35)' },
  }[tone]

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-pressed={on}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '10px 14px',
        borderRadius: 999,
        fontWeight: 800,
        fontSize: 13.5,
        background: on ? palette.bg : 'var(--paper)',
        color: on ? '#fff' : 'var(--ink)',
        border: `1.5px solid ${on ? palette.bg : 'var(--line-strong)'}`,
        boxShadow: on ? `0 8px 18px -9px ${palette.glow}` : 'none',
        transition: 'background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.18s',
      }}
    >
      <span style={{ fontSize: 15, lineHeight: 1 }}>{emoji}</span>
      {label}
      {on && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'inline-flex' }}>
          <Check size={13} strokeWidth={3} />
        </motion.span>
      )}
    </motion.button>
  )
}

export default function About({ mode = 'edit', onBack, onDone }) {
  const { state, dispatch } = useStore()
  const p = state.profile
  const onboarding = mode === 'onboarding'

  const setField = (field, value) => dispatch({ type: 'SET_PROFILE_FIELD', field, value })
  const toggleTag = (field, id) => dispatch({ type: 'TOGGLE_PROFILE_TAG', field, id })

  const touched =
    Boolean(p.socialStyle) || Boolean(p.zodiac) || p.likes.length > 0 || p.dislikes.length > 0 || Boolean(p.bio.trim())

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '52px 20px 0', flexShrink: 0 }}>
        <button onClick={onBack} aria-label="Back" style={{ color: 'var(--ink-soft)', padding: 6, marginLeft: -6 }}>
          <ArrowLeft size={22} />
        </button>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="eyebrow" style={{ marginTop: 6 }}>
            {onboarding ? 'Step 2 of 2 · optional' : 'About you'}
          </div>
          <h1 style={{ fontSize: 30, marginTop: 8, fontWeight: 500 }}>
            {onboarding ? 'Anything else we should know?' : 'About you'}
          </h1>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14.5, lineHeight: 1.5 }}>
            This helps us suggest circles that fit how you actually like to spend time. Every field is optional and only
            you decide what goes in.
          </p>
        </motion.div>
      </header>

      <div className="scroll" style={{ flex: 1, padding: '0 20px 20px', marginTop: 4 }}>
        <Section
          title="How you like to meet people"
          hint="There is no right answer, and you can change it whenever."
          delay={0.06}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SOCIAL_STYLES.map((s) => {
              const on = p.socialStyle === s.id
              return (
                <motion.button
                  key={s.id}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setField('socialStyle', s.id)}
                  aria-pressed={on}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 13,
                    textAlign: 'left',
                    padding: '14px 16px',
                    borderRadius: 18,
                    background: on ? 'var(--sage-soft)' : 'var(--paper)',
                    border: `1.5px solid ${on ? 'var(--sage)' : 'var(--line-strong)'}`,
                    boxShadow: on ? '0 10px 22px -14px rgba(127,169,143,0.7)' : 'none',
                    transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
                  }}
                >
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{s.emoji}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontWeight: 800,
                        fontSize: 14.5,
                        color: on ? 'var(--sage-deep)' : 'var(--ink)',
                      }}
                    >
                      {s.label}
                    </span>
                    <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{s.line}</span>
                  </span>
                  {on && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ display: 'inline-flex', color: 'var(--sage-deep)' }}
                    >
                      <Check size={17} strokeWidth={3} />
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </Section>

        <Section title="Things you enjoy" hint="Circles that share these will come up higher." delay={0.12}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LIKES.map((l) => (
              <TagChip
                key={l.id}
                on={p.likes.includes(l.id)}
                emoji={l.emoji}
                label={l.label}
                tone="terracotta"
                onClick={() => toggleTag('likes', l.id)}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Things you would rather avoid"
          hint="Nothing gets hidden from you. Circles that involve these just say so on the card."
          delay={0.18}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DISLIKES.map((d) => (
              <TagChip
                key={d.id}
                on={p.dislikes.includes(d.id)}
                emoji={d.emoji}
                label={d.label}
                tone="sage"
                onClick={() => toggleTag('dislikes', d.id)}
              />
            ))}
          </div>
        </Section>

        <Section title="Star sign" hint="Purely for fun. It is only ever an icebreaker, never a filter." delay={0.24}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {ZODIAC.map((z) => {
              const on = p.zodiac === z.id
              return (
                <motion.button
                  key={z.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setField('zodiac', z.id)}
                  aria-pressed={on}
                  title={z.dates}
                  style={{
                    padding: '11px 4px 9px',
                    borderRadius: 15,
                    background: on ? 'var(--gold-soft)' : 'var(--paper)',
                    border: `1.5px solid ${on ? 'var(--gold)' : 'var(--line-strong)'}`,
                    boxShadow: on ? '0 8px 18px -11px rgba(200,150,31,0.8)' : 'none',
                    transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
                  }}
                >
                  <div style={{ fontSize: 19, lineHeight: 1, color: on ? 'var(--gold-deep)' : 'var(--ink-soft)' }}>
                    {z.symbol}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      marginTop: 4,
                      color: on ? 'var(--gold-deep)' : 'var(--muted)',
                    }}
                  >
                    {z.label}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </Section>

        <Section title="One line about you" hint="Shown to circles you join. Skip it if you would rather not." delay={0.3}>
          <div
            style={{
              background: 'var(--paper)',
              border: '1.5px solid var(--line-strong)',
              borderRadius: 18,
              padding: '12px 14px',
            }}
          >
            <textarea
              value={p.bio}
              maxLength={BIO_MAX}
              onChange={(e) => dispatch({ type: 'SET_BIO', text: e.target.value })}
              placeholder="Just moved here for my masters. Still looking for a decent bakery."
              rows={2}
              style={{
                width: '100%',
                resize: 'none',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 14.5,
                lineHeight: 1.45,
              }}
            />
            <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>
              {p.bio.length}/{BIO_MAX}
            </div>
          </div>
        </Section>

        {touched && !onboarding && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_PROFILE' })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 20,
              fontSize: 12.5,
              fontWeight: 800,
              color: 'var(--muted)',
            }}
          >
            <Eraser size={13} /> Clear everything
          </button>
        )}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: '12px 20px calc(18px + env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--cream) 72%, rgba(250,246,239,0))',
        }}
      >
        <button className="btn btn-primary" onClick={onDone} style={{ width: '100%' }}>
          {onboarding ? (touched ? 'Find my circles' : 'Skip for now') : 'Done'}
        </button>
      </div>
    </div>
  )
}
