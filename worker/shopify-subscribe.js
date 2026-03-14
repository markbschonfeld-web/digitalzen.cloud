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
      const { email, archetype } = await request.json();

      if (!email || !email.includes('@')) {
        return respond(400, { error: 'Invalid email' });
      }

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
              tags: ['digitalzen', archetype ? 'nightmode-' + archetype : ''].filter(Boolean).join(', '),
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
