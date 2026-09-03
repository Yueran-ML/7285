import { motion } from 'framer-motion'
import { ChevronRight, Compass } from 'lucide-react'
import { GROUP_MAP } from '../data/groups.js'
import { AvatarStack } from '../components/Avatar.jsx'
import { useStore, bonusActive } from '../store/useStore.jsx'

export default function Chats({ onOpenChat, onDiscover }) {
  const { state } = useStore()
  const groups = state.joinedGroups.map((id) => GROUP_MAP[id]).filter(Boolean)

  return (
    <div className="scroll" style={{ position: 'absolute', inset: 0, padding: '58px 18px 110px' }}>
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="eyebrow">Your circles</div>
        <h1 style={{ fontSize: 32, marginTop: 8, fontWeight: 500 }}>
          {groups.length ? 'Say anything today.' : 'No circles yet.'}
        </h1>
        <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14.5 }}>
          {groups.length ? 'One message a day keeps the thread alive. That’s the whole ask.' : 'Join one from Discover to get started.'}
        </p>
      </motion.header>

      {!groups.length && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="btn btn-primary"
          onClick={onDiscover}
          style={{ marginTop: 20 }}
        >
          <Compass size={16} /> Find circles
        </motion.button>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {groups.map((g, i) => {
          const msgs = state.messages[g.id] || []
          const last = msgs[msgs.length - 1]
          const doneToday = state.checkIns[g.id] === state.day
          const bonus = bonusActive(state, g.id)
          return (
            <motion.button
              key={g.id}
              className="card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onOpenChat(g.id)}
              style={{ padding: 16, textAlign: 'left', display: 'flex', gap: 14, alignItems: 'center', width: '100%' }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  background: bonus ? 'var(--gold-soft)' : 'var(--cream-deep)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 25,
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                {g.emoji}
                {!doneToday && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -3,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: 'var(--terracotta)',
                      border: '2px solid var(--paper)',
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</h3>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: doneToday ? 'var(--sage-deep)' : 'var(--terracotta)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {doneToday ? '✓ today' : bonus ? '+3 waiting' : '+1 waiting'}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13.5,
                    color: 'var(--ink-soft)',
                    marginTop: 3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {last ? (
                    <>
                      <strong style={{ color: 'var(--ink)' }}>{last.mine ? 'You' : last.from}:</strong> {last.text}
                    </>
                  ) : (
                    'No messages yet'
                  )}
                </p>
                <div style={{ marginTop: 8 }}>
                  <AvatarStack members={g.members} size={20} max={4} />
                </div>
              </div>
              <ChevronRight size={18} color="var(--muted)" />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
