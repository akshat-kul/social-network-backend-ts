import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "./graphql/schema";
import { getPrisma } from "./prisma";
import jwt from "jsonwebtoken";
import { exec } from "child_process";
import util from "util";

const asyncExec = util.promisify(exec);
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

async function runMigrations() {
  try {
    const prisma = getPrisma();

    console.log("⏳ Checking database connection...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("🎉 Database reachable!");

    // Only run migrations inside Docker/Railway
    if (process.env.NODE_ENV === "production") {
      console.log("🔧 Running Prisma migrations...");
      await asyncExec("npx prisma migrate deploy");
      console.log("✅ Prisma migrations applied!");
    } else {
      console.log("Skipping migrations in development...");
    }
  } catch (err) {
    console.error("❌ Migration error:", err);
  }
}

async function startServer() {
  await runMigrations();

  const prisma = getPrisma();
  const schema = buildSchema();

  const server = new ApolloServer({
    schema,
    formatError: (e) => ({
      message: e.message,
      code: e.extensions.code,
    }),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: async ({ req }) => {
      const prisma = getPrisma(); // 🔥 FIXED

      const auth = req.headers.authorization || "";
      let currentUser = null;

      if (auth.startsWith("Bearer ")) {
        try {
          const token = auth.replace("Bearer ", "");
          const payload = jwt.verify(token, JWT_SECRET) as any;

          currentUser = await prisma.user.findUnique({
            where: { id: payload.userId },
          });
        } catch (err) {
          console.log("Invalid token:", err);
        }
      }

      return { prisma, currentUser };
    },
  });

  console.log(`🚀 Server running at ${url}`);
}

startServer();
