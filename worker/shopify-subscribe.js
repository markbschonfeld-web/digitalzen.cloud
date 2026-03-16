/*
 * Cloudflare Worker: Shopify Newsletter Subscriber
 *
 * Receives { email, archetype } from digitalzen.cloud and creates a
 * subscribed customer in your Shopify store via the Admin API.
 *
 * Auth: OAuth 2.0 client credentials grant (Dev Dashboard apps).
 * The worker exchanges SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET for
 * a temporary access token on each request.
 *
 * Secrets configured in Cloudflare:
 *   SHOPIFY_CLIENT_ID     — from Dev Dashboard app
 *   SHOPIFY_CLIENT_SECRET — from Dev Dashboard app
 *   SHOPIFY_STORE         — store admin handle (e.g., "helixirin")
 *
 * Deployed at: https://dz-subscribe.helixirin.workers.dev
 */

const ALLOWED_ORIGIN = 'https://digitalzen.cloud';

const VALID_ARCHETYPES = [
  'architect', 'ghost', 'circuit', 'twam', 'minimalist',
  'operator', 'engineer', 'phantom', 'builder', 'nocturnal'
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_REQUESTS_PER_HOUR = 5;

async function getAccessToken(env) {
  const res = await fetch(
    `https://${env.SHOPIFY_STORE}.myshopify.com/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env.SHOPIFY_CLIENT_ID,
        client_secret: env.SHOPIFY_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    }
  );
  const data = await res.json();
  return data.access_token;
}

async function checkRateLimit(ip) {
  const cache = caches.default;
  const cacheKey = new Request(`https://rate-limit.internal/${ip}`, { method: 'GET' });
  const cached = await cache.match(cacheKey);

  let count = 0;
  if (cached) {
    count = parseInt(await cached.text()) || 0;
    if (count >= MAX_REQUESTS_PER_HOUR) {
      return false;
    }
  }

  await cache.put(cacheKey, new Response(String(count + 1), {
    headers: { 'Cache-Control': 'max-age=3600' },
  }));
  return true;
}

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Rate limiting by IP
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      const allowed = await checkRateLimit(clientIP);
      if (!allowed) {
        return respond(429, { error: 'Rate limited' });
      }

      const { email, archetype } = await request.json();

      // Email validation
      if (!email || typeof email !== 'string' || email.length > 254 || !EMAIL_REGEX.test(email)) {
        return respond(400, { error: 'Invalid email' });
      }

      // Archetype whitelist
      const safeArchetype = VALID_ARCHETYPES.includes(archetype) ? archetype : 'unknown';

      const token = await getAccessToken(env);

      // Create customer in Shopify with marketing consent
      const shopifyRes = await fetch(
        `https://${env.SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/customers.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token,
          },
          body: JSON.stringify({
            customer: {
              email: email,
              email_marketing_consent: {
                state: 'subscribed',
                opt_in_level: 'single_opt_in',
                consent_updated_at: new Date().toISOString(),
              },
              tags: `digitalzen, nightmode-${safeArchetype}`,
            },
          }),
        }
      );

      const data = await shopifyRes.json();

      // Shopify returns 422 if customer already exists — that's OK
      if (shopifyRes.ok || shopifyRes.status === 422) {
        return respond(200, { success: true });
      }

      return respond(shopifyRes.status, { error: data.errors || 'Shopify error' });
    } catch (err) {
      return respond(500, { error: 'Internal error' });
    }
  },
};

function respond(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    },
  });
}
