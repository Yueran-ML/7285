// Seed circles. Members are fictional. Avatar colours come from the palette.
//
// Tags point into the interest tree in interests.js and may sit at any level.
// A circle tagged 'f1' is about Formula 1 generally; one tagged 'f1-ferrari' is
// specifically for Ferrari fans, and matching scores those differently.
//
// Per circle:
//   pace     — 'quiet' | 'mixed' | 'lively', compared against the user's social style
//   traits   — what the circle is like, drawn from the LIKES vocabulary
//   involves — honest heads-up tags, drawn from the DISLIKES vocabulary

import { commonNodeId, overlapDepth } from './interests.js'

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
    tags: ['home-cooking', 'cuisine-chinese'],
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
      'Adding it to the list for the meetup 📝',
    ],
  },
  {
    id: 'weekend-bakers',
    name: 'Weekend Bakers',
    emoji: '🥐',
    tags: ['baking'],
    pace: 'quiet',
    traits: ['foodie', 'homebody', 'early-riser'],
    involves: ['early-mornings'],
    capacity: 6,
    blurb: 'Slow mornings, one oven, and whatever we can get to rise in this humidity.',
    place: 'Shared Kitchen · Level 1',
    members: [
      { name: 'Elif', color: C.gold, sign: 'taurus' },
      { name: 'Hugo', color: C.clay, sign: 'capricorn' },
      { name: 'Sana', color: C.rose, sign: 'pisces' },
    ],
    meetup: { day: 'Sunday', time: '9:00 am', place: 'Shared Kitchen L1', activity: 'Focaccia attempt #3' },
    seed: [
      { from: 'Elif', text: 'The humidity here has destroyed my sourdough starter twice now', minsAgo: 400 },
      { from: 'Hugo', text: 'Mine lives in the fridge. It is the only thing that worked', minsAgo: 380 },
      { from: 'Sana', text: 'Focaccia this Sunday? Much more forgiving', minsAgo: 120 },
    ],
    replies: [
      'Ooh recipe please',
      'That actually makes sense, I will try it',
      'Sunday works for me',
      'Mine collapsed again. Starting over.',
    ],
  },
  {
    id: 'friday-film',
    name: 'Friday Film Club',
    emoji: '🎬',
    tags: ['arthouse', 'series'],
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
    ],
  },
  {
    id: 'anime-night',
    name: 'Anime Night',
    emoji: '🌸',
    tags: ['anime'],
    pace: 'quiet',
    traits: ['homebody', 'night-owl'],
    involves: ['late-nights'],
    capacity: 8,
    blurb: 'One season at a time, subs not dubs, and nobody spoils anything.',
    place: 'Common Room · Ground',
    members: [
      { name: 'Kenta', color: C.sky, sign: 'gemini' },
      { name: 'Rui', color: C.plum, sign: 'scorpio' },
      { name: 'Bea', color: C.rose, sign: 'cancer' },
      { name: 'Dan', color: C.moss, sign: 'aries' },
    ],
    meetup: { day: 'Wednesday', time: '8:00 pm', place: 'Common Room', activity: 'Frieren, episodes 5 to 8' },
    seed: [
      { from: 'Kenta', text: 'We are four episodes in and nobody has cried yet. Suspicious', minsAgo: 300 },
      { from: 'Bea', text: 'Give it two more. I have been warned', minsAgo: 290 },
      { from: 'Rui', text: 'Bringing snacks Wednesday 🍿', minsAgo: 100 },
    ],
    replies: [
      'No spoilers!! I am one behind',
      'That episode broke me honestly',
      'Wednesday, same room?',
      'Subs obviously. This is not a debate.',
    ],
  },
  {
    id: 'library-buddies',
    name: 'Library Buddies',
    emoji: '📚',
    tags: ['quiet-study', 'specialty-coffee'],
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
    replies: ['Nice, see you there?', 'Honestly that helps so much', 'Coffee break at 11?', 'I’m in the same boat'],
  },
  {
    id: 'thesis-club',
    name: 'Thesis Support Group',
    emoji: '📄',
    tags: ['thesis'],
    pace: 'quiet',
    traits: ['planner', 'deep-talks', 'quiet-cafes'],
    involves: [],
    capacity: 6,
    blurb: 'Everyone here is writing something long and slightly terrifying. Weekly check-in, no judgement.',
    place: 'Postgrad Lounge · Level 4',
    members: [
      { name: 'Marta', color: C.sage, sign: 'virgo' },
      { name: 'Chidi', color: C.clay, sign: 'libra' },
      { name: 'Yun', color: C.rose, sign: 'capricorn' },
    ],
    meetup: { day: 'Monday', time: '11:00 am', place: 'Postgrad Lounge', activity: 'Weekly word-count confession' },
    seed: [
      { from: 'Marta', text: 'Wrote 400 words and deleted 600. Net negative week', minsAgo: 500 },
      { from: 'Chidi', text: 'Deleting counts as progress. I have decided this', minsAgo: 480 },
      { from: 'Yun', text: 'Monday check-in as usual?', minsAgo: 200 },
    ],
    replies: [
      'Honestly that is further than me',
      'Deleting is writing. Standing by it.',
      'See you Monday',
      'How is the methods chapter going?',
    ],
  },
  {
    id: 'lofi-study',
    name: 'Lo-fi Study Beats',
    emoji: '🎵',
    tags: ['quiet-study', 'music'],
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
    replies: ['Adding that to the queue', 'Yes, that one hits', 'Send me the link?', 'Same, I’ve had it on repeat'],
  },
  {
    id: 'board-game-night',
    name: 'Board Game Night',
    emoji: '🎲',
    tags: ['boardgames'],
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
    replies: ['Ooh that’s a good one', 'You have to teach us that', 'Count me in', 'Never heard of it, sounds fun'],
  },
  {
    id: 'tuesday-table',
    name: 'The Tuesday Table',
    emoji: '🐉',
    tags: ['dnd'],
    pace: 'mixed',
    traits: ['deep-talks', 'night-owl', 'planner'],
    involves: ['late-nights'],
    capacity: 6,
    blurb: 'An ongoing campaign, one session a week. New players get a pre-made character and no pressure.',
    place: 'Study Room 4 · Level 2',
    members: [
      { name: 'Otto', color: C.plum, sign: 'scorpio' },
      { name: 'Nell', color: C.sage, sign: 'aquarius' },
      { name: 'Pia', color: C.gold, sign: 'gemini' },
      { name: 'Sef', color: C.clay, sign: 'leo' },
    ],
    meetup: { day: 'Tuesday', time: '6:30 pm', place: 'Study Room 4', activity: 'Session 12: the bridge' },
    seed: [
      { from: 'Otto', text: 'Reminder that you all still owe the innkeeper money', minsAgo: 600 },
      { from: 'Nell', text: 'I maintain that was Sef’s idea', minsAgo: 590 },
      { from: 'Sef', text: 'It was a great idea. The execution was the problem', minsAgo: 585 },
    ],
    replies: [
      'Rolling for that on Tuesday',
      'I have a plan and it is a bad one',
      'Can I bring a friend? They have never played',
      'New players welcome, genuinely',
    ],
  },
  {
    id: 'mahjong-table',
    name: 'Mahjong Sundays',
    emoji: '🀄',
    tags: ['mahjong'],
    pace: 'mixed',
    traits: ['deep-talks', 'foodie'],
    involves: [],
    capacity: 8,
    blurb: 'Four to a table, tea on the side. We play the version whoever brought the set plays.',
    place: 'Common Room · Ground',
    members: [
      { name: 'Qing', color: C.rose, sign: 'taurus' },
      { name: 'Alan', color: C.sky, sign: 'virgo' },
      { name: 'Xiu', color: C.gold, sign: 'cancer' },
    ],
    meetup: { day: 'Sunday', time: '3:00 pm', place: 'Common Room', activity: 'Two tables, tea, snacks' },
    seed: [
      { from: 'Qing', text: 'We have one set and six people. Someone please bring another', minsAgo: 700 },
      { from: 'Alan', text: 'My flatmate has one. Will ask.', minsAgo: 690 },
      { from: 'Xiu', text: 'I only know Cantonese rules, is that okay?', minsAgo: 300 },
    ],
    replies: [
      'Any rules are fine, we adapt',
      'Teach me, I only know the tiles',
      'Sunday works. Bringing snacks.',
      'Ha, my grandmother would destroy all of us',
    ],
  },
  {
    id: 'lights-out',
    name: 'Lights Out',
    emoji: '🏁',
    tags: ['f1'],
    pace: 'lively',
    traits: ['night-owl', 'spontaneous'],
    involves: ['late-nights', 'big-crowds'],
    capacity: 10,
    blurb: 'We watch every race together, whatever ungodly hour it starts. No team loyalty required.',
    place: 'Common Room · Ground',
    members: [
      { name: 'Rafa', color: C.terracotta, sign: 'aries' },
      { name: 'Jo', color: C.sky, sign: 'sagittarius' },
      { name: 'Nils', color: C.moss, sign: 'leo' },
      { name: 'Amara', color: C.gold, sign: 'libra' },
      { name: 'Kit', color: C.plum, sign: 'gemini' },
    ],
    meetup: { day: 'Sunday', time: '11:00 pm', place: 'Common Room', activity: 'Race watch + very bad commentary' },
    seed: [
      { from: 'Rafa', text: 'Quali at 1am. Who is actually going to make it', minsAgo: 500 },
      { from: 'Jo', text: 'Me. I have made peace with Monday being a write-off', minsAgo: 480 },
      { from: 'Nils', text: 'Bringing coffee for everyone. This is not optional', minsAgo: 470 },
      { from: 'Amara', text: 'Strategy call was insane last week btw', minsAgo: 200 },
    ],
    replies: [
      'That strategy call was criminal',
      'Setting an alarm. See you at 1',
      'Who are you backing this weekend?',
      'I have no team, I just like the chaos',
      'Undercut. Every time. Nobody listens to me.',
    ],
  },
  {
    id: 'tifosi-brisbane',
    name: 'Tifosi Brisbane',
    emoji: '🔴',
    tags: ['f1-ferrari'],
    pace: 'lively',
    traits: ['night-owl', 'deep-talks'],
    involves: ['late-nights'],
    capacity: 8,
    blurb: 'Ferrari only. We suffer together, we celebrate rarely, we never learn.',
    place: "Gio's Pizzeria · Toowong",
    members: [
      { name: 'Marco', color: C.terracotta, sign: 'scorpio' },
      { name: 'Sofia', color: C.rose, sign: 'taurus' },
      { name: 'Ilya', color: C.clay, sign: 'capricorn' },
    ],
    meetup: { day: 'Sunday', time: '10:30 pm', place: "Gio's Pizzeria", activity: 'Race night, red shirts encouraged' },
    seed: [
      { from: 'Marco', text: 'I am not emotionally recovered from that pit stop', minsAgo: 800 },
      { from: 'Sofia', text: 'Nobody is. That is the whole deal with supporting them', minsAgo: 780 },
      { from: 'Ilya', text: 'Twenty years in and I keep coming back', minsAgo: 300 },
    ],
    replies: [
      'Every single year. Every one.',
      'This is the year. It is never the year.',
      'Red shirt on Sunday?',
      'Do not talk to me about strategy right now',
    ],
  },
  {
    id: 'sim-garage',
    name: 'Sim Racing Garage',
    emoji: '🖥️',
    tags: ['sim-racing', 'gt3'],
    pace: 'mixed',
    traits: ['night-owl', 'planner'],
    involves: ['competitive'],
    capacity: 6,
    blurb: 'One rig, a league night, and a lot of arguing about brake bias. Controllers welcome.',
    place: 'Games Room · Level 2',
    members: [
      { name: 'Bram', color: C.sky, sign: 'virgo' },
      { name: 'Tariq', color: C.moss, sign: 'aquarius' },
      { name: 'Lena', color: C.gold, sign: 'aries' },
    ],
    meetup: { day: 'Thursday', time: '8:00 pm', place: 'Games Room', activity: 'Spa, 20 minute race' },
    seed: [
      { from: 'Bram', text: 'New league night: Spa, 20 minutes, no assists above 50%', minsAgo: 400 },
      { from: 'Tariq', text: 'I will be last and I will enjoy it', minsAgo: 380 },
      { from: 'Lena', text: 'Controller players are welcome, ignore Bram', minsAgo: 370 },
    ],
    replies: [
      'What are you running for setup?',
      'Genuinely, controller is fine. I use one.',
      'Thursday, count me in',
      'Turn 1 is going to be carnage again',
    ],
  },
  {
    id: 'sunrise-runners',
    name: 'Sunrise Runners',
    emoji: '🏃',
    tags: ['casual-run', 'parkrun'],
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
    replies: ['Love that', 'We keep it easy, promise', 'See you Sunday then!', 'The river at sunrise is unreal'],
  },
  {
    id: 'bouldering-beginners',
    name: 'Bouldering Beginners',
    emoji: '🧗',
    tags: ['climbing'],
    pace: 'mixed',
    traits: ['spontaneous', 'outdoors'],
    involves: [],
    capacity: 6,
    blurb: 'None of us are good at this. That is the entire point of the group.',
    place: 'Urban Climb · Milton',
    members: [
      { name: 'Dee', color: C.sage, sign: 'leo' },
      { name: 'Pav', color: C.terracotta, sign: 'gemini' },
      { name: 'Mira', color: C.plum, sign: 'cancer' },
    ],
    meetup: { day: 'Saturday', time: '4:00 pm', place: 'Urban Climb Milton', activity: 'Beginner session + shoe hire' },
    seed: [
      { from: 'Dee', text: 'Managed a V2 today. Fell off it four times first', minsAgo: 300 },
      { from: 'Pav', text: 'That still counts. Rules are rules', minsAgo: 280 },
      { from: 'Mira', text: 'First timers, they hire shoes there, do not buy anything', minsAgo: 150 },
    ],
    replies: [
      'My forearms are still recovering',
      'Saturday? I can come along',
      'Genuinely nobody is watching you, it took me ages to believe that',
      'Shoe hire is like six dollars, do not stress',
    ],
  },
  {
    id: 'badminton-weds',
    name: 'Badminton Wednesdays',
    emoji: '🏸',
    tags: ['badminton'],
    pace: 'lively',
    traits: ['spontaneous'],
    involves: ['big-crowds'],
    capacity: 10,
    blurb: 'Two courts booked, rackets to share, mixed levels. Turn up and get put in a game.',
    place: 'UQ Sport · Court 3',
    members: [
      { name: 'Wei', color: C.sky, sign: 'virgo' },
      { name: 'Ash', color: C.moss, sign: 'aries' },
      { name: 'Hana K', color: C.rose, sign: 'libra' },
      { name: 'Raj', color: C.gold, sign: 'taurus' },
      { name: 'Lin', color: C.plum, sign: 'sagittarius' },
    ],
    meetup: { day: 'Wednesday', time: '6:00 pm', place: 'UQ Sport Court 3', activity: 'Two courts, rotating doubles' },
    seed: [
      { from: 'Wei', text: 'Courts booked for Wednesday 6 to 8', minsAgo: 400 },
      { from: 'Ash', text: 'I have two spare rackets if anyone needs one', minsAgo: 380 },
      { from: 'Raj', text: 'Complete beginner here, is that okay?', minsAgo: 200 },
      { from: 'Lin', text: 'Very okay. Half of us were beginners in March', minsAgo: 190 },
    ],
    replies: [
      'Spare racket is yours if you want it',
      'We rotate every game so you play everyone',
      'See you Wednesday!',
      'Beginners genuinely welcome, do not overthink it',
    ],
  },
  {
    id: 'coottha-walkers',
    name: 'Mt Coot-tha Walkers',
    emoji: '🌿',
    tags: ['hiking', 'landscape-photo'],
    pace: 'quiet',
    traits: ['outdoors', 'early-riser', 'deep-talks'],
    involves: ['early-mornings'],
    capacity: 6,
    blurb: 'Saturday trail walks with too many photo stops.',
    place: 'Bus stop B · Chancellors Place',
    members: [
      { name: 'Grace', color: C.moss, sign: 'cancer' },
      { name: 'Arjun', color: C.plum, sign: 'virgo' },
      { name: 'Lena W', color: C.gold, sign: 'taurus' },
    ],
    meetup: { day: 'Saturday', time: '8:00 am', place: 'Bus stop B', activity: 'Summit track walk' },
    seed: [
      { from: 'Grace', text: 'Summit track this Saturday? Should be clear skies', minsAgo: 700 },
      { from: 'Arjun', text: 'In. Bringing the camera', minsAgo: 690 },
    ],
    replies: ['That view never gets old', 'Bring water, it gets warm', 'Yes!! Saturday it is', 'Ooh good idea'],
  },
  {
    id: 'film-photo-walks',
    name: 'Film Photo Walks',
    emoji: '📽️',
    tags: ['film-photo', 'street-photo'],
    pace: 'quiet',
    traits: ['outdoors', 'deep-talks', 'quiet-cafes'],
    involves: [],
    capacity: 6,
    blurb: 'One roll, one afternoon, one suburb. We compare scans a fortnight later.',
    place: 'West End · Boundary St',
    members: [
      { name: 'Tobias', color: C.clay, sign: 'aquarius' },
      { name: 'Nour', color: C.rose, sign: 'pisces' },
      { name: 'Ked', color: C.sage, sign: 'capricorn' },
    ],
    meetup: { day: 'Saturday', time: '3:00 pm', place: 'Boundary St', activity: 'One roll around West End' },
    seed: [
      { from: 'Tobias', text: 'Scans came back. Half of them are light leaks. I love them', minsAgo: 600 },
      { from: 'Nour', text: 'The leaks are the best part, do not fix that camera', minsAgo: 590 },
      { from: 'Ked', text: 'Where are we walking Saturday?', minsAgo: 220 },
    ],
    replies: [
      'Send the scans when they land',
      'What film stock was that?',
      'Saturday, West End again?',
      'Digital people are welcome too, honestly',
    ],
  },
  {
    id: 'coffee-crawl',
    name: 'Coffee Crawl',
    emoji: '☕',
    tags: ['specialty-coffee', 'street-photo'],
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
    replies: ['Okay we’re going there next', 'Rating: 9 pastries out of 10', 'Sunday can’t come fast enough', 'Oh I know that place!'],
  },
  {
    id: 'bubble-tea-run',
    name: 'Bubble Tea Run',
    emoji: '🧋',
    tags: ['bubble-tea'],
    pace: 'lively',
    traits: ['foodie', 'spontaneous'],
    involves: ['big-crowds'],
    capacity: 8,
    blurb: 'Between lectures, whoever is free. Sugar level is a personal decision and we do not judge.',
    place: 'Sunnybank & city',
    members: [
      { name: 'Cindy', color: C.rose, sign: 'gemini' },
      { name: 'Bao', color: C.plum, sign: 'leo' },
      { name: 'Tia', color: C.gold, sign: 'sagittarius' },
      { name: 'Jun', color: C.sky, sign: 'pisces' },
    ],
    meetup: { day: 'Friday', time: '2:00 pm', place: 'Sunnybank Plaza', activity: 'New place, four orders, one verdict' },
    seed: [
      { from: 'Cindy', text: 'New place opened at Sunnybank. Field trip Friday?', minsAgo: 300 },
      { from: 'Bao', text: 'Always. 30% sugar, no ice, do not @ me', minsAgo: 290 },
      { from: 'Tia', text: '30% is wild. Full sugar or nothing', minsAgo: 285 },
    ],
    replies: [
      'Half sugar is the correct answer and you all know it',
      'Friday works, meet at the bus stop?',
      'Oh I have been there, the taro is good',
      'Ordering for me too? I finish at 2:15',
    ],
  },
  {
    id: 'kpop-dance',
    name: 'K-pop Dance Practice',
    emoji: '💜',
    tags: ['kpop'],
    pace: 'lively',
    traits: ['spontaneous'],
    involves: ['big-crowds'],
    capacity: 10,
    blurb: 'We learn one chorus a fortnight. Nobody films anyone without asking.',
    place: 'Dance Studio · UQ Sport',
    members: [
      { name: 'Soo', color: C.rose, sign: 'aries' },
      { name: 'Mai', color: C.plum, sign: 'cancer' },
      { name: 'Ren', color: C.gold, sign: 'virgo' },
      { name: 'Ivy', color: C.sky, sign: 'libra' },
    ],
    meetup: { day: 'Saturday', time: '5:00 pm', place: 'Dance Studio', activity: 'Chorus, slowed to 0.75x first' },
    seed: [
      { from: 'Soo', text: 'New chorus this fortnight. Starting at 0.75 speed as always', minsAgo: 350 },
      { from: 'Mai', text: 'Thank you. Last one nearly killed me at full speed', minsAgo: 340 },
      { from: 'Ivy', text: 'Reminder: nobody films without asking first 💜', minsAgo: 120 },
    ],
    replies: [
      'I am still on the last one honestly',
      'Saturday 5, same studio?',
      'Complete beginner, is that fine?',
      'The footwork in that bridge is impossible',
    ],
  },
  {
    id: 'language-swap',
    name: 'Language Swap',
    emoji: '💬',
    tags: ['lang-english', 'lang-mandarin'],
    pace: 'mixed',
    traits: ['deep-talks', 'quiet-cafes', 'planner'],
    involves: [],
    capacity: 8,
    blurb: 'Half the hour in English, half in Mandarin. Mistakes are the point, not the problem.',
    place: 'Merlo · St Lucia',
    members: [
      { name: 'Ting', color: C.rose, sign: 'taurus' },
      { name: 'Jack', color: C.moss, sign: 'scorpio' },
      { name: 'Fen', color: C.gold, sign: 'aquarius' },
      { name: 'Beth', color: C.sage, sign: 'gemini' },
    ],
    meetup: { day: 'Thursday', time: '5:00 pm', place: 'Merlo St Lucia', activity: '30 minutes each language' },
    seed: [
      { from: 'Ting', text: 'Reminder that we swap at the half hour. Timer on the table', minsAgo: 400 },
      { from: 'Jack', text: 'My tones were terrible last week and everyone was very kind about it', minsAgo: 380 },
      { from: 'Beth', text: 'That is literally the point. Mine were worse', minsAgo: 370 },
    ],
    replies: [
      'Nobody is judging, genuinely',
      'Thursday, same table?',
      'Can I join? My English is okay but I never speak it',
      'We correct gently or not at all. Your call.',
    ],
  },
]

