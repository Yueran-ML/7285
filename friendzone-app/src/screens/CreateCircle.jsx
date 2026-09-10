import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ChevronRight, X } from 'lucide-react'
import { INTEREST_MAP, ROOT_INTERESTS, childrenOf, subtreeIds, trailOf } from '../data/interests.js'
import { WEEK_DAYS } from '../data/groups.js'
import { DISLIKES, LIKES, SOCIAL_STYLES } from '../data/profile.js'
import { useStore } from '../store/useStore.jsx'

const EMOJI = ['🍳', '☕', '🎬', '📚', '🎮', '🎲', '🏎️', '📷', '🏃', '🌿', '🎵', '🏀', '🧘', '🎨', '💬', '🧋', '🐉', '🀄']

const TIMES = ['9:00 am', '10:00 am', '12:00 pm', '2:00 pm', '4:00 pm', '6:00 pm', '7:00 pm', '8:00 pm']

const DEFAULT_REPLIES = [
  'Sounds good to me',
  'I’m in for that',
  'Nice, what time were you thinking?',
  'Count me in 👍',
  'Ha, same here',
]

function Field({ label, hint, children }) {
  return (
    <section style={{ marginTop: 22 }}>
      <div className="eyebrow">{label}</div>
      {hint && <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 5, lineHeight: 1.45 }}>{hint}</p>}
      <div style={{ marginTop: 10 }}>{children}</div>
    </section>
  )
}

function Chip({ on, children, onClick, tone = 'terracotta' }) {
  const bg = tone === 'sage' ? 'var(--sage)' : 'var(--terracotta)'
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '9px 13px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 800,
        background: on ? bg : 'var(--paper)',
        color: on ? '#fff' : 'var(--ink)',
        border: `1.5px solid ${on ? bg : 'var(--line-strong)'}`,
      }}
    >
      {children}
      {on && <Check size={12} strokeWidth={3} />}
    </button>
  )
}

