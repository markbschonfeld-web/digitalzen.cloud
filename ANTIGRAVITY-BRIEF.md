# Antigravity Brief: Digital Zen — "What's Your Night Mode?"

## What This Is

A sponsored interactive quiz experience at **digitalzen.cloud**. Users answer 4 questions, get assigned one of 10 "night mode" archetypes, and are directed toward the sponsor's product (KORFYR) via a CTA button and optional email capture.

The site is a single-page app: `index.html` + `style.css` + `script.js`. No frameworks, no build step. Deploys to Vercel. It's vanilla JS inside an IIFE — all state lives in closure variables.

---

## File Map

| File | What It Does |
|---|---|
| `index.html` | All screens in one file: splash, intro, Q1–Q4, analyzing interstitial, result. Semantic HTML, no dynamic templates. |
| `style.css` | ~1400 lines. Base styles → responsive → enhanced experience layer → per-archetype themes. All animations are CSS except the particle system. |
| `script.js` | ~610 lines. Quiz engine (screen transitions, scoring, result rendering), particle canvas system with per-archetype color/speed profiles, click-burst particles, choice-reactive color blending. |

---

## How the Quiz Works

### Screens (in order)
1. **Intro** — "WHAT'S YOUR NIGHT MODE?" + Begin button
2. **Q1** — "When does your night start?" (4 options)
3. **Q2** — "Pick your setting." (4 options)
4. **Q3** — "What anchors your ritual?" (4 options)
5. **Q4** — "What stays with you?" (4 options)
6. **Analyzing** — "READING YOUR FREQUENCY" spinner (2.5s auto-advance)
7. **Result** — Archetype reveal, body text, insight quote, KORFYR block, share button, email capture

### Scoring
Each option maps to one of 4 traits: `precision`, `stillness`, `kinetic`, `generative`. The trait with the highest score determines the archetype. Ties produce hybrid archetypes (e.g., precision+kinetic = "The Operator"). There are **10 total archetypes**.

### Direct-link testing
You can jump to any result via URL parameter: `?r=ghost`, `?r=architect`, `?r=circuit`, `?r=twam`, `?r=minimalist`, `?r=operator`, `?r=engineer`, `?r=phantom`, `?r=builder`, `?r=nocturnal`

---

## Current Visual Systems

### Particle Canvas (`#particleBg`)
- 18 particles, full-viewport canvas behind all content
- **Choice-reactive colors**: After each answer, particle color blends based on accumulated trait scores (precision→blue, stillness→neutral, kinetic→orange, generative→amber)
- **Archetype profiles**: On result screen, particles transition to archetype-specific color/speed/opacity over ~2s via lerp
- **Analyzing speed-up**: Particles run 2.5x during the analyzing screen
- **Click bursts**: 8 particles radiate from click point on option selection

### Per-Archetype Result Themes
Each archetype has unique CSS ambient gradients and text-shadow glows:
- **Architect** — steel blue from top
- **Ghost** — intentionally nothing (absence = design)
- **Circuit** — warm orange from edges
- **2AM** — amber rising from below
- **Minimalist** — single thin beam
- **Operator** — blue-red tactical split
- **Night Engineer** — deep blueprint blue
- **Phantom** — pulsing purple (4s CSS animation)
- **Quiet Builder** — warm earth from below
- **Nocturnal** — hot red center

### CTA Attention Effects
- "SEE WHAT WE BUILT" button: breathing glow, shimmer sweep, arrow nudge, ring pulse
- Email capture: divider beacon, input breathing border, I'M IN shimmer
- KORFYR wordmark: pulsing text-shadow

### Progressive Atmosphere
- Vignette overlay darkens edges with each answer (CSS custom property `--vignette`)
- Progress bar pulses on each new question
- Analyzing screen: white flash + CRT scan lines

---

## YOUR TASKS

### 1. Play Through the Quiz Multiple Times
Play through with different answer combinations to experience all paths. Test at minimum:
- All precision → Architect
- All stillness → Ghost
- All kinetic → Circuit
- All generative → 2AM
- Mixed precision+kinetic → Operator
- Mixed stillness+generative → Quiet Builder

