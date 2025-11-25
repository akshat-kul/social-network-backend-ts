FROM node:20-alpine

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

ENV NODE_ENV=production

COPY . .
RUN npm run build

RUN mkdir -p dist/graphql/typeDefs && \
    cp -R src/graphql/typeDefs/. dist/graphql/typeDefs/

COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000
CMD ["sh", "docker-entrypoint.sh"]
