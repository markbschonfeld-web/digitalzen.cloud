# Digital Zen — Claude Cowork Brief
**Branch:** `claude/review-digital-zen-PqA3X`
**Repo:** `markbschonfeld-web/digitalzen.cloud`
**Production URL:** `https://digitalzen.cloud`
**Written by:** Claude Code session `01KYxLwzRebCpa4oXjqVppNx`

---

## What This Project Is

`digitalzen.cloud` is a personality quiz — "What's Your Night Mode?" — that serves as a compliance-safe bridge between paid social ads and **KORFYR**, a cannabis vaporizer brand. The quiz routes users through 8 multiple-choice questions, scores them across 4 traits (precision, stillness, kinetic, generative), and assigns one of 10 archetypes. The KORFYR brand is revealed only on the result screen, after the user has opted in emotionally. There is no cannabis copy anywhere until that point.

**Stack:** Vanilla HTML/CSS/JS. No framework, no build step. Deployed on Vercel. Two Cloudflare Workers (email capture, OG rewriting + stats API). DNS through Cloudflare.

---

## File Map — What Does What

```
index.html              All screens in one file (intro, 8 quiz screens, analyzing, result, splash)
script.js               Quiz engine, scoring, result rendering, share logic, stats API calls
style.css               All styling, animations, responsive rules
vercel.json             { "cleanUrls": true } — allows /r/architect without .html suffix
favicon.svg             Branded favicon

og/                     10 archetype OG images (1200×630 PNG) — architect.png, ghost.png, etc.
r/                      10 static HTML pages for social sharing (one per archetype)
                        Each has hardcoded OG meta tags + JS redirect to /?r=<key>
                        Crawlers read the tags; humans are redirected instantly

worker/
  og-rewrite.js         Cloudflare Worker — two jobs:
                          1. OG meta tag rewriting for crawler requests (GET /?r=<key>)
                          2. Stats API backed by KV (POST /api/share, POST /api/result, GET /api/stats)
  shopify-subscribe.js  Cloudflare Worker — email capture → Shopify customer creation
  wrangler.toml         Deploy config for both workers, KV namespace setup instructions
  SETUP.md              Email worker setup docs (Shopify app credentials)
```

---

## The 10 Archetypes

| URL key | Display name | Seeded rarity |
|---|---|---|
| `architect` | The Architect | 14% |
| `ghost` | The Ghost | 11% |
| `circuit` | The Circuit | 10% |
| `twam` | The 2AM | 12% |
| `minimalist` | The Minimalist | 11% |
| `operator` | The Operator | 10% |
| `engineer` | The Night Engineer | 10% |
| `phantom` | The Phantom | 9% |
| `builder` | The Quiet Builder | 8% |
| `nocturnal` | The Nocturnal | 5% |

The seeded rarity values are **cold-start baselines only** — they appear in `script.js` archetype data as the `rarity` string (e.g. `'Only 14% of people get this result.'`) and are also duplicated in `SEEDED_PCT` in `script.js` and in `SEEDED_PCT` inside `og-rewrite.js`. The live stats system is intentionally designed to drift away from them over time using this blend formula:

```
displayPct = (realPct * realWeight) + (seededPct * (1 - realWeight))
realWeight = Math.min(totalCompletions / 500, 1)
```

At 0 completions: 100% seeded. At 500+ completions: 100% real. Do not change these values without owner sign-off — they were calibrated for credibility at launch.

---

## How the Share Flow Works End-to-End

1. User completes quiz → `renderResult(archKey)` is called in `script.js`
2. `renderResult` fires `POST /api/result?archetype=<key>` to the stats worker (fire-and-forget, increments KV counters)
3. The rarity slot machine animation runs, then calls `fetchStats()` to get the live blended percentage from `/api/stats` and updates the displayed rarity text
4. If total completions > 100, a "Based on X results" badge appears beneath the rarity stat
5. If share count ≥ 500, an "X,000+ people have shared" counter appears
6. Share preview card animates in (shows archetype OG image + title for ~2s, then fades out)
7. After 1.2s, if the share button is below the fold, page smooth-scrolls to bring it into view
8. User taps **Share Your Result** → `handleShare()` fires:
   - Increments `share_count` via `POST /api/share`
   - Builds contextual share text based on rarity tier (rare/common/referred)
   - Uses `navigator.share` on mobile if available, otherwise clipboard copy
