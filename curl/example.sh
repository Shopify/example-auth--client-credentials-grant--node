#!/bin/bash
set -euo pipefail

# [START client-credentials.config]

# Credentials come from the environment. Also read .env when one happens to be
# there, since the Shopify CLI writes credentials to that file.
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

: "${SHOPIFY_SHOP:?Set SHOPIFY_SHOP in your environment}"
: "${SHOPIFY_CLIENT_ID:?Set SHOPIFY_CLIENT_ID in your environment}"
: "${SHOPIFY_CLIENT_SECRET:?Set SHOPIFY_CLIENT_SECRET in your environment}"
# [END client-credentials.config]

# [START client-credentials.get-token]
# Request access token
TOKEN_RESPONSE=$(curl -s -X POST \
  "https://${SHOPIFY_SHOP}.myshopify.com/admin/oauth/access_token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=${SHOPIFY_CLIENT_ID}" \
  -d "client_secret=${SHOPIFY_CLIENT_SECRET}")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "Failed to get token: $TOKEN_RESPONSE" >&2
  exit 1
fi
# [END client-credentials.get-token]

# [START client-credentials.query-products]
# Query the GraphQL Admin API
curl -s -X POST \
  "https://${SHOPIFY_SHOP}.myshopify.com/admin/api/2025-01/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Access-Token: $ACCESS_TOKEN" \
  -d '{"query":"{ products(first: 3) { edges { node { id title handle } } } }"}' | jq .
# [END client-credentials.query-products]
