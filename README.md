## Installation

```bash
$ yarn install
```

## Running the app

Install prisma globally
`npm install -g prisma`

Start the database
`docker compose up -d`

Generate the prisma client
`npx prisma generate`

Seed the DB
`npx prisma db seed`

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

When finished
`docker compose down -v`

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Other

`npx prettier --write .`

# Notes

To make this production ready I'd also change it so it uses UUID's or some non-monotomically increasing ID so it can't be scraped easily.
