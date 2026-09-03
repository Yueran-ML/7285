import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { INTERESTS } from '../data/interests.js'
import { useStore } from '../store/useStore.jsx'

export default function Interests({ onBack, onNext }) {
  const { state, dispatch } = useStore()
  const picked = state.interests
  const ok = picked.length >= 1

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '60px 22px 30px' }}>
      <button onClick={onBack} aria-label="Back" style={{ alignSelf: 'flex-start', color: 'var(--ink-soft)', padding: 6, marginLeft: -6 }}>
        <ArrowLeft size={22} />
      </button>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="eyebrow" style={{ marginTop: 8 }}>
          Step 1 of 1
        </div>
        <h1 style={{ fontSize: 34, marginTop: 10, fontWeight: 500 }}>
          Hi {state.name}. What do you <em style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>already</em> like?
        </h1>
        <p style={{ marginTop: 10, color: 'var(--ink-soft)', fontSize: 15 }}>Pick a few. We’ll find circles that overlap.</p>
      </motion.div>

      <div className="scroll" style={{ flex: 1, marginTop: 22, marginInline: -4, paddingInline: 4 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {INTERESTS.map((it, i) => {
            const on = picked.includes(it.id)
            return (
              <motion.button
                key={it.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.045, type: 'spring', stiffness: 380, damping: 24 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => dispatch({ type: 'TOGGLE_INTEREST', id: it.id })}
                aria-pressed={on}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 16px 12px 14px',
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: 14.5,
                  background: on ? 'var(--terracotta)' : 'var(--paper)',
                  color: on ? '#fff' : 'var(--ink)',
                  border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--line-strong)'}`,
                  boxShadow: on ? '0 10px 22px -10px var(--terracotta-glow)' : 'none',
                  transition: 'background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{it.emoji}</span>
                {it.label}
                {on && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'inline-flex' }}>
                    <Check size={15} strokeWidth={3} />
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ marginTop: 16 }}>
        <button
          className="btn btn-primary"
          disabled={!ok}
          onClick={() => {
            dispatch({ type: 'COMPLETE_ONBOARDING' })
            onNext()
          }}
          style={{ width: '100%' }}
        >
          {ok ? `Find my circles (${picked.length})` : 'Pick at least one'}
        </button>
      </motion.div>
    </div>
  )
}
