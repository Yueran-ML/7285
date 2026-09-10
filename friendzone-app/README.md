# FriendZone — Iteration 2 prototype

Interactive React prototype for DECO7285. Iteration 1 was shown at the Week 8 exhibit.

**Concept.** Newcomers to Brisbane join small interest-based circles. Conversation prompts give them
*something to do rather than something to say*. One point per circle per day for showing up, cosmetic
badges, and a 7-day post-meetup bonus so connections survive the first in-person meeting.

**New in iteration 2.** Interests alone were too blunt a matching signal, so circles are now matched on
an optional profile as well: how you like to meet people, what you enjoy, what you would rather avoid,
and your star sign. Conversation prompts also carry their own replies, so two different questions no
longer produce the same answer.

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. On a laptop you get a phone frame with demo controls beside it.
On an actual phone (or a narrow window) the app goes full-screen and the demo controls move
to the **Me** tab.

```bash
npm run build      # production build into dist/
npm run preview    # serve dist/ locally
npm run lint       # oxlint
```

## Demo script (5-minute pitch)

1. **Welcome** — type a name. Note the tone: "You don't have to walk up to anyone."
2. **Interests** — pick 2–3 chips. Step 1 of 2.
3. **About you** — step 2, and everything on it is optional. Pick a social style
   (*Small and calm* / *Depends on the week* / *Big and busy*), a few things you enjoy, a few
   you would rather avoid, a star sign, and a one-line bio. The button reads **Skip for now**
   until you touch something, which is the point: a blank profile is a valid profile.
4. **Discover** — the heading counts circles matching *everything* you said, not just hobbies.
   Each card shows **why** it surfaced: shared interests in terracotta, social style and shared
   likes in sage, star-sign company in gold. Circles that involve something you said you would
   rather avoid still appear, with an honest *"Heads up, this one involves late finishes."*
5. **Sort lenses** — *Best match / Interests / How you meet / Star sign* reorder the same list.
   The last two only appear once you have filled in that field. Try *How you meet*: the quiet
   circles rise and Coffee Crawl sinks.
6. **Chat** — open Cooking Circle. Tap **Use this**, then **Send**. The +1 coin floats up, the
   header pill flips to ✓, and a member answers *that specific question*. Tap **Another**, use a
   different prompt, and note the reply is a different person answering a different thing.
   Type something free-form ("I have an assignment due Friday") and it still gets a fitting reply.
7. **Meetup** — tap **I'm in**, then **I went**. *Kitchen Table* badge unlocks.
8. **Skip to tomorrow** — the banner turns gold: *+3 per day for 7 more days*.
9. **Me** tab — points ring, streak, the **About you** card, badge grid, per-circle totals.
   Point out: *"Points never reset. There's no leaderboard."*

**Reset prototype** wipes localStorage and returns to Welcome.

## What is "dynamic" here (for the rubric)

| Interaction | Visible change |
|---|---|
| Pick interests | Discover list re-ranks; matching tags highlight; GREAT MATCH badge |
| Fill in a social style | Two new sort lenses appear; cards gain sage "why" chips; order changes |
| Add a dislike | Circles involving it drop down the list and show a heads-up line |
| Pick a star sign | Gold "2 Leos here" chips appear; a fourth sort lens unlocks |
| Leave the profile blank | Everything degrades to interest-only matching, no dead UI |
| Switch sort lens | Same eight circles, four genuinely different orderings |
| Join a circle | Seeded chat loads; badge unlock modal at 2 circles |
| Send first message of the day | +1/+3 point burst, header pill, streak, week strip, ring progress |
| Use / cycle prompt | Prompt text animates; fills composer; the reply answers *that* prompt |
| Type a free-form message | Keyword matching picks a fitting reply instead of a canned one |
| RSVP → attend meetup | Banner state machine: invite → going → gold bonus window |
| Advance day | Status bar, "waiting" nudges, bonus countdown, streak all update |

## Design decisions tied to research

- **Prompts, not blank inputs** — interview finding: "people have something to focus on so they
  don't need to keep thinking of new conversation topics."
- **Cumulative, non-resetting points, no leaderboard** — A1 ethics table row 2 (gamification
  as manipulation) and row 5 (extrinsic crowding out intrinsic motivation).
- **Post-meetup bonus** — interview finding: "after everyone goes home, you don't really talk again."
- **Group meetups only, public venues** — A1 ethics row 6 (safety).
- **"For anyone building connections", no clinical language** — A1 ethics row 4 (pathologising).
  The social-style question is an introvert/extrovert axis in substance, but it is worded as a
  preference about how you like to meet people. No personality test, no diagnosis, no score.
- **Every profile field is declared, never inferred** — A1 ethics row 7 (algorithmic segregation).
  Nothing is derived from a name, language, or nationality. Dislikes lower a circle's rank but
  never hide it, and the card always says why it is there.

## Stack

Vite 8 · React 19 · framer-motion 13 · lucide-react. No backend: all state lives in
`localStorage` under `friendzone-state-v1`. Saves from iteration 1 load fine — the profile is
merged in with empty defaults. Days are simulated (`state.day`) so the daily mechanic can be
demonstrated in one sitting.

```
src/
  data/        interests, groups (pace + traits + member star signs, matchFacets),
               profile (social styles, likes, dislikes, zodiac), prompts, badges
  store/       useStore.jsx — reducer, persistence, point/bonus/badge rules, profile actions
  components/  PhoneFrame, TabBar, Avatar, PointBurst, BadgeUnlock
  screens/     Welcome, Interests, About, Discover, Chats, Chat, Profile
```

### How matching works

`matchFacets(group, state)` in `data/groups.js` scores each circle across five facets and returns
the reasons alongside the number, so the card can always answer "why am I seeing this?":

| Facet | Weight | Source |
|---|---|---|
| Shared interest | +10 each | interest chips |
| Circle is entirely your interests | +5 | derived |
| Social style exact match | +6 | About you |
| Social style compatible (either side is "depends") | +3 | About you |
| Shared trait | +4 each | About you likes vs circle traits |
| Member with your star sign | +2 each | About you zodiac |
| Something you said you would avoid | −5 each | About you dislikes vs circle involves |

A circle needs one positive signal to be recommended. Everything else collapses under
"Browse N other circles" rather than disappearing.

### Conversation replies

`data/prompts.js` holds 43 prompts across 12 interests plus a general pool. Each prompt carries
4–5 replies written to answer that specific question, and roughly one in three hands the question
back to keep the thread going. Free-typed messages fall through 14 keyword responders (greeting,
newcomer, food, coffee, study, stress, weekend, music, outdoors, thanks, agreement, decline,
question, very short) before reaching the circle's generic pool. `Chat.jsx` remembers the last six
replies and the last speaker so the circle does not repeat itself or let one member answer twice
in a row, and typing delay scales with reply length.

In a shipped version these replies would be generated per message. They are hand-authored here so
the exhibit prototype runs with no API key and no per-message cost.

## Iteration 3 candidates

- Bilingual prompts and keyword hints for non-native speakers (A1 ethics row 8, and the language
  barrier raised in every interview)
- Real backend (Supabase or Django REST) for shared circles across devices
- Real dates instead of simulated days; opt-in daily reminder, no push by default
- Fading reward scaffold: reduce point visibility as a circle's chat becomes self-sustaining
- Model-generated replies behind the same `replyPoolFor` interface, with the hand-written pools
  kept as the offline fallback
