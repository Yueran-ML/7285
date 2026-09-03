// Conversation prompts, keyed by interest tag.
// "general" prompts are always mixed in so no group ever runs dry.

export const PROMPTS = {
  cooking: [
    "What's a dish from your hometown you miss?",
    "Best cheap meal you've made this week?",
    'Rice cooker or stovetop — which team are you on?',
    "One spice you can't live without?",
    'What would you cook if you had a whole kitchen to yourself on Saturday?',
  ],
  movies: [
    'Last film that made you cry?',
    "What's your comfort movie — the one you rewatch?",
    'Cinema or couch?',
    'A film everyone loves that you just don’t get?',
  ],
  study: [
    "What's your go-to study spot on campus?",
    'Coffee or tea while studying?',
    'Hardest course this semester — and why?',
    'Do you study better in silence or with background noise?',
  ],
  gaming: [
    "What's a game you'd teach a total beginner first?",
    'Co-op or competitive?',
    'Handheld, PC or console?',
  ],
  boardgames: [
    'Fast card game or a 3-hour strategy epic?',
    "What's a game you always win — and one you never do?",
    'Any game from home that nobody here knows?',
  ],
  photography: [
    'Best spot in Brisbane for golden hour?',
    'Phone or camera?',
    'Show us the last photo you took (no pressure).',
  ],
  running: [
    'Morning or evening runs?',
    'Music, podcast, or nothing while you run?',
    "What's your current comfortable distance?",
  ],
  hiking: [
    'Favourite trail so far — or one you want to try?',
    'Sunrise hike or sunset hike?',
    'Snacks are essential. What do you bring?',
  ],
  coffee: [
    'Flat white or long black?',
    'Best café near campus?',
    'How many coffees is too many?',
  ],
  music: [
    'What are you listening to right now?',
    'A concert you’d love to see in Brisbane?',
    'Song that instantly reminds you of home?',
  ],
  basketball: [
    'Pickup game this week — who’s in?',
    'Who are you watching this season?',
  ],
  yoga: [
    'Morning stretch or evening wind-down?',
    'Mat on the grass or in the studio?',
  ],
  general: [
    'Where are you from originally?',
    'What surprised you most about Brisbane?',
    'One thing you’d like to do this semester?',
    'What’s a small win you had this week?',
    'What’s something you’re looking forward to?',
  ],
}

export function promptsFor(tags = []) {
  const pool = []
  for (const t of tags) if (PROMPTS[t]) pool.push(...PROMPTS[t])
  pool.push(...PROMPTS.general)
  return pool
}
