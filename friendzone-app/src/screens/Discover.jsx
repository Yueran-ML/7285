import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, MapPin, Plus, Sparkles } from 'lucide-react'
import { GROUPS, matchInfo } from '../data/groups.js'
import { INTEREST_MAP } from '../data/interests.js'
import { AvatarStack } from '../components/Avatar.jsx'
import { useStore } from '../store/useStore.jsx'

function GroupCard({ g, i, joined, interests, onJoin, onOpen }) {
  const full = g.members.length >= g.capacity
  const fill = (g.members.length / g.capacity) * 100
  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: joined ? 0.985 : 1 }}
      onClick={() => joined && onOpen(g.id)}
      style={{ padding: 18, position: 'relative', overflow: 'hidden', cursor: joined ? 'pointer' : 'default' }}
    >
      {g.great && (
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
              const hit = interests.includes(t)
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
                transition={{ delay: 0.35 + i * 0.06, duration: 0.7, ease: 'easeOut' }}
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
              onJoin(g.id)
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
}

export default function Discover({ onOpenChat, onEditInterests }) {
  const { state, dispatch } = useStore()
  const [showOthers, setShowOthers] = useState(false)

  const byOpenness = (a, b) => a.members.length / a.capacity - b.members.length / b.capacity
  const scored = GROUPS.map((g) => ({ ...g, ...matchInfo(g, state.interests) }))
  const recommended = scored.filter((g) => g.hits > 0).sort((a, b) => b.score - a.score || byOpenness(a, b))
  const others = scored.filter((g) => g.hits === 0).sort(byOpenness)
  const noMatches = recommended.length === 0
  const othersOpen = showOthers || noMatches

  const join = (id) => dispatch({ type: 'JOIN_GROUP', groupId: id })
  const cardProps = { interests: state.interests, onJoin: join, onOpen: onOpenChat }

  return (
    <div className="scroll" style={{ position: 'absolute', inset: 0, padding: '58px 18px 110px' }}>
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="eyebrow">Circles for {state.name}</div>
        <h1 style={{ fontSize: 32, marginTop: 8, fontWeight: 500 }}>
          {noMatches ? (
            'Nothing overlaps yet.'
          ) : (
            <>
              {recommended.length} circle{recommended.length === 1 ? '' : 's'} share{recommended.length === 1 ? 's' : ''} your interests.
            </>
          )}
        </h1>
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

      {/* recommended */}
      {noMatches ? (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginTop: 22, padding: 18, background: 'var(--sage-soft)', borderColor: 'transparent', color: 'var(--sage-deep)' }}
        >
          <div style={{ fontWeight: 800, fontSize: 14.5 }}>No circle is about that yet.</div>
          <p style={{ fontSize: 13.5, marginTop: 4, lineHeight: 1.45, opacity: 0.9 }}>
            Have a look at what’s around, or <button onClick={onEditInterests} style={{ textDecoration: 'underline', fontWeight: 800 }}>add another interest</button>.
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
          <AnimatePresence initial={false}>
            {recommended.map((g, i) => (
              <GroupCard key={g.id} g={g} i={i} joined={state.joinedGroups.includes(g.id)} {...cardProps} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* everything else, collapsed by default */}
      {others.length > 0 && (
        <div style={{ marginTop: 26 }}>
          {!noMatches && (
            <button
              onClick={() => setShowOthers((v) => !v)}
              aria-expanded={othersOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '12px 14px',
                borderRadius: 14,
                border: '1.5px dashed var(--line-strong)',
                color: 'var(--ink-soft)',
                fontWeight: 800,
                fontSize: 13.5,
              }}
            >
              <motion.span animate={{ rotate: othersOpen ? 180 : 0 }} style={{ display: 'inline-flex' }}>
                <ChevronDown size={16} />
              </motion.span>
              {othersOpen ? 'Hide other circles' : `Browse ${others.length} other circle${others.length === 1 ? '' : 's'}`}
            </button>
          )}

          <AnimatePresence initial={false}>
            {othersOpen && (
              <motion.div
                key="others"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="eyebrow" style={{ color: 'var(--muted)', marginTop: noMatches ? 4 : 18 }}>
                  {noMatches ? 'All circles' : 'Other circles'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
                  {others.map((g, i) => (
                    <GroupCard key={g.id} g={g} i={i} joined={state.joinedGroups.includes(g.id)} {...cardProps} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
