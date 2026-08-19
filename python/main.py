import os
import time

import requests

# [START client-credentials.config]
# Credentials come from the environment. Also read .env when one happens to be
# there, since the Shopify CLI writes credentials to that file. setdefault means
# real environment variables win, so a platform's config always takes precedence.
def load_dotenv(path=".env"):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key, value.strip().strip('"').strip("'"))


load_dotenv()

SHOP = os.getenv("SHOPIFY_SHOP")
CLIENT_ID = os.getenv("SHOPIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SHOPIFY_CLIENT_SECRET")

if not SHOP or not CLIENT_ID or not CLIENT_SECRET:
    raise RuntimeError(
        "Set SHOPIFY_SHOP, SHOPIFY_CLIENT_ID, and SHOPIFY_CLIENT_SECRET in your environment."
    )
# [END client-credentials.config]

# [START client-credentials.get-token]
token = None
token_expires_at = 0.0


def get_token():
    global token, token_expires_at
    if token and time.time() < token_expires_at - 60:
        return token

    response = requests.post(
        f"https://{SHOP}.myshopify.com/admin/oauth/access_token",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    token = data["access_token"]
    token_expires_at = time.time() + data["expires_in"]
    return token
# [END client-credentials.get-token]


# [START client-credentials.query-products]
def graphql(query):
    response = requests.post(
        f"https://{SHOP}.myshopify.com/admin/api/2025-01/graphql.json",
        headers={
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": get_token(),
        },
        json={"query": query},
        timeout=30,
    )
    response.raise_for_status()
    payload = response.json()
    if payload.get("errors"):
        raise RuntimeError(payload["errors"])
    return payload["data"]
# [END client-credentials.query-products]


def main() -> None:
    query = "{ products(first: 3) { edges { node { id title handle } } } }"
    data = graphql(query)
    print(data)


if __name__ == "__main__":
    main()
