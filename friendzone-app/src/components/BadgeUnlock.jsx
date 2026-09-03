import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BADGES } from '../data/badges.js'

// Badge reveals are held back briefly so a same-moment point burst can play first.
const REVEAL_DELAY = 1400

export default function BadgeUnlock({ badgeId, onClose }) {
  const [shown, setShown] = useState(null)

  useEffect(() => {
    if (!badgeId) return undefined
    const t = setTimeout(() => setShown(badgeId), REVEAL_DELAY)
    return () => clearTimeout(t)
  }, [badgeId])

  // Only render once the delay has elapsed for the *current* badge; a cleared
  // badgeId hides immediately (exit animation) without touching state.
  const badge = badgeId && shown === badgeId ? BADGES.find((b) => b.id === badgeId) : null
  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, pointerEvents: 'auto' }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 60,
            background: 'rgba(47,49,71,0.45)',
            backdropFilter: 'blur(6px)',
            display: 'grid',
            placeItems: 'center',
            padding: 28,
          }}
        >
          <motion.div
            initial={{ scale: 0.7, y: 30, rotate: -4 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              background: 'var(--paper)',
              borderRadius: 28,
              padding: '32px 24px 24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-float)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: -40,
                background:
                  'radial-gradient(circle at 50% 30%, rgba(233,185,73,0.35), transparent 55%), radial-gradient(circle at 20% 80%, rgba(217,108,79,0.18), transparent 50%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative' }}>
              <div className="eyebrow" style={{ color: 'var(--gold-deep)' }}>
                New badge
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.25, 1] }}
                transition={{ delay: 0.15, duration: 0.5 }}
                style={{
                  fontSize: 64,
                  margin: '14px 0 8px',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))',
                }}
              >
                {badge.emoji}
              </motion.div>
              <h2 style={{ fontSize: 30, marginBottom: 8 }}>{badge.name}</h2>
              <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.5, marginBottom: 22 }}>{badge.line}</p>
              <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                Keep going
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
