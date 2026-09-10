import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Info, MapPin, Plus, Search, SlidersHorizontal, Sparkles, UserCog, X } from 'lucide-react'
import { SORT_MODES, WEEK_DAYS, comparatorFor, matchFacets } from '../data/groups.js'
import { INTEREST_MAP, trailOf } from '../data/interests.js'
import { DISLIKE_MAP, LIKE_MAP, SOCIAL_STYLE_MAP, ZODIAC_MAP } from '../data/profile.js'
import { AvatarStack } from '../components/Avatar.jsx'
import { allGroups, useStore } from '../store/useStore.jsx'

const PACE_FILTERS = [
  { id: 'any', label: 'Any pace' },
  { id: 'quiet', label: '🌙 Calm' },
  { id: 'mixed', label: '🌤️ Mixed' },
  { id: 'lively', label: '🎉 Busy' },
]

// Everything shown here comes from a field the user filled in themselves, so a
// recommendation is always explainable.
function MatchReasons({ g }) {
  const reasons = []

  const best = g.interestHits.reduce((a, h) => (!a || h.depth > a.depth ? h : a), null)
  if (best) {
    const node = INTEREST_MAP[best.nodeId]
    reasons.push({
      key: 'interest',
      emoji: node?.emoji,
      label: best.exact ? node?.label : `Both into ${node?.label}`,
      bg: 'var(--terracotta-soft)',
      fg: 'var(--terracotta-deep)',
    })
  }

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
    if (like) reasons.push({ key: `t-${t}`, emoji: like.emoji, label: like.label, bg: 'var(--sage-soft)', fg: 'var(--sage-deep)' })
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
        <span key={r.key} className="chip" style={{ background: r.bg, color: r.fg, fontSize: 11.5, padding: '4px 10px', fontWeight: 800 }}>
          <span style={{ fontSize: 12 }}>{r.emoji}</span>
          {r.label}
        </span>
      ))}
    </div>
  )
}

