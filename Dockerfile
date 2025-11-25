FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Build TS
RUN npm run build

# Copy GraphQL .graphql files
RUN mkdir -p dist/graphql/typeDefs && \
    cp -R src/graphql/typeDefs/. dist/graphql/typeDefs/

# Generate Prisma client WITHIN docker image (IMPORTANT)
RUN npx prisma generate

# Add entrypoint
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
