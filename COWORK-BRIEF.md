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
- `script.js` — quiz engine, scoring, sharing, email capture, canvas animations
- `style.css` — all styling and keyframe animations
- `og/*.png` — 10 archetype-specific OG images (1200×630 PNG)
- `r/*.html` — 10 static OG redirect pages (one per archetype)
- `worker/shopify-subscribe.js` — Cloudflare Worker for email → Shopify
- `worker/og-rewrite.js` — Cloudflare Worker for OG rewriting + stats API
- `worker/wrangler.toml` — deploy commands and KV namespace setup for both workers

---

## What's Been Done (Two Sessions — You Missed Both)

### Session 1 — Share mechanic overhaul

- **Share button redesigned** — full-width, shimmer animation, outer ping-ring pulse, `touch-action: manipulation`, iPad/iOS touch target fix
- **Rarity stat moved above share button** — "Only X% get this result" primes the share impulse before the CTA
- **Platform share pills added** — X (Twitter intent), Facebook (sharer), Copy Link with inline "Copied!" feedback
- **Post-share `.shared` state** — animations settle after user acts; resets on retake
- **`og:image:type="image/png"`** added to HTML head for LinkedIn crawler compatibility
- **Static OG redirect pages** created at `/r/<archetype>.html` for all 10 archetypes — each has hardcoded per-archetype OG/Twitter meta tags and a JS redirect to `/?r=<key>`. Crawlers read the static tags; humans are redirected instantly. The `<meta http-equiv="refresh">` tag was explicitly removed because Facebook and LinkedIn crawlers follow it, defeating the purpose.
- **Share URLs updated** in `script.js` to point to `/r/<key>` rather than `/?r=<key>`
- **`vercel.json`** added with `cleanUrls: true` — without this, Vercel 404s on `/r/circuit` (no `.html`)

### Session 2 — Share enhancements 1–9

- **`og-rewrite.js`** — upgraded from regex string-replace to HTMLRewriter streaming API; added VERCEL_ORIGIN bypass to prevent infinite fetch loops; added KV stats API (POST /api/share, POST /api/result, GET /api/stats)
- **`wrangler.toml`** — KV namespace setup steps documented
- **`index.html`** — animated share preview mockup card, rarity basis badge ("Based on X results"), live share count element, WhatsApp pill
- **`style.css`** — share preview animation, mobile layout tightening (share CTA visible without scroll on ≤600px), share count + rarity basis styles, WhatsApp hover accent
- **`script.js`** — `fetchStats()` with single-fetch cache; fires `/api/result` on result render; contextual share copy variants (rare/common/referred); smooth scroll to share at 1.2s; WhatsApp pill URL set per render; post-share nudge updated; share counter fires on all pill clicks

---

## What Cowork Needs to Do — In Order

### Step 1: Confirm Cloudflare Zone Is Active

- Go to https://dash.cloudflare.com → click `digitalzen.cloud`
- Confirm zone status shows **Active** (green checkmark)
- If still showing "Pending Nameserver Update", wait — propagation can take up to 24 hours
- Nothing below can be verified until this is active

---

### Step 2: Set Up KV Namespace and Deploy og-rewrite Worker

The stats API code is ready but the KV namespace doesn't exist yet. Without this, `/api/stats` and `/api/share` return 503 and the frontend silently falls back to seeded values — nothing breaks, but nothing is tracked.

```bash
cd worker

# Create the namespaces
wrangler kv:namespace create DZ_STATS
wrangler kv:namespace create DZ_STATS --preview

# Copy the two namespace IDs from the output above into wrangler.toml
# Replace <namespace-id> and <preview-namespace-id> in the [[dz-og-rewrite.kv_namespaces]] block

# Deploy the worker with the KV binding
wrangler deploy og-rewrite.js --name dz-og-rewrite --compatibility-date 2024-01-01
```

Then in Cloudflare Dashboard:
- Workers & Pages → dz-og-rewrite → Routes → confirm `digitalzen.cloud/*` is listed
- If the route is missing, add it: Workers Routes → `digitalzen.cloud/*` → `dz-og-rewrite`
- (Requires DNS A record to be proxied through Cloudflare — orange cloud)

