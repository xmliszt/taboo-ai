# Taboo AI

_Learn English Vacabulary while having fun playing a game with intelligent chat AI. Train to use clear English expression and descriptive phrases to trick the AI into saying the **target guess word**. Taboo AI is both fun and educational, allowing you to gain knowledge, practice english expression, memorize more vocabs, and simply have fun!_

Visit https://taboo-ai.vercel.app/

![Taboo AI](<https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/poster3.0(features).png?raw=true>)

![Feature 01](https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/3.0%20Feature%201.png?raw=true)

![Feature 02](https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/3.0%20Feature%202.png?raw=true)

![Feature 03](https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/3.0%20Feature%203.png?raw=true)

![Feature 04](https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/3.0%20Feature%204.png?raw=true)

# Contribute

Taboo AI is an open-source project. To contribute, simply fork the project into your own repository. Look at the [**Issues**](https://github.com/xmliszt/taboo-ai/issues) to find the one that you are interested in working with. Or raise your own issues. Once you are done, simply submit a pull request for review.

## Branching

Taboo AI has `main` branch for production, `preview` for staging. When you create a feature branch, you can either PR to `main` or `preview` depending on the urgency of the issue.

- PR to `main` will be blocked if no approval or unit test or preview deployment failed.
- PR to `preview` requires approval as well.

When you create a PR, GitHub pipeline is automatically run to deploy a staging build to vercel preview. Once succeeded, you can check the deployment from https://taboo-ai-xmliszt.vercel.app .

## Local Dev Environment

When you clone the project, simply run `npm i && npm run dev` to start your development. You might notice certain features in the local dev version not working, for example Google Authentication, Supabase Connection. This is because you need to specify a environment file for local development and it stays in your local and never pushed to GitHub. You should create your own environment file in order for some features to work:

`.env.local`

```
SITE_URL="http://localhost:3000"

# OPENAI API
OPENAI_API_KEY="sk-"
OPENAI_ORGANIZATION_ID=""

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

# Firebase project settings
NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY=''
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="taboo-ai-preview.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://taboo-ai-preview-default-rtdb.asia-southeast1.firebasedatabase.app"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="taboo-ai-preview"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="taboo-ai-preview.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="508144832475"
NEXT_PUBLIC_FIREBASE_APP_ID="1:508144832475:web:61f8681bef340b04d321fe"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

# Firebase admin settings
FIREBASE_CLIENT_EMAIL=""
FIREBASE_PRIVATE_KEY=""

# Stripe API
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""

```

For any missing values in the environment sample above, if you need it, please feel free to leave me a message and I will assist you in setting up.

## Why not use Vercel env?

Yes the most convenient way is to use Vercel. However, unfortunately I'm on FREE plan in vercel so I cannot add team members in order to do so. So for now, you have to create your own local env file 😅 sorry for the inconvenience!

---

Thank you for your contribution to make Taboo AI a better platform for English learning!
