import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Info, MapPin, Plus, Sparkles, UserCog } from 'lucide-react'
import { GROUPS, SORT_MODES, comparatorFor, matchFacets } from '../data/groups.js'
import { INTEREST_MAP } from '../data/interests.js'
import { DISLIKE_MAP, LIKE_MAP, SOCIAL_STYLE_MAP, ZODIAC_MAP } from '../data/profile.js'
import { AvatarStack } from '../components/Avatar.jsx'
import { useStore } from '../store/useStore.jsx'

// The "why am I seeing this" row. Everything shown here comes from a field the
// user filled in themselves, so a recommendation is always explainable.
function MatchReasons({ g }) {
  const reasons = []

  if (g.paceExact && SOCIAL_STYLE_MAP[g.pace]) {
    reasons.push({
      key: 'pace',
      emoji: SOCIAL_STYLE_MAP[g.pace].emoji,
      label: SOCIAL_STYLE_MAP[g.pace].label,
      bg: 'var(--sage-soft)',
      fg: 'var(--sage-deep)',
    })
  }

  for (const t of g.sharedTraits) {
    const like = LIKE_MAP[t]
    if (like) {
      reasons.push({ key: `t-${t}`, emoji: like.emoji, label: like.label, bg: 'var(--sage-soft)', fg: 'var(--sage-deep)' })
    }
  }

  if (g.signMateCount > 0) {
    const z = ZODIAC_MAP[g.signMates[0].sign]
    reasons.push({
      key: 'sign',
      emoji: z?.symbol,
      label: `${g.signMateCount} ${z?.label ?? ''}${g.signMateCount === 1 ? '' : 's'} here`,
      bg: 'var(--gold-soft)',
      fg: 'var(--gold-deep)',
    })
  }

  if (!reasons.length) return null

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
      {reasons.map((r) => (
        <span
          key={r.key}
          className="chip"
          style={{ background: r.bg, color: r.fg, fontSize: 11.5, padding: '4px 10px', fontWeight: 800 }}
        >
          <span style={{ fontSize: 12 }}>{r.emoji}</span>
          {r.label}
        </span>
      ))}
    </div>
  )
}

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
          <MatchReasons g={g} />
        </div>
      </div>

      {g.clashes.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 7,
            marginTop: 12,
            padding: '9px 11px',
            borderRadius: 12,
            background: 'var(--cream-deep)',
            color: 'var(--ink-soft)',
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Heads up, this one involves{' '}
            <strong style={{ fontWeight: 800 }}>
              {g.clashes.map((c) => DISLIKE_MAP[c]?.label.toLowerCase()).join(' and ')}
            </strong>
            .
          </span>
        </div>
      )}

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

export default function Discover({ onOpenChat, onEditInterests, onEditProfile }) {
  const { state, dispatch } = useStore()
  const [showOthers, setShowOthers] = useState(false)
  const [mode, setMode] = useState('best')

  const p = state.profile
  const hasStyle = Boolean(p.socialStyle)
  const hasSign = Boolean(p.zodiac)
  const hasProfile = hasStyle || hasSign || p.likes.length > 0 || p.dislikes.length > 0

  // Only offer a lens the user has actually filled in.
  const modes = SORT_MODES.filter(
    (m) => m.id === 'best' || m.id === 'interests' || (m.id === 'style' && hasStyle) || (m.id === 'sign' && hasSign),
  )
  const activeMode = modes.some((m) => m.id === mode) ? mode : 'best'

  const { recommended, others } = useMemo(() => {
    const scored = GROUPS.map((g) => ({ ...g, ...matchFacets(g, state) }))
    const cmp = comparatorFor(activeMode)
    return {
      recommended: scored.filter((g) => g.matched).sort(cmp),
      others: scored.filter((g) => !g.matched).sort(cmp),
    }
  }, [state, activeMode])

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
              {recommended.length} circle{recommended.length === 1 ? '' : 's'} match{recommended.length === 1 ? 'es' : ''}{' '}
              what you told us.
            </>
          )}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, alignItems: 'center' }}>
          {state.interests.map((id) => (
            <span key={id} className="chip">
              {INTEREST_MAP[id]?.emoji} {INTEREST_MAP[id]?.label}
            </span>
          ))}
          {hasStyle && (
            <span className="chip" style={{ background: 'var(--sage-soft)', color: 'var(--sage-deep)' }}>
              {SOCIAL_STYLE_MAP[p.socialStyle].emoji} {SOCIAL_STYLE_MAP[p.socialStyle].label}
            </span>
          )}
          {hasSign && (
            <span className="chip" style={{ background: 'var(--gold-soft)', color: 'var(--gold-deep)' }}>
              {ZODIAC_MAP[p.zodiac].symbol} {ZODIAC_MAP[p.zodiac].label}
            </span>
          )}
          <button
            onClick={onEditInterests}
            className="chip"
            style={{ background: 'transparent', border: '1.5px dashed var(--line-strong)', color: 'var(--muted)' }}
          >
            edit
          </button>
        </div>
      </motion.header>

      {/* nudge to fill in the optional profile, shown only while it is empty */}
      {!hasProfile && (
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          onClick={onEditProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            width: '100%',
            textAlign: 'left',
            marginTop: 18,
            padding: '13px 15px',
            borderRadius: 18,
            background: 'var(--sage-soft)',
            border: '1.5px solid transparent',
            color: 'var(--sage-deep)',
          }}
        >
          <UserCog size={19} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontWeight: 800, fontSize: 13.5 }}>Match on more than hobbies</span>
            <span style={{ display: 'block', fontSize: 12.5, opacity: 0.9, marginTop: 1 }}>
              Tell us how you like to meet people. Optional.
            </span>
          </span>
          <ChevronDown size={16} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }} />
        </motion.button>
      )}

      {/* sort lenses */}
      {!noMatches && modes.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          role="tablist"
          aria-label="Sort circles by"
          style={{ display: 'flex', gap: 6, marginTop: 18, overflowX: 'auto', paddingBottom: 2 }}
        >
          {modes.map((m) => {
            const on = m.id === activeMode
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={on}
                onClick={() => setMode(m.id)}
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  padding: '8px 14px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: on ? '#fff' : 'var(--ink-soft)',
                  border: `1.5px solid ${on ? 'var(--ink)' : 'var(--line-strong)'}`,
                }}
              >
                {on && (
                  <motion.span
                    layoutId="sort-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    style={{ position: 'absolute', inset: -1.5, background: 'var(--ink)', borderRadius: 999, zIndex: -1 }}
                  />
                )}
                {m.label}
              </button>
            )
          })}
        </motion.div>
      )}

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
            Have a look at what’s around, or{' '}
            <button onClick={onEditInterests} style={{ textDecoration: 'underline', fontWeight: 800 }}>
              add another interest
            </button>
            .
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
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
