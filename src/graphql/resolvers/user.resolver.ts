import { getPrisma } from "../../prisma";
import { requireAuth } from "../utils/authGuard";

const prisma = getPrisma();

export default {
  Query: {
    me: async (_: any, __: any, ctx: any) => {
      requireAuth(ctx);
      return ctx.currentUser; 
    },

    userByEmail: async (_: any, { email }: any, ctx: any) => {
      requireAuth(ctx);
      return prisma.user.findUnique({
        where: { email },
      });
    },
  },
};
