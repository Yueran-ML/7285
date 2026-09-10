# FriendZone — Iteration 2 prototype

Interactive React prototype for DECO7285. Iteration 1 was shown at the Week 8 exhibit.

**Concept.** Newcomers to Brisbane join small interest-based circles. Conversation prompts give them
*something to do rather than something to say*. One point per circle per day for showing up, cosmetic
badges, and a 7-day post-meetup bonus so connections survive the first in-person meeting.

## New in iteration 2

| | |
|---|---|
| **A profile past hobbies** | Optional: how you like to meet people, what you enjoy, what you would rather avoid, star sign, one line about you. Blank is a valid profile. |
| **A three-level interest tree** | Motorsport → Formula 1 → Ferrari. Stop wherever you like. Matching scores a shared leaf higher than a shared root and names whichever node actually matched. |
| **22 circles, five sort lenses** | Up from eight. Sort by best match, interests, how you meet, star sign, or most room. |
| **Search and filters** | Free-text over names, blurbs, places and the full interest trail, plus filters for pace, day of the week and circles with space left. |
| **Start your own circle** | If nothing fits, make it. Created circles behave exactly like seeded ones everywhere in the app. |
| **In-person mode** | At a meetup, one tap switches the whole app off except a deck of prompts written for a table rather than a chat. |
| **Replies that answer the question** | Each prompt carries its own replies, and free-typed messages fall through keyword responders. Two different questions no longer get the same answer. |

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

## Demo script (6-minute pitch)

1. **Welcome** — type a name. Note the tone: "You don't have to walk up to anyone."
2. **Interests, step 1 of 2** — tap **Motorsport**, then **Formula 1**, then **Ferrari**. Three levels.
   Back out and tap **Food & cooking**, then **Anything in Food & cooking** to show you can also
   stop at the top. Two picks, one specific and one broad.
3. **About you, step 2, optional** — pick a social style, a few likes and dislikes, a star sign.
   The button reads **Skip for now** until you touch something. A blank profile is valid.
4. **Discover** — the ranking is the payoff. *Tifosi Brisbane* is first because it is tagged Ferrari
   exactly. *Lights Out* follows on "Both into Formula 1", one level up. *Sim Racing Garage* is
   below that on "Both into Motorsport", two levels up. The card says which it was every time.
5. **Heads up lines** — a circle involving something you said you would avoid still appears, with
   *"Heads up, this one involves late finishes."* Nothing is hidden from you.
6. **Sort lenses** — *How you meet* floats the calm circles; *Most room* floats the emptiest.
7. **Search and filters** — type "formula", then clear it and filter to Sunday circles only.
8. **Start a circle** — name it, drill to an interest, set a first meetup, create. You land in its
   chat as its founder, and it is searchable immediately.
9. **Chat** — open Cooking Circle. **Use this** then **Send**: the +1 coin floats up and a member
   answers *that specific question*. **Another**, a different prompt, a different person, a
   different answer. Type something free-form and it still gets a fitting reply.
10. **Meetup, then in-person mode** — **I'm in**, then **I'm here**. The app goes dark and empties
    out: no tabs, no chat, no points, one large card at a time. Tap through a few. *"Nothing here
    earns points. Put the phone down."* Tap **I'm off** and you are marked as having attended.
11. **Skip to tomorrow** — the banner turns gold: *+3 per day for 7 more days*.
12. **Me** tab — points ring, streak, the **About you** card, badges, per-circle totals.

**Reset prototype** wipes localStorage and returns to Welcome.

## What is "dynamic" here (for the rubric)

| Interaction | Visible change |
|---|---|
| Drill into an interest | Three levels of options; parents show a count of what you picked beneath them |
| Pick a leaf vs a root | Ranking and the "why" chip both change: "Ferrari" vs "Both into Motorsport" |
| Fill in a social style | Two new sort lenses appear; cards gain sage "why" chips; order changes |
| Add a dislike | Circles involving it drop down the list and show a heads-up line |
| Pick a star sign | Gold "2 Leos here" chips appear; a fifth sort lens unlocks |
| Leave the profile blank | Everything degrades to interest-only matching, no dead UI |
| Switch sort lens | The same circles, five genuinely different orderings |
| Type in search | Live count in the heading, matched against tag trails as well as text |
| Apply filters | Filter button fills in; result set and count update |
| Create a circle | Appears in Discover, in search, in Circles, and on the Me tab immediately |
| Send first message of the day | +1/+3 point burst, header pill, streak, week strip, ring progress |
| Use / cycle a prompt | Prompt animates; the reply answers *that* prompt, from a different member |
| Enter in-person mode | Whole app is replaced: dark, no tabs, no chat, no points, one card |
| Leave in-person mode | Attendance recorded, badge unlocks, bonus window opens the next day |
| Advance day | Status bar, waiting nudges, bonus countdown, streak all update |

