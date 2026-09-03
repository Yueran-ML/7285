# FriendZone — Iteration 1 prototype

Interactive React prototype for DECO7285 Assessment 2 (Milestone 1, Week 8 exhibit).

**Concept.** Newcomers to Brisbane join small interest-based circles. Conversation prompts give them
*something to do rather than something to say*. One point per circle per day for showing up, cosmetic
badges, and a 7-day post-meetup bonus so connections survive the first in-person meeting.

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
```

## Demo script (5-minute pitch)

1. **Welcome** — type a name. Note the tone: "You don't have to walk up to anyone."
2. **Interests** — pick 2–3 chips. Only circles that share at least one interest are recommended,
   ranked by how many they share. GREAT MATCH = shares 2+ or the circle is entirely your interests.
   Everything else sits under "Browse other circles"; picking an interest no circle covers (e.g. Yoga)
   shows an empty state and the full list.
3. **Discover** — join two circles. The second join unlocks the *Circle Member* badge.
4. **Chat** — open Cooking Circle. Tap **Use this** on the prompt card, then **Send**.
   The +1 coin floats up ("Showed up today"), the header pill flips to ✓, a member replies,
   and the *First Hello* badge appears.
5. **Meetup** — tap **I'm in** on the meetup banner, then **I went** (demo shortcut for attending).
   *Kitchen Table* badge unlocks.
6. **Skip to tomorrow** (demo control). The banner turns gold: *+3 per day for 7 more days*.
   Send another message → +3 "Post-meetup bonus" → *Keeper* badge.
7. **Me** tab — points ring, streak, week strip, badge grid, per-circle totals.
   Point out: *"Points never reset. There's no leaderboard."*

**Reset prototype** wipes localStorage and returns to Welcome.

## What is "dynamic" here (for the rubric)

| Interaction | Visible change |
|---|---|
| Pick interests | Discover list re-ranks; matching tags highlight; GREAT MATCH badge |
| Join a circle | Seeded chat loads; badge unlock modal at 2 circles |
| Send first message of the day | +1/+3 point burst, header pill, streak, week strip, ring progress |
| Use / cycle prompt | Prompt text animates; fills composer |
| RSVP → attend meetup | Banner state machine: invite → going → gold bonus window |
| Advance day | Status bar, "waiting" nudges, bonus countdown, streak all update |
| Reach thresholds | Badge grid flips locked → unlocked with celebration |

## Design decisions tied to research

- **Prompts, not blank inputs** — interview finding: "people have something to focus on so they
  don't need to keep thinking of new conversation topics."
- **Cumulative, non-resetting points, no leaderboard** — A1 ethics table row 2 (gamification
  as manipulation) and row 5 (extrinsic crowding out intrinsic motivation).
- **Post-meetup bonus** — interview finding: "after everyone goes home, you don't really talk again."
- **Group meetups only, public venues** — A1 ethics row 6 (safety).
- **"For anyone building connections", no clinical language** — A1 ethics row 4 (pathologising).

## Stack

Vite 8 · React 19 · framer-motion 13 · lucide-react. No backend: all state lives in
`localStorage` under `friendzone-state-v1`. Days are simulated (`state.day`) so the daily
mechanic can be demonstrated in one sitting.

```
src/
  data/        interests, groups (seed chats + reply pools), prompts, badges
  store/       useStore.jsx — reducer, persistence, point/bonus/badge rules
  components/  PhoneFrame, TabBar, Avatar, PointBurst, BadgeUnlock
  screens/     Welcome, Interests, Discover, Chats, Chat, Profile
```

## Iteration 2 candidates

- Real backend (Django REST or Supabase) for shared circles across devices
- Real dates instead of simulated days; push-free daily reminder (opt-in only)
- Fading reward scaffold: reduce point visibility as a circle's chat becomes self-sustaining
- Diversity-aware ranking (A1 ethics row 7)
- Voice messages + multilingual prompts (A1 ethics row 8)