9. Platform pills (X, Facebook, WhatsApp on mobile, Copy Link) each have fresh URLs pointing to `https://digitalzen.cloud/r/<key>` — these are set by `renderResult` on every render, so retake resets them correctly

---

## Infrastructure State — What's Deployed vs What Isn't

### ✅ Deployed and working
- **Vercel** — site is live, branch deploys as preview, main branch is production
- **`dz-subscribe`** worker — deployed at `dz-subscribe.helixirin.workers.dev`, handles email → Shopify

### ⚠️ Deployed but needs KV namespace
- **`dz-og-rewrite`** worker — the code is deployed at `dz-og-rewrite.helixirin.workers.dev` but the **KV namespace `DZ_STATS` does not exist yet**. All `/api/stats` and `/api/share` calls return `{"error":"KV not configured"}` (503). The frontend handles this gracefully — it silently falls back to seeded values — so nothing breaks for users, but nothing is being tracked either.

### ⚠️ DNS / Cloudflare zone status unknown
- The Cloudflare zone for `digitalzen.cloud` may still be pending propagation. The `dz-og-rewrite` worker route (`digitalzen.cloud/*`) is only active when the zone is live and DNS is proxied (orange cloud). Until then, crawler OG rewriting only works via the static `/r/*.html` pages.

---

## What Cowork Needs to Do — In Order

### 1. Check if the Cloudflare zone is active

Go to https://dash.cloudflare.com → click `digitalzen.cloud` → confirm zone status is **Active** (green checkmark). If it says "Pending Nameserver Update", propagation isn't complete — the worker route won't fire until it is. Everything in the `/r/` static pages still works independently.

---

### 2. Set up KV and redeploy the og-rewrite worker

This is the only piece of infrastructure that requires terminal work. Everything else is already in the code.

```bash
cd worker

# Step 1 — create the namespaces
wrangler kv:namespace create DZ_STATS
wrangler kv:namespace create DZ_STATS --preview
```

The output will look like:
```
{ binding: 'DZ_STATS', id: 'abc123...' }
{ binding: 'DZ_STATS', preview_id: 'def456...' }
```

```bash
# Step 2 — open wrangler.toml and paste both IDs into the [[dz-og-rewrite.kv_namespaces]] block
# Replace <namespace-id> with the id value
# Replace <preview-namespace-id> with the preview_id value

# Step 3 — redeploy with the KV binding
wrangler deploy og-rewrite.js --name dz-og-rewrite --compatibility-date 2024-01-01
```

**Verify it worked:**
```bash
curl -X POST "https://dz-og-rewrite.helixirin.workers.dev/api/result?archetype=architect"
# Expected: {"ok":true}
# If you get {"error":"KV not configured"}: namespace IDs weren't saved correctly — recheck wrangler.toml and redeploy

curl "https://dz-og-rewrite.helixirin.workers.dev/api/stats"
# Expected: {"shareCount":0,"total":1,"archetypes":{"architect":{"count":1,"pct":14},...}}
```

---

### 3. Confirm this branch is live on production

The branch `claude/review-digital-zen-PqA3X` creates Vercel preview deployments. Confirm `digitalzen.cloud` (production) is serving this branch — check the Vercel dashboard or look at the `digitalzen-cloud.vercel.app` deployment link. If not yet merged to the production branch, the owner needs to do that before domain-level tests will work.

---

### 4. Verify the Cloudflare worker route is set

In Cloudflare Dashboard → Workers & Pages → `dz-og-rewrite` → Routes, confirm `digitalzen.cloud/*` is listed. If not, add it. This requires the zone to be active (Step 1).

---

### 5. Verify email worker secrets

The email capture shows "You're in. Stay tuned." even on failure, so broken secrets are invisible to users. Check:

- Cloudflare Dashboard → Workers & Pages → `dz-subscribe` → Settings → Variables and Secrets
- All three must be present: `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`, `SHOPIFY_STORE`
- If any are missing, see `worker/SETUP.md` (Shopify Dev Dashboard App ID: 334473822209)

To test end-to-end:
```bash
wrangler tail --name dz-subscribe
# Then submit a real email on the live site and watch the log
```

Then check Shopify Admin (`admin.shopify.com/store/helixirin/customers`) — the customer should appear tagged `digitalzen, nightmode-<archetype>`.

---

## Browser QA — Required After Deployment

These must be done in a real browser after Steps 1–4 above are confirmed.

