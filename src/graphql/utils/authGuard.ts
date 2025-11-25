import { GraphQLError } from "graphql";

export const requireAuth = (ctx: any) => {
  if (!ctx.currentUser) {
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED"
      }
    });
  }
};
