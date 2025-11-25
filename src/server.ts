import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { prisma } from "./prisma";

// Defining GraphQL schema
const typeDefs = `#graphql
  type User {
    id: Int!
    username: String!
    email: String!
  }

  type Query {
    hello: String!
    users: [User!]!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Testing GraphQL + Prisma working!",
    users: async (_, __, ctx) => {
      return ctx.prisma.user.findMany();
    },
  },
};

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => ({ prisma }),
    listen: { port: 3000 },
  });

  console.log("GraphQL running at:", url);
}

start();
