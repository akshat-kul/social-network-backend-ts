FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy all src including .graphql
COPY . .

# Build TS
RUN npm run build

# Copy graphql schema files to dist
RUN mkdir -p dist/graphql/typeDefs && \
    cp -R src/graphql/typeDefs/. dist/graphql/typeDefs/

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