export const GROUP_MAP = Object.fromEntries(GROUPS.map((g) => [g.id, g]))

export const SORT_MODES = [
  { id: 'best', label: 'Best match' },
  { id: 'interests', label: 'Interests' },
  { id: 'style', label: 'How you meet' },
  { id: 'sign', label: 'Star sign' },
  { id: 'space', label: 'Most room' },
]

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// How well a circle fits the user, across every facet they filled in.
//
// Interest matching walks the tree: sharing only a root ("Motorsport") counts
// for less than sharing a leaf ("Ferrari"), and the reason chip names whichever
// node actually matched, so a recommendation is always explainable.
export function matchFacets(group, state = {}) {
  const interests = state.interests || []
  const { socialStyle = null, zodiac = null, likes = [], dislikes = [] } = state.profile || {}

  const interestHits = []
  for (const gt of group.tags) {
    let best = null
    for (const ut of interests) {
      const depth = overlapDepth(ut, gt)
      if (depth > 0 && (!best || depth > best.depth)) {
        best = { depth, groupTag: gt, userTag: ut, nodeId: commonNodeId(ut, gt), exact: ut === gt }
      }
    }
    if (best) interestHits.push(best)
  }

  const interestScore = interestHits.reduce((a, h) => a + h.depth * 5, 0)
  const deepest = interestHits.reduce((a, h) => Math.max(a, h.depth), 0)

  const paceExact = Boolean(socialStyle) && group.pace === socialStyle
  const paceOk = Boolean(socialStyle) && !paceExact && (group.pace === 'mixed' || socialStyle === 'mixed')

  const sharedTraits = group.traits.filter((t) => likes.includes(t))
  const clashes = group.involves.filter((t) => dislikes.includes(t))
  const signMates = zodiac ? group.members.filter((m) => m.sign === zodiac) : []

  const score =
    interestScore +
    (paceExact ? 6 : paceOk ? 3 : 0) +
    sharedTraits.length * 4 +
    signMates.length * 2 -
    clashes.length * 5

  const great = deepest >= 3 || interestHits.length >= 2 || (deepest >= 2 && (paceExact || sharedTraits.length >= 1))

  return {
    hits: interestHits.length,
    interestHits,
    deepest,
    paceExact,
    paceOk,
    sharedTraits,
    clashes,
    signMates,
    signMateCount: signMates.length,
    score,
    great,
    matched: interestHits.length > 0 || paceExact || sharedTraits.length > 0 || signMates.length > 0,
    full: group.members.length >= group.capacity,
  }
}

export function comparatorFor(mode) {
  const openness = (a, b) => a.members.length / a.capacity - b.members.length / b.capacity
  switch (mode) {
    case 'interests':
      return (a, b) => b.deepest - a.deepest || b.hits - a.hits || b.score - a.score || openness(a, b)
    case 'style':
      return (a, b) =>
        Number(b.paceExact) - Number(a.paceExact) ||
        b.sharedTraits.length - a.sharedTraits.length ||
        b.score - a.score ||
        openness(a, b)
    case 'sign':
      return (a, b) => b.signMateCount - a.signMateCount || b.score - a.score || openness(a, b)
    case 'space':
      return (a, b) => openness(a, b) || b.score - a.score
    default:
      return (a, b) => b.score - a.score || openness(a, b)
  }
}
