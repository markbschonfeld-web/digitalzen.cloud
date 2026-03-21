/**
 * Cloudflare Worker: Social Sharing OG Meta Tag Rewriter + Stats API
 * digitalzen.cloud
 *
 * Intercepts requests from social media crawlers when a ?r=<archetype> param
 * is present, then injects per-archetype OG/Twitter meta tags using
 * Cloudflare's HTMLRewriter streaming API.
 *
 * Also exposes a stats API backed by Cloudflare KV (DZ_STATS binding):
 *   POST /api/share            → increment share_count, return { count: N }
 *   POST /api/result?archetype → increment completion + archetype count
 *   GET  /api/stats            → blended live/seeded percentages + share count
 *
 * Regular browser visits pass through untouched.
 *
 * DEPLOY:
 *   cd worker
 *   # 1. Create KV namespace:
 *   #    wrangler kv:namespace create DZ_STATS
 *   #    wrangler kv:namespace create DZ_STATS --preview
 *   #    Then fill in namespace IDs in wrangler.toml
 *   wrangler deploy og-rewrite.js --name dz-og-rewrite --compatibility-date 2024-01-01
 *
 * ROUTE (Cloudflare Dashboard → Workers & Pages → dz-og-rewrite → Routes):
 *   digitalzen.cloud/*
 *   (DNS must be proxied through Cloudflare — orange cloud on the A record)
 */

const ARCHETYPES = {
  architect:  { name: 'The Architect',     title: "I'm The Architect. What's your night mode?",     desc: 'You set the conditions before the night starts. Only 14% of people get this result.' },
  ghost:      { name: 'The Ghost',          title: "I'm The Ghost. What's your night mode?",          desc: 'You strip everything away until it shows up on its own. Only 11% of people get this result.' },
  circuit:    { name: 'The Circuit',        title: "I'm The Circuit. What's your night mode?",        desc: "The energy doesn't leave when the day ends — it redirects. Take the quiz." },
  twam:       { name: 'The 2AM',            title: "I'm The 2AM. What's your night mode?",            desc: "Your best work happens when nobody's watching. Take the quiz." },
  minimalist: { name: 'The Minimalist',     title: "I'm The Minimalist. What's your night mode?",     desc: "You've eliminated everything that doesn't earn its place. Only 11% of people get this result." },
  operator:   { name: 'The Operator',       title: "I'm The Operator. What's your night mode?",       desc: 'Controlled chaos. Nothing random about it. Take the quiz.' },
  engineer:   { name: 'The Night Engineer', title: "I'm The Night Engineer. What's your night mode?", desc: "You build things at hours that don't exist. Take the quiz." },
  phantom:    { name: 'The Phantom',        title: "I'm The Phantom. What's your night mode?",        desc: 'Moving through silence. Both at the same time. Take the quiz.' },
  builder:    { name: 'The Quiet Builder',  title: "I'm The Quiet Builder. What's your night mode?",  desc: 'No audience. No deadline. No problem. Take the quiz.' },
  nocturnal:  { name: 'The Nocturnal',      title: "I'm The Nocturnal. What's your night mode?",      desc: 'Sleep is a suggestion. Making things is the priority. Take the quiz.' },
};

const SEEDED_PCT = {
  architect: 14, ghost: 11, circuit: 10, twam: 12, minimalist: 11,
  operator: 10,  engineer: 10, phantom: 9,  builder: 8,  nocturnal: 5,
};

const CRAWLER_UA = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|Discordbot|TelegramBot|iMessage|AppleBot|Pinterest|Snapchat|redditbot|vkShare|W3C_Validator/i;

const VERCEL_ORIGIN = 'https://digitalzen-cloud.vercel.app';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://digitalzen.cloud',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function corsJson(body, status, extra) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...(extra || {}) },
  });
}

async function kvIncrement(kv, key) {
  const current = await kv.get(key);
  const next = (parseInt(current || '0', 10) || 0) + 1;
  await kv.put(key, String(next));
  return next;
}

