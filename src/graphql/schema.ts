import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import path from "path";

export function buildSchema() {
  const typeDefs = loadFilesSync(path.join(__dirname, "./typeDefs/**/*.graphql"));
  const resolvers = loadFilesSync(path.join(__dirname, "./resolvers/**/*.resolver.{ts,js}"));

  console.log("Loaded schema files:", typeDefs.length);
  console.log("Loaded resolver files:", resolvers.length);

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
}
