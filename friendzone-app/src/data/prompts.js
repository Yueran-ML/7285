// Conversation prompts, keyed by interest tag.
//
// Iteration 2: every prompt carries its own replies, so asking two different
// questions no longer produces the same answer. In a shipped version these
// would come from a model at send time; hand-authoring them keeps the exhibit
// prototype free to run and keeps the conversation quality visible offline.
//
// Reply-writing rules used throughout:
//  · answer the actual question, in the voice of a housemate rather than a bot
//  · vary the length, and let roughly one in three hand the question back, since
//    a returned question is what keeps a thread alive past two turns
//  · emoji are occasional, not decorative punctuation on every line

export const PROMPTS = {
  cooking: [
    {
      id: 'cook-hometown',
      text: "What's a dish from your hometown you miss?",
      replies: [
        'My mum makes this soup with pork bones and radish. Two years since I had it properly.',
        'Honestly just bread. Real bread. The stuff here is so sweet.',
        'Dumplings, obviously. Nobody folds them right here 😭',
        'There is a noodle stall near my old flat that opened at 6am. I dream about it.',
        'Anything with proper chilli. What about you, what do you miss?',
      ],
    },
    {
      id: 'cook-cheap',
      text: "Best cheap meal you've made this week?",
      replies: [
        'Fried rice with whatever was dying in the fridge. Four dollars, genuinely good.',
        'Lentils and rice. Boring but it fed me three nights.',
        'Woolworths roast chicken stretched into two dinners and a sandwich. Not proud, not sorry.',
        'Eggs on toast four times. I need to branch out.',
      ],
    },
    {
      id: 'cook-rice',
      text: 'Rice cooker or stovetop, which team are you on?',
      replies: [
        'Rice cooker, no contest. I brought mine on the plane.',
        'Stovetop. My grandmother would disown me otherwise.',
        'I burned rice on a stovetop three times before I gave in and bought a cooker.',
        'Rice cooker for rice, but it also does a decent steamed egg. Underrated machine.',
      ],
    },
    {
      id: 'cook-spice',
      text: "One spice you can't live without?",
      replies: [
        'Cumin. I put it in things it does not belong in.',
        'Sichuan peppercorn. The numbing thing. I brought a bag with me.',
        'Just good flaky salt honestly. Changes everything.',
        'Smoked paprika. What is yours?',
      ],
    },
    {
      id: 'cook-saturday',
      text: 'What would you cook if you had a whole kitchen to yourself on Saturday?',
      replies: [
        'Something slow. A braise that takes four hours and makes the whole floor smell good.',
        'Handmade noodles. It is a mess and it takes forever, which is the point.',
        'I would just make way too much and force it on everyone in the lounge.',
        'Honestly? Breakfast. A proper one, at 2pm, with no rush.',
      ],
    },
  ],

  movies: [
    {
      id: 'film-cry',
      text: 'Last film that made you cry?',
      replies: [
        'Grave of the Fireflies. I was not okay for a day after.',
        'Coco. I called my family straight after, which I think was the intent.',
        'Not a film but the first ten minutes of Up count and everyone knows it.',
        'Past Lives. Quietly devastating if you moved countries.',
      ],
    },
    {
      id: 'film-comfort',
      text: "What's your comfort movie, the one you rewatch?",
      replies: [
        'Kiki’s Delivery Service. Puts me back together every time.',
        'Paddington 2. I will not be taking questions.',
        'Whatever Nora Ephron did in the 90s. On in the background constantly.',
        'Spider-Verse. I have seen it enough times to quote it, which is embarrassing.',
      ],
    },
    {
      id: 'film-where',
      text: 'Cinema or couch?',
      replies: [
        'Cinema. Phone off, no pausing, it forces you to actually watch.',
        'Couch, purely because I can pause for snacks without guilt.',
        'Cinema for anything loud, couch for anything sad.',
        'Couch, but the common room projector counts as a cinema I think.',
      ],
    },
    {
      id: 'film-unpopular',
      text: 'A film everyone loves that you just do not get?',
      replies: [
        'La La Land. I know. I have made peace with being wrong about it.',
        'Most superhero films. I fall asleep in the third act every time.',
        'Titanic. I have tried twice.',
        'I will say Interstellar and then hide. Go on, defend it.',
      ],
    },
  ],

  study: [
    {
      id: 'study-spot',
      text: "What's your go-to study spot on campus?",
      replies: [
        'Central Library level 2, by the windows. Quiet but not oppressively so.',
        'The Great Court lawn when the weather behaves. Terrible for focus, great for mood.',
        'Any café with a plug and no music. Rarer than it should be.',
        'Honestly my room, but that is why nothing gets done. Where do you go?',
      ],
    },
    {
      id: 'study-drink',
      text: 'Coffee or tea while studying?',
      replies: [
        'Coffee until 2pm, tea after, or I do not sleep.',
        'Tea. Coffee makes me anxious and then I read the same line eleven times.',
        'Coffee. Three. I know it is a problem.',
        'Neither, just cold water. I am the fun one.',
      ],
    },
    {
      id: 'study-hardest',
      text: 'Hardest course this semester, and why?',
      replies: [
        'Stats. Not the maths, the fact that every lecture assumes I remember the last one.',
        'The group project one. The content is fine, the coordinating is not.',
        'Anything with a 40% exam. The weighting alone stresses me out.',
        'Mine is fine content-wise but the readings are 60 pages a week. Yours?',
      ],
    },
    {
      id: 'study-noise',
      text: 'Do you study better in silence or with background noise?',
      replies: [
        'Café noise. Total silence makes me hear my own thoughts, which is fatal.',
        'Silence, earplugs, the whole setup. I am very annoying about it.',
        'Lo-fi with no lyrics. Anything with words and I start typing the lyrics.',
        'Rain sounds. I know it is a cliché. It works.',
      ],
    },
  ],

  gaming: [
    {
      id: 'game-beginner',
      text: "What's a game you'd teach a total beginner first?",
      replies: [
        'Stardew Valley. Nothing can go badly wrong and that matters when you are new.',
        'Mario Kart. Everyone understands it in ninety seconds.',
        'Overcooked, but only with people you are not afraid to shout at.',
        'Portal. It teaches you how to play it while you play it, which is genius.',
      ],
    },
    {
      id: 'game-coop',
      text: 'Co-op or competitive?',
      replies: [
        'Co-op. I get weirdly stressed by competitive lobbies.',
        'Competitive, but only against friends. Strangers online are a different species.',
        'Co-op. Losing together is much better than losing alone.',
        'Depends on the day. Mostly co-op lately. You?',
      ],
    },
    {
      id: 'game-platform',
      text: 'Handheld, PC or console?',
      replies: [
        'Handheld. I moved here with one suitcase, so it was the only option.',
        'PC, but I left mine at home and I feel the loss daily.',
        'Console on the common room TV. Best way to accidentally meet people, honestly.',
        'Handheld on the bus, PC at the desk. Different moods.',
      ],
    },
  ],

  boardgames: [
    {
      id: 'board-length',
      text: 'Fast card game or a three-hour strategy epic?',
      replies: [
        'Fast. My attention span has been destroyed and I accept that.',
        'Three-hour epic. The betrayal only lands if you have suffered together first.',
        'Fast on a weeknight, epic on a Sunday when nobody has anywhere to be.',
        'Card game to warm up, then something long. Best of both.',
      ],
    },
    {
      id: 'board-winlose',
      text: "What's a game you always win, and one you never do?",
      replies: [
        'I always win Codenames and never win anything requiring spatial reasoning.',
        'Never won a single game of Catan. Twelve attempts. I keep coming back.',
        'I win at bluffing games and lose at anything with maths in it.',
        'Always: Uno, through pure aggression. Never: chess, obviously.',
      ],
    },
    {
      id: 'board-fromhome',
      text: 'Any game from home that nobody here knows?',
      replies: [
        'We play a card game called Doudizhu. Three players, one is the landlord, it gets loud.',
        'There is a dice game my family plays at new year that I have never seen anyone here play.',
        'Carrom! Nobody here has heard of it and it is genuinely the best.',
        'Yes and I keep meaning to bring it to a meetup. Maybe Thursday.',
      ],
    },
  ],

  photography: [
    {
      id: 'photo-goldenhour',
      text: 'Best spot in Brisbane for golden hour?',
      replies: [
        'Kangaroo Point cliffs, looking back at the city. Cliché for a reason.',
        'Mt Coot-tha lookout, but get there early or you are behind forty other people.',
        'The Story Bridge from the river walk. The light comes right down the water.',
        'Honestly the Wheel of Brisbane end of South Bank. Where do you go?',
      ],
    },
    {
      id: 'photo-gear',
      text: 'Phone or camera?',
      replies: [
        'Phone. The camera stays in the drawer and I have made peace with that.',
        'Camera, an old film one. Half the shots fail and that is the fun.',
        'Phone for people, camera for landscapes. Different jobs.',
        'Camera, but only because I like the ritual of it more than the photos.',
      ],
    },
    {
      id: 'photo-last',
      text: 'Show us the last photo you took, no pressure.',
      replies: [
        'Mine is a blurry photo of a bin chicken stealing chips. Peak Brisbane.',
        'A screenshot of my timetable. Deeply unglamorous.',
        'The sky on the walk home yesterday, it went completely pink.',
        'My dinner, which I was proud of, and which does not photograph well at all.',
      ],
    },
  ],

  running: [
    {
      id: 'run-time',
      text: 'Morning or evening runs?',
      replies: [
        'Morning. If I leave it to the evening it simply does not happen.',
        'Evening. Mornings here are already too warm for me.',
        'Morning in summer, evening in winter. The heat decides, not me.',
        'Morning, and I hate every second until about the ten minute mark.',
      ],
    },
    {
      id: 'run-audio',
      text: 'Music, podcast, or nothing while you run?',
      replies: [
        'Podcast. It tricks me into going further because I want to hear the end.',
        'Music, and it has to be embarrassingly upbeat.',
        'Nothing. It is the only half hour all day where nobody is talking at me.',
        'Music going out, nothing coming back. No idea why.',
      ],
    },
    {
      id: 'run-distance',
      text: "What's your current comfortable distance?",
      replies: [
        'About 5k. I could push further but comfortable is the key word there.',
        'Three, and I am rebuilding after a lazy winter.',
        '8k on a good day, 2k on a realistic one.',
        'Honestly whatever gets me to a café at the end.',
      ],
    },
  ],

  hiking: [
    {
      id: 'hike-trail',
      text: 'Favourite trail so far, or one you want to try?',
      replies: [
        'Summit track at Coot-tha. Not hard, and the view pays out properly.',
        'I want to do Springbrook but I have no car. Anyone driving?',
        'The Kangaroo Point to New Farm river walk. Barely a hike but very pleasant.',
        'Did Mt Ngungun up near Glass House Mountains. Short, steep, worth it.',
      ],
    },
    {
      id: 'hike-time',
      text: 'Sunrise hike or sunset hike?',
      replies: [
        'Sunrise. Nobody is there and the heat has not started.',
        'Sunset, because I am not a morning person and never will be.',
        'Sunrise in theory, sunset in practice.',
        'Sunrise, but only if someone else agrees to come so I cannot bail.',
      ],
    },
    {
      id: 'hike-snacks',
      text: 'Snacks are essential. What do you bring?',
      replies: [
        'Salted nuts and one absurdly good chocolate bar for the summit.',
        'Oranges. Sounds boring, tastes incredible halfway up a hill.',
        'Whatever is in the cupboard, which last time was dry cereal. Not recommended.',
        'Rice balls. My mum would be proud. What do you bring?',
      ],
    },
  ],

  coffee: [
    {
      id: 'coffee-order',
      text: 'Flat white or long black?',
      replies: [
        'Flat white. I have fully assimilated.',
        'Long black. Flat whites are dessert and I will die on this hill.',
        'Neither, iced latte, and I know that is barely coffee to some of you.',
        'Flat white in the morning, long black if I need to be honest with myself.',
      ],
    },
    {
      id: 'coffee-cafe',
      text: 'Best café near campus?',
      replies: [
        'There is a tiny place off Hawken Drive that does a good filter. Never busy.',
        'Merlo is fine but everyone is there. I go for the seats, not the coffee.',
        'Anywhere in Toowong honestly, the standard is high.',
        'I am still looking, which is partly why I joined this circle.',
      ],
    },
    {
      id: 'coffee-count',
      text: 'How many coffees is too many?',
      replies: [
        'Three is my line. Four and I can hear colours.',
        'There is no such thing. This is a safe space.',
        'Two, and the second one has to be before noon or I am up at 3am.',
        'Asking as someone on their fourth: I do not want to answer this.',
      ],
    },
  ],

  music: [
    {
      id: 'music-now',
      text: 'What are you listening to right now?',
      replies: [
        'Same three lo-fi playlists on rotation. I have stopped fighting it.',
        'A band from home nobody here has heard of. I will drop a link.',
        'Silence, actually. I hit my noise limit for the day.',
        'Something loud to get through a deadline. What about you?',
      ],
    },
    {
      id: 'music-concert',
      text: "A concert you'd love to see in Brisbane?",
      replies: [
        'Anything at the Tivoli, the room is the right size for actually seeing the band.',
        'Honestly a small local gig would do. I just want live music again.',
        'There is a band touring in November I have wanted to see for years.',
        'Something at Fortitude Valley on a Friday. Anyone in?',
      ],
    },
    {
      id: 'music-home',
      text: 'Song that instantly reminds you of home?',
      replies: [
        'One my dad played in the car constantly. I skipped it for years, now I seek it out.',
        'Anything from a specific summer when I was seventeen. Instant time travel.',
        'A song in my first language. I cannot explain why it hits differently.',
        'There is one that was playing at the airport when I left. Ruined it forever.',
      ],
    },
  ],

  basketball: [
    {
      id: 'ball-pickup',
      text: "Pickup game this week, who's in?",
      replies: [
        'In. What time were you thinking?',
        'Yes but fair warning, I have not played in two years.',
        'Only if we keep it casual. I am not built for competitive any more.',
        'I am in if it is after 5, I have class until then.',
      ],
    },
    {
      id: 'ball-watching',
      text: 'Who are you watching this season?',
      replies: [
        'Nobody consistently, I just watch highlights and pretend I followed the game.',
        'I have adopted a local team purely so I have something to talk about.',
        'Same team since I was a kid, through some genuinely bleak years.',
        'Honestly the timezone has ruined me. Everything is on at 4am.',
      ],
    },
  ],

  yoga: [
    {
      id: 'yoga-time',
      text: 'Morning stretch or evening wind-down?',
      replies: [
        'Evening. It is the only thing that stops me scrolling until 1am.',
        'Morning, ten minutes, mostly just to undo how I slept.',
        'Evening, and I fall asleep during the last bit every single time.',
        'Morning in theory. Evening in reality.',
      ],
    },
    {
      id: 'yoga-where',
      text: 'Mat on the grass or in the studio?',
      replies: [
        'Grass. Bit of a mess afterwards but worth it.',
        'Studio. I need someone telling me what to do or I invent poses.',
        'Grass, early, before the sun becomes an enemy.',
        'Studio in summer purely for the air conditioning. No shame.',
      ],
    },
  ],

  general: [
    {
      id: 'gen-from',
      text: 'Where are you from originally?',
      replies: [
        'A small city a few hours from Shanghai. Nobody has heard of it, which I enjoy.',
        'Jakarta. The quiet here still unsettles me a bit.',
        'Just outside Manchester. The weather here is an ongoing shock.',
        'Chennai. Been here eight months. You?',
      ],
    },
    {
      id: 'gen-surprised',
      text: 'What surprised you most about Brisbane?',
      replies: [
        'How early everything closes. I was not prepared for 5pm on a Sunday.',
        'The birds. Genuinely nobody warned me about the birds.',
        'How friendly strangers are, and how hard it still is to make actual friends.',
        'That winter is just a slightly cooler summer. I brought a coat for nothing.',
      ],
    },
    {
      id: 'gen-semester',
      text: "One thing you'd like to do this semester?",
      replies: [
        'Actually leave the campus bubble once a fortnight. Low bar, still failing it.',
        'Learn to cook three things properly instead of ten things badly.',
        'Say yes to more stuff. Which is partly why I am in this chat.',
        'Get to the coast. I have been here months and have not seen the sea.',
      ],
    },
    {
      id: 'gen-win',
      text: "What's a small win you had this week?",
      replies: [
        'Submitted something two hours early instead of two minutes. Growth.',
        'Cooked instead of ordering, four nights running.',
        'Spoke up in a tutorial. Small, but it took me all semester.',
        'Got out of bed before nine. Taking it.',
      ],
    },
    {
      id: 'gen-forward',
      text: "What's something you're looking forward to?",
      replies: [
        'Family visiting in December. Counting weeks at this point.',
        'The end of assignment season, mostly.',
        'Genuinely, the meetup. It is nice having something in the calendar.',
        'A weekend with absolutely nothing scheduled.',
      ],
    },
  ],
}