// Compact drill-down over the interest tree, same rules as onboarding.
function TagPicker({ tags, onToggle }) {
  const [stack, setStack] = useState([])
  const hereId = stack[stack.length - 1] || null
  const here = hereId ? INTEREST_MAP[hereId] : null
  const nodes = hereId ? childrenOf(hereId) : ROOT_INTERESTS

  return (
    <div>
      {here && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <button
            onClick={() => setStack((s) => s.slice(0, -1))}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 800, color: 'var(--terracotta)' }}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <span style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 700 }}>{trailOf(here.id).join(' · ')}</span>
        </div>
      )}

      {here && (
        <button
          onClick={() => onToggle(here.id)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '10px 13px',
            borderRadius: 14,
            marginBottom: 10,
            fontSize: 13,
            fontWeight: 800,
            background: tags.includes(here.id) ? 'var(--terracotta)' : 'transparent',
            color: tags.includes(here.id) ? '#fff' : 'var(--ink-soft)',
            border: `1.5px ${tags.includes(here.id) ? 'solid var(--terracotta)' : 'dashed var(--line-strong)'}`,
          }}
        >
          Anything in {here.label}
        </button>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {nodes.map((n) => {
          const on = tags.includes(n.id)
          const hasKids = Boolean(n.children?.length)
          const below = hasKids ? subtreeIds(n.id).filter((x) => tags.includes(x) && x !== n.id).length : 0
          return (
            <button
              key={n.id}
              onClick={() => (hasKids ? setStack((s) => [...s, n.id]) : onToggle(n.id))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 13px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                background: on ? 'var(--terracotta)' : 'var(--paper)',
                color: on ? '#fff' : 'var(--ink)',
                border: `1.5px solid ${on || below ? 'var(--terracotta)' : 'var(--line-strong)'}`,
              }}
            >
              <span style={{ fontSize: 15, lineHeight: 1 }}>{n.emoji}</span>
              {n.label}
              {below > 0 && (
                <span style={{ background: 'var(--terracotta)', color: '#fff', borderRadius: 999, fontSize: 10, padding: '1px 5px' }}>
                  {below}
                </span>
              )}
              {hasKids && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
              {on && <Check size={12} strokeWidth={3} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function CreateCircle({ onBack, onCreated }) {
  const { state, dispatch } = useStore()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍳')
  const [tags, setTags] = useState([])
  const [pace, setPace] = useState('mixed')
  const [blurb, setBlurb] = useState('')
  const [place, setPlace] = useState('')
  const [day, setDay] = useState('Saturday')
  const [time, setTime] = useState('2:00 pm')
  const [activity, setActivity] = useState('')
  const [capacity, setCapacity] = useState(6)
  const [traits, setTraits] = useState([])
  const [involves, setInvolves] = useState([])

  const ok = name.trim().length >= 2 && tags.length >= 1

  const toggleIn = (list, setList) => (id) =>
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  const create = () => {
    if (!ok) return
    const id = `custom-${Date.now().toString(36)}`
    dispatch({
      type: 'CREATE_GROUP',
      group: {
        id,
        name: name.trim(),
        emoji,
        tags,
        pace,
        traits,
        involves,
        capacity,
        blurb: blurb.trim() || 'A new circle. Say hello and tell everyone why you started it.',
        place: place.trim() || 'To be decided',
        members: [],
        founder: state.name,
        meetup: {
          day,
          time,
          place: place.trim() || 'To be decided',
          activity: activity.trim() || 'First meetup',
        },
        seed: [],
        replies: DEFAULT_REPLIES,
      },
    })
    onCreated(id)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '52px 20px 0', flexShrink: 0 }}>
        <button onClick={onBack} aria-label="Back" style={{ color: 'var(--ink-soft)', padding: 6, marginLeft: -6 }}>
          <ArrowLeft size={22} />
        </button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="eyebrow" style={{ marginTop: 6 }}>
            Start a circle
          </div>
          <h1 style={{ fontSize: 29, marginTop: 8, fontWeight: 500 }}>What is missing?</h1>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.5 }}>
            If nothing here fits, make the thing you were looking for. Small is fine. Four people is a circle.
          </p>
        </motion.div>
      </header>

      <div className="scroll" style={{ flex: 1, padding: '0 20px 16px' }}>
        <Field label="Name it">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={34}
            placeholder="Sunday Sketch Club"
            style={{
              width: '100%',
              padding: '13px 15px',
              borderRadius: 15,
              border: '1.5px solid var(--line-strong)',
              background: 'var(--paper)',
              outline: 'none',
              fontSize: 15,
              fontWeight: 700,
            }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {EMOJI.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                aria-pressed={emoji === e}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 13,
                  fontSize: 19,
                  background: emoji === e ? 'var(--terracotta-soft)' : 'var(--paper)',
                  border: `1.5px solid ${emoji === e ? 'var(--terracotta)' : 'var(--line-strong)'}`,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </Field>

        <Field label="What is it about?" hint="Pick broadly or drill down. This is how people will find you.">
          <TagPicker tags={tags} onToggle={toggleIn(tags, setTags)} />
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {tags.map((id) => (
                <button
                  key={id}
                  onClick={() => toggleIn(tags, setTags)(id)}
                  className="chip"
                  style={{ background: 'var(--terracotta-soft)', color: 'var(--terracotta-deep)' }}
                  title={trailOf(id).join(' · ')}
                >
                  {INTEREST_MAP[id]?.emoji} {INTEREST_MAP[id]?.label}
                  <X size={11} strokeWidth={3} />
                </button>
              ))}
            </div>
          )}
        </Field>

        <Field label="What will it feel like?">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SOCIAL_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setPace(s.id)}
                aria-pressed={pace === s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: 15,
                  background: pace === s.id ? 'var(--sage-soft)' : 'var(--paper)',
                  border: `1.5px solid ${pace === s.id ? 'var(--sage)' : 'var(--line-strong)'}`,
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{s.emoji}</span>
                <span style={{ flex: 1, fontWeight: 800, fontSize: 13.5, color: pace === s.id ? 'var(--sage-deep)' : 'var(--ink)' }}>
                  {s.label}
                </span>
                {pace === s.id && <Check size={15} strokeWidth={3} style={{ color: 'var(--sage-deep)' }} />}
              </button>
            ))}
          </div>
        </Field>

        <Field label="A line about it" hint="Optional.">
          <textarea
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
            maxLength={120}
            rows={2}
            placeholder="We draw badly for an hour and nobody looks at anyone else's page."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 15,
              border: '1.5px solid var(--line-strong)',
              background: 'var(--paper)',
              outline: 'none',
              fontSize: 14,
              resize: 'none',
              lineHeight: 1.45,
            }}
          />
        </Field>

        <Field label="First meetup" hint="You can change all of this later.">
          <input
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            maxLength={40}
            placeholder="What are you doing? e.g. Sketching in the park"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 15,
              border: '1.5px solid var(--line-strong)',
              background: 'var(--paper)',
              outline: 'none',
              fontSize: 14,
            }}
          />
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            maxLength={40}
            placeholder="Where? e.g. Common Room, Level 2"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 15,
              border: '1.5px solid var(--line-strong)',
              background: 'var(--paper)',
              outline: 'none',
              fontSize: 14,
              marginTop: 8,
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 10px',
                borderRadius: 15,
                border: '1.5px solid var(--line-strong)',
                background: 'var(--paper)',
                fontSize: 13.5,
                fontWeight: 700,
                fontFamily: 'inherit',
                color: 'var(--ink)',
              }}
            >
              {WEEK_DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 10px',
                borderRadius: 15,
                border: '1.5px solid var(--line-strong)',
                background: 'var(--paper)',
                fontSize: 13.5,
                fontWeight: 700,
                fontFamily: 'inherit',
                color: 'var(--ink)',
              }}
            >
              {TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </Field>

        <Field label="How many people?" hint="Small circles are easier to walk into.">
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {[4, 5, 6, 8, 10].map((n) => (
              <Chip key={n} on={capacity === n} onClick={() => setCapacity(n)}>
                {n}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="What is it like?" hint="Optional. Helps people who care about these things find you.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {LIKES.map((l) => (
              <Chip key={l.id} on={traits.includes(l.id)} onClick={() => toggleIn(traits, setTraits)(l.id)}>
                {l.emoji} {l.label}
              </Chip>
            ))}
          </div>
        </Field>

        <Field
          label="Anything to flag?"
          hint="Shown honestly on your circle's card so nobody turns up to a surprise."
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {DISLIKES.map((d) => (
              <Chip key={d.id} tone="sage" on={involves.includes(d.id)} onClick={() => toggleIn(involves, setInvolves)(d.id)}>
                {d.emoji} {d.label}
              </Chip>
            ))}
          </div>
        </Field>
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: '12px 20px calc(16px + env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--cream) 74%, rgba(250,246,239,0))',
        }}
      >
        <button className="btn btn-primary" disabled={!ok} onClick={create} style={{ width: '100%' }}>
          {ok ? 'Create circle' : name.trim().length < 2 ? 'Give it a name' : 'Pick what it is about'}
        </button>
      </div>
    </div>
  )
}
