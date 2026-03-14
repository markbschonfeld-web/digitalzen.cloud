/*
 * Cloudflare Worker: Shopify Newsletter Subscriber
 *
 * Receives { email, archetype } from digitalzen.cloud and creates a
 * subscribed customer in your Shopify store via the Admin API.
 *
 * SETUP:
 * 1. In Shopify Admin, go to Settings > Apps and sales channels > Develop apps
 * 2. Create a new app (e.g., "Digital Zen Signup")
 * 3. Under "API credentials", configure Admin API scopes:
 *    - write_customers
 * 4. Install the app and copy the Admin API access token
 * 5. Deploy this worker to Cloudflare:
 *    - npx wrangler init dz-subscribe
 *    - Replace the generated worker code with this file
 *    - npx wrangler secret put SHOPIFY_TOKEN  (paste your Admin API token)
 *    - npx wrangler secret put SHOPIFY_STORE  (e.g., "korfyr" — just the subdomain)
 *    - npx wrangler deploy
 * 6. Copy the worker URL (e.g., https://dz-subscribe.your-account.workers.dev)
 *    and set it as CAPTURE_ENDPOINT in script.js
 */

const ALLOWED_ORIGIN = 'https://digitalzen.cloud';

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

      // Create customer in Shopify with marketing consent
      const shopifyRes = await fetch(
        `https://${env.SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/customers.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': env.SHOPIFY_TOKEN,
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
        return respond(200, { ok: true });
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
