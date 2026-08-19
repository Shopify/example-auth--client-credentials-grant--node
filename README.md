# Client Credentials Grant Examples

Example code for authenticating Shopify apps created in the Dev Dashboard using the client credentials grant.

**Tutorial:** [Using the client credentials grant](https://shopify.dev/docs/apps/build/dev-dashboard/get-api-access-tokens)

## Languages

- `node/` — Node.js example
- `python/` — Python example
- `curl/` — cURL/Bash example

## Usage

1. Set your credentials as environment variables. `SHOPIFY_SHOP` is your store's `myshopify.com` subdomain, without `.myshopify.com`:

   ```sh
   export SHOPIFY_SHOP=your-store
   export SHOPIFY_CLIENT_ID=your-client-id
   export SHOPIFY_CLIENT_SECRET=your-client-secret
   ```

2. Run the example for your preferred language, from the repo root:

   - `node node/index.js` — needs Node.js 20.12 or later
   - `python python/main.py` — needs `requests`
   - `sh curl/example.sh`

All three samples read their credentials from the environment. If a `.env` file is present in the repo root, they read that too, since the Shopify CLI writes credentials to one. Environment variables take precedence, and `.env` is gitignored.

## Note

This repository is for documentation purposes. Issues and pull requests are not accepted.