const ALL_PROMPTS = Object.values(PROMPTS).flat()
const PROMPT_BY_ID = Object.fromEntries(ALL_PROMPTS.map((p) => [p.id, p]))

export function promptsFor(tags = []) {
  const pool = []
  const seen = new Set()
  for (const t of tags) {
    for (const p of PROMPTS[t] || []) {
      if (!seen.has(p.id)) {
        seen.add(p.id)
        pool.push(p)
      }
    }
  }
  for (const p of PROMPTS.general) {
    if (!seen.has(p.id)) {
      seen.add(p.id)
      pool.push(p)
    }
  }
  return pool
}

// Free-text fallbacks. Checked in order, so the specific ones sit above the
// broad ones. These exist so that typing your own message still gets a reply
// that reads as if somebody actually looked at it.
const FALLBACKS = [
  {
    id: 'greeting',
    match: /^(hi|hey|hello|yo|hiya|good morning|good evening|morning|evening)\b/i,
    replies: [
      'Hey! Good to have you here 👋',
      'Hello! How are you settling in?',
      'Hey, welcome. What brought you to this one?',
      'Hi! Glad you found us.',
    ],
  },
  {
    id: 'newcomer',
    match: /\b(just (moved|arrived|got here)|new here|first (week|semester|year)|just joined)\b/i,
    replies: [
      'Welcome! Everyone here was new about five minutes ago, you are in good company.',
      'Oh nice, how long have you been in Brisbane?',
      'Welcome. Fair warning, we will absolutely ask you what food you miss.',
      'Congrats on the move. The first month is the strange one, it does get easier.',
    ],
  },
  {
    id: 'thanks',
    match: /\b(thanks|thank you|thx|cheers|ta)\b/i,
    replies: ['Anytime 🙂', 'No worries at all!', 'Of course. Ask us anything.', 'Happy to help.'],
  },
  {
    id: 'affirmative',
    match: /^(yes|yeah|yep|sure|ok|okay|count me in|i'?m in|same|agreed|definitely|sounds good)\b/i,
    replies: [
      'Great, that is three of us now.',
      'Nice! I will put it in the group calendar.',
      'Perfect. Anyone else?',
      'Love that. See you there.',
    ],
  },
  {
    id: 'negative',
    match: /\b(can'?t make it|not this time|maybe next|i'?ll pass|sorry i)\b/i,
    replies: [
      'All good, next time 👍',
      'No problem at all, we do this most weeks.',
      'Totally fine. We will save you a spot next round.',
      'No stress. Have a good one.',
    ],
  },
  {
    id: 'food',
    match: /\b(food|eat|eating|dinner|lunch|breakfast|cook|cooking|recipe|dumpling|noodle|rice|snack|hungry|restaurant)\b/i,
    replies: [
      'Okay now I am hungry. Where does one get that around here?',
      'That sounds so good. You have to make it for the group sometime.',
      'Adding this to the meetup list 📝',
      'Genuinely thinking about this now instead of my assignment.',
      'Have you found anywhere here that does it properly?',
    ],
  },
  {
    id: 'coffee',
    match: /\b(coffee|espresso|latte|flat white|long black|cafe|café|tea)\b/i,
    replies: [
      'Right, we are going for coffee this week. Deciding it now.',
      'Which place? I am always looking for a new one.',
      'Same, that is basically my personality at this point.',
      'Good shout. There is a decent one near campus if you want to try it.',
    ],
  },
  {
    id: 'study',
    match: /\b(assignment|exam|deadline|study|studying|essay|lecture|tutorial|due|library|thesis|semester)\b/i,
    replies: [
      'Oof, when is it due? Solidarity either way.',
      'Same boat honestly. Want to go sit in the library together?',
      'You will be fine. Take a break at some point though.',
      'The end of semester is close. Sort of. Not really.',
    ],
  },
  {
    id: 'tired',
    match: /\b(tired|exhausted|stressed|stressful|busy|overwhelmed|burnt out|no sleep|can'?t sleep)\b/i,
    replies: [
      'That sounds rough. Anything we can take off your plate?',
      'Same this week. It helps a bit just saying it out loud, I think.',
      'Be kind to yourself. The chat is not going anywhere.',
      'Rest if you can. We will still be here.',
    ],
  },
  {
    id: 'weekend',
    match: /\b(weekend|saturday|sunday|friday|tomorrow|tonight|next week|monday|tuesday|wednesday|thursday)\b/i,
    replies: [
      'That works for me. What time were you thinking?',
      'I am free then. Anyone else?',
      'Good timing, that is when most of us are around.',
      'Let us lock that in before it drifts like last time 😄',
    ],
  },
  {
    id: 'music',
    match: /\b(song|music|playlist|album|band|concert|gig|listening)\b/i,
    replies: [
      'Send the link! Always after something new.',
      'Oh I have not heard that one. Adding it now.',
      'Good taste. Adding to the shared playlist.',
      'What else is on rotation for you?',
    ],
  },
  {
    id: 'outdoors',
    match: /\b(walk|hike|run|running|trail|park|beach|river|outside|weather|sunny|rain)\b/i,
    replies: [
      'The weather has actually been decent for it lately.',
      'I would be up for that if you are going.',
      'Good idea, I have been inside far too much this week.',
      'Which route were you thinking?',
    ],
  },
  {
    id: 'question',
    match: /\?\s*$/,
    replies: [
      'Good question. I have thought about this more than is reasonable.',
      'Ooh, hard one. Let me think.',
      'Depends on the day for me, honestly. What about you?',
      'Nobody has ever asked me that. Give me a second.',
    ],
  },
  {
    id: 'short',
    match: /^.{1,12}$/,
    replies: ['Ha, fair.', 'Same 😄', 'Agreed.', 'Honestly, yeah.'],
  },
]

const normalise = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!?]+$/, '')

// Pick the reply pool for an outgoing message.
//   promptId — set when the message came from a tapped prompt
//   group    — falls back to the circle's own generic pool
// `exclude` holds recently used lines so the same one does not come back twice.
export function replyPoolFor(text, promptId, group) {
  if (promptId && PROMPT_BY_ID[promptId]) {
    const p = PROMPT_BY_ID[promptId]
    if (normalise(text) === normalise(p.text)) return p.replies
  }

  // The user may have retyped a prompt, or edited it lightly.
  const typed = ALL_PROMPTS.find((p) => normalise(p.text) === normalise(text))
  if (typed) return typed.replies

  for (const f of FALLBACKS) {
    if (f.match.test(text)) return f.replies
  }

  return group?.replies || FALLBACKS.find((f) => f.id === 'question').replies
}

export function pickReply(pool, exclude = []) {
  const fresh = pool.filter((r) => !exclude.includes(r))
  const from = fresh.length ? fresh : pool
  return from[Math.floor(Math.random() * from.length)]
}
