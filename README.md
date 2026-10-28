# Web 2.0 Next

English · [简体中文](README.zh-Hans.md)

**Express yourself. Connect with others.**

A shared manifesto and directory of personal websites. Web 2.0 Next carries forward personal publishing, blogs, and links between people, while helping agents discover and understand the people behind those websites.

[Website](https://web20next.com) · [Manifesto](https://web20next.com/manifesto) · [Browse websites](https://web20next.com/websites) · [Share your website](https://web20next.com/join)

Initiated by [Next Token](https://nexttoken.tv).

## Share your website

Give your agent the Web 2.0 Next address and your website address. The [participation page](https://web20next.com/join) provides a message to copy; [how it works](https://web20next.com/how-it-works) explains the route from a proposed entry to the published directory.

Entries are added, updated, and removed through GitHub pull requests to this repository. Each website has one `sites/<slug>.json` file, submitted by its owner or an authorized representative. Maintainers review submissions; the directory updates after merge and a successful website deployment. There is no automatic submission API.

- [Contribution guide](CONTRIBUTING.md): consent, fields, checks, review, corrections, and removal.
- [Agent guide](docs/agent-guide.en.md): sources, authorization, branches, and PR submission.
- [PR template](.github/pull_request_template.md), [example entry](examples/site.en.example.json), and [JSON Schema](schemas/site.schema.json).
- `/llms.txt`: the English agent entry for every interface language. Discovery support varies between agents; the HTML discovery link does not guarantee automatic reading.
- `/directory.json` and `/rss.xml`: the full directory and the English feed, including the manifesto. Owner-submitted text stays in its original language.

The homepage features the websites of Next Token’s four co-hosts—Yang Pan, Xiangyang Qiaomu, Guizang, and Orange—alongside Xiaohu and Yao Jingang. The complete directory, RSS feeds, and JSON export use all records. Public availability alone does not authorize listing someone else's website.

## Develop locally

Use Node.js 24, at least **24.14.1**. `.nvmrc` and CI pin 24.14.1; `package.json` requires 24.x. Run commands in the directory containing `package.json`:

```sh
npm ci
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run validate:directory` | Check entry fields, public URL syntax, filenames, and duplicates |
| `npm test` | Run directory, translation-structure, RSS, URL, and CSS architecture tests |
| `npm run check` | Check Astro and TypeScript |
| `npm run build` | Validate entries and build static files in `dist/` |
| `npm run preview` | Preview the built website |
| `npm run preview:cf` | Build and preview Cloudflare's static asset handling locally |
| `npm run generate:social` | Generate the six share images with Playwright |
| `npm run deploy:dry-run` | Build and validate deployment packaging without publishing |
| `npm run deploy` | Check the site URL, type-check, build, and publish to Cloudflare |

Share-image generation requires a Playwright Chromium installation (`npx playwright install chromium`), or an installed Chrome browser with `CHROME_CHANNEL=chrome`. Images are checked in, so normal builds do not require a browser. See [share-image conventions](docs/social-sharing.md).

Run commands that invoke Wrangler outside an agent sandbox. Deployment requires an authorized Cloudflare account.

## Architecture and deployment

The site uses **Astro static generation, TypeScript, and native CSS**, with Cloudflare Workers Static Assets as the deployment target. There is no React runtime or server-side rendering service, and no Cloudflare SSR adapter is needed for this setup.

- `src/views/` and `src/components/`: shared page views and components.
- `src/i18n/`: locale registry and interface copy. English is the default; Chinese reading pages use `/zh`.
- `src/styles/global.css`: all authored CSS, including design tokens and share-card styles.
- `docs/manifesto.<locale>.md`: the source for manifesto pages, the homepage manifesto, and share-card principles.
- `sites/`: owner-approved directory entries; examples are stored separately in `examples/`.
- `public/social/`: generated share images. Preview pages with `npm run dev` or build and run `npm run preview`; `dist/` contains deployment output and is ignored by Git.
- `wrangler.jsonc`: serves `dist/`, removes trailing slashes from page routes, and uses `404.html` for unknown paths.

The production origin is `https://web20next.com`. The [deployment workflow](.github/workflows/deploy.yml) publishes the `web20next` Worker on pushes to `main`, including merged pull requests. It also supports **Actions → Deploy website → Run workflow**, with `main` selected. Only `main` in `web20next/web20next` can deploy; PRs and forks do not publish to production.

In the GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | A Cloudflare API token with permission to deploy Workers to the target account |
| `CLOUDFLARE_ACCOUNT_ID` | The ID of that Cloudflare account |

Use Cloudflare’s **Edit Cloudflare Workers** API-token template, scoped to the intended account and any required zones. Follow the [Cloudflare authentication guide](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) for token setup. Store credentials only as GitHub Secrets.

Each deployment installs locked dependencies, validates the production URL, runs tests and type checks, and builds the site before publishing `dist/`. The build also validates directory entries. The Cloudflare action uses the Wrangler installation pinned in the lockfile. Credentials are available only to the initial configuration check and deployment step; missing secrets stop the deployment immediately. Deployment runs are serialized. The separate validation workflow continues to check PRs and pushes.

`wrangler.jsonc` binds `web20next.com` to the `web20next` Worker as a Custom Domain on deployment, with the `workers.dev` address disabled. The Cloudflare account must contain the active `web20next.com` zone, and the deployment token needs Workers Scripts Edit, Workers Routes Edit, and Zone Read permissions for the relevant account and zone. Use GitHub Actions as the automatic deployment path; disable any Cloudflare Workers Builds trigger for the same Worker to avoid duplicate deployments.

Human reading navigation is localized. Agent instructions, copy/share links, and primary subscription links use the unprefixed production addresses. Project URLs omit trailing slashes, except the necessary root-relative `/`. The compatibility endpoints `/zh/llms.txt` and `/zh/rss.xml` remain available.

## Project conventions

- [Agent instructions](AGENTS.md): repository rules and verification requirements.
- [Internationalization](docs/i18n.md): adding languages, terminology, and link conventions.
- [Visual conventions](docs/visual-direction.md): layout, typography, components, and interaction rules.
- [Design system](https://web20next.com/design-system): colors, typography, components, and interactions.
- [Bilingual review skill](.agents/skills/review-bilingual-site/SKILL.md): reviewing equivalent meaning and natural language across UI, articles, metadata, and share images.

Use Conventional Commits and keep changes focused. Run the validation commands in the contribution guide before submitting. Never put private conversations, credentials, or private authorization evidence in entries or PRs.

## License

Original code is [MIT](LICENSE). Original project content, including the manifesto, articles, interface copy, and share-card artwork, is [CC BY 4.0](LICENSE-CONTENT).

Owner-submitted entries and third-party material are excluded from those project licenses. See the [licensing scope and submission permission](docs/licensing.en.md) before contributing or reusing material. Contributors retain copyright; linked websites retain their own rights.
