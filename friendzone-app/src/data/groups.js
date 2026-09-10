// Seed groups. Members are fictional. Avatar colours are picked from the palette.
//
// Iteration 2 adds three fields per circle so matching can look past interests:
//   pace     — 'quiet' | 'mixed' | 'lively', compared against the user's social style
//   traits   — what the circle is like, drawn from the LIKES vocabulary
//   involves — honest heads-up tags, drawn from the DISLIKES vocabulary
// Members carry a star sign so the profile's zodiac field has something to meet.

const C = {
  terracotta: '#d96c4f',
  sage: '#7fa98f',
  gold: '#e9b949',
  plum: '#8e6c9e',
  sky: '#6c9bc4',
  clay: '#c48a6c',
  moss: '#6f8f5a',
  rose: '#d98a9a',
}

export const GROUPS = [
  {
    id: 'cooking-circle',
    name: 'Cooking Circle',
    emoji: '🍳',
    tags: ['cooking', 'coffee'],
    pace: 'mixed',
    traits: ['foodie', 'homebody', 'deep-talks'],
    involves: [],
    capacity: 6,
    blurb: 'Home-cooked food, shared kitchens, and recipes from wherever we came from.',
    place: 'Shared Kitchen · Level 3',
    members: [
      { name: 'Priya', color: C.plum, sign: 'virgo' },
      { name: 'Tom', color: C.sky, sign: 'taurus' },
      { name: 'Mei', color: C.rose, sign: 'cancer' },
      { name: 'Jonas', color: C.moss, sign: 'leo' },
    ],
    meetup: { day: 'Saturday', time: '2:00 pm', place: 'Shared Kitchen L3', activity: 'Dumpling night' },
    seed: [
      { from: 'Priya', text: 'Hi everyone 👋 I just moved into level 3 last week', minsAgo: 180 },
      { from: 'Tom', text: 'Welcome! Kitchen on L3 is the good one, the big stove works', minsAgo: 172 },
      { from: 'Mei', text: 'I miss proper dumplings so much. Nobody here makes them right 😭', minsAgo: 95 },
      { from: 'Jonas', text: 'Okay but... what if we just make them?', minsAgo: 90 },
      { from: 'Mei', text: 'Saturday?? I can bring the wrappers', minsAgo: 88 },
    ],
    replies: [
      'Oh nice, where did you learn that?',
      'Haha same, I think about food way too much',
      'That sounds amazing honestly',
      'Wait, you have to show us on Saturday',
      'I’ve never tried that, would love to',
      'Adding it to the list for the meetup 📝',
    ],
  },
  {
    id: 'friday-film',
    name: 'Friday Film Club',
    emoji: '🎬',
    tags: ['movies'],
    pace: 'quiet',
    traits: ['homebody', 'night-owl'],
    involves: ['late-nights'],
    capacity: 8,
    blurb: 'One film, one couch, every Friday. Popcorn negotiable.',
    place: 'Common Room · Ground',
    members: [
      { name: 'Aiko', color: C.rose, sign: 'pisces' },
      { name: 'Ben', color: C.sky, sign: 'aquarius' },
      { name: 'Farah', color: C.gold, sign: 'libra' },
      { name: 'Luca', color: C.moss, sign: 'scorpio' },
      { name: 'Sam', color: C.clay, sign: 'gemini' },
    ],
    meetup: { day: 'Friday', time: '7:00 pm', place: 'Common Room', activity: 'Studio Ghibli night' },
    seed: [
      { from: 'Ben', text: 'Poll: Ghibli or a thriller this week?', minsAgo: 240 },
      { from: 'Aiko', text: 'Ghibli. Always Ghibli.', minsAgo: 238 },
      { from: 'Farah', text: 'I’ve never actually seen Spirited Away 😅', minsAgo: 120 },
      { from: 'Luca', text: 'Okay that settles it then', minsAgo: 118 },
    ],
    replies: [
      'Oh that one’s a classic',
      'Adding it to the watchlist',
      'Wait I haven’t seen that either',
      'Friday can’t come soon enough',
      'Big agree',
    ],
  },
  {
    id: 'library-buddies',
    name: 'Library Buddies',
    emoji: '📚',
    tags: ['study', 'coffee'],
    pace: 'quiet',
    traits: ['early-riser', 'planner', 'quiet-cafes'],
    involves: ['early-mornings'],
    capacity: 6,
    blurb: 'Quiet company for long study sessions. Coffee runs at the top of the hour.',
    place: 'Central Library · Level 2',
    members: [
      { name: 'Hana', color: C.plum, sign: 'capricorn' },
      { name: 'Ravi', color: C.moss, sign: 'virgo' },
      { name: 'Ella', color: C.gold, sign: 'taurus' },
    ],
    meetup: { day: 'Wednesday', time: '10:00 am', place: 'Central Library L2', activity: 'Study block + coffee' },
    seed: [
      { from: 'Ravi', text: 'Anyone at the library tomorrow? I’ll be at the L2 windows', minsAgo: 300 },
      { from: 'Hana', text: 'Yes! I have a report due Friday and need accountability', minsAgo: 290 },
      { from: 'Ella', text: 'Same. I’ll bring snacks', minsAgo: 200 },
    ],
    replies: [
      'Nice, see you there?',
      'Honestly that helps so much',
      'Coffee break at 11?',
      'I’m in the same boat',
      'Good luck with it!',
    ],
  },
  {
    id: 'board-game-night',
    name: 'Board Game Night',
    emoji: '🎲',
    tags: ['boardgames', 'gaming'],
    pace: 'lively',
    traits: ['night-owl', 'spontaneous'],
    involves: ['competitive', 'big-crowds', 'late-nights'],
    capacity: 8,
    blurb: 'Thursday nights on the rooftop. Beginners welcome, we explain everything.',
    place: 'Rooftop Lounge',
    members: [
      { name: 'Diego', color: C.terracotta, sign: 'aries' },
      { name: 'Wen', color: C.sky, sign: 'gemini' },
      { name: 'Olivia', color: C.rose, sign: 'leo' },
      { name: 'Kofi', color: C.moss, sign: 'sagittarius' },
      { name: 'Ines', color: C.gold, sign: 'libra' },
      { name: 'Max', color: C.plum, sign: 'aries' },
    ],
    meetup: { day: 'Thursday', time: '7:00 pm', place: 'Rooftop Lounge', activity: 'Catan + card games' },
    seed: [
      { from: 'Diego', text: 'Bringing Catan and a deck of cards on Thursday', minsAgo: 500 },
      { from: 'Wen', text: 'I’ve never played Catan, is it hard?', minsAgo: 480 },
      { from: 'Olivia', text: 'Not at all, we’ll teach you in 5 min', minsAgo: 475 },
    ],
    replies: [
      'Ooh that’s a good one',
      'You have to teach us that',
      'Thursday is going to be chaos, I love it',
      'Count me in',
      'Never heard of it, sounds fun',
    ],
  },
  {
    id: 'sunrise-runners',
    name: 'Sunrise Runners',
    emoji: '🏃',
    tags: ['running', 'hiking'],
    pace: 'mixed',
    traits: ['early-riser', 'outdoors'],
    involves: ['early-mornings'],
    capacity: 6,
    blurb: 'Easy pace along the river before the city wakes up. No one gets left behind.',
    place: 'River Walk · Kangaroo Point',
    members: [
      { name: 'Nadia', color: C.sage, sign: 'capricorn' },
      { name: 'Chris', color: C.sky, sign: 'scorpio' },
      { name: 'Yuki', color: C.rose, sign: 'pisces' },
      { name: 'Omar', color: C.clay, sign: 'aquarius' },
    ],
    meetup: { day: 'Sunday', time: '6:30 am', place: 'River Walk', activity: '5k easy run' },
    seed: [
      { from: 'Nadia', text: 'Sunday 6:30, the usual spot by the cliffs?', minsAgo: 600 },
      { from: 'Chris', text: 'I’ll be slow but I’ll be there', minsAgo: 590 },
      { from: 'Yuki', text: 'Slow is the whole point 😄', minsAgo: 585 },
    ],
    replies: [
      'Love that',
      'We keep it easy, promise',
      'See you Sunday then!',
      'Same here honestly',
      'The river at sunrise is unreal',
    ],
  },
  {
    id: 'coottha-walkers',
    name: 'Mt Coot-tha Walkers',
    emoji: '🌿',
    tags: ['hiking', 'photography'],
    pace: 'quiet',
    traits: ['outdoors', 'early-riser', 'deep-talks'],
    involves: ['early-mornings'],
    capacity: 6,
    blurb: 'Saturday trail walks with too many photo stops.',
    place: 'Bus stop B · Chancellors Place',
    members: [
      { name: 'Grace', color: C.moss, sign: 'cancer' },
      { name: 'Arjun', color: C.plum, sign: 'virgo' },
      { name: 'Lena', color: C.gold, sign: 'taurus' },
    ],
    meetup: { day: 'Saturday', time: '8:00 am', place: 'Bus stop B', activity: 'Summit track walk' },
    seed: [
      { from: 'Grace', text: 'Summit track this Saturday? Should be clear skies', minsAgo: 700 },
      { from: 'Arjun', text: 'In. Bringing the camera', minsAgo: 690 },
    ],
    replies: [
      'That view never gets old',
      'Bring water, it gets warm',
      'Yes!! Saturday it is',
      'Ooh good idea',
      'I’ll take the photos this time',
    ],
  },
  {
    id: 'lofi-study',
    name: 'Lo-fi Study Beats',
    emoji: '🎵',
    tags: ['study', 'music'],
    pace: 'quiet',
    traits: ['homebody', 'quiet-cafes', 'night-owl'],
    involves: [],
    capacity: 6,
    blurb: 'Shared playlists, shared deadlines. Headphones on, doors open.',
    place: 'Study Lounge · Level 1',
    members: [
      { name: 'Zara', color: C.rose, sign: 'libra' },
      { name: 'Finn', color: C.sky, sign: 'sagittarius' },
      { name: 'Ayla', color: C.sage, sign: 'cancer' },
      { name: 'Theo', color: C.clay, sign: 'gemini' },
      { name: 'Noor', color: C.plum, sign: 'pisces' },
    ],
    meetup: { day: 'Tuesday', time: '4:00 pm', place: 'Study Lounge L1', activity: 'Playlist swap + study' },
    seed: [
      { from: 'Finn', text: 'Dropped a new playlist in the shared folder 🎧', minsAgo: 400 },
      { from: 'Zara', text: 'The second track is exactly my vibe', minsAgo: 380 },
    ],
    replies: [
      'Adding that to the queue',
      'Yes, that one hits',
      'Send me the link?',
      'Perfect for the lounge on Tuesday',
      'Same, I’ve had it on repeat',
    ],
  },
  {
    id: 'coffee-crawl',
    name: 'Coffee Crawl',
    emoji: '☕',
    tags: ['coffee', 'photography'],
    pace: 'lively',
    traits: ['foodie', 'spontaneous', 'quiet-cafes'],
    involves: ['big-crowds'],
    capacity: 6,
    blurb: 'One new café every Sunday. Rating system very unscientific.',
    place: 'West End',
    members: [
      { name: 'Isla', color: C.gold, sign: 'leo' },
      { name: 'Mateo', color: C.terracotta, sign: 'aries' },
    ],
    meetup: { day: 'Sunday', time: '10:00 am', place: 'West End', activity: 'Café #4 of the crawl' },
    seed: [
      { from: 'Isla', text: 'Café #4 this Sunday. I hear the pastries are dangerous', minsAgo: 900 },
      { from: 'Mateo', text: 'Dangerous is exactly what I need', minsAgo: 880 },
    ],
    replies: [
      'Okay we’re going there next',
      'Rating: 9 pastries out of 10',
      'Sunday can’t come fast enough',
      'Ha, that’s the spirit',
      'Oh I know that place!',
    ],
  },
]

