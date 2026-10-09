# FriendZone

**Something to do, not something to say.**

FriendZone is a mobile app concept that helps newcomers to Brisbane — especially international
students — build and *keep* social connections. It pairs small interest-based groups with
conversation prompts and gentle daily rewards. When a circle meets, two phones tap, a clock runs,
and a seven-day board shows who has been showing up in person. A bonus window afterwards helps
new connections survive the first goodbye.

**Live prototype:** <https://yueran-ml.github.io/7285/>
Open it on a phone for the full-screen app, or on a laptop for the exhibition view with demo controls.

Team FriendZone · DECO7285 Design Computing Studio 2 (Interaction Design) · The University of Queensland · Semester 2, 2026 · Theme: **Care**

---

## The problem

Roughly two-thirds of international students report loneliness on arrival (Sawir et al., 2008),
and loneliness feeds social anxiety, which in turn makes people avoid the very interactions that
would help. Our team interviewed nine residents of student accommodation and community groups
in Brisbane. Two barriers came up again and again:

- **Starting is hard without a reason.** *"It's much harder if you literally have no context and
  you just have to walk up to someone."*
- **Connections decay after the first meeting.** *"Maybe you talk a little bit at the event, add
  each other, and then after everyone goes home, you don't really talk again."*

Existing tools either broadcast events to large audiences or match people one-to-one. Neither
gives a nervous newcomer a low-stakes way in, and neither does anything about the drop-off
afterwards.

## The concept

The mechanisms, designed to work together:

| Mechanism | What it does | Why |
|---|---|---|
| **Interest-based circles** | Pick what you already like; get recommended small groups (4–8 people) that share it. An optional profile adds how you like to meet people, what you enjoy, what you would rather avoid, and your star sign. | Replaces the cold approach with a curated, low-pressure entry point. Shared hobbies alone say little about whether a room will feel comfortable. |
| **Prompted chat with daily points** | Each circle chat has built-in conversation prompts. Saying anything once a day earns one point; points unlock cosmetic badges. | Prompts give people *something to focus on* instead of something to invent. Small, daily, non-competitive rewards scaffold the first steps for people who would otherwise stay silent. |
| **Post-meetup bonus** | When a circle meets in person, chatting in the seven days afterwards earns triple points. | Directly targets the "after everyone goes home" drop-off our research identified. |
| **Tap phones in person** | At the meetup the screen becomes the table. Bring your phone to someone else's and hold it there; the tap starts a clock for the two of you. | The aim is face-to-face contact, so that is what gets recorded. A tap needs both people and cannot be done from a bedroom. |
| **The in-person board** | The last seven days, ranked by time together or by people met, built from taps alone. | Makes showing up visible. It is the only ranked element in the app, and its limits are listed under Ethics. |

The whole flow, as one user would experience it: *Jia arrives in Brisbane → picks cooking, movies
and study → joins the Cooking Circle → answers the prompt "What's a dish from your hometown you
miss?" → chats daily → the circle cooks dumplings together on Saturday → they tap phones at the
table and the clock runs → the bonus window keeps the thread alive → they plan the next one.*

## Design principles

- **Scaffolded, not spontaneous.** The app never asks users to open with nothing. Prompts are
  interest-specific and can be cycled or hidden.
- **Chat rewards are cumulative and unranked.** Points never reset, there are no streaks that
  punish a missed day, and badges are cosmetic.
- **One ranked element.** The in-person board is the single place the app compares people, and it
  compares only what a tap between two phones recorded.
- **Continuity across online and offline.** The in-person meetup is a stage in the same
  relationship, not the end of the app's job.
- **For anyone building connections.** No clinical language, no "social anxiety" labels in the
  interface. The design is informed by research on social anxiety without diagnosing its users.

## Ethics built into the prototype

- Points are capped at one earn per circle per day; rewards are cosmetic only.
- The in-person board lists nobody until they have a tap, so there is no last place for someone
  who has met no one. It looks back seven days, so a newcomer is not behind people who arrived a
  year ago. A session closes itself after four hours, and a tap credits both people.
- A tap records who and for how long. It does not record where, and nothing tracks location.
- Meetup suggestions are group-based (never one-to-one) in public or shared spaces.
- No message content is analysed; participation is tracked as a yes/no per day.
- Interest matching surfaces overlap but never filters by language or nationality.
- Every profile field is chosen by the user, never inferred. The social-style question avoids
  clinical language, and a blank profile is fully supported.
- Something you said you would rather avoid lowers a circle's rank and is disclosed on the card.
  It never hides the circle from you.
- Interview audio and transcripts are kept out of this repository.

## Roadmap

| Iteration | Focus | Status |
|---|---|---|
| **1** — Week 8 exhibit (17 Sep 2026) | Interactive prototype: onboarding, discovery, prompted chat, points, meetup flow, badges. Simulated days, local state. | ✅ Live |
| **2** | Matching past hobbies: an optional profile (how you like to meet people, things you enjoy, things you would rather avoid, star sign) and a three-level interest tree, so Motorsport, Formula 1 and Ferrari are three different signals. 22 circles, five sort lenses, search and filters, circle creation, and an in-person mode that switches the app off at a meetup. Conversation prompts gained their own replies. | ✅ Live |
| **3** — Week 13 exhibit (29 Oct 2026) | In person: tapping phones, a clock per person, and a seven-day board. The in-person prompt deck was removed after Week 8 feedback. Evaluation study with the System Usability Scale. | In progress |
| **Next** | Language as a barrier: bilingual prompts and keyword hints for non-native speakers. A real NFC tap, a backend for shared circles across devices, real dates. | Planned |

## Repository

```
friendzone-app/     React + Vite prototype — setup, demo script and architecture in its README
.github/workflows/  GitHub Pages deployment (runs on every push to main)
```

Run locally:

```bash
cd friendzone-app
npm install
npm run dev
```

## Acknowledgements

Prototype code was written with **Claude Code (Anthropic)** under the team's design direction,
following the user research, concept and ethics analysis developed by the team. Interview
participants are quoted with pseudonyms.

## Key references

- Fisher, B., & Tronto, J. C. (1990). Toward a feminist theory of caring. In *Circles of care* (pp. 35–62). SUNY Press.
- Gray, C. M., et al. (2018). The dark (patterns) side of UX design. *CHI 2018*.
- Sawir, E., et al. (2008). Loneliness and international students: An Australian study. *Journal of Studies in International Education, 12*(2), 148–180.
- Stuart, A., Stevenson, C., Koschate, M., Cohen, J., & Levine, M. (2022). 'Oh no, not a group!' The factors that lonely or isolated people report as barriers to joining groups for health and well-being. *British Journal of Health Psychology, 27*(1), 179–193.