export default {
  async fetch(request, env, ctx) {
    const url  = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (path === '/api/share' && request.method === 'POST') {
      if (!env.DZ_STATS) return corsJson({ error: 'KV not configured' }, 503);
      const count = await kvIncrement(env.DZ_STATS, 'share_count');
      return corsJson({ count }, 200);
    }

    if (path === '/api/result' && request.method === 'POST') {
      const archetype = url.searchParams.get('archetype');
      if (!archetype || !ARCHETYPES[archetype]) return corsJson({ error: 'invalid archetype' }, 400);
      if (!env.DZ_STATS) return corsJson({ error: 'KV not configured' }, 503);
      await Promise.all([
        kvIncrement(env.DZ_STATS, 'total'),
        kvIncrement(env.DZ_STATS, 'archetype:' + archetype),
      ]);
      return corsJson({ ok: true }, 200);
    }

    if (path === '/api/stats' && request.method === 'GET') {
      if (!env.DZ_STATS) return corsJson({ error: 'KV not configured' }, 503);
      const kvKeys = ['total', 'share_count', ...Object.keys(ARCHETYPES).map(k => 'archetype:' + k)];
      const values = await Promise.all(kvKeys.map(k => env.DZ_STATS.get(k)));
      const kvMap = {};
      kvKeys.forEach((k, i) => { kvMap[k] = parseInt(values[i] || '0', 10) || 0; });
      const total = kvMap['total'];
      const shareCount = kvMap['share_count'];
      const realWeight = Math.min(total / 500, 1);
      const archetypes = {};
      Object.keys(ARCHETYPES).forEach(key => {
        const count  = kvMap['archetype:' + key];
        const rPct   = total > 0 ? (count / total) * 100 : 0;
        const seeded = SEEDED_PCT[key] || 10;
        archetypes[key] = { count, pct: Math.round(((rPct * realWeight) + (seeded * (1 - realWeight))) * 10) / 10 };
      });
      return corsJson({ shareCount, total, archetypes }, 200, { 'Cache-Control': 'no-store' });
    }

    const ua = request.headers.get('user-agent') || '';
    let key = url.searchParams.get('r');
    if (!key) {
      const m = path.match(/^\/r\/([a-z0-9]+)(?:\.html)?$/i);
      if (m) key = m[1];
    }
    const arch = key ? ARCHETYPES[key.toLowerCase()] : null;

    if (!arch || !CRAWLER_UA.test(ua)) return fetch(request);

    const imageUrl = `https://digitalzen.cloud/og/${key.toLowerCase()}.png`;
    const pageUrl  = `https://digitalzen.cloud/r/${key.toLowerCase()}`;
    const { title, desc } = arch;

    const originUrl = VERCEL_ORIGIN + path + url.search;
    let response;
    try {
      response = await fetch(originUrl, { headers: { 'x-forwarded-host': 'digitalzen.cloud' }, redirect: 'follow' });
    } catch (err) {
      return minimalOgPage(title, desc, imageUrl, pageUrl, key);
    }
    if (!response.ok) return minimalOgPage(title, desc, imageUrl, pageUrl, key);

    const rewritten = new HTMLRewriter()
      .on('meta[property="og:title"]',        { element(el) { el.setAttribute('content', title); } })
      .on('meta[property="og:description"]',  { element(el) { el.setAttribute('content', desc); } })
      .on('meta[property="og:image"]',        { element(el) { el.setAttribute('content', imageUrl); } })
      .on('meta[property="og:image:width"]',  { element(el) { el.setAttribute('content', '1200'); } })
      .on('meta[property="og:image:height"]', { element(el) { el.setAttribute('content', '630'); } })
      .on('meta[property="og:image:type"]',   { element(el) { el.setAttribute('content', 'image/png'); } })
      .on('meta[property="og:url"]',          { element(el) { el.setAttribute('content', pageUrl); } })
      .on('meta[name="twitter:title"]',       { element(el) { el.setAttribute('content', title); } })
      .on('meta[name="twitter:description"]', { element(el) { el.setAttribute('content', desc); } })
      .on('meta[name="twitter:image"]',       { element(el) { el.setAttribute('content', imageUrl); } })
      .on('meta[name="twitter:card"]',        { element(el) { el.setAttribute('content', 'summary_large_image'); } })
      .transform(response);

    return new Response(rewritten.body, {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'public, max-age=3600', 'Vary': 'User-Agent' },
    });
  },
};

function minimalOgPage(title, desc, imageUrl, pageUrl, key) {
  const h = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  return new Response(`<!DOCTYPE html><html><head>
  <meta charset="UTF-8"/><title>${h(title)}</title>
  <meta property="og:title" content="${h(title)}"/>
  <meta property="og:description" content="${h(desc)}"/>
  <meta property="og:image" content="${h(imageUrl)}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:type" content="image/png"/>
  <meta property="og:url" content="${h(pageUrl)}"/>
  <meta property="og:type" content="website"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${h(title)}"/>
  <meta name="twitter:description" content="${h(desc)}"/>
  <meta name="twitter:image" content="${h(imageUrl)}"/>
  <script>window.location.replace('/?r=${key}');<\/script>
</head><body></body></html>`, {
    status: 200,
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
