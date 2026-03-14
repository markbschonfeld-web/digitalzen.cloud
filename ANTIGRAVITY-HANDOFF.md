# Antigravity Handoff Brief — Digital Zen "Night Mode" Quiz

**Date:** 2026-03-14
**Site:** https://digitalzen.cloud
**Repo:** digitalzen.cloud (static site — `index.html`, `script.js`, `style.css`)
**Objective:** Make the quiz more fun, engaging, and visually polished
**Constraint:** Do NOT alter any compliance-sensitive content or structure

---

## What This Is

A personality quiz ("What's Your Night Mode?") hosted on `digitalzen.cloud` under the brand **Digital Zen**. It asks 4 questions about nighttime rituals, scores the user into one of 10 archetypes (4 core + 6 hybrids), shows a result, and then presents a "curiosity block" that links out to **korfyr.com**.

KORFYR is a cannabis/smoking products brand. This quiz is the advertising vehicle. The entire compliance strategy depends on the separation between the quiz content (which is what gets shown in ads / on social) and the KORFYR brand reveal (which only appears *after* the quiz is completed). **This separation is load-bearing. Do not collapse it.**

---

## Why Compliance Matters Here — Read This Carefully

KORFYR sells cannabis smoking products. This subjects advertising to **both cannabis and tobacco advertising restrictions** across:

- **Meta/Facebook/Instagram ad policies** (no promotion of tobacco, cannabis, or related products)
- **Google Ads policies** (same)
- **State-level cannabis advertising regulations**

### The Compliance Strategy

The way we legally get this in front of people:

1. **The ad itself** (what gets submitted to Meta/Google) links to `digitalzen.cloud` — a lifestyle personality quiz. The ad creative and landing page contain **zero references** to cannabis, smoking, tobacco, vaping, hemp, THC, CBD, or any product.
2. **Digital Zen** is the publisher brand. It presents as an editorial/culture publication ("Issue 001", "After Dark"). This is the entity that runs the quiz.
3. **KORFYR is only revealed in the result screen**, after the user has completed the quiz. It appears as a "curiosity block" — a branded section that says "We made something for people on your frequency" and links to korfyr.com. It does NOT say what the product is. It does NOT show product imagery. It does NOT mention cannabis, smoking, or anything restricted.
4. **The email capture** explicitly discloses KORFYR as the sponsor and requires an opt-in checkbox. This is CAN-SPAM / consent compliance.

**This is not a loophole we're exploiting carelessly — it's a carefully constructed editorial-to-brand bridge that keeps the ad-facing content clean while being transparent about sponsorship at the point of engagement.**

---

## What You CAN Change (Your Playground)

You have full creative latitude on **visual polish, animations, micro-interactions, and UI feel** across the entire quiz. Go wild with:

### Intro Screen
- Entry animations, ambient effects, background treatments
- Button hover/click states, pulse animations
- Typography motion, reveal sequences
- The "6,200+ people checked" social proof styling

### Question Screens (Q1–Q4)
- Option card hover states, selection animations, transitions between cards
- The red left-border "scan flash" effect on selection — enhance it, rethink it, make it feel better
- Progress bar styling and animation
- Screen-to-screen transition timing and easing
- Ambient background effects per question
- Any micro-interactions that make answering feel more satisfying (haptic-style feedback, ripples, glows, etc.)

### Result Screen — Visual Presentation
- The archetype name reveal (currently uses a `flickerIn` animation — improve it)
- Frequency bar animation
- Body text stagger timing
- The insight quote styling
- Share button interaction and "Copied" confirmation

### Overall
- Color refinements within the existing palette (dark bg, off-white text, red accent)
- Font weight/size micro-adjustments
- Spacing, rhythm, breathing room
- Mobile responsiveness improvements
- Scroll behavior
- Loading/perceived performance
- Sound design if you want (subtle, optional, not autoplaying)
- Dark ambient textures, grain, glow effects

---

## What You CANNOT Change (Compliance Red Lines)

### Absolute No-Go List

1. **Do NOT add any references to cannabis, marijuana, weed, hemp, THC, CBD, smoking, vaping, tobacco, or any controlled/restricted substance** — anywhere in the HTML, JS, CSS, meta tags, alt text, comments, or any content that renders in the browser.

2. **Do NOT add product imagery, product descriptions, pricing, or "shop/buy" CTAs** — the KORFYR block is a curiosity teaser, not a product listing. It must stay abstract.

3. **Do NOT change the KORFYR block copy:**
   - The bridge lines (per-archetype text like "You set the conditions before the night starts. Someone else designed something with that same precision.")
   - "We made something for people on your frequency. It's not what you'd expect."
   - "See What We Built" (the CTA text)
   - The `korfyr.com` outbound URL or its UTM parameters

4. **Do NOT change the email capture consent text:** "I agree to receive emails from KORFYR, the sponsor of this experience. You can unsubscribe anytime." — This is legally required consent language.

5. **Do NOT change the footer disclosure:** "Sponsored by KORFYR" — this is the sponsorship transparency statement.

6. **Do NOT change the quiz questions or answer text.** The questions are carefully written to be about lifestyle/ritual with zero product references. Don't add new questions, don't reword existing ones.

7. **Do NOT change archetype names, descriptions, insight quotes, or rarity percentages.** These are the quiz "content" and have been reviewed for compliance.

8. **Do NOT change the page title, meta description, or OG tags.** These are what ad platforms crawl. They say "What's Your Night Mode?" and "A 30-second read. You already have a ritual." — that's intentional.

9. **Do NOT move the KORFYR block above the result reveal.** The brand must appear AFTER the archetype/description, never before or alongside questions. The funnel order is: quiz → result → KORFYR curiosity → share → email capture.

10. **Do NOT add age-gating, age verification, or "21+" language.** This would signal to ad platform reviewers that the content is age-restricted, which would trigger the exact scrutiny we're avoiding. The quiz is a lifestyle quiz. It has no age-restricted content.

---

## Architecture Notes

- **Static site** — just HTML + CSS + JS. No build step, no framework.
- **`index.html`** — all screens are `<section>` elements, toggled via `.active` class
- **`script.js`** — IIFE, vanilla JS. Handles screen transitions, scoring, result rendering, share, and email capture.
- **`style.css`** — CSS custom properties, BEM-ish naming, keyframe animations. All animation timing is here.
- **`worker/shopify-subscribe.js`** — Cloudflare Worker for email capture → Shopify. **Do not touch this file.**
- **Referral flow** — URLs like `?r=architect` show a "friend splash" screen before the quiz. Don't break this.
- Screen transitions use `fade-out`/`fade-in` classes with 150ms linear timing. You can change the timing/easing.

---

## How to Work on This

Since this is a client-rendered quiz, **use browser screenshots** to see what you're changing. The fetch tool will only show the static HTML shell (noscript fallback + inactive sections). You need to:

1. Take a screenshot of the current state
2. Make CSS/JS changes
3. Take another screenshot to verify

The quiz flow is: Intro → Q1 → Q2 → Q3 → Q4 → Result. You can test the result screen directly by loading `https://digitalzen.cloud/?r=architect` (or `ghost`, `circuit`, `twam`, `minimalist`, `operator`, `engineer`, `phantom`, `builder`, `nocturnal`).

---

## Summary of the Assignment

Make this quiz **feel better to play through** — more satisfying option selections, smoother transitions, more polished result reveal, better ambient atmosphere. Think of it as going from "functional prototype" to "this feels like a premium interactive experience."

Do not touch the words, the structure, or anything that changes what the site *says*. Only change how it *feels*.
