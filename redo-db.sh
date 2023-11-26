
npx prisma migrate deploy

dotenv -e .env.test -- npx prisma migrate deploy

npx prisma generate

npx prisma db seed
