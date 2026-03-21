# Digital Zen — Claude Cowork Brief
**Branch:** `claude/review-digital-zen-PqA3X`
**Date written:** March 2026
**Written by:** Claude Code (claude-sonnet-4-6), session `01KYxLwzRebCpa4oXjqVppNx`

---

## What This Project Is

`digitalzen.cloud` — "What's Your Night Mode?" — is a static personality quiz that acts as a bridge/landing page between social media ads and **KORFYR**, a cannabis vaporizer brand. The quiz is compliance-sensitive: no cannabis references appear until after the quiz result, where a sponsor disclosure and KORFYR CTA are shown.

**Stack:** Vanilla HTML/CSS/JS (no build step, no framework). Deployed on **Vercel**. Two **Cloudflare Workers** handle email capture and OG meta tag rewriting. DNS is through Cloudflare.

**Key files:**
- `index.html` — all screens in one file
- `script.js` (~1850 lines) — quiz engine, scoring, sharing, email capture, canvas animations
- `style.css` (~2300 lines) — all styling and keyframe animations
- `og/*.png` — 10 archetype-specific OG images (1200×630 PNG, valid)
- `r/*.html` — 10 static OG redirect pages (one per archetype, newly added)
- `worker/shopify-subscribe.js` — Cloudflare Worker for email → Shopify
- `worker/og-rewrite.js` — Cloudflare Worker for OG meta rewriting (exists in code, not deployed)
- `worker/SETUP.md` — documents the email worker deployment
- `worker/wrangler.toml` — documents deploy commands for both workers

---

## What's Been Done in This Session (You Missed These)

This session addressed a share mechanic overhaul requested by the project owner. Here's exactly what changed:

### 1. Share Button UX Overhaul
- **Rarity stat moved above the share button** in `index.html` — "Only X% get this result" now appears before the CTA so it primes the share impulse at peak emotional investment
- **Share button redesigned** in `style.css` — full-width (max 300px), brighter border, shimmer sweep animation (background-position based, no `overflow:hidden`), outer ping-ring pulse
- **Platform share pills added** — X (Twitter intent URL), Facebook (sharer URL), Copy Link with inline "Copied!" feedback
- **Post-share `.shared` state** — animations settle after user has shared; resets on retake
- **`touch-action: manipulation`** added; `overflow:hidden` and `scale()` animation removed to fix iPad/iOS WebKit touch target bug
- **`og:image:type="image/png"`** added to HTML head for LinkedIn crawler compatibility

### 2. Static OG Redirect Pages (Fixes Per-Archetype Social Previews)
Created `/r/<archetype>.html` for all 10 archetypes:
- `architect`, `ghost`, `circuit`, `twam`, `minimalist`, `operator`, `engineer`, `phantom`, `builder`, `nocturnal`

Each page has hardcoded per-archetype OG/Twitter meta tags and a JS redirect to `/?r=<key>`. Social crawlers (Facebook, LinkedIn, Discord, iMessage) don't execute JS — they read the static OG tags. Humans get redirected instantly.

**Why this exists:** The `og-rewrite.js` Cloudflare Worker was never deployed (see below), so crawlers were always seeing the default `og-image.png`. These static pages replace the need for the worker entirely.

**Important fix in this session:** The pages originally had `<meta http-equiv="refresh">` which Facebook and LinkedIn crawlers DO follow, defeating the purpose. That tag was removed — only the JS redirect remains.

### 3. Share URLs Updated
All share URLs in `script.js` now point to `/r/<key>` (e.g. `https://digitalzen.cloud/r/architect`) instead of `/?r=<key>`. This routes shares through the static OG pages with correct per-archetype previews.

The browser history URL (`/?r=<key>`) is unchanged — only the explicitly shared/copied links use `/r/`.

### 4. `vercel.json` Added
```json
{ "cleanUrls": true }
```
Without this, Vercel returned 404 for `/r/circuit` (without `.html`). This fixes it.

### 5. `worker/wrangler.toml` Added
Documents deploy commands for both workers. See below re: the unresolved worker situation.

---

## Current State — What Still Needs Attention

### Priority 1: Verify OG Previews Are Working After Deploy

After the latest deployment lands, test each of these in **Facebook's Sharing Debugger** (`developers.facebook.com/tools/debug`) and **LinkedIn's Post Inspector**:
- `https://digitalzen.cloud/r/architect`
- `https://digitalzen.cloud/r/circuit`
- (spot check 2–3 others)

