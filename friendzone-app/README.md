# FriendZone — Iteration 3 prototype

Interactive React prototype for DECO7285. Iteration 1 was shown at the Week 8 exhibit.

**Concept.** Newcomers to Brisbane join small interest-based circles and chat there until the circle
meets. At the meetup two phones touch, a clock starts, and a seven-day board shows who has been
showing up in person. Chat points, cosmetic badges and a 7-day post-meetup bonus carry the thread on
afterwards.

## New in iteration 3

| | |
|---|---|
| **Tap phones in person** | At a meetup the screen becomes the table: everyone else's phone in a row, yours below. Drag yours onto someone's and hold it there, or tap them and it travels over by itself. Contact takes two thirds of a second, the way an NFC read does. |
| **A clock per person** | The session clock starts on the first tap. Each person's time runs from the minute they were tapped, so arriving late shows. A session closes itself at four hours. |
| **The in-person board** | The last 7 days, ranked by time together or by people met. Built from taps and nothing else. |
| **Attendance is a tap** | Opening a screen no longer counts as having been there. No tap, no meetup. |
| **Removed** | The in-person prompt deck and its "put the phone down" mode, after Week 8 feedback that the feature was not justified by the problem. |

The NFC exchange itself is simulated. The drag stands in for it, and the screen says so. Everything
after the tap (the clock, the summary, the board) runs for real on the recorded taps.

## Carried over from iteration 2

| | |
|---|---|
| **A profile past hobbies** | Optional: how you like to meet people, what you enjoy, what you would rather avoid, star sign, one line about you. Blank is a valid profile. |
| **A three-level interest tree** | Motorsport → Formula 1 → Ferrari. Stop wherever you like. Matching scores a shared leaf higher than a shared root and names whichever node actually matched. |
| **22 circles, five sort lenses** | Up from eight. Sort by best match, interests, how you meet, star sign, or most room. |
| **Search and filters** | Free-text over names, blurbs, places and the full interest trail, plus filters for pace, day of the week and circles with space left. |
| **Start your own circle** | If nothing fits, make it. Created circles behave exactly like seeded ones everywhere in the app. |
| **In-person mode** | Replaced in iteration 3 by tapping phones. It switched the app off at a meetup except for a deck of prompts written for a table. |
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
10. **Skip a few days, reopen the chat** — the three dots on the prompt card fill in and the
    questions get more personal. Day 1 asks what dish you miss from home. Day 5 asks what small
    win you had this week.
11. **Meetup: tap phones** — **I'm in**, then **I'm here**. The screen becomes the table. Drag your
    phone onto someone's and hold it there: a ring closes, the phones bump, and the clock starts.
    Tapping a person does the same thing by itself. **Skip 30 min** a couple of times, tap the rest,
    then **End meetup**.
12. **The summary** — who you were with and for how long, and where that puts you on the board.
13. **Board** tab — the last 7 days. Switch between **Time together** and **People met** and the
    rows re-rank. You are shown between your two neighbours. People you tapped carry a MET tag, and
    their numbers went up as well.
14. **Skip to tomorrow** — the chat banner turns gold: *+3 per day for 7 more days*. Skip a week
    and you drop off the board, because it only looks back seven days.
15. **Me** tab — points ring, streak, the in-person card, **About you**, badges, per-circle totals.

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
| Stay in a circle for days | Prompts get more personal. Three dots on the card fill in, and the deepest available level is offered first |
| Drag your phone onto someone's | Their phone lights up and a ring fills while you hold. Then the tap lands: burst, tick, and their clock starts |
| Pass over a phone without stopping | Nothing. Contact needs two thirds of a second, or letting go while still touching |
| Tap a second person later | Their clock starts from that minute, not from the start of the meetup |
| Skip 30 min | Every running clock jumps forward together, up to the four-hour cap |
| End meetup | Summary with time per person, attendance recorded, badge unlocks, bonus window opens the next day |
| Switch the board's measure | The same people re-ranked by time or by head-count, rows sliding to their new places |
| Advance day | Status bar, waiting nudges, bonus countdown and streak update. The board shifts, and taps older than seven days drop off |

## Design decisions tied to research

