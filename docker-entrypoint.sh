#!/bin/sh

echo "⏳ Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 1
  echo "Database not ready yet..."
done

echo "🎉 Database is up!"

echo "🔧 Running Prisma generate..."
npx prisma generate

echo "🔧 Running Prisma migrations..."
npx prisma migrate deploy

echo "🚀 Starting server..."
node dist/server.js
