/*
 * Cloudflare Worker: Social Sharing Meta Tag Rewriter
 *
 * Intercepts requests from social crawlers (Facebook, Twitter, iMessage, etc.)
 * when ?r=<archetype> is present and injects archetype-specific OG meta tags.
 *
 * For regular browser requests, passes through to the origin unchanged.
 *
 * Deploy as a Cloudflare Worker route on digitalzen.cloud/*
 *
 * Setup:
 *   1. Create worker in Cloudflare dashboard
 *   2. Add route: digitalzen.cloud/* → this worker
 *   3. The worker fetches the origin HTML and rewrites meta tags for crawlers
 */

const ARCHETYPES = {
  architect: { name: 'The Architect', tagline: 'Precision', desc: 'You set the conditions before the night starts.' },
  ghost: { name: 'The Ghost', tagline: 'Subtracted', desc: 'You strip everything away until it shows up on its own.' },
  circuit: { name: 'The Circuit', tagline: 'Restless', desc: "The energy doesn't leave when the day ends — it redirects." },
  twam: { name: 'The 2AM', tagline: 'Generative', desc: "Your best work happens when nobody's watching." },
  minimalist: { name: 'The Minimalist', tagline: 'Refined', desc: "You've eliminated everything that doesn't earn its place." },
  operator: { name: 'The Operator', tagline: 'Calculated', desc: 'Controlled chaos. Nothing random about it.' },
  engineer: { name: 'The Night Engineer', tagline: 'Exacting', desc: 'You build things at hours that don\'t exist.' },
  phantom: { name: 'The Phantom', tagline: 'Contradictory', desc: 'Moving through silence. Both at the same time.' },
  builder: { name: 'The Quiet Builder', tagline: 'Meditative', desc: 'No audience. No deadline. No problem.' },
  nocturnal: { name: 'The Nocturnal', tagline: 'Untamed', desc: "Sleep is a suggestion. Making things is the priority." },
};

const CRAWLER_UA = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot|Discordbot|iMessagePreview|Applebot|Googlebot|bingbot/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ua = request.headers.get('user-agent') || '';
    const r = url.searchParams.get('r');

    // Only rewrite for crawler requests with a referral param
    if (!r || !ARCHETYPES[r] || !CRAWLER_UA.test(ua)) {
      return fetch(request);
    }

    const arch = ARCHETYPES[r];
    const ogImage = `${url.origin}/og/${r}.svg`;
    const shareUrl = `${url.origin}/?r=${r}`;

    // Fetch the original page
    const originResponse = await fetch(request);
    const html = await originResponse.text();

    // Rewrite meta tags
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