function GroupCard({ g, i, joined, onJoin, onOpen }) {
  const full = g.members.length >= g.capacity
  const fill = g.capacity ? (g.members.length / g.capacity) * 100 : 0
  const hitTags = new Set(g.interestHits.map((h) => h.groupTag))

  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ delay: Math.min(0.3, 0.04 + i * 0.045), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
          {g.founder && (
            <div style={{ fontSize: 11.5, color: 'var(--sage-deep)', fontWeight: 800, marginTop: 2 }}>
              Started by {g.founder}
            </div>
          )}
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.45 }}>{g.blurb}</p>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {g.tags.map((t) => {
              const hit = hitTags.has(t)
              return (
                <span
                  key={t}
                  className="chip"
                  title={trailOf(t).join(' · ')}
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
            <strong style={{ fontWeight: 800 }}>{g.clashes.map((c) => DISLIKE_MAP[c]?.label.toLowerCase()).join(' and ')}</strong>.
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
                transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
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

export default function Discover({ onOpenChat, onEditInterests, onEditProfile, onCreate }) {
  const { state, dispatch } = useStore()
  const [showOthers, setShowOthers] = useState(false)
  const [mode, setMode] = useState('best')
  const [q, setQ] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [pace, setPace] = useState('any')
  const [day, setDay] = useState('any')
  const [roomOnly, setRoomOnly] = useState(false)

  const p = state.profile
  const hasStyle = Boolean(p.socialStyle)
  const hasSign = Boolean(p.zodiac)
  const hasProfile = hasStyle || hasSign || p.likes.length > 0 || p.dislikes.length > 0

  const modes = SORT_MODES.filter(
    (m) =>
      m.id === 'best' ||
      m.id === 'interests' ||
      m.id === 'space' ||
      (m.id === 'style' && hasStyle) ||
      (m.id === 'sign' && hasSign),
  )
  const activeMode = modes.some((m) => m.id === mode) ? mode : 'best'
  const filtersOn = pace !== 'any' || day !== 'any' || roomOnly
  const searching = q.trim().length > 0

  const { recommended, others, total } = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const scored = allGroups(state)
      .map((g) => ({ ...g, ...matchFacets(g, state) }))
      .filter((g) => {
        if (pace !== 'any' && g.pace !== pace) return false
        if (day !== 'any' && g.meetup.day !== day) return false
        if (roomOnly && g.full) return false
        if (!needle) return true
        const hay = [g.name, g.blurb, g.place, g.meetup.activity, ...g.tags.flatMap((t) => trailOf(t))]
          .join(' ')
          .toLowerCase()
        return hay.includes(needle)
      })
    const cmp = comparatorFor(activeMode)
    return {
      total: scored.length,
      recommended: scored.filter((g) => g.matched).sort(cmp),
      others: scored.filter((g) => !g.matched).sort(cmp),
    }
  }, [state, activeMode, q, pace, day, roomOnly])

  const noMatches = recommended.length === 0
  const othersOpen = showOthers || noMatches || searching || filtersOn

  const join = (id) => dispatch({ type: 'JOIN_GROUP', groupId: id })
  const cardProps = { onJoin: join, onOpen: onOpenChat }

  const clearFilters = () => {
    setPace('any')
    setDay('any')
    setRoomOnly(false)
  }

  return (
    <div className="scroll" style={{ position: 'absolute', inset: 0, padding: '58px 18px 110px' }}>
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="eyebrow">Circles for {state.name}</div>
        <h1 style={{ fontSize: 30, marginTop: 8, fontWeight: 500 }}>
          {searching || filtersOn ? (
            <>
              {total} circle{total === 1 ? '' : 's'} found.
            </>
          ) : noMatches ? (
            'Nothing overlaps yet.'
          ) : (
            <>
              {recommended.length} circle{recommended.length === 1 ? '' : 's'} match{recommended.length === 1 ? 'es' : ''} what
              you told us.
            </>
          )}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, alignItems: 'center' }}>
          {state.interests.slice(0, 4).map((id) => (
            <span key={id} className="chip" title={trailOf(id).join(' · ')}>
              {INTEREST_MAP[id]?.emoji} {INTEREST_MAP[id]?.label}
            </span>
          ))}
          {state.interests.length > 4 && <span className="chip">+{state.interests.length - 4}</span>}
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

      {/* search */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 999,
            background: 'var(--paper)',
            border: '1.5px solid var(--line-strong)',
            minWidth: 0,
          }}
        >
          <Search size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search circles"
            aria-label="Search circles"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, minWidth: 0 }}
          />
          {searching && (
            <button onClick={() => setQ('')} aria-label="Clear search" style={{ color: 'var(--muted)', display: 'flex' }}>
              <X size={14} strokeWidth={3} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-label="Filters"
          style={{
            flexShrink: 0,
            width: 42,
            borderRadius: 999,
            display: 'grid',
            placeItems: 'center',
            background: filtersOn ? 'var(--ink)' : 'var(--paper)',
            color: filtersOn ? '#fff' : 'var(--ink-soft)',
            border: `1.5px solid ${filtersOn ? 'var(--ink)' : 'var(--line-strong)'}`,
          }}
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* filters */}
      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            key="filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="card" style={{ marginTop: 10, padding: 14 }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>
                Pace
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {PACE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPace(f.id)}
                    aria-pressed={pace === f.id}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 999,
                      fontSize: 12.5,
                      fontWeight: 800,
                      background: pace === f.id ? 'var(--sage)' : 'var(--cream-deep)',
                      color: pace === f.id ? '#fff' : 'var(--ink-soft)',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="eyebrow" style={{ fontSize: 10, marginTop: 14 }}>
                Meets on
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {['any', ...WEEK_DAYS].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDay(d)}
                    aria-pressed={day === d}
                    style={{
                      padding: '7px 11px',
                      borderRadius: 999,
                      fontSize: 12.5,
                      fontWeight: 800,
                      background: day === d ? 'var(--sage)' : 'var(--cream-deep)',
                      color: day === d ? '#fff' : 'var(--ink-soft)',
                    }}
                  >
                    {d === 'any' ? 'Any day' : d.slice(0, 3)}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                <button
                  onClick={() => setRoomOnly((v) => !v)}
                  aria-pressed={roomOnly}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 999,
                    fontSize: 12.5,
                    fontWeight: 800,
                    background: roomOnly ? 'var(--sage)' : 'var(--cream-deep)',
                    color: roomOnly ? '#fff' : 'var(--ink-soft)',
                  }}
                >
                  Only circles with room
                </button>
                {filtersOn && (
                  <button onClick={clearFilters} style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--muted)' }}>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* nudge to fill in the optional profile */}
      {!hasProfile && !searching && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          onClick={onEditProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            width: '100%',
            textAlign: 'left',
            marginTop: 14,
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
      {modes.length > 1 && total > 1 && (
        <div
          role="tablist"
          aria-label="Sort circles by"
          style={{ display: 'flex', gap: 6, marginTop: 16, overflowX: 'auto', paddingBottom: 2 }}
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
                  background: on ? 'var(--ink)' : 'transparent',
                  border: `1.5px solid ${on ? 'var(--ink)' : 'var(--line-strong)'}`,
                }}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      )}

      {/* results */}
      {total === 0 ? (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 18, padding: 18, background: 'var(--sage-soft)', borderColor: 'transparent', color: 'var(--sage-deep)' }}
        >
          <div style={{ fontWeight: 800, fontSize: 14.5 }}>Nothing matches that.</div>
          <p style={{ fontSize: 13.5, marginTop: 4, lineHeight: 1.45, opacity: 0.9 }}>
            Try fewer filters, or start the circle you were looking for.
          </p>
          <button className="btn btn-sage btn-sm" onClick={onCreate} style={{ marginTop: 12 }}>
            <Plus size={14} strokeWidth={3} /> Start a circle
          </button>
        </motion.div>
      ) : (
        <>
          {recommended.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
              <AnimatePresence initial={false}>
                {recommended.map((g, i) => (
                  <GroupCard key={g.id} g={g} i={i} joined={state.joinedGroups.includes(g.id)} {...cardProps} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {others.length > 0 && (
            <div style={{ marginTop: recommended.length ? 26 : 18 }}>
              {recommended.length > 0 && !searching && !filtersOn && (
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
                    transition={{ duration: 0.28 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {recommended.length > 0 && (
                      <div className="eyebrow" style={{ color: 'var(--muted)', marginTop: 16 }}>
                        Other circles
                      </div>
                    )}
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
        </>
      )}

      {/* start your own */}
      <button
        onClick={onCreate}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          width: '100%',
          marginTop: 20,
          padding: '14px',
          borderRadius: 16,
          border: '1.5px dashed var(--line-strong)',
          color: 'var(--terracotta)',
          fontWeight: 800,
          fontSize: 13.5,
        }}
      >
        <Plus size={16} strokeWidth={3} /> Nothing fits? Start a circle
      </button>
    </div>
  )
}
