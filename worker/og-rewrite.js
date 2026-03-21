/*
 * Cloudflare Worker: Social Sharing Meta Tag Rewriter + Stats API
 *
 * Routes:
 *   GET  /*                    → OG rewrite for crawlers, passthrough for browsers
 *   POST /api/share            → Increment share_count in KV, return { count: N }
 *   POST /api/result?archetype → Increment archetype:<name> + total in KV
 *   GET  /api/stats            → Return share count, per-archetype counts + percentages
 *
 * KV binding: DZ_STATS
 * Deploy: wrangler deploy og-rewrite.js --name dz-og-rewrite
 * Route:  digitalzen.cloud/* → dz-og-rewrite (Cloudflare Dashboard → Workers Routes)
 */

const ARCHETYPES = {
  architect:  { name: 'The Architect',      tagline: 'Precision',      desc: 'You set the conditions before the night starts.' },
  ghost:      { name: 'The Ghost',           tagline: 'Subtracted',     desc: 'You strip everything away until it shows up on its own.' },
  circuit:    { name: 'The Circuit',         tagline: 'Restless',       desc: "The energy doesn't leave when the day ends — it redirects." },
  twam:       { name: 'The 2AM',             tagline: 'Generative',     desc: "Your best work happens when nobody's watching." },
  minimalist: { name: 'The Minimalist',      tagline: 'Refined',        desc: "You've eliminated everything that doesn't earn its place." },
  operator:   { name: 'The Operator',        tagline: 'Calculated',     desc: 'Controlled chaos. Nothing random about it.' },
  engineer:   { name: 'The Night Engineer',  tagline: 'Exacting',       desc: 'You build things at hours that don\'t exist.' },
  phantom:    { name: 'The Phantom',         tagline: 'Contradictory',  desc: 'Moving through silence. Both at the same time.' },
  builder:    { name: 'The Quiet Builder',   tagline: 'Meditative',     desc: 'No audience. No deadline. No problem.' },
  nocturnal:  { name: 'The Nocturnal',       tagline: 'Untamed',        desc: "Sleep is a suggestion. Making things is the priority." },
};

// Seeded baseline percentages used during cold-start blending (< 500 completions)
const SEEDED_PCT = {
  architect: 14, ghost: 11, circuit: 10, twam: 12, minimalist: 11,
  operator: 10,  engineer: 10, phantom: 9,  builder: 8,  nocturnal: 5,
};

const CRAWLER_UA = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot|Discordbot|iMessagePreview|Applebot|Googlebot|bingbot/i;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://digitalzen.cloud',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function corsResponse(body, status, extra) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...extra },
  });
}

// Atomic KV increment helper
async function kvIncrement(kv, key) {
  const current = await kv.get(key);
  const next = (parseInt(current || '0', 10) || 0) + 1;
  await kv.put(key, String(next));
  return next;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ── CORS preflight ──────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ── POST /api/share — increment share counter ──────────────────────────
    if (path === '/api/share' && request.method === 'POST') {
      if (!env.DZ_STATS) return corsResponse('{"error":"KV not configured"}', 503);
      const count = await kvIncrement(env.DZ_STATS, 'share_count');
      return corsResponse(JSON.stringify({ count }), 200);
    }

    // ── POST /api/result — record archetype completion ─────────────────────
    if (path === '/api/result' && request.method === 'POST') {
      const archetype = url.searchParams.get('archetype');
      if (!archetype || !ARCHETYPES[archetype]) {
        return corsResponse('{"error":"invalid archetype"}', 400);
      }
      if (!env.DZ_STATS) return corsResponse('{"error":"KV not configured"}', 503);
      await Promise.all([
        kvIncrement(env.DZ_STATS, 'total'),
        kvIncrement(env.DZ_STATS, 'archetype:' + archetype),
      ]);
      return corsResponse('{"ok":true}', 200);
    }

    // ── GET /api/stats — return aggregated stats ───────────────────────────
    if (path === '/api/stats' && request.method === 'GET') {
      if (!env.DZ_STATS) return corsResponse('{"error":"KV not configured"}', 503);

      const keys = ['total', 'share_count', ...Object.keys(ARCHETYPES).map(k => 'archetype:' + k)];
      const values = await Promise.all(keys.map(k => env.DZ_STATS.get(k)));

      const kvMap = {};
      keys.forEach((k, i) => { kvMap[k] = parseInt(values[i] || '0', 10) || 0; });

      const total = kvMap['total'];
      const shareCount = kvMap['share_count'];
      const realWeight = Math.min(total / 500, 1);

      const archetypes = {};
      Object.keys(ARCHETYPES).forEach(key => {
        const count = kvMap['archetype:' + key];
        const realPct = total > 0 ? (count / total) * 100 : 0;
        const seededPct = SEEDED_PCT[key] || 10;
        const displayPct = (realPct * realWeight) + (seededPct * (1 - realWeight));
        archetypes[key] = { count, pct: Math.round(displayPct * 10) / 10 };
      });

      return corsResponse(JSON.stringify({ shareCount, total, archetypes }), 200, {
        'Cache-Control': 'no-store',
      });
    }

    // ── OG rewrite for social crawlers ─────────────────────────────────────
    const ua = request.headers.get('user-agent') || '';
    const r = url.searchParams.get('r');

    if (!r || !ARCHETYPES[r] || !CRAWLER_UA.test(ua)) {
      return fetch(request);
    }

    const arch = ARCHETYPES[r];
    const ogImage = `${url.origin}/og/${r}.png`;
    const shareUrl = `${url.origin}/?r=${r}`;

    const originResponse = await fetch(request);
    const html = await originResponse.text();

    const rewritten = html
      .replace(
        /<meta property="og:title"[^>]*>/,
        `<meta property="og:title" content="I'm ${arch.name}. What's your night mode?" />`
      )
      .replace(
        /<meta property="og:description"[^>]*>/,
        `<meta property="og:description" content="${arch.desc} Take the quiz to find yours." />`
      )
      .replace(
        /<meta property="og:image"[^>]*>/,
        `<meta property="og:image" content="${ogImage}" />`
      )
      .replace(
        /<meta property="og:url"[^>]*>/,
        `<meta property="og:url" content="${shareUrl}" />`
      )
      .replace(
        /<meta name="twitter:title"[^>]*>/,
        `<meta name="twitter:title" content="I'm ${arch.name}. What's your night mode?" />`
      )
      .replace(
        /<meta name="twitter:description"[^>]*>/,
        `<meta name="twitter:description" content="${arch.desc}" />`
      )
      .replace(
        /<meta name="twitter:image"[^>]*>/,
        `<meta name="twitter:image" content="${ogImage}" />`
      );

    return new Response(rewritten, {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
};
