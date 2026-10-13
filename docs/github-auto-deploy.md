# GitHub Actions -> Cloudflare Pages

Repository: https://github.com/abexziero/abex-portfolio
Website: https://abexziero.pages.dev

Push to main runs content tests, lint, the static release build and typecheck.
Deployment targets the existing Cloudflare Pages project abexziero, production branch main.
Actions and Wrangler versions are pinned. Deployment credentials are only used after checks pass.
No deployment runs from pull requests or another branch.

## One-time activation

1. In Cloudflare, create an API token with Account -> Cloudflare Pages -> Edit.
   Restrict the resource to the account hosting abexziero.
   Token page: https://dash.cloudflare.com/profile/api-tokens
2. Find that account's Account ID in the Cloudflare dashboard.
3. Add two repository Actions secrets:
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID

Secrets page: https://github.com/abexziero/abex-portfolio/settings/secrets/actions

Do not commit credentials or paste them into chat. If either secret is missing,
the workflow still validates/builds the app and clearly skips deployment.
After saving both secrets, open Actions -> Deploy portfolio to Cloudflare -> Run workflow -> main.
Later pushes to main deploy automatically.

## Local sync and updates

The workflow was added directly on GitHub. Before another local commit:

    git pull --ff-only origin main

Then edit, commit and push normally. The latest main state becomes the website
only after the workflow's checks and deployment succeed.

## Verify

The workflow checks seven public routes after upload, with bounded retries for
temporary network/HTTP5xx failures. An uploaded deployment is only marked verified
once every route returns200. A green build with a skipped deploy means secrets still
need configuration; it does not mean that a new website version was published.

Workflow: .github/workflows/cloudflare-pages.yml
Official guide: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
