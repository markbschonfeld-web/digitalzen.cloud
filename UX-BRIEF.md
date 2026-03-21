# Digital Zen — UX & Conversion Enhancement Brief

**Scope:** Visitor experience, KORFYR click-through conversion, share rate, compliance review of proposed enhancements, and independent findings from full codebase analysis.

---

## Compliance Framework

Everything on this site operates under a specific constraint: it is a bridge page routing social-media traffic to a sponsored product (KORFYR) that cannot be explicitly advertised in this context. That shapes every recommendation below.

**Hard limits:**
- No visual language that appeals to minors (no bright primaries, no cartoon motion, no arcade/prize aesthetics)
- No explicit reference to the product category anywhere on the page
- Consent mechanics for email must be genuine — animating or pressuring users toward the checkbox constitutes dark-pattern territory and creates real legal exposure
- "Slot machine" or "jackpot" visual patterns are gambling-adjacent; the current rarity ticker is fine but the ceiling is already close

**Design directive that follows:** everything should feel like a late-night cultural artifact, not a game. Sophisticated, dark, a little cinematic. That aesthetic is both the brand and the compliance strategy.

---

## Site Flow Audit

### What's Working

**The analyzing sequence (4.8s)** is the best thing on the site. The percentage counter, trait readout, and archetype lock-in sequence build genuine suspense and make the result feel earned. This should be left largely alone.

**Contextual share copy** (referral-aware, rarity-tiered) is more sophisticated than most quiz sites manage. The difference between "I got one of the rarer results" and "My night mode is X, what's yours?" depending on rarity is exactly right.

**Archetype-specific KORFYR bridge lines** are the strongest conversion writing on the page. "You stripped everything down to what matters. We did the same thing." is excellent. This is doing the heavy lifting for the click-through.

**Progressive vignette and particle color morphing** during the quiz is subtle but effective. Users probably don't consciously notice but it creates a sense of deepening immersion.

**Back button implementation** (Q2–Q4) is smart. Reducing commitment anxiety increases completion rates.

### Friction Points

**The result screen has too much between the share button and the KORFYR block.** Current order: archetype name → share button → frequency bar → two body paragraphs → insight quote → email capture form → KORFYR block. Users who complete the share action feel a sense of closure and may not scroll further. The KORFYR CTA is currently behind the email form in scroll depth.

**The BEGIN button click is underwhelming.** There is a 150ms fade-out and 260ms spring-eased fade-in. For a site with this much visual craft in the later screens, the first transition feels abrupt. This is the moment that sets the user's expectation for everything that follows.

**Email form creates friction before the primary conversion.** The email capture is positioned as a speed bump between the result reveal and the KORFYR block. Users who fill in the form feel done. Users who skip it may still exit before reaching KORFYR. Either way, email is competing with the primary CTA.

---

## Your Proposals — Analysis & Recommendations

---

### 1. Animated transition after BEGIN

**What you described:** A more cinematic, "video-game" dopamine reward when the user clicks BEGIN.

**Analysis:** The current transition is the weakest moment in the experience. The breathing pulse ring on the button is good, but the screen change itself is just a fade with a 14px slide. Given the production quality of everything that follows, this sets a lower expectation than the site deserves.

A transition that treats the click as a meaningful threshold — the user committing to the experience — would set the right tone and serve as a clear dopamine reward before the quiz starts.

**Recommended approach:** A "system boot" or "signal lock" effect. When BEGIN is clicked: the button collapses inward, the background particles accelerate briefly, a horizontal scan line sweeps the screen once (120ms), and the first question fades in with a slightly stronger spring. Total: 600–700ms. Should feel like the site waking up, not loading.

**Compliance:** No concerns.

**Verdict: Yes. High priority.**

---

### 2. Same transition for FIND OUT (splash/referral screen)

**What you described:** The friend referral entry point should feel as good as the cold start.

**Analysis:** Both BEGIN and FIND OUT lead to Q1. They should use the exact same transition. Currently, the referral visitor path may feel less crafted, which is the wrong signal — this user is arguably higher-intent (a friend sent them).