### OG previews

**Facebook Sharing Debugger** (https://developers.facebook.com/tools/debug) — test all 10, click "Scrape Again" on each:
```
https://digitalzen.cloud/r/architect
https://digitalzen.cloud/r/ghost
https://digitalzen.cloud/r/circuit
https://digitalzen.cloud/r/twam
https://digitalzen.cloud/r/minimalist
https://digitalzen.cloud/r/operator
https://digitalzen.cloud/r/engineer
https://digitalzen.cloud/r/phantom
https://digitalzen.cloud/r/builder
https://digitalzen.cloud/r/nocturnal
```
Each should show: archetype-specific OG image (1200×630), correct title ("I'm The Architect. What's your night mode?"), correct description. If any show `og-image.png` (the default), the worker route isn't firing.

**Twitter/X Card Validator** (https://cards-dev.twitter.com/validator) — test the same 10. Card type should be `summary_large_image`.

**Curl check** (once zone is active):
```bash
curl -s -H "User-Agent: facebookexternalhit/1.1" "https://digitalzen.cloud/?r=architect" | grep -E "og:title|og:image"
curl -I "https://digitalzen.cloud/r/architect"   # must return HTTP/2 200
```

### Stats and live display

- Complete the quiz and reach a result screen
- Open DevTools Network tab — confirm `POST /api/result?archetype=<key>` returns 200
- Confirm `GET /api/stats` returns JSON (not 503)
- The displayed rarity % should update after the slot machine animation settles
- Below 500 completions the % is a blend — this is expected and correct
- Once total > 100: "Based on X results" badge appears beneath the rarity stat
- Once share count ≥ 500: "X,000+ people have shared" appears above the share button

Check KV directly: Cloudflare Dashboard → Workers & Pages → KV → `DZ_STATS` — after completing a quiz you should see `total` and `archetype:<key>` keys increment.

### Share mechanic

**Share preview card:** After result loads, a mini card showing the archetype's OG image and title should animate in for ~2 seconds, then fade out. It should not replay if you scroll away and back. On retake it should play again with the new archetype.

**Smooth scroll:** On a phone-sized viewport, after the archetype name animates in (~1.2s), the page should smoothly scroll to make the share button visible. On a large screen where it's already visible, no scroll should happen.

**WhatsApp pill:** On mobile (Android/iPhone) a WhatsApp pill should appear alongside X, Facebook, Copy Link. On desktop it should be hidden. Tapping it should open WhatsApp with pre-filled text including the archetype name and share URL.

**Contextual share copy** — tap the main Share Your Result button in three scenarios:
- Rare archetype (pct ≤ 8%): text should say "I got one of the rarer results — [Archetype]. Only X% of people get this. Find yours."
- Common archetype (pct > 20%): text should say "My night mode is [Archetype]. X% of people get this. What's yours?"
- Referred visit (visit `/?r=architect`, complete quiz, get a different archetype): text should name the friend's archetype

**Post-share nudge:** After sharing, a line should appear (~1s delay) reading "Now send it to someone you think would get a different result." It fades after ~7s.

**Retake:** Click "Take it again" and complete to a different archetype. Confirm the share button's shimmer animation restarts, all pill URLs point to the new archetype's `/r/` page, and the share preview card plays with the new image.

---

## What Must Not Be Changed Without Owner Sign-Off

- All quiz copy: questions, answer options, archetype names, body paragraphs, insight quotes, bridge lines
- KORFYR section copy and structure
- The consent checkbox — it is legally required and cannot be removed or reworded
- The email capture endpoint URL (`dz-subscribe.helixirin.workers.dev`) — tied to Shopify app credentials
- The seeded rarity values (`SEEDED_PCT` in `script.js` and `og-rewrite.js`) — calibrated for launch credibility

---

## Quick Reference

```bash
# Watch email worker logs live
wrangler tail --name dz-subscribe

# Watch OG/stats worker logs live
wrangler tail --name dz-og-rewrite

# Test stats API
curl "https://dz-og-rewrite.helixirin.workers.dev/api/stats"

# Test OG rewrite on worker subdomain (before zone propagates)
curl -s -H "User-Agent: facebookexternalhit/1.1" \
  "https://dz-og-rewrite.helixirin.workers.dev/?r=architect" | grep -E "og:title|og:image"

# Jump to a specific result for testing
https://digitalzen.cloud/?r=architect
```
