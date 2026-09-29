# Playwright API Testing

A REST API test framework built on Playwright's `APIRequestContext`, tested against the [Conduit](https://conduit-api.bondaracademy.com/api) (RealWorld) API.

## What's in it

- **Fluent request handler:** `api.path('/articles').params({ limit: 10 }).getRequest(200)` builds the request, asserts the status code and returns the parsed body in one chain (`utils/request-handlers.ts`).
- **JSON-schema validation:** a custom `expect(...).shouldMatchSchema(dir, file)` matcher validates responses with **AJV**; pass `true` to generate a schema from a live response with `genson-js` (`utils/schema-validator.ts`).
- **Custom matchers** (`shouldEqual`, …) that attach the recent request/response log to the failure message (`utils/custom-expect.ts`, `utils/logger.ts`).
- **Fixtures:** an authenticated `api` fixture that fetches a token once per worker (`utils/fixtures.ts`, `helpers/createToken.ts`).
- **Environments:** `qa` / `dev` / `prod` selected with `TEST_ENV`; credentials come from `.env`, never the code (`api-test.config.ts`).
- **Test data** with Faker, and data-driven negative tests for validation messages.

## Run it

```bash
npm install
cp .env.example .env        # USER_EMAIL / USER_PASSWORD for a Conduit account
npx playwright test --project=smoke-tests
npx playwright show-report
```

## Tech

TypeScript · Playwright Test · AJV · genson-js · Faker · dotenv
