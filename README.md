## Installation

```bash
$ yarn install
```

Install prisma globally
`npm install -g prisma`

`npm install -g dotenv-cli`

Start the database
`docker compose up -d`

Migrate the DB
`npx prisma migrate deploy`

Migrate the test DB
`dotenv -e .env.test -- npx prisma migrate deploy`

Generate the prisma client
`npx prisma generate`

Seed the DB
`npx prisma db seed`

## Running the app

```bash
# Startup docker with postgres
$ docker compose down -v

# Migrate the Database
$ ./redo-db.sh

# Startup the API server
$ yarn run start:dev
```

Call the API Server with Curl

```curl
curl -X POST http://localhost:3000/bikes \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer 123" \
     -d '{
         "userId": "b8d2a033-58db-4cdb-96f1-3bd63e50892f",
         "bikeId": "e03b313e-6c98-41ea-ab1c-0c4e03afe60e",
         "startDate": "2024-01-18",
         "endDate": "2024-01-18"
         }'
```

When finished
`docker compose down -v`

## Test

```bash
# unit tests
$ yarn run test
```

## Other

`npx prettier --write .`

Generating a new migration
`npx prisma migrate dev --name`

# Notes

I used NestJS + Prisma because NestJS is a better framework to use for large projects and it enforces some
more structure to a project than just using express. With Prisma you get a really nice schema in just 1 file
`prisma/schema.prisma` that's easy to see what the structure of the DB is like. Also prisma auto-generates all
the types for you so you can do things like this without having to write a ton of boilerplate code:

```typescript
const user = await transaction.user.findUnique({
  where: { id: userId },
  include: {
    bookings: {
      where: {
        startDate: {
          gte: now,
        },
      },
    },
  },
})
```

I used UUID's so its a non-monotomically increasing ID so it can't be scraped easily. This
is something that comes up all the time in security scans so you can't use integers as ID's.

In 3 hours I was only able to implement 1 endpoint for booking bikes and to run some tests.
