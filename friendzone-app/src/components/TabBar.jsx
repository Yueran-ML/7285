import { motion } from 'framer-motion'
import { Compass, MessageCircle, User } from 'lucide-react'

const TABS = [
  { id: 'discover', label: 'Discover', Icon: Compass },
  { id: 'chats', label: 'Circles', Icon: MessageCircle },
  { id: 'profile', label: 'Me', Icon: User },
]

export default function TabBar({ active, onChange, unread = 0 }) {
  return (
    <nav
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: '10px 18px calc(14px + env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, var(--cream) 70%, rgba(250,246,239,0))',
        zIndex: 30,
      }}
    >
      <div
        style={{
          display: 'flex',
          background: 'var(--ink)',
          borderRadius: 999,
          padding: 6,
          boxShadow: '0 18px 40px -16px rgba(47,49,71,0.55)',
        }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const on = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-label={label}
              aria-current={on ? 'page' : undefined}
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                padding: '11px 0',
                borderRadius: 999,
                color: on ? 'var(--ink)' : 'rgba(255,255,255,0.72)',
                fontWeight: 800,
                fontSize: 13,
                zIndex: 1,
              }}
            >
              {on && (
                <motion.span
                  layoutId="tab-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  style={{ position: 'absolute', inset: 0, background: 'var(--paper)', borderRadius: 999, zIndex: -1 }}
                />
              )}
              <Icon size={17} strokeWidth={2.4} />
              <span>{label}</span>
              {id === 'chats' && unread > 0 && !on && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 'calc(50% - 32px)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--terracotta)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
