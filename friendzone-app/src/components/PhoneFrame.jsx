import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, SkipForward } from 'lucide-react'
import { useStore, dayLabel } from '../store/useStore.jsx'

function useViewportWidth() {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

export default function PhoneFrame({ children }) {
  const width = useViewportWidth()
  const narrow = width < 560 // real phone: full-screen, no frame
  const wide = width >= 1000 // room for captions beside the phone
  const { state, dispatch } = useStore()

  const statusBar = (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 22px',
        fontSize: 12.5,
        fontWeight: 800,
        color: 'var(--ink)',
        zIndex: 40,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, var(--cream) 55%, rgba(250,246,239,0))',
      }}
    >
      <span>
        Day {state.day} · {dayLabel(state.day)}
      </span>
      <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <span style={{ width: 14, height: 8, border: '1.5px solid var(--ink)', borderRadius: 3, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1.5, background: 'var(--ink)', borderRadius: 1 }} />
        </span>
      </span>
    </div>
  )

  if (narrow) {
    return (
      <div className="grain" style={{ position: 'fixed', inset: 0, background: 'var(--cream)', overflow: 'hidden' }}>
        {statusBar}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>{children}</div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: wide ? '1fr auto 1fr' : '1fr',
        justifyItems: 'center',
        alignItems: 'center',
        gap: 40,
        padding: '40px 32px',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(1200px 700px at 15% 10%, rgba(233,185,73,0.16), transparent 60%), radial-gradient(900px 600px at 90% 90%, rgba(127,169,143,0.18), transparent 60%), var(--cream)',
      }}
    >
      {/* decorative blobs */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(217,108,79,0.22), transparent 65%)',
          top: -80,
          right: '12%',
          filter: 'blur(10px)',
          animation: 'float-blob 12s ease-in-out infinite',
        }}
      />

      {/* left caption */}
      {wide && (
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ justifySelf: 'end', maxWidth: 300, textAlign: 'right' }}
      >
        <div className="eyebrow">Iteration 1 · Prototype</div>
        <h1 style={{ fontSize: 46, marginTop: 10, fontVariationSettings: "'SOFT' 100, 'opsz' 144", fontWeight: 500 }}>
          Friend<em style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>Zone</em>
        </h1>
        <p style={{ marginTop: 14, color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55 }}>
          Something to <em>do</em>, not something to say. Interest-based circles, gentle prompts, and small daily rewards for showing up.
        </p>
        <p style={{ marginTop: 18, fontSize: 12.5, color: 'var(--muted)' }}>Team FriendZone · DECO7285 · UQ 2026</p>
      </motion.aside>
      )}

      {/* phone */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 'var(--phone-w)',
          height: 'min(var(--phone-h), calc(100vh - 80px))',
          borderRadius: 48,
          background: '#1e1f2b',
          padding: 12,
          boxShadow: '0 40px 80px -30px rgba(47,49,71,0.55), 0 0 0 1px rgba(255,255,255,0.15) inset',
          position: 'relative',
        }}
      >
        <div
          className="grain"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 38,
            background: 'var(--cream)',
            overflow: 'hidden',
          }}
        >
          {/* notch */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 110,
              height: 26,
              background: '#1e1f2b',
              borderRadius: 999,
              zIndex: 50,
            }}
          />
          {statusBar}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>{children}</div>
        </div>
      </motion.div>

      {/* right: demo controls (narrower screens get them inside the Me tab) */}
      {wide ? (
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ justifySelf: 'start', maxWidth: 260 }}
      >
        <div className="eyebrow" style={{ color: 'var(--sage-deep)' }}>
          Demo controls
        </div>
        <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
          Points are earned once per circle per day. Skip ahead to see streaks and the post-meetup bonus window.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <button className="btn btn-sage" onClick={() => dispatch({ type: 'ADVANCE_DAY' })}>
            <SkipForward size={16} /> Skip to tomorrow
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (confirm('Reset the prototype to a fresh install?')) dispatch({ type: 'RESET' })
            }}
          >
            <RotateCcw size={16} /> Reset prototype
          </button>
        </div>
      </motion.aside>
      ) : (
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-sage btn-sm" onClick={() => dispatch({ type: 'ADVANCE_DAY' })}>
            <SkipForward size={14} /> Skip to tomorrow
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (confirm('Reset the prototype to a fresh install?')) dispatch({ type: 'RESET' })
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      )}
    </div>
  )
}
