# Cloudflare Worker Setup — Digital Zen Email Capture to Shopify

This worker proxies email signups from digitalzen.cloud into the KORFYR Shopify store's customer list with marketing consent enabled.

## Current Deployment

- **Worker URL:** `https://dz-subscribe.helixirin.workers.dev`
- **Shopify App:** Digital Zen Signup (App ID: 334473822209, Dev Dashboard)
- **Auth:** OAuth 2.0 client credentials grant (temporary access tokens)
- **Store:** `helixirin.myshopify.com` (brand: KORFYR, domain: korfyr.com)

---

## How It Works

1. User enters email on digitalzen.cloud and checks the KORFYR consent box
2. Frontend validates consent, then POSTs `{ email, archetype }` to the Cloudflare Worker
3. Worker exchanges `SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET` for a temporary Shopify access token
4. Worker calls Shopify Admin API to create a customer with `email_marketing_consent: subscribed`
5. Customer is tagged with `digitalzen` and `nightmode-{archetype}` for segmentation
6. If the customer already exists in Shopify (422 response), the worker returns success anyway
7. CORS is locked to `https://digitalzen.cloud` only

---

## Secrets Reference

| Secret | Type | Description |
|--------|------|-------------|
| `SHOPIFY_CLIENT_ID` | Encrypted | Dev Dashboard app Client ID |
| `SHOPIFY_CLIENT_SECRET` | Encrypted | Dev Dashboard app Client Secret |
| `SHOPIFY_STORE` | Plaintext | `helixirin` (store admin handle) |

These are configured in Cloudflare Workers > dz-subscribe > Settings > Variables and Secrets.

---

## Testing

1. Go to `https://digitalzen.cloud`
2. Take the quiz, get a result
3. Scroll to the email capture form
4. Enter a test email address
5. Check the consent checkbox
6. Click "I'm in"
7. You should see "You're on the list."
8. Go to Shopify Admin > Customers (`admin.shopify.com/store/helixirin/customers`) — the test email should appear with:
   - Email marketing status: **Subscribed**
   - Tags: `digitalzen, nightmode-architect` (or whichever archetype)

---

## Troubleshooting

- **502 from worker** — Most likely the Shopify app doesn't have `write_customers` scope. Verify at `dev.shopify.com/dashboard/153727070/apps/334473822209/settings`
- **CORS errors in browser console** — Check that `ALLOWED_ORIGIN` in the worker matches exactly `https://digitalzen.cloud` (no trailing slash)
- **Customer not appearing in Shopify** — Check worker logs in Cloudflare dashboard (Workers > dz-subscribe > Logs)
- **422 from Shopify** — Customer already exists. The worker treats this as success, which is correct behavior