For each playthrough, evaluate:
- Does every piece of text read easily? No squinting?
- Do the animations feel smooth and satisfying?
- Is the flow intuitive — does the user always know what to do next?
- Does the result screen build anticipation and feel like a reward?
- Do the CTAs (SEE WHAT WE BUILT, email form) draw attention naturally?

### 2. Fix Text Contrast — CRITICAL

**The biggest readability problem right now: `--text-secondary` and `--text-muted` are too dark on the `--bg` background.**

Current values:
```css
--bg: #0c0c0e;           /* near-black */
--text-secondary: #8a8680; /* used for body text, subtitles, descriptions */
--text-muted: #4a4640;     /* used for option subs, metadata, labels */
```

`--text-muted` (#4a4640) on `--bg` (#0c0c0e) has a contrast ratio of roughly **2.6:1** — far below the WCAG AA minimum of 4.5:1 for normal text. This affects:
- Option subtitle/hint text (e.g., "Early. Deliberate.")
- Progress labels ("1 / 4")
- Result frequency label, rarity text
- Capture consent text, notes
- Footer

`--text-secondary` (#8a8680) at roughly **4.3:1** is borderline — fine for large text but straining for body copy.

**What to do:**
- Bump `--text-muted` to at least `#7a756f` or brighter (target 4.5:1+ contrast)
- Bump `--text-secondary` to at least `#9e9890` or brighter (target 5:1+ for comfortable body reading)
- Test with real content on each screen — the insight quote, consent text, and option subs are the most critical
- DO NOT make everything bright white — the hierarchy (text > text-secondary > text-muted) must remain. Just raise the floor so nothing is unreadable.

### 3. Improve Visual Storytelling & Game-Like Feel

**Goal: Make it feel more like an interactive experience / video game, less like a web form. Subtle, premium, not cheesy.**

Areas to explore:

**Quiz flow (Q1–Q4):**
- Can question transitions feel more varied/dynamic? Currently they all fade-slide the same way. Could Q3 or Q4 have slightly different timing or direction to build tension?
- The option cards could have more tactile feedback on tap — consider a very brief scale-bounce or border flash
- The progress bar could feel more like a "loading" moment — maybe a brief overshoot-settle animation when it fills

**Analyzing screen:**
- This is the "boss fight loading screen" moment. It's good but could be more dramatic. Consider: additional concentric rings, a brief data-readout with the trait scores visualized, or a subtle screen shake as it "locks in"
- The 2.5s duration should feel like just enough — not too long, not too short

**Result reveal:**
- The archetype name flickers in (CSS `flickerIn` animation) — this is strong. Could the moment right before it feel emptier/quieter to heighten the contrast?
- Consider a very brief "everything goes dark/still" beat (200ms) before the name appears — like a breath before the reveal
- The body paragraphs fade in with stagger — could they also have a very slight typewriter-like character-by-character reveal for the first sentence only? (Be careful — this can feel slow. Only if it's fast enough.)

**CTAs (SEE WHAT WE BUILT + email):**
- These are the conversion points. The shimmer/glow effects are already there — evaluate whether they're visible enough on mobile
- The KORFYR block should feel like a "next chapter" moment — the bridge text ("You stripped everything down...") should feel like a narrative connection, not an ad
- The email capture should feel like joining something exclusive, not filling out a form. The "Only X% of people get this result" rarity stat helps — make sure it's visible and feels significant
- Consider: could the rarity stat have a brief counting-up animation (like a slot machine settling)?

**Environmental details:**
- Screen ambient gradients per question are already there but very subtle. Evaluate if they need to be slightly stronger
- The vignette deepening is subtle — is it noticeable? If not, consider increasing the multiplier
- Particles: are they visible enough on mobile? The canvas might need slightly larger/brighter particles on small screens

### 4. Mobile-Specific Evaluation

Play through on mobile viewport (or simulate 375px width). Check:
- All text is readable without zooming
- Buttons are easy to tap (min 48px touch targets)
- The result screen scrolls smoothly — no layout jumps
- The email form works: input → consent checkbox → submit
- The stacked input/button layout (vertical on mobile) looks clean
- Consent text is fully readable (compliance requirement)

### 5. Suggested Quick Wins (if you see opportunities)

- Option cards: add a subtle left-border color on the selected card that matches the trait color (precision=blue, kinetic=orange, etc.) instead of always red
- Result screen: the frequency bar fill animation could have an easing overshoot (fills past target, settles back)
- Share button: when tapped and link is copied, the "Copied. Send it." message could have a more game-like entrance (slide-up instead of just appearing)
- The "6,200+ people checked" proof text on intro: could animate with a counting-up effect on page load

---

## HARD CONSTRAINTS — DO NOT CHANGE

### Content restrictions
- **DO NOT** modify any archetype text (names, body copy, insight quotes, bridge lines)
- **DO NOT** modify the KORFYR wordmark, CTA text ("See What We Built"), or intrigue copy
- **DO NOT** modify consent/checkbox language — this is legally required
- **DO NOT** add new text content that makes product claims or implies endorsements
- **DO NOT** remove or hide the consent checkbox, sponsor attribution, or "unsubscribe anytime" language

### Structural restrictions
- **DO NOT** change the scoring logic or trait-to-archetype mapping
- **DO NOT** reorder screens or add/remove screens
- **DO NOT** change the KORFYR outbound URL structure or UTM parameters
- **DO NOT** modify the email capture endpoint or form submission logic
- **DO NOT** break the direct-link system (`?r=ghost`, etc.)

### Compliance context
This is a **sponsored content experience**. KORFYR is the sponsor. The quiz is editorial content (Digital Zen) with a sponsored recommendation block at the end. Key compliance requirements:
- Sponsor must be clearly identified (it is: "sponsored by KORFYR" in footer, consent text)
- Consent for email must be explicit and opt-in (checkbox exists, don't remove it)
- The experience must not be deceptive — it should be clear this is a quiz leading to a product recommendation
- No health claims, no financial claims, no "you need this" pressure language
- The CTA "See What We Built" is intentionally curiosity-driven, not hard-sell — keep this tone
- Rarity stats ("Only 11% of people get this result") are directional, not scientific — don't make them sound more authoritative than they are

### Technical restrictions
- Keep it vanilla JS — no frameworks, no npm, no build step
- Keep all code in 3 files (index.html, style.css, script.js)
- Must work on: iOS Safari 15+, Chrome Android, Chrome/Firefox/Safari desktop
- Canvas particle system must not drain battery on mobile — keep particle count at 18 or below
- All animations must respect `prefers-reduced-motion` (currently not implemented — you may add this)

---

## Color Reference

Current CSS custom properties:
```
--bg: #0c0c0e           (background — near black)
--bg-card: #141416       (option card background)
--bg-elevated: #1a1a1e   (hover/elevated state)
--text: #f0ede8          (primary text — warm white)
--text-secondary: #8a8680 (body copy — TOO LOW CONTRAST, fix this)
--text-muted: #4a4640     (metadata/labels — WAY TOO LOW, fix this)
--red: #c41e1e           (accent — deep red)
--red-warm: #e85d3a      (warm accent variant)
--border: rgba(255,255,255,0.08)
```

---

## How to Test Efficiently

1. Load `digitalzen.cloud` in browser
2. Play through quiz → land on result
3. Use `?r=architect` (etc.) to jump to specific results
4. Use browser DevTools to test mobile viewport (375x812 iPhone, 360x740 Android)
5. Check contrast with DevTools accessibility panel or browser contrast checker
6. Test with `prefers-reduced-motion: reduce` in DevTools to see if animations should be toned down

---

## Summary of Priorities

1. **Fix text contrast** (`--text-muted` and `--text-secondary`) — this is the #1 readability issue
2. **Evaluate and improve CTA visibility** — "SEE WHAT WE BUILT" button and email form must draw the eye
3. **Add game-like polish** where it enhances without feeling cheap — subtle environmental effects, satisfying feedback, narrative tension
4. **Mobile experience** — must be effortless, readable, fun
5. **Keep it compliant** — sponsor disclosure, consent, no misleading claims
