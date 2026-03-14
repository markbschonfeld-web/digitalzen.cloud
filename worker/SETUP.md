# Cloudflare Worker Setup — Digital Zen Email Capture to Shopify

This worker proxies email signups from digitalzen.cloud into the KORFYR Shopify store's customer list with marketing consent enabled.

---

## Step 1: Get Shopify Admin API Token

1. Log into Shopify Admin at `admin.shopify.com/store/helixirin`
2. Click **Settings** (gear icon, bottom-left corner)
3. Click **Apps and sales channels**
4. Click **"Develop apps"** at the top of the page
5. If prompted, click **"Allow custom app development"** and confirm
6. Click **"Create an app"**
7. Name it `Digital Zen Signup`, click Create
8. Click **"Configure Admin API scopes"**
9. Search for and check **`write_customers`**
10. Click **Save**
11. Click the **"API credentials"** tab at the top of the page
12. Click **"Install app"** and confirm the installation
13. You will see **"Admin API access token"** — click **"Reveal token once"**
14. **Copy this token immediately and save it.** Shopify only shows it once. You will need it in Step 3.

**Important:** This must be done from Shopify Admin (`admin.shopify.com`), NOT from the Shopify Dev Dashboard (`dev.shopify.com`). They are different interfaces. Only the Admin path shows the access token.

---

## Step 2: Create the Cloudflare Worker

You need a Cloudflare account. If you already manage digitalzen.cloud on Cloudflare, use that account.

### Option A: Cloudflare Dashboard (no terminal needed)

1. Log into `dash.cloudflare.com`
2. In the left sidebar, click **"Workers & Pages"**
3. Click **"Create"**
4. Click **"Create Worker"**
5. Name it `dz-subscribe`, click **"Deploy"**
6. After deploy, click **"Edit code"**
7. Delete all the default code in the editor
8. Copy the entire contents of `worker/shopify-subscribe.js` from this repo and paste it into the editor
9. Click **"Deploy"** (top-right)
10. Note the worker URL shown (e.g., `https://dz-subscribe.<account>.workers.dev`)

Now add the secrets:
1. Go back to the worker's overview page (click the back arrow or navigate to Workers & Pages > dz-subscribe)
2. Click the **"Settings"** tab
3. Click **"Variables and Secrets"** (or find "Environment Variables" section)
4. Under **"Secrets"**, click **"Add"**:
   - Name: `SHOPIFY_TOKEN` — Value: the Admin API access token from Step 1
   - Name: `SHOPIFY_STORE` — Value: `korfyr`
5. Click **Save and deploy**

### Option B: Wrangler CLI (terminal)

```bash
# Install wrangler
npm install -g wrangler

# Log into Cloudflare
npx wrangler login

# Create project directory
mkdir dz-subscribe && cd dz-subscribe

# Initialize worker
npx wrangler init . --type javascript

# Copy worker code (adjust path if needed)
cp /path/to/digitalzen.cloud/worker/shopify-subscribe.js src/index.js

# Set secrets
npx wrangler secret put SHOPIFY_TOKEN
# Paste the Admin API token from Step 1, press Enter

npx wrangler secret put SHOPIFY_STORE
# Type: korfyr
# Press Enter

# Deploy
npx wrangler deploy
```

Note the worker URL printed after deploy.

---

## Step 3: Connect the Worker to the Site

In the digitalzen.cloud repo, open `script.js`. Find this line (near line 342):

```javascript
var CAPTURE_ENDPOINT = 'YOUR_WORKER_URL';
```

Replace `YOUR_WORKER_URL` with the actual worker URL from Step 2. For example:

```javascript
var CAPTURE_ENDPOINT = 'https://dz-subscribe.your-account.workers.dev';
```

Commit and deploy the site.

---

## Step 4: Test

1. Go to digitalzen.cloud
2. Take the quiz, get a result
3. Scroll to the email capture form
4. Enter a test email address
5. Check the consent checkbox
6. Click "I'm in"
7. You should see "You're on the list."
8. Go to **Shopify Admin > Customers** — the test email should appear with:
   - Email marketing status: **Subscribed**
   - Tags: `digitalzen, nightmode-architect` (or whichever archetype)

---

## How It Works

- User enters email on digitalzen.cloud and checks the KORFYR consent box
- Frontend validates consent, then POSTs `{ email, archetype }` to the Cloudflare Worker
- Worker calls Shopify Admin API to create a customer with `email_marketing_consent: subscribed`
- Customer is tagged with `digitalzen` and `nightmode-{archetype}` for segmentation
- If the customer already exists in Shopify (422 response), the worker returns success anyway
- CORS is locked to `https://digitalzen.cloud` only

---

## Secrets Reference

| Secret | Value | Where to get it |
|--------|-------|-----------------|
| `SHOPIFY_TOKEN` | Admin API access token | Shopify Admin > Settings > Apps > Develop apps > Digital Zen Signup > API credentials |
| `SHOPIFY_STORE` | `korfyr` | The subdomain from korfyr.myshopify.com |

---

## Troubleshooting

- **"Method not allowed"** — The worker only accepts POST requests. Make sure the frontend is using `fetch` with `method: 'POST'`.
- **CORS errors in browser console** — Check that `ALLOWED_ORIGIN` in the worker matches exactly `https://digitalzen.cloud` (no trailing slash).
- **Customer not appearing in Shopify** — Check the worker logs in Cloudflare dashboard (Workers > dz-subscribe > Logs). Verify `SHOPIFY_TOKEN` and `SHOPIFY_STORE` secrets are set correctly.
- **422 from Shopify** — Customer already exists. The worker treats this as success, which is correct behavior.
