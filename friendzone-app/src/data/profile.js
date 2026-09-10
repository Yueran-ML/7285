// Profile vocabulary for iteration 2.
//
// Design notes tied to the A1 ethics table:
//  · Row 4 (pathologising) — the social-style axis is introvert/extrovert in
//    substance, but it is worded as a preference about *how you like to meet
//    people*, never as a personality diagnosis. No clinical labels in the UI.
//  · Row 7 (algorithmic segregation) — every field here is chosen by the user.
//    Nothing is inferred, and nothing is required. Blank is a valid profile.
//  · Star signs are deliberately low-stakes and low-weight: an icebreaker, not
//    a filter. They can never hide a circle from you.

export const SOCIAL_STYLES = [
  {
    id: 'quiet',
    emoji: '🌙',
    label: 'Small and calm',
    line: 'One or two people, somewhere quiet',
  },
  {
    id: 'mixed',
    emoji: '🌤️',
    label: 'Depends on the week',
    line: 'Sometimes quiet, sometimes busy',
  },
  {
    id: 'lively',
    emoji: '🎉',
    label: 'Big and busy',
    line: 'Bigger groups, more going on',
  },
]

export const SOCIAL_STYLE_MAP = Object.fromEntries(SOCIAL_STYLES.map((s) => [s.id, s]))

// Things you enjoy. Circles carry the same tags, so overlap is a real signal.
export const LIKES = [
  { id: 'early-riser', emoji: '🌅', label: 'Early mornings' },
  { id: 'night-owl', emoji: '🦉', label: 'Late nights' },
  { id: 'homebody', emoji: '🛋️', label: 'Staying in' },
  { id: 'outdoors', emoji: '🌳', label: 'Being outside' },
  { id: 'foodie', emoji: '🍜', label: 'Food and cooking' },
  { id: 'quiet-cafes', emoji: '🫖', label: 'Quiet cafés' },
  { id: 'deep-talks', emoji: '💬', label: 'Long conversations' },
  { id: 'spontaneous', emoji: '🎲', label: 'Last-minute plans' },
  { id: 'planner', emoji: '🗓️', label: 'Planning ahead' },
  { id: 'pets', emoji: '🐾', label: 'Animals' },
]

export const LIKE_MAP = Object.fromEntries(LIKES.map((l) => [l.id, l]))

// Things you would rather avoid. These never hide a circle. They show up as an
// honest heads-up on the card so you can decide for yourself.
export const DISLIKES = [
  { id: 'big-crowds', emoji: '👥', label: 'Big crowds' },
  { id: 'loud-places', emoji: '🔊', label: 'Loud places' },
  { id: 'early-mornings', emoji: '⏰', label: 'Early starts' },
  { id: 'late-nights', emoji: '🌃', label: 'Late finishes' },
  { id: 'competitive', emoji: '🏆', label: 'Competition' },
  { id: 'small-talk', emoji: '💭', label: 'Small talk' },
]

export const DISLIKE_MAP = Object.fromEntries(DISLIKES.map((d) => [d.id, d]))

export const ZODIAC = [
  { id: 'aries', symbol: '♈', label: 'Aries', dates: '21 Mar – 19 Apr' },
  { id: 'taurus', symbol: '♉', label: 'Taurus', dates: '20 Apr – 20 May' },
  { id: 'gemini', symbol: '♊', label: 'Gemini', dates: '21 May – 20 Jun' },
  { id: 'cancer', symbol: '♋', label: 'Cancer', dates: '21 Jun – 22 Jul' },
  { id: 'leo', symbol: '♌', label: 'Leo', dates: '23 Jul – 22 Aug' },
  { id: 'virgo', symbol: '♍', label: 'Virgo', dates: '23 Aug – 22 Sep' },
  { id: 'libra', symbol: '♎', label: 'Libra', dates: '23 Sep – 22 Oct' },
  { id: 'scorpio', symbol: '♏', label: 'Scorpio', dates: '23 Oct – 21 Nov' },
  { id: 'sagittarius', symbol: '♐', label: 'Sagittarius', dates: '22 Nov – 21 Dec' },
  { id: 'capricorn', symbol: '♑', label: 'Capricorn', dates: '22 Dec – 19 Jan' },
  { id: 'aquarius', symbol: '♒', label: 'Aquarius', dates: '20 Jan – 18 Feb' },
  { id: 'pisces', symbol: '♓', label: 'Pisces', dates: '19 Feb – 20 Mar' },
]

export const ZODIAC_MAP = Object.fromEntries(ZODIAC.map((z) => [z.id, z]))

export const emptyProfile = {
  socialStyle: null,
  zodiac: null,
  likes: [],
  dislikes: [],
  bio: '',
}

// How much of the optional profile has been filled in (0–1). Used only to show
// a gentle nudge, never to gate anything.
export function profileCompletion(profile = emptyProfile) {
  const parts = [
    Boolean(profile.socialStyle),
    profile.likes?.length > 0,
    profile.dislikes?.length > 0,
    Boolean(profile.zodiac),
    Boolean(profile.bio?.trim()),
  ]
  return parts.filter(Boolean).length / parts.length
}