export const GROUP_MAP = Object.fromEntries(GROUPS.map((g) => [g.id, g]))

export const SORT_MODES = [
  { id: 'best', label: 'Best match' },
  { id: 'interests', label: 'Interests' },
  { id: 'style', label: 'How you meet' },
  { id: 'sign', label: 'Star sign' },
]

// How well a circle fits the user, across every facet they chose to fill in.
//
// Returns the numbers plus a `reasons` list the card renders verbatim, so the
// app can always answer "why am I seeing this?" — nothing is a black box.
// A clash lowers the score but never removes a circle from the list.
export function matchFacets(group, state = {}) {
  const interests = state.interests || []
  const { socialStyle = null, zodiac = null, likes = [], dislikes = [] } = state.profile || {}

  const sharedInterests = group.tags.filter((t) => interests.includes(t))
  const allInterests = sharedInterests.length > 0 && sharedInterests.length === group.tags.length

  const paceExact = Boolean(socialStyle) && group.pace === socialStyle
  const paceOk = Boolean(socialStyle) && !paceExact && (group.pace === 'mixed' || socialStyle === 'mixed')

  const sharedTraits = group.traits.filter((t) => likes.includes(t))
  const clashes = group.involves.filter((t) => dislikes.includes(t))
  const signMates = zodiac ? group.members.filter((m) => m.sign === zodiac) : []

  const score =
    sharedInterests.length * 10 +
    (allInterests ? 5 : 0) +
    (paceExact ? 6 : paceOk ? 3 : 0) +
    sharedTraits.length * 4 +
    signMates.length * 2 -
    clashes.length * 5

  const great =
    sharedInterests.length >= 2 ||
    allInterests ||
    (sharedInterests.length >= 1 && (paceExact || sharedTraits.length >= 2))

  return {
    hits: sharedInterests.length,
    sharedInterests,
    allInterests,
    paceExact,
    paceOk,
    sharedTraits,
    clashes,
    signMates,
    signMateCount: signMates.length,
    score,
    great,
    // any positive signal at all — decides recommended vs "browse the rest"
    matched: sharedInterests.length > 0 || paceExact || sharedTraits.length > 0 || signMates.length > 0,
  }
}

// Sort comparator per mode. Fuller circles sink so newcomers land somewhere
// with room, which also keeps the same few circles from always winning.
export function comparatorFor(mode) {
  const openness = (a, b) => a.members.length / a.capacity - b.members.length / b.capacity
  switch (mode) {
    case 'interests':
      return (a, b) => b.hits - a.hits || b.score - a.score || openness(a, b)
    case 'style':
      return (a, b) =>
        Number(b.paceExact) - Number(a.paceExact) ||
        b.sharedTraits.length - a.sharedTraits.length ||
        b.score - a.score ||
        openness(a, b)
    case 'sign':
      return (a, b) => b.signMateCount - a.signMateCount || b.score - a.score || openness(a, b)
    default:
      return (a, b) => b.score - a.score || openness(a, b)
  }
}
