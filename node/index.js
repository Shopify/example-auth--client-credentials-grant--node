import { existsSync } from 'node:fs';
import { URLSearchParams } from 'node:url';

// [START client-credentials.config]
// Credentials come from the environment. Also read .env when one happens to be
// there, since the Shopify CLI writes credentials to that file. Real environment
// variables win over the file, so a platform's config always takes precedence.
// loadEnvFile needs Node.js 20.12 or later, and throws if the file is missing.
if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const SHOP = process.env.SHOPIFY_SHOP;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

if (!SHOP || !CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    'Set SHOPIFY_SHOP, SHOPIFY_CLIENT_ID, and SHOPIFY_CLIENT_SECRET in your environment.'
  );
}
// [END client-credentials.config]

// [START client-credentials.get-token]
let token = null;
let tokenExpiresAt = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiresAt - 60_000) return token;

  const response = await fetch(
    `https://${SHOP}.myshopify.com/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    }
  );

  if (!response.ok) throw new Error(`Token request failed: ${response.status}`);

  const { access_token, expires_in } = await response.json();
  token = access_token;
  tokenExpiresAt = Date.now() + expires_in * 1000;
  return token;
}
// [END client-credentials.get-token]

// [START client-credentials.query-products]
async function graphql(query, variables = {}) {
  const response = await fetch(
    `https://${SHOP}.myshopify.com/admin/api/2025-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': await getToken(),
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const { data, errors } = await response.json();
  if (errors?.length) {
    throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
  }
  return data;
}
// [END client-credentials.query-products]

async function main() {
  const query =
    '{ products(first: 3) { edges { node { id title handle } } } }';
  const data = await graphql(query);
  console.log('Products:', JSON.stringify(data, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
