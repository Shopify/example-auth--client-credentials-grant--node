# Client Credentials Grant Examples

Example code for authenticating Shopify apps created in the Dev Dashboard using the client credentials grant.

**Tutorial:** [Using the client credentials grant](https://shopify.dev/docs/apps/build/dev-dashboard/get-api-access-tokens)

## Languages

- `node/` — Node.js example
- `python/` — Python example  
- `curl/` — cURL/Bash example

## Usage

1. Copy `.env.example` to `.env` and fill in your Client ID, Client Secret, and store subdomain. `.env` is gitignored, so your credentials stay out of version control.
2. Run the example for your preferred language, from the repo root so it finds `.env`:
   - `node node/index.js` — needs Node.js 20.12 or later
   - `python python/main.py` — needs `requests`
   - `sh curl/example.sh`

All three samples read their credentials from the environment and fall back to `.env`, so real environment variables take precedence when you deploy.

## Note

This repository is for documentation purposes. Issues and pull requests are not accepted.