**Verify KV is working:**
```bash
curl -X POST https://dz-og-rewrite.helixirin.workers.dev/api/result?archetype=architect
# Expected: {"ok":true}

curl https://dz-og-rewrite.helixirin.workers.dev/api/stats
# Expected: JSON with shareCount, total, archetypes{}
```

If you get `{"error":"KV not configured"}` — namespace IDs weren't saved in wrangler.toml or the deploy didn't pick them up. Re-check wrangler.toml and redeploy.

---

### Step 3: Confirm Branch Is Deployed to Production

The branch `claude/review-digital-zen-PqA3X` generates Vercel preview deployments, not production. Confirm whether `digitalzen.cloud` is serving this branch or an older one. If preview-only, the owner needs to merge to the production branch before any fixes go live. None of the domain-level tests below will work until this is resolved.

---

### Step 4: Verify OG Worker on Live Domain

```bash
curl -s -H "User-Agent: facebookexternalhit/1.1" "https://digitalzen.cloud/?r=architect" | grep -E "og:title|og:image"
```

Expected: archetype-specific `og:title` and `og:image`. If you see the default page meta, the worker route isn't firing — check Workers Routes in Cloudflare dashboard.

Also verify static `/r/` pages return 200:
```bash
curl -I https://digitalzen.cloud/r/architect
# Expected: HTTP/2 200
```

If 404, the `vercel.json` cleanUrls change isn't deployed to production yet.

---

### Step 5: Facebook Sharing Debugger — All 10 Archetypes

Go to: https://developers.facebook.com/tools/debug

Test each URL — click **"Scrape Again"** for each (Facebook caches aggressively):

- https://digitalzen.cloud/r/architect
- https://digitalzen.cloud/r/ghost
- https://digitalzen.cloud/r/circuit
- https://digitalzen.cloud/r/twam
- https://digitalzen.cloud/r/minimalist
- https://digitalzen.cloud/r/operator
- https://digitalzen.cloud/r/engineer
- https://digitalzen.cloud/r/phantom
- https://digitalzen.cloud/r/builder
- https://digitalzen.cloud/r/nocturnal

For each: confirm the archetype-specific image (1200×630, not cropped), correct title ("I'm The Architect. What's your night mode?"), and correct description. If any show the generic `og-image.png`, the worker route isn't firing for that URL.

---

### Step 6: Twitter/X Card Validator

Go to: https://cards-dev.twitter.com/validator

Test the same 10 URLs. Confirm card type is `summary_large_image` and the archetype image fills the preview correctly.

---

### Step 7: Email Capture Worker — Verify Secrets

The frontend shows "You're in. Stay tuned." even on failure, so email errors are invisible. Emails may not be reaching Shopify if secrets aren't set.

1. Go to Cloudflare Dashboard → Workers & Pages → **dz-subscribe** → Settings → Variables and Secrets
2. Verify `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`, and `SHOPIFY_STORE` are all present
3. If any are missing, see `worker/SETUP.md` (Dev Dashboard App ID 334473822209)
4. Watch live logs: `wrangler tail --name dz-subscribe`, then submit a test email on the site
5. Check Shopify Admin: `admin.shopify.com/store/helixirin/customers` — new customer should appear tagged `digitalzen, nightmode-<archetype>`

If secrets are correct but emails still don't arrive: the worker uses Shopify OAuth `client_credentials`. If the Dev Dashboard app access has expired, re-auth at `dev.shopify.com/dashboard/153727070/apps/334473822209`.

---

### Step 8: Verify KV Stats Are Incrementing

- Cloudflare Dashboard → Workers & Pages → KV → **DZ_STATS**
- Complete the quiz and reach a result screen
- Refresh KV namespace view — confirm `total` and `archetype:<name>` incremented
- Share using the share button — confirm `share_count` incremented

---

### Step 9: Verify Live Stats Display in Browser

