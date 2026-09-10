// Interests are a tree, up to three levels deep.
//
// Flat tags were too blunt: "Gaming" put a Catan table and a Valorant five-stack
// in the same bucket, and "Motorsport" says nothing about whether you want to
// talk strategy or go karting. You may stop at any level. Picking a parent means
// "anything under here", picking a leaf means "this specifically", and matching
// scores the two differently rather than treating them as the same signal.

export const INTERESTS = [
  {
    id: 'food',
    label: 'Food & cooking',
    emoji: '🍳',
    children: [
      { id: 'home-cooking', label: 'Home cooking', emoji: '🥘' },
      { id: 'baking', label: 'Baking', emoji: '🥐' },
      {
        id: 'regional',
        label: 'Cooking from home',
        emoji: '🍜',
        children: [
          { id: 'cuisine-chinese', label: 'Chinese', emoji: '🥟' },
          { id: 'cuisine-japanese', label: 'Japanese', emoji: '🍱' },
          { id: 'cuisine-indian', label: 'Indian', emoji: '🍛' },
          { id: 'cuisine-italian', label: 'Italian', emoji: '🍝' },
          { id: 'cuisine-mideast', label: 'Middle Eastern', emoji: '🥙' },
        ],
      },
      { id: 'eating-out', label: 'Eating out', emoji: '🍽️' },
    ],
  },
  {
    id: 'coffee',
    label: 'Coffee & tea',
    emoji: '☕',
    children: [
      { id: 'specialty-coffee', label: 'Specialty coffee', emoji: '☕' },
      { id: 'bubble-tea', label: 'Bubble tea', emoji: '🧋' },
      { id: 'tea', label: 'Tea', emoji: '🫖' },
    ],
  },
  {
    id: 'screen',
    label: 'Film & TV',
    emoji: '🎬',
    children: [
      { id: 'anime', label: 'Anime', emoji: '🌸' },
      { id: 'arthouse', label: 'Arthouse', emoji: '🎞️' },
      { id: 'horror', label: 'Horror', emoji: '👻' },
      { id: 'series', label: 'Series binges', emoji: '📺' },
      { id: 'docs', label: 'Documentaries', emoji: '🎥' },
    ],
  },
  {
    id: 'study',
    label: 'Study',
    emoji: '📚',
    children: [
      { id: 'quiet-study', label: 'Quiet co-working', emoji: '🤫' },
      { id: 'thesis', label: 'Thesis & research', emoji: '📄' },
      { id: 'group-project', label: 'Group projects', emoji: '👥' },
      { id: 'exam-prep', label: 'Exam prep', emoji: '✏️' },
    ],
  },
  {
    id: 'gaming',
    label: 'Video games',
    emoji: '🎮',
    children: [
      { id: 'cozy-games', label: 'Cozy games', emoji: '🌱' },
      { id: 'console', label: 'Console', emoji: '🕹️' },
      {
        id: 'esports',
        label: 'Competitive',
        emoji: '🏆',
        children: [
          { id: 'lol', label: 'League of Legends', emoji: '⚔️' },
          { id: 'valorant', label: 'Valorant', emoji: '🎯' },
          { id: 'cs', label: 'Counter-Strike', emoji: '💣' },
        ],
      },
    ],
  },
  {
    id: 'tabletop',
    label: 'Tabletop',
    emoji: '🎲',
    children: [
      { id: 'boardgames', label: 'Board games', emoji: '🎲' },
      { id: 'mahjong', label: 'Mahjong', emoji: '🀄' },
      {
        id: 'ttrpg',
        label: 'Roleplaying',
        emoji: '🐉',
        children: [
          { id: 'dnd', label: 'D&D', emoji: '🐉' },
          { id: 'coc', label: 'Call of Cthulhu', emoji: '🦑' },
        ],
      },
    ],
  },
  {
    id: 'motorsport',
    label: 'Motorsport',
    emoji: '🏎️',
    children: [
      {
        id: 'f1',
        label: 'Formula 1',
        emoji: '🏁',
        children: [
          { id: 'f1-ferrari', label: 'Ferrari', emoji: '🔴' },
          { id: 'f1-mclaren', label: 'McLaren', emoji: '🟠' },
          { id: 'f1-redbull', label: 'Red Bull', emoji: '🔵' },
          { id: 'f1-mercedes', label: 'Mercedes', emoji: '⚪' },
          { id: 'f1-neutral', label: 'No team, just the racing', emoji: '🏳️' },
        ],
      },
      { id: 'gt3', label: 'GT3 & endurance', emoji: '🏆' },
      { id: 'motogp', label: 'MotoGP', emoji: '🏍️' },
      { id: 'karting', label: 'Karting', emoji: '🛞' },
      { id: 'sim-racing', label: 'Sim racing', emoji: '🖥️' },
    ],
  },
  {
    id: 'photography',
    label: 'Photography',
    emoji: '📷',
    children: [
      { id: 'film-photo', label: 'Film photography', emoji: '📽️' },
      { id: 'street-photo', label: 'Street', emoji: '🚦' },
      { id: 'landscape-photo', label: 'Landscape', emoji: '🏞️' },
    ],
  },
  {
    id: 'fitness',
    label: 'Running & fitness',
    emoji: '🏃',
    children: [
      { id: 'casual-run', label: 'Easy running', emoji: '🏃' },
      { id: 'parkrun', label: 'Parkrun', emoji: '🅿️' },
      { id: 'gym', label: 'Gym', emoji: '🏋️' },
      { id: 'climbing', label: 'Climbing', emoji: '🧗' },
      { id: 'swimming', label: 'Swimming', emoji: '🏊' },
    ],
  },
  {
    id: 'outdoors',
    label: 'Outdoors',
    emoji: '🌿',
    children: [
      { id: 'hiking', label: 'Hiking', emoji: '🥾' },
      { id: 'beach', label: 'Beach days', emoji: '🏖️' },
      { id: 'cycling', label: 'Cycling', emoji: '🚲' },
      { id: 'camping', label: 'Camping', emoji: '⛺' },
    ],
  },
  {
    id: 'music',
    label: 'Music',
    emoji: '🎵',
    children: [
      { id: 'live-music', label: 'Live gigs', emoji: '🎤' },
      { id: 'kpop', label: 'K-pop', emoji: '💜' },
      { id: 'classical', label: 'Classical', emoji: '🎻' },
      {
        id: 'playing',
        label: 'Playing something',
        emoji: '🎸',
        children: [
          { id: 'guitar', label: 'Guitar', emoji: '🎸' },
          { id: 'piano', label: 'Piano', emoji: '🎹' },
          { id: 'singing', label: 'Singing', emoji: '🎙️' },
        ],
      },
    ],
  },
  {
    id: 'ballsports',
    label: 'Ball sports',
    emoji: '🏀',
    children: [
      { id: 'basketball', label: 'Basketball', emoji: '🏀' },
      { id: 'football', label: 'Football', emoji: '⚽' },
      { id: 'badminton', label: 'Badminton', emoji: '🏸' },
      { id: 'tabletennis', label: 'Table tennis', emoji: '🏓' },
      { id: 'volleyball', label: 'Volleyball', emoji: '🏐' },
    ],
  },
  {
    id: 'wellbeing',
    label: 'Wellbeing',
    emoji: '🧘',
    children: [
      { id: 'yoga', label: 'Yoga', emoji: '🧘' },
      { id: 'meditation', label: 'Meditation', emoji: '🌙' },
      { id: 'walking-talk', label: 'Walk and talk', emoji: '🚶' },
    ],
  },
  {
    id: 'making',
    label: 'Making things',
    emoji: '🎨',
    children: [
      { id: 'drawing', label: 'Drawing', emoji: '✏️' },
      { id: 'pottery', label: 'Pottery', emoji: '🏺' },
      { id: 'knitting', label: 'Knitting & sewing', emoji: '🧶' },
      { id: 'diy', label: 'DIY & repair', emoji: '🔧' },
    ],
  },
  {
    id: 'language',
    label: 'Language exchange',
    emoji: '💬',
    children: [
      { id: 'lang-english', label: 'English practice', emoji: '🇦🇺' },
      { id: 'lang-mandarin', label: 'Mandarin', emoji: '🇨🇳' },
      { id: 'lang-japanese', label: 'Japanese', emoji: '🇯🇵' },
      { id: 'lang-korean', label: 'Korean', emoji: '🇰🇷' },
      { id: 'lang-spanish', label: 'Spanish', emoji: '🇪🇸' },
    ],
  },
]

