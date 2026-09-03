export const INTERESTS = [
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'movies', label: 'Movies', emoji: '🎬' },
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'boardgames', label: 'Board games', emoji: '🎲' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'hiking', label: 'Hiking', emoji: '🌿' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
]

export const INTEREST_MAP = Object.fromEntries(INTERESTS.map((i) => [i.id, i]))