- Complete the quiz and reach a result screen
- Confirm the rarity percentage is live from KV (not hardcoded) — below 500 completions it's a blend, which is expected
- Once total > 100: confirm **"Based on X,XXX results"** appears beneath the percentage
- Once share count > 500: confirm **"X,000+ people have shared their result."** appears

---

### Step 10: Visual QA — Animated Share Preview

- Complete the quiz on both mobile and desktop
- Confirm the share card preview animates in (~2s) then fades cleanly into the share button
- Confirm it does **not** replay if you scroll away and back (`.share-preview--played` prevents it)
- On retake: confirm it plays again with the new archetype's image

---

### Step 11: Visual QA — Mobile Layout

On a real iPhone (iPhone 15 base or similar):

- Complete the quiz for the longest-named archetypes: **The Night Engineer**, **The Quiet Builder**, **The Nocturnal**
- Confirm the share button is visible without scrolling immediately after the result appears
- Go to Settings → Display & Text Size → **Larger Text** (accessibility size) → repeat
- If the share button is pushed below the fold at large text sizes, screenshot and report back to Claude Code for a CSS fix

---

### Step 12: Visual QA — WhatsApp Pill

- Mobile: confirm the WhatsApp pill appears alongside X, Facebook, and Copy Link
- Desktop: confirm it does **not** appear
- Tap it: confirm WhatsApp opens with correct pre-filled text (archetype name + URL)

---

### Step 13: Verify Contextual Share Copy

Test three scenarios by tapping the main **Share Your Result** button:

- **Common result (pct > 20%):** share text should say `"X% of people get this. What's yours?"` (not "Only X%")
- **Rare result (pct ≤ 8%):** share text should say `"I got one of the rarer results — [Archetype]. Only X% of people get this. Find yours."`
- **Referred result:** visit `/?r=architect`, complete quiz, get a different archetype → share text should reference the friend's archetype name

---

### Step 14: Verify Smooth Scroll

- On a device where the share button is below the fold on result load
- After the archetype name animates in (~1.2s), the page should smoothly scroll to bring the share button into view
- On a tall screen where the button is already visible: confirm no scroll happens

---

### Step 15: Verify Post-Share Nudge

- Tap **Share Your Result**
- After ~1 second: confirm nudge appears — **"Now send it to someone you think would get a different result."**
- Confirm it fades out after ~7 seconds

---

## Architecture Diagram

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

Result screen load
      ↓
POST dz-og-rewrite.helixirin.workers.dev/api/result?archetype=<key>  → KV increment
GET  dz-og-rewrite.helixirin.workers.dev/api/stats                   → blended % display

Share button tap
      ↓
POST dz-og-rewrite.helixirin.workers.dev/api/share  → KV increment share_count

Email form submit
      ↓
POST dz-subscribe.helixirin.workers.dev
      ↓
Shopify Admin API → customer with email_marketing_consent
```

---

## What NOT to Touch

Compliance-critical — do not modify without owner sign-off:
- Quiz question copy, answer options, archetype text, bridge lines
- KORFYR disclosure structure and sponsor attribution
- Consent checkbox (legally required, cannot be removed/reworded)
- Rarity percentages in the archetype data (calibrated)
- Email capture endpoint URL (tied to Shopify app credentials)

---

## Useful Commands

```bash
# Check live OG tags at a share URL
curl -s -H "User-Agent: facebookexternalhit/1.1" https://digitalzen.cloud/r/architect | grep -E "og:title|og:image"

# Check static /r/ page returns 200
curl -I https://digitalzen.cloud/r/architect

# Watch email worker logs live
wrangler tail --name dz-subscribe

# Watch OG/stats worker logs live
wrangler tail --name dz-og-rewrite

# Test stats API directly
curl https://dz-og-rewrite.helixirin.workers.dev/api/stats

# Test email worker locally
cd worker && wrangler dev shopify-subscribe.js --name dz-subscribe
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","archetype":"architect"}'

# Jump to a specific archetype result for testing
# Visit: https://digitalzen.cloud/?r=architect
```
