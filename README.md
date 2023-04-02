# TABOO.AI

![taboo.ai](/public/images/Poster.png)

## How to play?

![taboo.ai](/public/images/Artboard%201.png)
![taboo.ai](/public/images/Artboard%202.png)
![taboo.ai](/public/images/Artboard%203.png)

## Pre-requisites

`Taboo.AI` needs `OpenAI` to work! Therefore, you need to obtain an **API Key** at https://openai.com/api/

Assume you have gotten your API Key: `123456` (just an example),
Go to the root of the project, create a file `.env.local` and put your key inside as follows:

```bash
OPENAI_API=123456
```

Then you are set!

## How to run

Install the project

```bash
npm install
```

Run in development environment

```bash
npm run dev
```

Try out [Turbopack](https://turbo.build/pack)!

```bash
npm run dev:turbo
```

Build the project

```bash
npm run build
```

Run the built project

```bash
npm run start
```

Run linter and auto fix

```bash
npm run lint
```

Run prettier to format the code and auto fix

```bash
npm run style
```

Run unit test Jest

```bash
npm run test
```

Run E2E test using Playwright

```bash
npm run test:e2e
```

Run E2E test using Playwright with tracing on

```bash
npm run test:e2e:trace
```
