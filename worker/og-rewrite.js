/**
 * Cloudflare Worker: Social Sharing OG Meta Tag Rewriter
 * digitalzen.cloud
 *
 * Intercepts requests from social media crawlers when a ?r=<archetype> param
 * is present, then injects per-archetype OG/Twitter meta tags using
 * Cloudflare's HTMLRewriter streaming API.
 *
 * Regular browser visits pass through untouched.
 *
 * DEPLOY:
 *   cd worker
 *   wrangler deploy og-rewrite.js --name dz-og-rewrite --compatibility-date 2024-01-01
 *
 * ROUTE (Cloudflare Dashboard → Workers & Pages → dz-og-rewrite → Routes):
 *   digitalzen.cloud/*
 *   (DNS must be proxied through Cloudflare — orange cloud on the A record)
 */

// ─── Archetype data ──────────────────────────────────────────────────────────
// Keys must match the ?r= param values used in script.js handleShare()

const ARCHETYPES = {
  architect: {
    name: 'The Architect',
    title: "I'm The Architect. What's your night mode?",
    desc:  'You set the conditions before the night starts. Only 14% of people get this result.',
  },
  ghost: {
    name: 'The Ghost',
    title: "I'm The Ghost. What's your night mode?",
    desc:  'You strip everything away until it shows up on its own. Only 11% of people get this result.',
  },
  circuit: {
    name: 'The Circuit',
    title: "I'm The Circuit. What's your night mode?",
    desc:  "The energy doesn't leave when the day ends — it redirects. Take the quiz.",
  },
  twam: {
    name: 'The 2AM',
    title: "I'm The 2AM. What's your night mode?",
    desc:  "Your best work happens when nobody's watching. Take the quiz.",
  },
  minimalist: {
    name: 'The Minimalist',
    title: "I'm The Minimalist. What's your night mode?",
    desc:  "You've eliminated everything that doesn't earn its place. Only 11% of people get this result.",
  },
  operator: {
    name: 'The Operator',
    title: "I'm The Operator. What's your night mode?",
    desc:  'Controlled chaos. Nothing random about it. Take the quiz.',
  },
  engineer: {
    name: 'The Night Engineer',
    title: "I'm The Night Engineer. What's your night mode?",
    desc:  "You build things at hours that don't exist. Take the quiz.",
  },
  phantom: {
    name: 'The Phantom',
    title: "I'm The Phantom. What's your night mode?",
    desc:  'Moving through silence. Both at the same time. Take the quiz.',
  },
  builder: {
    name: 'The Quiet Builder',
    title: "I'm The Quiet Builder. What's your night mode?",
    desc:  'No audience. No deadline. No problem. Take the quiz.',
  },
  nocturnal: {
    name: 'The Nocturnal',
    title: "I'm The Nocturnal. What's your night mode?",
    desc:  'Sleep is a suggestion. Making things is the priority. Take the quiz.',
  },
};

// ─── Crawler detection ───────────────────────────────────────────────────────
// Matches the user-agents of social platforms that read OG meta tags.

const CRAWLER_UA = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|Discordbot|TelegramBot|iMessage|AppleBot|Pinterest|Snapchat|redditbot|vkShare|W3C_Validator/i;

// ─── Vercel origin ───────────────────────────────────────────────────────────
// Fetch the page HTML from Vercel directly to avoid an infinite loop.
// If the worker is on digitalzen.cloud/* and we fetch request.url, Cloudflare
// would re-invoke this worker on the outbound request → infinite loop.
// Fetching the Vercel origin bypasses Cloudflare and breaks the loop.

const VERCEL_ORIGIN = 'https://digitalzen-cloud.vercel.app';

// ─── Worker ──────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ua  = request.headers.get('user-agent') || '';

    // Extract archetype key from:
    //   /?r=architect          (original share URL format)
    //   /r/architect           (static OG page format — handles direct hits)
    let key = url.searchParams.get('r');

    if (!key) {
      // Check /r/<key> path pattern
      const pathMatch = url.pathname.match(/^\/r\/([a-z0-9]+)(?:\.html)?$/i);
      if (pathMatch) key = pathMatch[1];
    }

    const arch = key ? ARCHETYPES[key.toLowerCase()] : null;

    // Pass through if: no archetype key, unknown key, or not a crawler
    if (!arch || !CRAWLER_UA.test(ua)) {
      return fetch(request);
    }

    // ── Build meta tag values ─────────────────────────────────────────────

    const imageUrl  = `https://digitalzen.cloud/og/${key.toLowerCase()}.png`;
    const pageUrl   = `https://digitalzen.cloud/r/${key.toLowerCase()}`;
    const { title, desc } = arch;

    // ── Fetch page HTML from Vercel origin ────────────────────────────────

    const originUrl = VERCEL_ORIGIN + url.pathname + url.search;
    let response;

    try {
      response = await fetch(originUrl, {
        headers: { 'x-forwarded-host': 'digitalzen.cloud' },
        redirect: 'follow',
      });
    } catch (err) {
      // Network error fetching origin — return a minimal page with correct OG
      return minimalOgPage(title, desc, imageUrl, pageUrl, key);
    }

    if (!response.ok) {
      return minimalOgPage(title, desc, imageUrl, pageUrl, key);
    }

    // ── Rewrite meta tags using HTMLRewriter ──────────────────────────────
    // HTMLRewriter is a streaming API — it rewrites tags as they pass through
    // without buffering the entire response. Robust to whitespace differences.

    const rewritten = new HTMLRewriter()

      // og: tags
      .on('meta[property="og:title"]', {
        element(el) { el.setAttribute('content', title); },
      })
      .on('meta[property="og:description"]', {
        element(el) { el.setAttribute('content', desc); },
      })
      .on('meta[property="og:image"]', {
        element(el) { el.setAttribute('content', imageUrl); },
      })
      .on('meta[property="og:image:width"]', {
        element(el) { el.setAttribute('content', '1200'); },
      })
      .on('meta[property="og:image:height"]', {
        element(el) { el.setAttribute('content', '630'); },
      })
      .on('meta[property="og:image:type"]', {
        element(el) { el.setAttribute('content', 'image/png'); },
      })
      .on('meta[property="og:url"]', {
        element(el) { el.setAttribute('content', pageUrl); },
      })

      // twitter: tags
      .on('meta[name="twitter:title"]', {
        element(el) { el.setAttribute('content', title); },
      })
      .on('meta[name="twitter:description"]', {
        element(el) { el.setAttribute('content', desc); },
      })
      .on('meta[name="twitter:image"]', {
        element(el) { el.setAttribute('content', imageUrl); },
      })
      .on('meta[name="twitter:card"]', {
        element(el) { el.setAttribute('content', 'summary_large_image'); },
      })

      .transform(response);

    // Return with correct Content-Type and a short cache
    return new Response(rewritten.body, {
      status:  200,
      headers: {
        'Content-Type':  'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
        'Vary':          'User-Agent',
      },
    });
  },
};

// ─── Fallback: minimal HTML page with correct OG tags ────────────────────────
// Used when the origin fetch fails. Crawlers will still read correct previews.

function minimalOgPage(title, desc, imageUrl, pageUrl, key) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <meta property="og:title"       content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:image"       content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type"  content="image/png" />
  <meta property="og:url"         content="${escapeHtml(pageUrl)}" />
  <meta property="og:type"        content="website" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image"       content="${escapeHtml(imageUrl)}" />
  <script>window.location.replace('/?r=${key}');<\/script>
</head>
<body></body>
</html>`;

  return new Response(html, {
    status:  200,
    headers: {
      'Content-Type':  'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