// ── flattened lookups ─────────────────────────────────────────────────────
// INTEREST_MAP: id -> node (with .path and .depth attached)
// Paths make hierarchy-aware matching a prefix comparison rather than a search.

export const INTEREST_MAP = {}

;(function index(nodes, path = []) {
  for (const n of nodes) {
    const here = [...path, n.id]
    INTEREST_MAP[n.id] = { ...n, path: here, depth: here.length, parentId: path[path.length - 1] || null }
    if (n.children) index(n.children, here)
  }
})(INTERESTS)

export const ROOT_INTERESTS = INTERESTS

export function pathOf(id) {
  return INTEREST_MAP[id]?.path || []
}

export function labelOf(id) {
  return INTEREST_MAP[id]?.label || id
}

export function emojiOf(id) {
  return INTEREST_MAP[id]?.emoji || '•'
}

export function childrenOf(id) {
  return INTEREST_MAP[id]?.children || []
}

// The chain of labels down to a tag, e.g. ['Motorsport', 'Formula 1', 'Ferrari'].
export function trailOf(id) {
  return pathOf(id).map(labelOf)
}

// How closely two tags relate. 0 = unrelated; otherwise the number of levels
// they share, so a shared root scores lower than an exact leaf match.
export function overlapDepth(a, b) {
  const pa = pathOf(a)
  const pb = pathOf(b)
  let n = 0
  while (n < pa.length && n < pb.length && pa[n] === pb[n]) n++
  return n
}

// The deepest node the two tags have in common, for the "why" label on a card.
export function commonNodeId(a, b) {
  const n = overlapDepth(a, b)
  return n ? pathOf(a)[n - 1] : null
}

// Every id at or under a node, used by search and filters.
export function subtreeIds(id) {
  const out = []
  const walk = (n) => {
    out.push(n.id)
    for (const c of n.children || []) walk(c)
  }
  const node = INTEREST_MAP[id]
  if (node) walk(node)
  return out
}

export const ALL_INTEREST_IDS = Object.keys(INTEREST_MAP)