Hit "Scrape Again" in Facebook's debugger — it caches aggressively and won't update automatically. You should see the archetype-specific image and title ("I'm The Architect. What's your night mode?").

If the preview still shows the generic `og-image.png`, check:
1. Is the latest Vercel deployment live on the production domain? (The branch `claude/review-digital-zen-PqA3X` generates preview deployments, not production — the owner may need to merge to main)
2. Does `/r/architect` (no .html) return 200? (Should after `vercel.json` cleanUrls lands)
3. Does the returned HTML contain `<meta property="og:image" content="https://digitalzen.cloud/og/architect.png"` and NO `<meta http-equiv="refresh">`?

### Priority 2: Email Capture Worker — Needs Secrets Verified

**The situation:**
- Worker `dz-subscribe` IS deployed at Cloudflare (we confirmed it responds)
- Worker URL in `script.js`: `https://dz-subscribe.helixirin.workers.dev`
- The worker is documented in `worker/SETUP.md` and `worker/shopify-subscribe.js`
- The frontend shows "You're in. Stay tuned." even on error — so email failures are invisible to users
- Emails may not be reaching Shopify (`helixirin.myshopify.com`) if secrets aren't set

**To diagnose:**
1. Go to **Cloudflare Dashboard → Workers & Pages → dz-subscribe → Settings → Variables and Secrets**
2. Verify `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`, and `SHOPIFY_STORE` are all present
3. If any are missing, add them (see `worker/SETUP.md` for the source app: Dev Dashboard App ID 334473822209)
4. To watch live logs: `wrangler tail --name dz-subscribe` then submit a test email on the site
5. Test result in Shopify Admin: `admin.shopify.com/store/helixirin/customers` — should appear tagged `digitalzen, nightmode-<archetype>`

**If secrets are correct but emails still don't arrive:**
The worker uses Shopify OAuth `client_credentials` grant type. If the Dev Dashboard app's access has expired or been revoked, re-auth at `dev.shopify.com/dashboard/153727070/apps/334473822209`.

### Priority 3: Deployment Branch vs Production

Confirm whether the `claude/review-digital-zen-PqA3X` branch auto-deploys to `digitalzen.cloud` (production) or only to a Vercel preview URL. If it's preview-only, the owner needs to merge the branch to the production branch before any of the recent fixes go live.

---

## Architecture Diagram (Quick Reference)

```
User clicks ad
      ↓
digitalzen.cloud (Vercel, static)
      ↓
Quiz → Result → Share button
      ↓
Shared URL: digitalzen.cloud/r/<archetype>
      ↓ (crawlers stop here, read OG tags)
      ↓ (humans redirect to /?r=<archetype>)
Social platform shows archetype OG preview image + title

Email form submit
      ↓
POST → dz-subscribe.helixirin.workers.dev (Cloudflare Worker)
      ↓
Shopify Admin API → creates customer with email_marketing_consent
```

---

## What NOT to Touch

The following are compliance-critical and must not be modified without owner sign-off:
- Quiz question copy, answer options, archetype text, bridge lines
- KORFYR disclosure structure and sponsor attribution
- Consent checkbox (legally required, cannot be removed/reworded)
- Rarity percentages (calibrated, changing affects credibility)
- Email capture endpoint URL (tied to Shopify app credentials)

---

## Useful Commands

```bash
# Check live OG tags at a share URL
curl -s https://digitalzen.cloud/r/architect | grep "og:image\|og:title\|http-equiv"

# Watch email worker logs live
wrangler tail --name dz-subscribe

# Test worker locally
cd worker && wrangler dev shopify-subscribe.js --name dz-subscribe
# Then in another terminal:
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","archetype":"architect"}'

# Quick quiz result test (jump direct to archetype result)
# Just visit: https://digitalzen.cloud/?r=architect
```

---

## Files Changed in This Session (git log)

```
04f80c4  Add vercel.json cleanUrls + wrangler.toml worker deploy docs
f9c02d7  Fix OG crawlers following meta-refresh; fix iPad touch target
2829d41  Fix OG previews: static redirect pages replace undeployed CF Worker
db08e8e  Add shareability and conversion analysis document
03c8652  Overhaul share mechanic: prominent CTA, platform pills, rarity priming
```

The full analysis of additional shareability enhancements is in `SHAREABILITY-ANALYSIS.md`.
