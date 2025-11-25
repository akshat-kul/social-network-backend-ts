FROM node:20-alpine

WORKDIR /app

# Install all deps including dev
COPY package*.json ./
RUN npm ci --include=dev

# Set env AFTER installing dev deps
ENV NODE_ENV=production

# Copy source code
COPY . .

# Build TS
RUN npm run build

# Copy GraphQL schema
RUN mkdir -p dist/graphql/typeDefs && \
    cp -R src/graphql/typeDefs/. dist/graphql/typeDefs/

# Add entrypoint
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["sh", "docker-entrypoint.sh"]
