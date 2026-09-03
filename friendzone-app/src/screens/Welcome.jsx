import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore.jsx'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const rise = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }

export default function Welcome({ onNext }) {
  const { state, dispatch } = useStore()
  const [name, setName] = useState(state.name)
  const ok = name.trim().length > 0

  const go = () => {
    if (!ok) return
    dispatch({ type: 'SET_NAME', name: name.trim() })
    onNext()
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '72px 26px 34px' }}>
      {/* warm backdrop shapes */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(233,185,73,0.45), rgba(233,185,73,0) 70%)',
          animation: 'float-blob 10s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 120,
          left: -140,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 60% 60%, rgba(127,169,143,0.4), rgba(127,169,143,0) 70%)',
          animation: 'float-blob 13s ease-in-out infinite reverse',
        }}
      />

      <motion.div variants={stagger} initial="hidden" animate="show" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <motion.div variants={rise} className="eyebrow">
          Welcome to Brisbane
        </motion.div>

        <motion.h1
          variants={rise}
          style={{ fontSize: 44, marginTop: 14, fontWeight: 500, lineHeight: 1.05, fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}
        >
          You don’t have to
          <br />
          <em style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>walk up</em> to anyone.
        </motion.h1>

        <motion.p variants={rise} style={{ marginTop: 18, fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 300 }}>
          Join small circles around things you already like. We’ll give you something to talk about, and a little nudge to keep going.
        </motion.p>

        <motion.div variants={rise} style={{ marginTop: 'auto' }}>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: 'var(--ink-soft)', marginBottom: 8, letterSpacing: '0.04em' }}>
            WHAT SHOULD WE CALL YOU?
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--paper)',
              border: '1.5px solid var(--line-strong)',
              borderRadius: 999,
              padding: '6px 6px 6px 20px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && go()}
              placeholder="Your first name"
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 16,
                fontWeight: 600,
                minWidth: 0,
              }}
            />
            <button
              className="btn btn-primary"
              onClick={go}
              disabled={!ok}
              aria-label="Continue"
              style={{ width: 46, height: 46, padding: 0, borderRadius: '50%' }}
            >
              <ArrowRight size={20} />
            </button>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>No account needed for this prototype.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
