# Cowork Browser Tasks — Digital Zen

These tasks require a browser and cannot be automated by Claude Code. Complete them in order after the share enhancements have been deployed.

## 1. Confirm Cloudflare Zone Is Active

- Go to https://dash.cloudflare.com
- Click on `digitalzen.cloud`
- Confirm the zone status shows **Active** (green checkmark)
- If still showing "Pending Nameserver Update", wait and check back — propagation can take up to 24 hours

## 2. Verify OG Worker Is Live on Real Domain

Once the zone is active, run this in a terminal:

```bash
curl -s -H "User-Agent: facebookexternalhit/1.1" "https://digitalzen.cloud/?r=architect" | grep -E "og:title|og:image"
```

Expected: archetype-specific `og:title` and `og:image` tags. If you see the default page meta instead, the worker route is not firing — check Workers Routes in the Cloudflare dashboard.

## 3. Facebook Sharing Debugger — All 10 Archetypes

Go to: https://developers.facebook.com/tools/debug

Test each URL and confirm the preview shows the correct archetype image and title:

- https://digitalzen.cloud/?r=architect
- https://digitalzen.cloud/?r=ghost
- https://digitalzen.cloud/?r=circuit
- https://digitalzen.cloud/?r=twam
- https://digitalzen.cloud/?r=minimalist
- https://digitalzen.cloud/?r=operator
- https://digitalzen.cloud/?r=engineer
- https://digitalzen.cloud/?r=phantom
- https://digitalzen.cloud/?r=builder
- https://digitalzen.cloud/?r=nocturnal

For each: confirm the image is 1200×630, not cropped, and the archetype name is legible at small sizes. If Facebook shows a cached old result, click **"Scrape Again"**.

## 4. Twitter/X Card Validator

Go to: https://cards-dev.twitter.com/validator

Test the same 10 URLs. Confirm the card type is `summary_large_image` and the archetype image fills the preview correctly.

## 5. Visual QA — Mobile Layout (Enhancement 2)

On a real iPhone (preferably iPhone 15 base or similar):

- Navigate to the quiz and complete it for each of the following long-named archetypes: **The Night Engineer**, **The Quiet Builder**, **The Nocturnal**
- Confirm the share button is visible without scrolling immediately after the result appears
- Go to Settings → Display & Text Size → set text to **Larger Text** (accessibility size) and repeat
- If the share button is pushed below the fold at large text sizes, report back to Claude Code with a screenshot for a CSS fix

## 6. Visual QA — Animated Share Preview (Enhancement 1)

- Complete the quiz on both mobile and desktop
- Confirm the share card animation plays smoothly and fades cleanly into the share button
- Confirm it does **not** replay if you scroll away and scroll back
- On retake, confirm the preview plays again with the new archetype image

## 7. Visual QA — WhatsApp Pill (Enhancement 7)

- On a mobile device, confirm the WhatsApp pill appears alongside the other share options
- On desktop, confirm it does **not** appear
- Tap the WhatsApp pill and confirm it opens a WhatsApp share dialog with the correct pre-filled text

## 8. Verify KV Share Count Is Incrementing

- Go to https://dash.cloudflare.com → Workers & Pages → KV → **DZ_STATS**
- Share a result using the share button on the live site
- Refresh the KV namespace view and confirm `share_count` incremented
- Also confirm the relevant `archetype:<name>` key incremented after viewing a result

## 9. Verify Live Stats Display

- Complete the quiz and reach a result screen
- Confirm the frequency percentage shown is pulling from live KV data (not hardcoded)
- If total completions are below 500, the displayed percentage should be a **blend** — this is expected
- Once total > 100, confirm **"Based on X,XXX results"** appears beneath the percentage
