#!/bin/sh

# Parse DB host + port from DATABASE_URL
DB_URL="$DATABASE_URL"

# Example: postgresql://user:pass@hostname:5432/dbname
DB_HOST=$(echo "$DB_URL" | sed -E 's|.*://.*:.*@(.*):.*|\1|')
DB_PORT=$(echo "$DB_URL" | sed -E 's|.*://.*:.*@.*:(.*)/.*|\1|')

echo "⏳ Waiting for database at $DB_HOST:$DB_PORT ..."

# Wait for DB
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Database not ready yet..."
  sleep 1
done

echo "🎉 Database is ready!"

echo "🔧 Running Prisma generate..."
npx prisma generate

echo "🔧 Running Prisma migrations..."
npx prisma migrate deploy

echo "🚀 Starting server..."
node dist/server.js
