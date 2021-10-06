# Olli's home sauna-booker

> _**Home**_ `sauna-booker` 📖 📅

Fetches new car ad info from _**Nettiauto**_ and stores them for later analysis.

## Features 📦💥

- Book sauna slots automatically with **puppeteer** runnning in AWS Lambda
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



> Install `docker` & `npm` beofre continuing


### Env variables

After `make setup` replace your in [.env.local](./.env.local)variables to placeholders.

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
