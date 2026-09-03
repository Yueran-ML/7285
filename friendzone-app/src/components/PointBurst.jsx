import { AnimatePresence, motion } from 'framer-motion'

// Floats a "+N" coin up from the input bar when a daily point is earned.
export default function PointBurst({ earned }) {
  return (
    <AnimatePresence>
      {earned && (
        <motion.div
          key={earned.id}
          initial={{ opacity: 0, y: 10, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], y: [10, -30, -70, -110], scale: [0.6, 1.15, 1, 0.9] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, times: [0, 0.18, 0.7, 1], ease: 'easeOut' }}
          style={{
            position: 'absolute',
            right: 22,
            bottom: 86,
            zIndex: 20,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f6d27a, #e9b949)',
              boxShadow: '0 8px 20px -6px rgba(200,150,31,0.6), inset 0 -3px 0 rgba(0,0,0,0.08)',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 15,
              color: '#5a3d00',
            }}
          >
            +{earned.amount}
          </div>
          <div
            style={{
              background: 'var(--ink)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              padding: '6px 10px',
              borderRadius: 999,
              whiteSpace: 'nowrap',
            }}
          >
            {earned.reason === 'bonus' ? 'Post-meetup bonus' : 'Showed up today'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
