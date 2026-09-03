export default function Avatar({ name = '?', color = '#d96c4f', size = 34, ring = false, style }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: size * 0.42,
        flexShrink: 0,
        boxShadow: ring ? '0 0 0 2.5px var(--paper), 0 0 0 4px ' + color : 'none',
        ...style,
      }}
    >
      {initial}
    </div>
  )
}

export function AvatarStack({ members = [], size = 28, max = 4 }) {
  const shown = members.slice(0, max)
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((m, i) => (
        <Avatar
          key={m.name}
          name={m.name}
          color={m.color}
          size={size}
          style={{ marginLeft: i === 0 ? 0 : -size * 0.32, boxShadow: '0 0 0 2px var(--paper)' }}
        />
      ))}
      {members.length > max && (
        <div
          style={{
            marginLeft: -size * 0.32,
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'var(--cream-deep)',
            color: 'var(--ink-soft)',
            display: 'grid',
            placeItems: 'center',
            fontSize: size * 0.38,
            fontWeight: 800,
            boxShadow: '0 0 0 2px var(--paper)',
          }}
        >
          +{members.length - max}
        </div>
      )}
    </div>
  )
}
