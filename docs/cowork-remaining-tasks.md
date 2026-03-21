# Remaining Tasks for Claude Cowork
**Branch:** `claude/review-digital-zen-PqA3X`

All code is complete. These are the two remaining tasks that require a terminal with wrangler credentials and outbound network access.

---

## Task 1 — Redeploy the og-rewrite worker

The KV namespace ID is now in `wrangler.toml` (`2edbb5a77cf6433db46a5b2dee4e5674`). Redeploy so the wrangler.toml binding is canonical (currently the binding only exists via the Cloudflare dashboard).

```bash
cd worker
wrangler deploy og-rewrite.js --name dz-og-rewrite --compatibility-date 2024-01-01
```

Expected output: `✅ Deployed dz-og-rewrite`

Then verify the stats API responds with KV data (not the `{"error":"KV not configured"}` fallback):

```bash
curl -X POST "https://dz-og-rewrite.helixirin.workers.dev/api/result?archetype=architect"
# Expected: {"ok":true}

curl "https://dz-og-rewrite.helixirin.workers.dev/api/stats"
# Expected: {"shareCount":0,"total":1,"archetypes":{"architect":{"count":1,"pct":14},...}}
# If you get {"error":"KV not configured"}: the binding didn't take — check Cloudflare dashboard
# Workers & Pages → dz-og-rewrite → Settings → Variables and Secrets → confirm DZ_STATS is listed
```

---

## Task 2 — Run OG tag verification for all 10 archetypes (Enhancement 8)

Run against the worker subdomain first (always available), then against the live domain once the Cloudflare zone is confirmed active.

**Worker subdomain (run now):**

```bash
for archetype in architect ghost circuit twam minimalist operator engineer phantom builder nocturnal; do
  echo "=== $archetype ==="
  curl -s -H "User-Agent: facebookexternalhit/1.1" \
    "https://dz-og-rewrite.helixirin.workers.dev/?r=$archetype" \
    | grep -E "og:title|og:image|og:description"
done
```

**Expected output for each archetype** — three matching lines like:
```
=== architect ===
<meta property="og:title" content="I'm The Architect. What's your night mode?"/>
<meta property="og:image" content="https://digitalzen.cloud/og/architect.png"/>
<meta property="og:description" content="You set the conditions before the night starts. Only 14% of people get this result."/>
```

If any archetype shows the *default* page meta (`What's Your Night Mode?` and `/og-image.png` instead of the archetype-specific values), the HTMLRewriter isn't matching that key — check the `ARCHETYPES` object in `og-rewrite.js` for a key mismatch.

**Live domain (run after zone is confirmed active):**

```bash
for archetype in architect ghost circuit twam minimalist operator engineer phantom builder nocturnal; do
  echo "=== $archetype ==="
  curl -s -H "User-Agent: facebookexternalhit/1.1" \
    "https://digitalzen.cloud/?r=$archetype" \
    | grep -E "og:title|og:image|og:description"
done
```

Same expected output. If you get default meta here but correct meta on the worker subdomain, the Workers Route (`digitalzen.cloud/*` → `dz-og-rewrite`) is not firing — check Cloudflare Dashboard → Workers & Pages → `dz-og-rewrite` → Routes.

---

Once both tasks are done, hand off `docs/cowork-browser-tasks.md` to a human for the visual QA steps that require a real browser and device.