**Compliance:** No concerns.

**Verdict: Yes. Bundle with #1. Same animation, same timing.**

---

### 3. Differentiating archetypes visually

**What you described:** Making each archetype look and feel like its name — not just different canvas backgrounds, but typography and layout identity.

**Analysis:** This is the highest-leverage change on the list. Currently, all 10 archetypes share the same result screen layout and typography. The canvas animations differentiate the backgrounds, but the archetype NAME — the single most important moment of the reveal — looks identical across all ten. The Ghost reveal and the Circuit reveal look the same at the moment of truth.

The result should feel like a bespoke identity, not a template swap.

**Possible per-archetype directions:**
- **Architect:** Monospace type, grid underline, very precise character spacing
- **Ghost:** Low opacity on reveal, letters that drift slightly before settling, fog-like entrance
- **Circuit:** Rapid character glitch before locking, tight tracking, digital segment aesthetic
- **2AM (TWAM):** Slightly warmer, looser letterforms, slower reveal — handmade feeling
- **Minimalist:** Single line, maximum whitespace, type that appears by subtraction not addition
- **Operator:** Military-technical font weight, tight caps, blip-style reveal
- **Phantom:** Unstable glitch that never fully resolves — name slightly jittery, never quite locked
- **Builder:** Incremental, structural — letters that assemble rather than flash in
- **Nocturnal:** Heat-bloom entrance, warm color leak on the name
- **Night Engineer:** Schematic-traced, precise, deliberate character-by-character reveal

**Compliance concern:** Keep every direction dark, adult, and sophisticated. Primary colors, cartoon physics, or "winning" animations would undermine both the brand and the compliance posture. No sound effects.

**Verdict: Yes. Highest priority change on the list. Transforms the result from template to identity.**

---

### 4. Customizing share screens to match archetypes

**What you described:** The social share preview should look like the archetype.

**Analysis:** The OG images are static PNGs per archetype, handled by the Cloudflare Worker — those don't need to change. This proposal is about the in-page share preview mockup (the `.result__share-preview` that appears for 2.2 seconds before fading out).

Currently the share preview is a generic card. If the visual identity work from #3 is in place, the share preview can inherit those colors and styles cheaply — same CSS classes, no new infrastructure.

**Compliance:** No concerns.

**Verdict: Yes. Bundle with #3 — minimal additional work once #3 is done.**

---

### 5. More animation on "Share Your Result" and "See What We Built"

**What you described:** More visual weight on both primary CTAs.

**Analysis:** These two buttons are adjacent, and the KORFYR button already carries significant animation: breathing glow (3s pulse), shimmer sweep (4s cycle), arrow nudge (every 2.5s), quest objective ring pulse, cursor spotlight, and click burst ring. Adding more to KORFYR risks making it feel desperate rather than magnetic.

The share button is comparatively understated. That's the right place to invest.

**Recommended approach:** Leave KORFYR animation as-is. For the share button: add a single one-shot animation at approximately 1.5s after result load — a brief "pulse ring" that expands and fades once, similar to the KORFYR ping notification, to draw the eye before the user has scrolled past it. After that, let it sit quietly. The goal is one moment of "look here" not persistent gamification.

**Compliance:** Fine. A one-shot pulse is well within bounds.

**Verdict: Partial. Enhance Share button with one-shot attention pulse. Do not add to KORFYR.**

---

### 6. Text visibility improvements

**What you described:** General audit of contrast and readability.

**Analysis:** The CSS notes mention contrast was raised to 5.2:1 (WCAG AA threshold is 4.5:1 for normal text). That passes, but 5.2:1 is close to the floor. The areas most likely to be under-specified:

- **Result body copy (the two paragraphs):** These are the trust-building text before the email form. If they're hard to read, the user skips them and arrives at email without context, reducing consent willingness.
- **Email form compliance text:** The consent label ("I agree to receive emails from KORFYR, the sponsor of this experience") must be legible. Legally this text cannot be buried or faint.
- **Option hover states:** The 38% opacity dimming on sibling options during selection — verify that selected option remains clearly above 4.5:1 during the scan flash animation.
- **Insight quote:** Styled differently from body — verify it isn't relying on italics alone to carry legibility.

**Compliance note:** The consent label text has a specific legal dimension here. Faint compliance text is a dark pattern. It needs to be fully readable at all times, including on mobile in poor ambient light.

**Verdict: Yes. Targeted audit of the four areas above. Not a full redesign.**

---

### 7. Email form contrast + "I'm In" button activation animation

**What you described:** The form container needs more visual weight; the "I'm In" button should animate when the email becomes valid.

**Analysis:** The form has a beacon pulse divider and breathing border glow on the input already, which is good. The main contrast issue is likely the form container blending into the dark result background — it needs a subtly distinct surface.

The "I'm In" button behavior currently: disabled and dimmed until the consent checkbox is checked. The UX problem is that users type their email, look at a dimmed button, and aren't sure why it's inactive. This causes drop-off before consent is given.

**The right fix is sequenced animation:**
1. User types a valid email → input border brightens slightly (already partially implemented with breathing border)
2. User checks consent → "I'm In" button activates with a brief "unlock" animation (scale up from 0.97 to 1.0, border flashes once, text brightens)
3. The activation animation fires only after BOTH conditions are met

**Compliance critical note:** Do not animate the button toward "press me" before consent is given. That reads as pressure toward a consent action and is a genuine dark pattern. The animation must be the reward for giving consent, not the prompt to give it.

**Verdict: Yes — with the sequencing above strictly respected.**

---

### 8. "See What We Built" shutdown animation before redirect

**What you described:** A "Digital Zen is powering down / handing off" cinematic transition when the user clicks the KORFYR button.

**Analysis:** This is a strong idea if executed correctly. The thematic logic is sound — Digital Zen has done its job, it's now stepping aside. Making that handoff feel intentional rather than just a navigation event is memorable and could improve link-through because it validates the click as a meaningful action.

**Recommended approach:** When "See What We Built" is clicked: the ambient canvas slowly loses signal (intensity fades over 400ms), the particles decelerate, a brief horizontal interference line crosses the screen once, and the page fades to near-black with a subtle "REDIRECTING" or no text at all — just the darkness — before the new tab/navigation fires. Total: 800–1000ms. Should feel like tuning out of a frequency, not winning a prize.

**Compliance concern:** The execution must stay in the "contemplative system shutdown" register, not the "launching into something exciting" register. No fanfare, no celebration, no bright flash. The risk is a shutdown animation that reads as a reward gateway to a vape product. The dark, quiet version avoids that entirely.

**Verdict: Yes — with the tonal note above as a hard constraint.**

---

## Additional Findings

These are issues I identified independently that aren't in your proposal list.

---

### A. Email capture order is hurting KORFYR conversion

**Current order:** Archetype name → Share → Frequency bar → Body copy → Insight quote → **Email form** → KORFYR block

**The problem:** Users who fill in the email form feel a sense of completion. The form is a conversion event in itself and creates psychological closure. Users who skip the form may still exit before scrolling to KORFYR. In both cases, email is functioning as a funnel exit rather than a waypoint.

**KORFYR click-through is the primary conversion goal.** Email is secondary. The email form should come after KORFYR, not before it — capturing users who completed the primary action and are still engaged, rather than intercepting users on their way there.

