# Cowork Browser Tasks — Digital Zen

These tasks require a browser and cannot be automated by Claude Code. Complete them in order after the share enhancements have been deployed.

## 1. Confirm Cloudflare Zone Is Active

- Go to https://dash.cloudflare.com
- Click on `digitalzen.cloud`
- Confirm the zone status shows **Active** (green checkmark)
- If still showing "Pending Nameserver Update", wait and check back — propagation can take up to 24 hours

## 2. Deploy the KV Namespace and og-rewrite Worker

Before the stats API works, the KV namespace must be created and the worker redeployed with it bound.

Run in `worker/` directory:

```bash
# Create KV namespaces
wrangler kv:namespace create DZ_STATS
wrangler kv:namespace create DZ_STATS --preview

# Copy the namespace IDs from output above into wrangler.toml
# Replace <namespace-id> and <preview-namespace-id>

# Deploy the worker
wrangler deploy og-rewrite.js --name dz-og-rewrite --compatibility-date 2024-01-01
```

Then in Cloudflare Dashboard:
- Workers Routes → Add route: `digitalzen.cloud/*` → `dz-og-rewrite`

## 3. Verify OG Worker Is Live on Real Domain

Once the zone is active, run this in a terminal:

```bash
curl -s -H "User-Agent: facebookexternalhit/1.1" "https://digitalzen.cloud/?r=architect" | grep -E "og:title|og:image"
```

Expected: archetype-specific `og:title` and `og:image` tags. If you see the default page meta instead, the worker route is not firing — check Workers Routes in the Cloudflare dashboard.

Also verify the static `/r/` pages return 200 (requires `vercel.json` cleanUrls to be deployed):

```bash
curl -I https://digitalzen.cloud/r/architect
```

Expected: `HTTP/2 200`

## 4. Facebook Sharing Debugger — All 10 Archetypes

Go to: https://developers.facebook.com/tools/debug

Test each URL and confirm the preview shows the correct archetype image and title:

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

For each: confirm the image is 1200×630, not cropped, and the archetype name is legible at small sizes. If Facebook shows a cached old result, click **"Scrape Again"**.

## 5. Twitter/X Card Validator

Go to: https://cards-dev.twitter.com/validator

Test the same 10 URLs. Confirm the card type is `summary_large_image` and the archetype image fills the preview correctly.

## 6. Visual QA — Animated Share Preview (Enhancement 1)

- Complete the quiz on both mobile and desktop
- Confirm the share card animation plays smoothly (~2s) and fades cleanly into the share button
- Confirm it does **not** replay if you scroll away and scroll back (the `.share-preview--played` class prevents it)
- On retake, confirm the preview plays again with the new archetype image

## 7. Visual QA — Mobile Layout (Enhancement 2)

On a real iPhone (preferably iPhone 15 base or similar):

- Navigate to the quiz and complete it for each of the following long-named archetypes: **The Night Engineer**, **The Quiet Builder**, **The Nocturnal**
- Confirm the share button is visible without scrolling immediately after the result appears
- Go to Settings → Display & Text Size → set text to **Larger Text** (accessibility size) and repeat
- If the share button is pushed below the fold at large text sizes, report back to Claude Code with a screenshot for a CSS fix

## 8. Visual QA — WhatsApp Pill (Enhancement 7)

- On a mobile device, confirm the WhatsApp pill appears alongside the other share options
- On desktop, confirm it does **not** appear
- Tap the WhatsApp pill and confirm it opens a WhatsApp share dialog with the correct pre-filled text (archetype name + URL)

## 9. Verify KV Stats Are Incrementing

- Go to https://dash.cloudflare.com → Workers & Pages → KV → **DZ_STATS**
- Complete the quiz and reach a result screen
- Refresh the KV namespace view and confirm `total` and `archetype:<name>` incremented
- Share a result using the share button
- Confirm `share_count` incremented

Also verify via API:
```bash
curl https://dz-og-rewrite.helixirin.workers.dev/api/stats
```

Expected: JSON with `shareCount`, `total`, and per-archetype `count` + `pct` values.

## 10. Verify Live Stats Display

- Complete the quiz and reach a result screen
- Confirm the frequency percentage shown is pulling from live KV data (not hardcoded)
- If total completions are below 500, the displayed percentage should be a **blend** — this is expected
- Once total > 100, confirm **"Based on X,XXX results"** appears beneath the percentage
- Once share count > 500, confirm the share count line appears: **"X,000+ people have shared their result."**

## 11. Verify Contextual Share Copy (Enhancement 3)

Test three scenarios:

**Common result (pct > 20%):** Get a result with a high percentage. Tap the main Share button and confirm the share text says `"X% of people get this. What's yours?"` (not "Only X%")

**Rare result (pct ≤ 8%):** Get a rarer archetype. Share text should say `"I got one of the rarer results — [Archetype]. Only X% of people get this. Find yours."`

**Referred result (different from friend):** Visit `/?r=architect`, complete quiz, get a different result. Share text should reference the friend's archetype.

## 12. Verify Smooth Scroll (Enhancement 6)

- On a device where the share button is below the fold on initial load
- Complete the quiz
- After the archetype name animates in (~1.2s), the page should smoothly scroll to bring the share button into view
- Confirm this only scrolls if the button is actually below the fold (no unnecessary scroll on tall screens)

## 13. Verify Post-Share Nudge (Enhancement 5)

- Complete the quiz and tap **Share Your Result** (main button)
- After ~1 second, confirm a nudge line appears: **"Now send it to someone you think would get a different result."**
- Confirm it fades out after ~7 seconds
