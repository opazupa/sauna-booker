# Olli's home sauna-booker

> _**Home**_ `sauna-booker` 📖 📅

Books sauna slots for you automatically based on your preferences when they are published. 🎢

## Features 📦💥

- Book sauna slots (4 weeks inito future) automatically with **puppeteer** runnning in AWS Lambda
- Daily [configurable sauna preferences](./app/configuration/sauna-preference.ts) for booking.
- Serverless framework + Cloudformation for infra.
- _**Sentry.io**_ on issue lookout!
- ~~VS Code dev container for local dev setup 🐳 🐳~~

## Pipelines 🚀

[![Sauna Booker CI/CD](https://github.com/opazupa/sauna-booker/actions/workflows/pipeline.yml/badge.svg)](https://github.com/opazupa/sauna-booker/actions/workflows/pipeline.yml)

### Including

- Build
- Lint
- Cloudformation deployment

## How to get started 👋


> Install `docker`, `make` & `npm` beofre continuing


### Env variables

After `make setup` replace your in variables to placeholders in [.env.local](./.env.local).

### Running locally

```bash
# If not already
make setup or npm install

# Invoke the book function
make book
```

### Other commands

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| `npm run build` | Build the `serverless` stack with `typescript` |
| `npm run lint`  | Run `eslint` to check code style                    |


#### Updating google **refresh token**
1. Go to google console to fetch the OAuth client configs
2. Run `make refresh-token`
3. Give consent for google for access and follow instructions
4. Get the new **refresh token** from the console.