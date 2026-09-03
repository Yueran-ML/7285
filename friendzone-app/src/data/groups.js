// Seed groups. Members are fictional. Avatar colours are picked from the palette.

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
    capacity: 6,
    blurb: 'Home-cooked food, shared kitchens, and recipes from wherever we came from.',
    place: 'Shared Kitchen · Level 3',
    members: [
      { name: 'Priya', color: C.plum },
      { name: 'Tom', color: C.sky },
      { name: 'Mei', color: C.rose },
      { name: 'Jonas', color: C.moss },
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
    capacity: 8,
    blurb: 'One film, one couch, every Friday. Popcorn negotiable.',
    place: 'Common Room · Ground',
    members: [
      { name: 'Aiko', color: C.rose },
      { name: 'Ben', color: C.sky },
      { name: 'Farah', color: C.gold },
      { name: 'Luca', color: C.moss },
      { name: 'Sam', color: C.clay },
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
    capacity: 6,
    blurb: 'Quiet company for long study sessions. Coffee runs at the top of the hour.',
    place: 'Central Library · Level 2',
    members: [
      { name: 'Hana', color: C.plum },
      { name: 'Ravi', color: C.moss },
      { name: 'Ella', color: C.gold },
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
    capacity: 8,
    blurb: 'Thursday nights on the rooftop. Beginners welcome, we explain everything.',
    place: 'Rooftop Lounge',
    members: [
      { name: 'Diego', color: C.terracotta },
      { name: 'Wen', color: C.sky },
      { name: 'Olivia', color: C.rose },
      { name: 'Kofi', color: C.moss },
      { name: 'Ines', color: C.gold },
      { name: 'Max', color: C.plum },
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
    capacity: 6,
    blurb: 'Easy pace along the river before the city wakes up. No one gets left behind.',
    place: 'River Walk · Kangaroo Point',
    members: [
      { name: 'Nadia', color: C.sage },
      { name: 'Chris', color: C.sky },
      { name: 'Yuki', color: C.rose },
      { name: 'Omar', color: C.clay },
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
    capacity: 6,
    blurb: 'Saturday trail walks with too many photo stops.',
    place: 'Bus stop B · Chancellors Place',
    members: [
      { name: 'Grace', color: C.moss },
      { name: 'Arjun', color: C.plum },
      { name: 'Lena', color: C.gold },
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
    capacity: 6,
    blurb: 'Shared playlists, shared deadlines. Headphones on, doors open.',
    place: 'Study Lounge · Level 1',
    members: [
      { name: 'Zara', color: C.rose },
      { name: 'Finn', color: C.sky },
      { name: 'Ayla', color: C.sage },
      { name: 'Theo', color: C.clay },
      { name: 'Noor', color: C.plum },
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
    capacity: 6,
    blurb: 'One new café every Sunday. Rating system very unscientific.',
    place: 'West End',
    members: [
      { name: 'Isla', color: C.gold },
      { name: 'Mateo', color: C.terracotta },
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

// How well a circle fits the user's interests.
//   hits  — number of the circle's tags the user also picked
//   full  — every tag of the circle is one of the user's interests
//   great — strong overlap: shares 2+ interests, or the circle is entirely "their thing"
export function matchInfo(group, interests) {
  const hits = group.tags.filter((t) => interests.includes(t)).length
  const full = hits > 0 && hits === group.tags.length
  return { hits, full, great: hits >= 2 || full, score: hits * 10 + (full ? 5 : 0) }
}
