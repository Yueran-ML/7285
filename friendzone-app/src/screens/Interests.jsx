import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ChevronRight, X } from 'lucide-react'
import { INTEREST_MAP, ROOT_INTERESTS, childrenOf, subtreeIds, trailOf } from '../data/interests.js'
import { useStore } from '../store/useStore.jsx'

export default function Interests({ onBack, onNext }) {
  const { state, dispatch } = useStore()
  const picked = state.interests
  // Drill path through the tree. Empty means we are looking at the roots.
  const [stack, setStack] = useState([])

  const hereId = stack[stack.length - 1] || null
  const nodes = hereId ? childrenOf(hereId) : ROOT_INTERESTS
  const here = hereId ? INTEREST_MAP[hereId] : null
  const ok = picked.length >= 1

  const toggle = (id) => dispatch({ type: 'TOGGLE_INTEREST', id })
  const isPicked = (id) => picked.includes(id)
  // A parent shows a marker when anything beneath it is selected.
  const countBelow = (id) => subtreeIds(id).filter((x) => picked.includes(x)).length

  const goBack = () => {
    if (stack.length) setStack((s) => s.slice(0, -1))
    else onBack()
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '52px 20px 0', flexShrink: 0 }}>
        <button onClick={goBack} aria-label="Back" style={{ color: 'var(--ink-soft)', padding: 6, marginLeft: -6 }}>
          <ArrowLeft size={22} />
        </button>

        <div className="eyebrow" style={{ marginTop: 6 }}>
          Step 1 of 2
        </div>

        {here ? (
          <>
            <h1 style={{ fontSize: 28, marginTop: 8, fontWeight: 500 }}>
              {here.emoji} {here.label}
            </h1>
            <p style={{ marginTop: 6, color: 'var(--muted)', fontSize: 13 }}>{trailOf(here.id).join(' · ')}</p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 32, marginTop: 8, fontWeight: 500 }}>
              Hi {state.name}. What do you <em style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>already</em>{' '}
              like?
            </h1>
            <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14.5, lineHeight: 1.5 }}>
              Pick as broadly or as specifically as you want. Tap a category to go deeper.
            </p>
          </>
        )}
      </header>

      <div className="scroll" style={{ flex: 1, padding: '18px 20px 12px' }}>
        {/* select the whole branch you are standing in */}
        {here && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => toggle(here.id)}
            aria-pressed={isPicked(here.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              textAlign: 'left',
              padding: '13px 15px',
              borderRadius: 16,
              marginBottom: 12,
              background: isPicked(here.id) ? 'var(--terracotta)' : 'transparent',
              color: isPicked(here.id) ? '#fff' : 'var(--ink-soft)',
              border: `1.5px ${isPicked(here.id) ? 'solid var(--terracotta)' : 'dashed var(--line-strong)'}`,
              fontWeight: 800,
              fontSize: 13.5,
            }}
          >
            <span style={{ flex: 1 }}>Anything in {here.label}</span>
            {isPicked(here.id) && <Check size={15} strokeWidth={3} />}
          </motion.button>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {nodes.map((n, i) => {
            const on = isPicked(n.id)
            const hasKids = Boolean(n.children?.length)
            const below = hasKids ? countBelow(n.id) - (on ? 1 : 0) : 0
            return (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.03 + i * 0.025, type: 'spring', stiffness: 400, damping: 26 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (hasKids ? setStack((s) => [...s, n.id]) : toggle(n.id))}
                aria-pressed={hasKids ? undefined : on}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 15px',
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: 14,
                  background: on ? 'var(--terracotta)' : 'var(--paper)',
                  color: on ? '#fff' : 'var(--ink)',
                  border: `1.5px solid ${on ? 'var(--terracotta)' : below ? 'var(--terracotta)' : 'var(--line-strong)'}`,
                  boxShadow: on ? '0 10px 22px -10px var(--terracotta-glow)' : 'none',
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{n.emoji}</span>
                {n.label}
                {below > 0 && (
                  <span
                    style={{
                      background: 'var(--terracotta)',
                      color: '#fff',
                      borderRadius: 999,
                      fontSize: 10.5,
                      padding: '1px 6px',
                    }}
                  >
                    {below}
                  </span>
                )}
                {hasKids && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
                {on && <Check size={14} strokeWidth={3} />}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* what you have picked so far, always visible */}
      <div
        style={{
          flexShrink: 0,
          padding: '10px 20px calc(16px + env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--cream) 76%, rgba(250,246,239,0))',
        }}
      >
        {picked.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12, maxHeight: 84, overflowY: 'auto' }}>
            {picked.map((id) => (
              <button
                key={id}
                onClick={() => toggle(id)}
                className="chip"
                style={{ background: 'var(--terracotta-soft)', color: 'var(--terracotta-deep)' }}
                title={trailOf(id).join(' · ')}
              >
                {INTEREST_MAP[id]?.emoji} {INTEREST_MAP[id]?.label}
                <X size={12} strokeWidth={3} />
              </button>
            ))}
          </div>
        )}
        <button
          className="btn btn-primary"
          disabled={!ok}
          onClick={() => {
            dispatch({ type: 'COMPLETE_ONBOARDING' })
            onNext()
          }}
          style={{ width: '100%' }}
        >
          {ok ? `Next (${picked.length} picked)` : 'Pick at least one'}
        </button>
      </div>
    </div>
  )
}
