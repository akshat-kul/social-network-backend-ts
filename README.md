# 🚀 Social Graph Backend (TypeScript + GraphQL + PostgreSQL)

A minimal social-media style backend service built with **Node.js**, **TypeScript**, **GraphQL (Apollo Server)**, and **PostgreSQL (Prisma ORM)**.

This project is part of a backend engineering assignment and demonstrates:
- Clean architecture
- GraphQL schema design
- Social graph modeling (follow/unfollow)
- Feed generation
- Pagination
- Authentication (JWT)
- Deployment best practices

---

## 🌐 Live Demo

Deployed API URL
**[Production GraphQL API](https://social-network-backend-ts-production.up.railway.app/graphql)**

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript |
| Runtime | Node.js 18+ |
| API Layer | GraphQL (Apollo Server) |
| ORM | Prisma |
| Database | PostgreSQL 15 |
| Auth | JWT (HS256) |
| Deployment | Render / Railway / Fly.io |
| Bonus | Docker support |

---

## ⭐ Features

### 👤 User Graph
- Follow a user  
- Unfollow a user  
- Get list of followers  
- Get list of following users  

### 📝 Posts
- Create posts (text + media)
- Get all posts for a user

### 📰 Feed
- Personalized timeline feed  
- Cursor-based pagination  
- Returns posts from followed users + self  

### 🔐 Authentication
- User registration
- User login
- JWT-based protected resolvers

---

## 🏗️ Architecture

```
src/
  prisma.ts
  server.ts
  graphql/
    typeDefs/
    resolvers/
    utils/
  ...
prisma/
  schema.prisma
Dockerfile
docker-compose.yml
README.md
```

- **Resolvers** → business logic  
- **TypeDefs** → GraphQL schema definitions  
- **Prisma** → DB models + migrations  
- **Context** → authenticated user + Prisma client  
- **server.ts** → Apollo server entrypoint  

---

## 🗄️ Database Schema (Prisma)

```prisma
model User {
  id            Int        @id @default(autoincrement())
  username      String     @unique
  email         String     @unique
  passwordHash  String
  displayName   String?
  bio           String?
  avatarUrl     String?
  createdAt     DateTime   @default(now())

  posts         Post[]
  followers     Follow[]   @relation("Followers")
  following     Follow[]   @relation("Following")
}

model Follow {
  id            Int      @id @default(autoincrement())
  followerId    Int
  followingId   Int
  createdAt     DateTime @default(now())

  follower      User     @relation("Followers", fields: [followerId], references: [id])
  following     User     @relation("Following", fields: [followingId], references: [id])

  @@unique([followerId, followingId])
}

model Post {
  id            Int       @id @default(autoincrement())
  authorId      Int
  content       String?
  media         Json?
  createdAt     DateTime  @default(now())

  author        User      @relation(fields: [authorId], references: [id])
}
```

---

## ⚙️ Setup Instructions (Local Development)

### 1️⃣ Clone the repo
```bash
git clone https://github.com/<your-username>/social-graph-backend
cd social-graph-backend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Setup environment variables
Create `.env`:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialdb"
JWT_SECRET="supersecret"
```

### 4️⃣ Start Postgres (Docker)
```bash
docker-compose up -d
```

### 5️⃣ Prisma setup
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6️⃣ Run development server
```bash
npm run dev
```

GraphQL Playground opens at:
```
http://localhost:3000/
```

---

## 📜 GraphQL API Overview

### Queries:
- `user(id)`
- `userPosts(userId)`
- `feed(cursor, limit)`

### Mutations:
- `register`
- `login`
- `followUser`
- `unfollowUser`
- `createPost`

---

## 🧪 Feature Test Cases

### Authentication
- Register new user  
- Register with duplicate email → fail  
- Login with correct credentials  
- Login with wrong password → fail  
- Access protected route without token → fail  

### Follow System
- Follow a valid user  
- Follow same user twice → fail  
- Unfollow user  
- Follow self → fail  

### Posts
- Create post with text only  
- Create post with media  
- Fetch user posts in reverse chronological order  

### Feed
- Feed shows posts from followed users  
- Pagination works (cursor-based)  
- No duplicate posts across pages  

---

## 🐳 Docker Support

### Build + Run
```bash
docker-compose up --build
```

Starts:
- Node server  
- PostgreSQL  

---

## Testing
A complete Postman Collection is included:
```bash
postman/social-graph-collection.json
```

### It contains:

- Register
- Login
- me
- userByEmail
- follow / unfollow
- createPost
- updatePost
- deletePost
- postsByUser (paginated)
- feed (paginated)

## 🚀 Deployment (Render / Railway)
### Railway
- Create project
- Add PostgreSQL plugin
- Connect GitHub repo
- Add environment variables
- Deploy
- Render

Build command:
```bash
npm install && npm run build
```

Start command:
```bash
node dist/server.js
```
---
