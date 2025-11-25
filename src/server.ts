import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "./graphql/schema";
import { prisma } from "./prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

async function startServer() {
  const schema = buildSchema();

  const server = new ApolloServer({
    schema,
    formatError: (formattedError) => {
      // Only return clean error messages
      return {
        message: formattedError.message,
        code: formattedError.extensions.code,
      };
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: async ({ req }) => {
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

  console.log(`Server running at ${url}`);
}

startServer();
