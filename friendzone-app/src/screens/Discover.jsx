import { motion } from 'framer-motion'
import { Check, MapPin, Plus, Sparkles } from 'lucide-react'
import { GROUPS, matchScore } from '../data/groups.js'
import { INTEREST_MAP } from '../data/interests.js'
import { AvatarStack } from '../components/Avatar.jsx'
import { useStore } from '../store/useStore.jsx'

export default function Discover({ onOpenChat, onEditInterests }) {
  const { state, dispatch } = useStore()
  const ranked = [...GROUPS]
    .map((g) => ({ ...g, score: matchScore(g, state.interests) }))
    .sort((a, b) => b.score - a.score || a.members.length / a.capacity - b.members.length / b.capacity)

  return (
    <div className="scroll" style={{ position: 'absolute', inset: 0, padding: '58px 18px 110px' }}>
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="eyebrow">Circles for {state.name}</div>
        <h1 style={{ fontSize: 32, marginTop: 8, fontWeight: 500 }}>Small groups, shared interests.</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, alignItems: 'center' }}>
          {state.interests.map((id) => (
            <span key={id} className="chip">
              {INTEREST_MAP[id]?.emoji} {INTEREST_MAP[id]?.label}
            </span>
          ))}
          <button onClick={onEditInterests} className="chip" style={{ background: 'transparent', border: '1.5px dashed var(--line-strong)', color: 'var(--muted)' }}>
            edit
          </button>
        </div>
      </motion.header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
        {ranked.map((g, i) => {
          const joined = state.joinedGroups.includes(g.id)
          const full = g.members.length >= g.capacity
          const fill = (g.members.length / g.capacity) * 100
          return (
            <motion.article
              key={g.id}
              className="card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: joined ? 0.985 : 1 }}
              onClick={() => joined && onOpenChat(g.id)}
              style={{ padding: 18, position: 'relative', overflow: 'hidden', cursor: joined ? 'pointer' : 'default' }}
            >
              {g.score >= 100 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'var(--gold-soft)',
                    color: 'var(--gold-deep)',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    padding: '6px 12px',
                    borderBottomLeftRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <Sparkles size={12} /> GREAT MATCH
                </div>
              )}

              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    background: 'var(--cream-deep)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 27,
                    flexShrink: 0,
                  }}
                >
                  {g.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 19, fontWeight: 600 }}>{g.name}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.45 }}>{g.blurb}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {g.tags.map((t) => {
                      const hit = state.interests.includes(t)
                      return (
                        <span
                          key={t}
                          className="chip"
                          style={{
                            background: hit ? 'var(--terracotta-soft)' : 'var(--cream-deep)',
                            color: hit ? 'var(--terracotta-deep)' : 'var(--ink-soft)',
                            fontSize: 12,
                            padding: '4px 10px',
                          }}
                        >
                          {INTEREST_MAP[t]?.emoji} {INTEREST_MAP[t]?.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <AvatarStack members={g.members} size={26} max={3} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800 }}>
                      {g.members.length}/{g.capacity} members
                    </div>
                    <div style={{ height: 4, width: 90, background: 'var(--cream-deep)', borderRadius: 999, marginTop: 4, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${fill}%` }}
                        transition={{ delay: 0.4 + i * 0.06, duration: 0.7, ease: 'easeOut' }}
                        style={{ height: '100%', background: full ? 'var(--muted)' : 'var(--sage)', borderRadius: 999 }}
                      />
                    </div>
                  </div>
                </div>

                {joined ? (
                  <span className="btn btn-sm" style={{ background: 'var(--sage-soft)', color: 'var(--sage-deep)' }}>
                    <Check size={14} strokeWidth={3} /> Joined
                  </span>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={full}
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch({ type: 'JOIN_GROUP', groupId: g.id })
                    }}
                  >
                    <Plus size={14} strokeWidth={3} /> {full ? 'Full' : 'Join'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
                <MapPin size={12} /> {g.place} · meets {g.meetup.day}s
              </div>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