- **Prompts, not blank inputs** — interview finding: "people have something to focus on so they
  don't need to keep thinking of new conversation topics."
- **Chat points stay cumulative and unranked** — A1 ethics row 2 (gamification as manipulation) and
  row 5 (extrinsic crowding out intrinsic motivation). Nothing about them changed in iteration 3.
- **Count the meeting, not the messaging** — the project's aim is face-to-face contact, so the one
  thing counted in public is time actually spent together. A tap is the only evidence of that the
  app can collect without tracking where anyone is.
- **One ranked element, with limits** — A1 argued against leaderboards. The in-person board is a
  deliberate change of position for iteration 3, and it is kept narrow. Nobody is listed until they
  have a tap, so there is no last place for someone who has met no one. It looks back seven days,
  so a newcomer is not behind people who arrived a year ago. A session closes itself at four
  hours. A tap credits both people. Whether the board motivates or discourages is the first
  question for the evaluation study.
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
               prompts     — chat prompts with per-prompt replies, keyword fallbacks
               session     — the simulated in-person clock
               board       — the 7-day in-person board, built from taps
               badges
  store/       useStore.jsx — reducer, persistence, points, bonus, badges, profile, custom circles,
                              tap sessions and encounters
  components/  PhoneFrame, TabBar, Avatar, PointBurst, BadgeUnlock
  screens/     Welcome, Interests, About, Discover, CreateCircle, Chats, Chat, TapSession,
               SessionSummary, Leaderboard, Profile
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

Every prompt also carries a disclosure level, following the graded self-disclosure that builds
closeness between strangers (Aron et al., 1997). Level 1 is a concrete preference answerable in a few
words, level 2 is a small story or an opinion, level 3 is reflection. A circle you just joined offers
level 1 only. After two days in it level 2 opens, after four days level 3, and the deepest available
level is shown first while the lighter ones stay in the deck behind it. Nothing is ever taken away,
so there is always an easy option. Three dots on the prompt card show where the circle is.

Each prompt carries 4–5 replies written to answer that specific question, and roughly one in three
hands the question back to keep the thread going. Free-typed messages fall through 14 keyword
responders before reaching the circle's generic pool. `Chat.jsx` remembers the last six replies and
the last speaker so the circle does not repeat itself or let one member answer twice in a row, and
the typing delay scales with reply length.

In a shipped version these replies would be generated per message. They are hand-authored here so
the exhibit prototype runs with no API key and no per-message cost.

### In-person tap and board

`state.tapSession` holds the live session: `{ groupId, t0, skipped, taps: [{ name, atMin }] }`. While
it is set, `App.jsx` renders `TapSession` and nothing else. The clock is simulated like the calendar
(`data/session.js`): one real second is one minute, **Skip 30 min** jumps it forward, and it stops at
240 minutes.

A tap is a drag that ends in overlap. `TapSession` measures both phones when the drag starts, and
once mine covers a quarter of someone else's a 650 ms dwell timer starts. Staying put connects,
moving off cancels, and letting go while still touching also connects. Tapping a person runs the
same contact with the phone travelling by itself, which is also the keyboard path. The logic runs
on pointer events and timers rather than on animation callbacks, so it behaves the same when the
tab is in the background.

Ending a session writes one `encounter` per person, `{ sessionId, name, day, minutes }`, and marks
attendance. `data/board.js` builds the board from those. Time is counted once per meetup rather
than once per person present, a tap is credited to both sides, and anything older than seven days
is ignored. The fictional members' own activity is generated from their name and the day, so the
board is the same after a reload and still moves when the day advances.

## Next

- A real tap. Web NFC can read a tag in Chrome for Android, so giving each person an NFC card is
  the shortest route. Phone-to-phone NFC is not available to web apps, and Web NFC does not exist
  on iOS

- Bilingual prompts and keyword hints for non-native speakers (A1 ethics row 8, and the language
  barrier raised in every interview)
- Real backend for shared circles across devices, so a created circle is visible to other people
- Real dates instead of simulated days; opt-in daily reminder, no push by default
- Fading reward scaffold: reduce point visibility as a circle's chat becomes self-sustaining
- Model-generated replies behind the same `replyPoolFor` interface, with the hand-written pools kept
  as the offline fallback