**Recommended order:** Archetype name → Share → Body copy → Insight quote → KORFYR block → Email form (for users who didn't immediately click through)

This is the single structural change most likely to improve KORFYR conversion.

---

### B. The quiz questions — copy review

The question copy has a deliberate literary quality that differentiates it from standard personality quizzes. This is the right call and should be preserved. But a few specific options create unnecessary friction:

**Q1: "When does your night start?"**
- "When it hits." — too vague. What hits? Mood? Energy? A deadline? Users who don't have a poetic relationship with language will not self-identify here and will pick randomly. Random picks dilute result authenticity, which reduces the "this is genuinely me" feeling that drives sharing.
- Suggested direction: "When something shifts." — still evocative, slightly more legible

**Q2: "Pick your setting."**
- "Outside. Something between you and the air." — grammatically odd. "Something between you and the air" doesn't land cleanly. The image is clear (being outside, being porous to the environment) but the phrasing trips.
- Suggested direction: "Outside. Nothing between you and the air." — the intended meaning was probably absence, not presence

**Q4: "What stays with you?"**
- "The three seconds before you came back." — this is the weakest option on the page. "Came back" where? From what? It requires context the user doesn't have.
- Suggested direction: "The moment before you came back." — still cryptic enough but removes the oddly specific "three seconds"

**Everything else:** leave alone. The rest of the copy is strong and the abstractness is intentional.

---

### C. KORFYR bridge copy is working — don't touch it

The archetype-specific bridge lines are the best conversion writing on the page. "You set the conditions before the night starts. Someone else designed something with that same precision." (Architect), "You stripped everything down to what matters. We did the same thing." (Ghost) — these are good. They create genuine curiosity without naming the product. Leave them exactly as they are.

The only line that does less work: "We made something for people on your frequency. It's not what you'd expect." This is the generic fallback and it's showing its seams. If there's a hybrid archetype that currently gets a weaker bridge line, that's worth checking.

---

### D. Social proof on the share button

The rarity display handles some of this, but the share button itself has no social proof reinforcing it. A small line below the button — "X people have shared this week" (once the stats API has enough data) — makes sharing feel like joining something rather than broadcasting alone. This is the same principle as the "People are checking." line on the intro screen. Worth carrying through to the result screen.

---

### E. The analyzing sequence and mobile drop-off

4.8 seconds is long for mobile users arriving from social media. The sequence is well-crafted and earns its time, but it's worth instrumenting whether there's a completion drop-off between Q4 answer and result display. If there is, the fix is not to shorten the animation but to add a micro-interaction during Phase 1 (the percentage counter phase) — a small pulsing element that signals active processing rather than frozen load.

---

### F. Rarity ticker is at the ceiling

The slot-machine effect on the rarity percentage is clever and is currently the right level of intensity. It's also the closest thing on the site to gambling-adjacent UX. Don't amplify it further — no coin sounds, no flash on landing, no "jackpot" language. The current implementation (ticking numbers settling on a percentage) is fine. The ceiling is here.

---

## Priority Matrix

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| 1 | Move email form below KORFYR block | Low | High (direct KORFYR conversion lift) |
| 2 | Archetype visual differentiation (#3) | High | High (transforms result into identity) |
| 3 | BEGIN / FIND OUT transition (#1, #2) | Medium | Medium-High (sets expectations correctly) |
| 4 | Fix Q2 and Q4 copy (B) | Low | Medium (improves result authenticity → share rate) |
| 5 | Share button one-shot pulse (#5) | Low | Medium |
| 6 | KORFYR shutdown animation (#8) | Medium | Medium |
| 7 | Text contrast audit (#6) | Low | Medium (compliance + readability) |
| 8 | Email form contrast + I'm In animation (#7) | Low | Low-Medium |
| 9 | Share screen archetype styling (#4) | Low | Low (bundle with #3) |
| 10 | Social proof on share button (D) | Low | Low-Medium (scale-dependent) |

---

## What Not to Touch

**The analyzing sequence.** It is the experiential centerpiece. Any change risks making it feel shorter, more generic, or more gamified. Leave it alone.

**The KORFYR button animation stack.** It already has six simultaneous effects. Adding more makes it feel panicked rather than magnetic. The existing implementation is at the right level.

**The archetype body copy and insight quotes.** These are doing trust-building work before the email ask. They should not be shortened in a misguided attempt to reduce scroll depth — the fix to scroll depth is reordering sections, not removing content.

**The consent checkbox requirement.** It must remain mandatory, clearly labeled, and unambiguous. This is not a UX problem to solve around.

---

*Brief compiled from full static analysis of index.html, script.js, style.css, worker/og-rewrite.js, worker/shopify-subscribe.js, and r/ redirect pages.*

---

## Implementation Notes

File-level specifics for each recommendation, in priority order.

---

### Priority 1 — Move email form below KORFYR block

**Files:** `index.html`, `script.js`

**index.html (~line 327–361):** The DOM order is currently:
```
<p class="capture__primer">...</p>     ← intro line above email
<div class="capture">...</div>          ← email form
<div class="korfyr">...</div>           ← KORFYR block
```
Swap so it becomes:
```
<div class="korfyr">...</div>
<p class="capture__primer">...</p>
<div class="capture">...</div>
```

**script.js (~line 562–563):** The animation delay values need to swap to match the new order:
```js
// Before
captureEl.style.setProperty('--delay-capture', (afterBody + 0.2) + 's');
korfyrEl.style.setProperty('--delay-korfyr',   (afterBody + 0.6) + 's');

// After
korfyrEl.style.setProperty('--delay-korfyr',   (afterBody + 0.2) + 's');
captureEl.style.setProperty('--delay-capture', (afterBody + 0.6) + 's');
```

The KORFYR ping delay calculation at ~line 666 (`2760 + Math.round((afterBody + 0.3) * 1000)`) references `afterBody + 0.3` — since KORFYR now appears at `afterBody + 0.2`, update the `+ 0.3` to `+ 0.2` to keep the ping timed correctly relative to the block entrance.

---

### Priority 2 — Archetype visual differentiation

**Files:** `script.js`, `style.css`

**script.js (~line 467):** Where `currentArchKey = archKey` is set inside `showResult()`, add one line after it:
```js
document.querySelector('.screen--result').setAttribute('data-arch', archKey);
```

**style.css:** Add per-archetype rules targeting `.screen--result[data-arch="X"] .result__archetype`. The archetype name element is `<h2 class="result__archetype" id="resultArchetype">`. Target it with data-arch selectors for typography overrides. Examples:

```css
/* Ghost — ethereal, drifting entrance */
[data-arch="ghost"] .result__archetype {
  font-weight: 200;
  letter-spacing: 0.25em;
  animation: ghostReveal 1.8s ease forwards;
}

/* Circuit — glitch lock */
[data-arch="circuit"] .result__archetype {
  letter-spacing: -0.02em;
  animation: circuitGlitch 0.6s steps(1) forwards;
}

/* Architect — structured, precise */
[data-arch="architect"] .result__archetype {
  letter-spacing: 0.12em;
  font-weight: 500;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.1em;
}
```

Each needs a corresponding `@keyframes` block. The canvas background (`screen__ambient--result`) already handles the animated backdrop per archetype — the typography layer adds identity to the name itself.

For color theming per archetype, the archetype objects in `script.js` already define `color` arrays — these can be surfaced as CSS custom properties on the result section at the same point where `data-arch` is set, e.g. `document.querySelector('.screen--result').style.setProperty('--arch-color', arch.colors[0])`.

---

### Priority 3 — BEGIN / FIND OUT transition

**Files:** `index.html`, `script.js`, `style.css`

**index.html:** Add a scan-line element to the body (inside `<div id="quiz">`):
```html
<div class="scan-line" id="scanLine" aria-hidden="true"></div>
```

**script.js:** The `transitionTo()` function at ~line 249 handles all screen transitions. Both BEGIN and FIND OUT call it to move to screen index 1 (Q1). Find the click handlers for both:
- BEGIN: somewhere around the intro screen event listeners (~line 1040–1050)
- FIND OUT: ~line 1048

Before each `transitionTo(1)` call from intro/splash, set a flag:
```js
window._bootTransition = true;
transitionTo(1);
```

Inside `transitionTo()`, at the start, check for this flag:
```js
if (window._bootTransition) {
  window._bootTransition = false;
  // Accelerate particles briefly
  window._particleBoost = true;
  setTimeout(function() { window._particleBoost = false; }, 500);
  // Trigger scan line
  var sl = document.getElementById('scanLine');
  if (sl) { sl.classList.add('active'); setTimeout(function() { sl.classList.remove('active'); }, 180); }
}
```

The particle loop already checks various state flags — `_particleBoost` can increase particle speed for one cycle by checking it in the particle update loop.

**style.css:**
```css
.scan-line {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  transform: translateY(-2px);
  opacity: 0;
  pointer-events: none;
  z-index: 9999;
  transition: none;
}
.scan-line.active {
  animation: scanSweep 180ms linear forwards;
}
@keyframes scanSweep {
  0%   { opacity: 0; transform: translateY(0); }
  15%  { opacity: 0.7; }
  100% { opacity: 0; transform: translateY(100vh); }
}
```

---

### Priority 4 — Question copy corrections

**File:** `index.html`

**Q1, line ~130:** `"When it hits"` is too vague as primary text. Sub-text ("No schedule. Just instinct.") helps but doesn't fully rescue it. Suggested replacement:
```html
<span class="option__text">When something shifts</span>
```

**Q4, line ~221:** `"The three seconds before you went back in."` — the "went back in" does provide context (returning inside) and the sub-text ("That was the whole point.") reinforces the meaning. Lower priority than Q1. If editing, consider:
```html
<span class="option__text">The moment before you went back in.</span>
```
Removing the specific "three seconds" makes it feel less oddly precise while preserving the image.

**Q2 note:** The actual code reads `"Outside. Just the air."` / `"Nothing between you and it."` — this is clean and does not need the edit described in the copy review section of this brief. That analysis was based on an earlier draft version. Leave Q2 as-is.

---

### Priority 5 — Share button one-shot attention pulse

**Files:** `script.js`, `style.css`

**script.js:** In `showResult()`, near where the share section is shown (~line 553), after the existing 0.8s delay logic, add:
```js
setTimeout(function () {
  var shareEl = document.querySelector('.result__share');
  if (shareEl) {
    shareEl.classList.add('share--pulse');
    setTimeout(function () { shareEl.classList.remove('share--pulse'); }, 800);
  }
}, 1500);
```

**style.css:**
```css
.result__share.share--pulse::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: inherit;
  border: 1px solid rgba(255,255,255,0.25);
  animation: sharePulseRing 0.8s ease-out forwards;
  pointer-events: none;
}
@keyframes sharePulseRing {
  0%   { opacity: 0.7; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.04); }
}
```

`.result__share` needs `position: relative` if not already set.

---

### Priority 6 — KORFYR shutdown animation

**Files:** `index.html`, `script.js`, `style.css`

**index.html:** Add shutdown overlay inside `<div id="quiz">`:
```html
<div class="korfyr-shutdown" id="korfyrShutdown" aria-hidden="true"></div>
```

**script.js (~line 1227):** The `.btn--korfyr` click handler currently does cursor effects and burst ring. Add shutdown logic before navigation fires:
```js
kBtn.addEventListener('click', function (e) {
  e.preventDefault();
  var dest = kBtn.href;
  var overlay = document.getElementById('korfyrShutdown');
  if (overlay) { overlay.classList.add('active'); }
  // Fade ambient canvas
  if (window._ambientIntensityTarget !== undefined) {
    window._ambientIntensityTarget = 0;
  }
  setTimeout(function () {
    window.open(dest, '_blank');
    // Reset overlay after navigation
    setTimeout(function () {
      if (overlay) overlay.classList.remove('active');
    }, 300);
  }, 900);
});
```

The ambient canvas system tracks intensity via a target value — the exact variable name will need to be confirmed in the canvas rendering loop, but the pattern for fading it out is already used during the analyzing/result transitions.

**style.css:**
```css
.korfyr-shutdown {
  position: fixed;
  inset: 0;
  background: #000;
  opacity: 0;
  pointer-events: none;
  z-index: 200;
  transition: opacity 0.7s cubic-bezier(0.4, 0, 1, 1);
}
.korfyr-shutdown.active {
  opacity: 1;
  pointer-events: all;
}
```

The transition from opacity 0 → 1 over 700ms gives a slow fade to black. Navigation fires at 900ms, so the screen is dark before the redirect. No text, no flash, no sound — just the site going quiet.

---

### Priority 7 — Text contrast audit

**File:** `style.css`

Four specific areas to check and adjust:

1. **`.result__body p`** — the two archetype description paragraphs. Should be at minimum `rgba(255,255,255,0.85)` against the dark background.
2. **`.capture__consent-text`** — the GDPR consent label. This is legally material text. Must be fully opaque or very close to it. Check current opacity/color value and confirm it passes 4.5:1 against its background.
3. **`.result__insight`** — the insight quote. Often styled with reduced opacity for aesthetic hierarchy. Confirm it still passes 4.5:1 — if it currently uses something like `opacity: 0.6` or a muted color, it may be failing.
4. **Option selected state** — during the selection scan animation, the `.option.selected` element has a brief flash/scan overlay. Confirm the text underneath remains legible (above 4.5:1) during the 0.38s animation.

---

### Priority 8 — Email form contrast + "I'm In" activation animation

**Files:** `script.js`, `style.css`

**style.css — form container surface:**
Add a subtle background to `.capture` to lift it off the result background:
```css
.capture {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  padding: 1.5rem;  /* adjust to match existing spacing */
}
```

**script.js — "I'm In" activation sequence:**
Find the event listeners for the email input (`~line 1157`) and the consent checkbox (`captureConsent`). After each change event, run a shared check function:
```js
function checkCaptureReady() {
  var email = captureForm.querySelector('.capture__input').value;
  var consent = document.getElementById('captureConsent').checked;
  var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (validEmail && consent) {
    captureBtn.classList.add('capture-ready');
  } else {
    captureBtn.classList.remove('capture-ready');
  }
}
```

**style.css — activation animation (fires only when both conditions met):**
```css
.btn--capture.capture-ready {
  animation: captureActivate 0.3s ease forwards;
}
@keyframes captureActivate {
  0%   { transform: scale(0.97); box-shadow: none; }
  60%  { transform: scale(1.02); }
  100% { transform: scale(1.0); box-shadow: 0 0 12px rgba(255,255,255,0.15); }
}
```

The button's disabled/dimmed state (before consent) remains unchanged — the animation only fires when transitioning from not-ready to ready, which requires both a valid email AND consent checked. This satisfies the compliance constraint: the animation is the reward for completing consent, not a prompt toward it.

---

### Priority 9 — Social proof line below share button

**Files:** `index.html`, `script.js`

**index.html:** Add a span after the share button inside `.result__share`:
```html
<span class="result__share-social" id="shareSocialProof"></span>
```

**script.js:** In the stats callback (where `shareCount` is already populated), also populate `shareSocialProof` if the share count is above a threshold (e.g., 200):
```js
if (data.shareCount > 200) {
  var sp = document.getElementById('shareSocialProof');
  if (sp) sp.textContent = data.shareCount.toLocaleString() + ' people sharing this week';
}
```

Low lift, scale-dependent value — only shows when there's real volume to show.

---

### What Doesn't Need Code

- **KORFYR bridge copy** — all 10 archetype-specific bridge lines are in `script.js` and are working well. No changes.
- **Analyzing sequence** — leave `script.js` timing constants and the three-phase structure entirely alone.
- **Consent checkbox** — the required/disabled logic is correctly implemented. No changes.
- **Cloudflare Workers** (`worker/og-rewrite.js`, `worker/shopify-subscribe.js`) — none of the above recommendations require worker changes. The OG image PNGs in `og/` are also unchanged.
- **The `r/` redirect files** — purely redirect shims, untouched by all of the above.
