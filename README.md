# Taboo AI

_Learn English Vacabulary while having fun playing a game with intelligent chat AI. Train to use clear English expression and descriptive phrases to trick the AI into saying the **target guess word**. Taboo AI is both fun and educational, allowing you to gain knowledge, practice english expression, memorize more vocabs, and simply have fun!_

Visit https://taboo-ai.vercel.app/

![Taboo AI](<https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/poster3.0(features).png?raw=true>)

![Feature 01](https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/3.0%20Feature%201.png?raw=true)

![Feature 02](https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/3.0%20Feature%202.png?raw=true)

![Feature 03](https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/3.0%20Feature%203.png?raw=true)

![Feature 04](https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/3.0%20Feature%204.png?raw=true)

# Commands

- `npm run dev`: Start a local development with `.env.local`
- `npm dev:turbo`: Start a local development using experimental turbopack (not available for now)
- `npm run build`: Create a local build
- `npm run start`: Start the local server using local build
- `npm run lint`: Run eslint and stylelint on the codebase
- `npm run style`: Run prettier on the codebase and auto-format
- `npm run test`: Run unit test
- `npm run test:e2e`: Run e2e test using Playwright
- `npm run test:e2e:trace`: Run e2e test using Playwright and generate a trace report
- `npm run vercel:init`: Login to your account in vercel, bind the project and then pull in development environment variables
- `npm run vercel:pull`: Required login to vercel. Pull in development environment variables.
- `npm run vercel:dev`: Start a local development using vercel cli pulled environment (found in `.vercel/` in project root)
- `npm run gen-types`: Generate types for supabase postgres schemas

# Local supabase

When you are running `npm run dev`, it is recommended that you run with a local supabase instance. For how to set up supabase for local dev, check out https://supabase.com/docs/guides/cli/local-development.

Then ask me for the migration files, which you will need to populate the local postgres with existing schemas, roles and RLS policies.

# Contribute

Taboo AI is an open-source project. To contribute, simply fork the project into your own repository. Look at the [**Issues**](https://github.com/xmliszt/taboo-ai/issues) to find the one that you are interested in working with. Or raise your own issues. Once you are done, simply submit a pull request for review.

## Branching

Taboo AI has `main` branch for production, `preview` for staging. When you create a feature branch, you can either PR to `main` or `preview` depending on the urgency of the issue.

- PR to `main` will be blocked if no approval or unit test or preview deployment failed.
- PR to `preview` requires approval as well.

When you create a PR, GitHub pipeline is automatically run to deploy a staging build to vercel preview. Once succeeded, you can check the deployment from https://taboo-ai-xmliszt.vercel.app .

## Local Dev Environment

When you clone the project, simply run `npm i && npm run dev` to start your development. If you are given access to Vercel proejct, then you can run `npm run vercel:dev` instead. You might notice certain features in the local dev version not working, for example Ai feature or Supabase Connection. This is because you need to specify a environment file for local development and it stays in your local and never pushed to GitHub. You should create your own environment file in order for some features to work:

`.env.local`

```
SITE_URL="http://localhost:3000"

# Taboo AI app settings
NEXT_PUBLIC_MAINTENANCE="false"
NEXT_PUBLIC_TABOO_AI_VERSION="3.1.2"

# Sendgrid API
SENDGRID_API_KEY=""
SENDGRID_TO_EMAIL=""
SENDGRID_FROM_EMAIL=""

# Vercel analytics
VERCEL_ANALYTICS_ID=""
VERCEL_WEB_ANALYTICS_ID=""

# Google Gemini API
GOOGLE_GEMINI_PRO_API_KEY=""

# Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""

# Stripe API
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""

```

For any missing values in the environment sample above, if you need it, please feel free to leave me a message and I will assist you in setting up.

## Why not use Vercel env and do `vercel pull`?

Yes the most convenient way is to use Vercel. However, unfortunately I'm on FREE plan in vercel so I cannot add team members in order to do so. So for now, you have to create your own local env file 😅 sorry for the inconvenience!

---

Thank you for your contribution to make Taboo AI a better platform for English learning!
