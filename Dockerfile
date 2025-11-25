FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Copy GraphQL schema to dist folder
RUN mkdir -p dist/graphql/typeDefs && \
    cp -R src/graphql/typeDefs/. dist/graphql/typeDefs/

# Do NOT run prisma generate here (DB env not available yet)

# Add entrypoint script
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["sh", "docker-entrypoint.sh"]