## Design decisions tied to research

- **Prompts, not blank inputs** — interview finding: "people have something to focus on so they
  don't need to keep thinking of new conversation topics."
- **Cumulative, non-resetting points, no leaderboard** — A1 ethics row 2 (gamification as
  manipulation) and row 5 (extrinsic crowding out intrinsic motivation).
- **In-person mode earns nothing** — the app's job at a meetup is to get out of the way. Rewarding
  screen time at the exact moment someone is finally face to face would undo the whole design.
- **Post-meetup bonus** — interview finding: "after everyone goes home, you don't really talk again."
- **Group meetups only, public venues** — A1 ethics row 6 (safety).
- **No clinical language** — A1 ethics row 4. The social-style question is an introvert/extrovert
  axis in substance, worded as a preference about how you like to meet people. No test, no score.
- **Declared, never inferred** — A1 ethics row 7. Nothing is derived from a name, language or
  nationality. Dislikes lower a circle's rank but never hide it, and the card always says why it
  is there.

## Stack

Vite 8 · React 19 · framer-motion 13 · lucide-react. No backend: all state lives in
`localStorage` under `friendzone-state-v1`. Saves from earlier iterations load fine — the profile
and custom circles are merged in with empty defaults. Days are simulated (`state.day`).

```
src/
  data/        interests   — the three-level tree, path helpers, overlap scoring
               groups      — 22 circles, pace/traits/involves, matchFacets, sort comparators
               profile     — social styles, likes, dislikes, zodiac
               prompts     — chat prompts with per-prompt replies, in-person deck, keyword fallbacks
               badges
  store/       useStore.jsx — reducer, persistence, points, bonus, badges, profile, custom circles
  components/  PhoneFrame, TabBar, Avatar, PointBurst, BadgeUnlock
  screens/     Welcome, Interests, About, Discover, CreateCircle, Chats, Chat, MeetupMode, Profile
```

### How matching works

`matchFacets(group, state)` scores each circle and returns the reasons alongside the number, so a
card can always answer "why am I seeing this?".

| Facet | Weight | Source |
|---|---|---|
| Shared interest | +5 per level of the tree the two tags share | interest tree |
| Social style exact match | +6 | About you |
| Social style compatible | +3 | About you |
| Shared trait | +4 each | About you likes vs circle traits |
| Member with your star sign | +2 each | About you zodiac |
| Something you said you would avoid | −5 each | About you dislikes vs circle involves |

Interest scoring walks the tree. `overlapDepth('f1-ferrari', 'f1')` is 2, so a Ferrari fan sees a
general F1 circle at 10 points and a Ferrari circle at 15. A circle needs one positive signal to be
recommended; everything else collapses under "Browse N other circles" rather than disappearing.

### Conversation replies

`data/prompts.js` holds prompts keyed at whichever level of the interest tree suits them, mostly the
root. A circle tagged `f1-ferrari` walks up its path and inherits the `motorsport` prompts, so
specific circles are never left with nothing to say.

Each prompt carries 4–5 replies written to answer that specific question, and roughly one in three
hands the question back to keep the thread going. Free-typed messages fall through 14 keyword
responders before reaching the circle's generic pool. `Chat.jsx` remembers the last six replies and
the last speaker so the circle does not repeat itself or let one member answer twice in a row, and
the typing delay scales with reply length.

In a shipped version these replies would be generated per message. They are hand-authored here so
the exhibit prototype runs with no API key and no per-message cost.

### In-person mode

`state.meetupMode` holds a circle id. While it is set, `App.jsx` renders `MeetupMode` and nothing
else — no tab bar, no chat, no badge popups. The deck is shuffled per session and mixes two card
kinds: *ask the group* and *try this*, the second being a small action rather than a question, which
is the project's thesis applied to a table rather than a chat. Leaving records attendance and opens
the bonus window.

## Iteration 3 candidates

- Bilingual prompts and keyword hints for non-native speakers (A1 ethics row 8, and the language
  barrier raised in every interview)
- Real backend for shared circles across devices, so a created circle is visible to other people
- Real dates instead of simulated days; opt-in daily reminder, no push by default
- Fading reward scaffold: reduce point visibility as a circle's chat becomes self-sustaining
- Model-generated replies behind the same `replyPoolFor` interface, with the hand-written pools kept
  as the offline fallback
